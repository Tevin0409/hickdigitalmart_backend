"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const util_1 = require("../utils/util");
const email_Service_1 = require("./email.Service");
const prisma = new client_1.PrismaClient();
exports.userService = {
    createUser: async (userData) => {
        if (!userData)
            throw new middleware_1.AppError(400, "Please provide valid data");
        const { email, password, firstName, lastName, phoneNumber, roleId } = userData;
        if (!roleId) {
            throw new middleware_1.AppError(400, "Role ID is required to create a user");
        }
        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ email }, { phoneNumber }],
                },
            });
            if (existingUser) {
                throw new middleware_1.AppError(400, "This email or phone number is already registered with us");
            }
            // Validate roleId exists in the Role table
            const existingRole = await prisma.role.findUnique({
                where: { id: roleId },
            });
            if (!existingRole) {
                throw new middleware_1.AppError(400, "Invalid role ID provided");
            }
            // Hash the password
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const otp = (0, util_1.generateOTP)();
            const otpHash = await bcryptjs_1.default.hash(otp, 10);
            const otpExpiresAt = new Date(Date.now() + 60 * 30 * 1000);
            // Create the user
            const result = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    otpHash,
                    otpExpiresAt,
                    password: hashedPassword,
                    roleId,
                },
            });
            await (0, email_Service_1.sendOTPEmail)(result.email, otp);
            return {
                message: "User created successfully. Please check your email to verify Account",
            };
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, `Failed to create user: ${err.message}`);
        }
    },
    loginUser: async (loginData) => {
        const { email, password } = loginData;
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
                include: { role: true },
            });
            if (!existingUser) {
                throw new middleware_1.AppError(400, `No user found with email: ${email}`);
            }
            if (existingUser &&
                existingUser.role &&
                existingUser.role.name === "TECHNICIAN" &&
                !existingUser.technicianVerified) {
                throw new middleware_1.AppError(401, `Your Technician account is still pending approval. Please check back later or contact support for more information`);
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, existingUser.password);
            if (!isPasswordValid) {
                // Increment failed login attempts
                await prisma.user.update({
                    where: { email },
                    data: {
                        inCorrectAttempts: (existingUser.inCorrectAttempts || 0) + 1,
                    },
                });
                throw new middleware_1.AppError(401, "Invalid credentials");
            }
            //check if verified
            if (!existingUser.isVerified) {
                const otp = (0, util_1.generateOTP)();
                const otpHash = await bcryptjs_1.default.hash(otp, 10);
                const otpExpiresAt = new Date(Date.now() + 60 * 30 * 1000);
                await prisma.user.update({
                    where: { email },
                    data: {
                        otpHash,
                        otpExpiresAt,
                    },
                });
                await (0, email_Service_1.sendOTPEmail)(existingUser.email, otp);
                throw new middleware_1.AppError(402, "This account is not yet verified , check your email for an otp to verify your account ");
            }
            // Generate tokens
            const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, refreshToken, } = (0, jwt_1.generateToken)(existingUser);
            // Reset failed attempts & store refresh token in DB
            await prisma.user.update({
                where: { email },
                data: {
                    inCorrectAttempts: 0,
                    refreshToken,
                    refreshTokenExpiresAt,
                },
            });
            //remove password from the response
            const { password: ignoredPassword, otpHash, otpExpiresAt, refreshToken: ignore, refreshTokenExpiresAt: ignoredRefreshTokenExpiresAt, // renamed
            inCorrectAttempts, ...safeUser } = existingUser;
            return {
                accessToken,
                accessTokenExpiresAt,
                refreshToken,
                refreshTokenExpiresAt,
                user: safeUser,
            };
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, `Failed to login: ${err.message}`);
        }
    },
    verifyUser: async (verifyData) => {
        if (!verifyData.email || !verifyData.otp) {
            throw new Error("Email and otp are required");
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: verifyData.email },
        });
        if (!existingUser || !existingUser.otpHash) {
            throw new Error("User not found");
        }
        // Check if OTP is valid
        const isOTPValid = await bcryptjs_1.default.compare(verifyData.otp, existingUser.otpHash);
        if (!isOTPValid) {
            throw new Error("Invalid OTP");
        }
        // Check if OTP has expired
        if (existingUser.otpExpiresAt &&
            new Date(existingUser.otpExpiresAt) < new Date()) {
            throw new Error("OTP has expired");
        }
        // Generate authentication tokens
        const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, } = (0, jwt_1.generateToken)(existingUser);
        // Reset incorrect attempts & store refresh token in the database
        await prisma.user.update({
            where: { email: verifyData.email },
            data: {
                inCorrectAttempts: 0,
                refreshToken,
                refreshTokenExpiresAt,
                isVerified: true,
            },
        });
        //remove password from the response
        const { password: ignoredPassword, otpHash, otpExpiresAt, refreshToken: ignore, refreshTokenExpiresAt: ignoredRefreshTokenExpiresAt, // renamed
        inCorrectAttempts, ...safeUser } = existingUser;
        return {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            user: safeUser,
        };
    },
    refresh: async (id, refresh_token) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id, refreshToken: refresh_token },
            });
            if (!user) {
                throw new middleware_1.AppError(400, `No user found `);
            }
            const isValid = (0, jwt_1.verifyToken)(refresh_token, "refresh");
            if (!isValid) {
                throw new middleware_1.AppError(401, "Invalid refresh token ,Please log in");
            }
            // Generate tokens
            const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, refreshToken, } = (0, jwt_1.generateToken)(user);
            // Reset failed attempts & store refresh token in DB
            await prisma.user.update({
                where: { email: user.email },
                data: {
                    refreshToken,
                    refreshTokenExpiresAt,
                },
            });
            //remove password from the response
            const { password: ignoredPassword, otpHash, otpExpiresAt, refreshToken: ignore, refreshTokenExpiresAt: ignoredRefreshTokenExpiresAt, // renamed
            inCorrectAttempts, ...safeUser } = user;
            return {
                accessToken,
                accessTokenExpiresAt,
                refreshToken,
                refreshTokenExpiresAt,
                user: safeUser,
            };
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, `Failed to login: ${err.message}`);
        }
    },
    updateUser: async (id, updateData) => {
        if (!id)
            throw new middleware_1.AppError(400, "User ID is required for update");
        try {
            // Validate roleId if provided
            if (updateData.roleId) {
                const existingRole = await prisma.role.findUnique({
                    where: { id: updateData.roleId },
                });
                if (!existingRole) {
                    throw new middleware_1.AppError(400, "Invalid role ID provided");
                }
            }
            // Hash the password if it's being updated
            if (updateData.password) {
                updateData.password = await bcryptjs_1.default.hash(updateData.password, 10);
            }
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
            });
            return updatedUser;
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, `Failed to update user: ${err.message}`);
        }
    },
    getAllUsers: async (page = 1, limit = 10, searchTerm, roleId) => {
        try {
            const skip = (page - 1) * limit;
            // Construct search filters
            const filters = {};
            if (roleId) {
                filters.roleId = roleId;
            }
            if (searchTerm) {
                filters.OR = [
                    { firstName: { contains: searchTerm, mode: "insensitive" } },
                    { lastName: { contains: searchTerm, mode: "insensitive" } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
                    { phoneNumber: { contains: searchTerm, mode: "insensitive" } },
                ];
            }
            // Get total user count with filters
            const totalResults = await prisma.user.count({ where: filters });
            // Fetch paginated users
            const users = await prisma.user.findMany({
                where: filters,
                select: {
                    id: true,
                    phoneNumber: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isVerified: true,
                    technicianVerified: true,
                    shopOwnerVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    role: {
                        select: {
                            id: true,
                            name: true, // Include whatever role fields you need
                        },
                    },
                    permissions: {
                        select: {
                            id: true, // Include whatever permission fields you need
                            name: true,
                        },
                    },
                },
                skip,
                take: limit,
            });
            const totalPages = Math.ceil(totalResults / limit);
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: users,
            };
        }
        catch (err) {
            throw new middleware_1.AppError(500, `Failed to retrieve users: ${err.message}`);
        }
    },
    // Get a user by ID
    getUserById: async (id) => {
        if (!id)
            throw new middleware_1.AppError(400, "User ID is required");
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                include: { role: true, permissions: true },
            });
            if (!user) {
                throw new middleware_1.AppError(404, "User not found");
            }
            return user;
        }
        catch (err) {
            throw new middleware_1.AppError(500, `Failed to retrieve user: ${err.message}`);
        }
    },
    getUserByEmail: async (email) => {
        if (!email)
            throw new middleware_1.AppError(400, "Email is required");
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                include: { role: true, permissions: true },
            });
            if (!user) {
                throw new middleware_1.AppError(404, "User not found");
            }
            return user;
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, `Failed to retrieve user: ${err.message}`);
        }
    },
    isUserAdmin: async (email) => {
        const user = await prisma.user.findFirst({
            where: { email },
            include: { role: true },
        });
        if (user &&
            user.role &&
            (user.role.name === "SUDO" || user.role.name === "ADMIN")) {
            return true;
        }
        return false;
    },
    managePermissions: async (userId, permissionsToAdd, permissionsToRemove) => {
        try {
            await prisma.$transaction(async (prisma) => {
                for (const permissionName of permissionsToAdd) {
                    const permission = await prisma.permission.findUnique({
                        where: { name: permissionName },
                    });
                    if (permission) {
                        const user = await prisma.user.findUnique({
                            where: { id: userId },
                            include: { permissions: true },
                        });
                        if (user &&
                            !user.permissions.some((perm) => perm.name === permissionName)) {
                            await prisma.user.update({
                                where: { id: userId },
                                data: {
                                    permissions: {
                                        connect: { id: permission.id },
                                    },
                                },
                            });
                        }
                    }
                    else {
                        console.log(`Permission ${permissionName} does not exist`);
                    }
                }
                for (const permissionName of permissionsToRemove) {
                    const permission = await prisma.permission.findUnique({
                        where: { name: permissionName },
                    });
                    if (permission) {
                        const user = await prisma.user.findUnique({
                            where: { id: userId },
                            include: { permissions: true },
                        });
                        if (user &&
                            user.permissions.some((perm) => perm.name === permissionName)) {
                            await prisma.user.update({
                                where: { id: userId },
                                data: {
                                    permissions: {
                                        disconnect: { id: permission.id },
                                    },
                                },
                            });
                        }
                    }
                    else {
                        console.log(`Permission ${permissionName} does not exist`);
                    }
                }
            });
            return "Permissions updated successfully";
        }
        catch (error) {
            throw new Error(`Failed to manage permissions ${error?.message}`);
        }
    },
    addTechnicianQuestionnaire: async (technicianDTO) => {
        try {
            // Check if the email already exists
            const existingTechnician = await prisma.technicianQuestionnaire.findUnique({
                where: { email: technicianDTO.email },
            });
            if (existingTechnician) {
                throw new Error("Email already exists. Please use a different email address.");
            }
            // Create a new technician questionnaire
            const newTechnicianQuestionnaire = await prisma.technicianQuestionnaire.create({
                data: {
                    businessName: technicianDTO.businessName,
                    phoneNumber: technicianDTO.phoneNumber,
                    email: technicianDTO.email,
                    location: technicianDTO.location,
                    businessType: technicianDTO.businessType,
                    experienceYears: technicianDTO.experienceYears,
                    experienceAreas: technicianDTO.experienceAreas || [],
                    brandsWorkedWith: technicianDTO.brandsWorkedWith || [],
                    integrationExperience: technicianDTO.integrationExperience,
                    purchaseSource: technicianDTO.purchaseSource,
                    purchaseHikvision: technicianDTO.purchaseHikvision,
                    requiresTraining: technicianDTO.requiresTraining,
                },
            });
            return {
                message: "Your submission has been successfully recorded. Our team is currently reviewing and verifying the details. You will be notified once the process is complete.",
            };
        }
        catch (error) {
            throw new Error(error.message || "Error creating Technician Questionnaire");
        }
    },
    addShopOwnersQuestionnaire: async (shopOwnerDTO) => {
        try {
            // Check if the email already exists
            const existingShopOwner = await prisma.shopOwnerQuestionnaire.findUnique({
                where: { email: shopOwnerDTO.email },
            });
            if (existingShopOwner) {
                throw new Error("Email already exists. Please use a different email address.");
            }
            // Create a new shop owner questionnaire
            const newShopOwnerQuestionnaire = await prisma.shopOwnerQuestionnaire.create({
                data: {
                    companyName: shopOwnerDTO.companyName,
                    firstName: shopOwnerDTO.firstName,
                    lastName: shopOwnerDTO.lastName,
                    phoneNumber: shopOwnerDTO.phoneNumber,
                    phoneNumber2: shopOwnerDTO.phoneNumber2 ?? null,
                    email: shopOwnerDTO.email,
                    email2: shopOwnerDTO.email2 ?? null,
                    address: shopOwnerDTO.address,
                    selectedBusinessType: shopOwnerDTO.selectedBusinessType,
                    selectedBrands: shopOwnerDTO.selectedBrands,
                    selectedSecurityBrands: shopOwnerDTO.selectedSecurityBrands,
                    otherBrand: shopOwnerDTO.otherBrand ?? null,
                    selectedCategories: shopOwnerDTO.selectedCategories,
                    hikvisionChallenges: shopOwnerDTO.hikvisionChallenges ?? null,
                    adviceToSecureDigital: shopOwnerDTO.adviceToSecureDigital ?? null,
                },
            });
            return {
                message: "Your submission has been successfully recorded. Our team is currently reviewing and verifying the details. You will be notified once the process is complete.",
            };
        }
        catch (error) {
            throw new Error(error.message || "Error creating Shop Owner Questionnaire");
        }
    },
    getTechnicianRequest: async (page = 1, limit = 10, searchTerm) => {
        try {
            // Define pagination
            const skip = (page - 1) * limit;
            // Construct search conditions dynamically
            const searchConditions = [];
            if (searchTerm) {
                searchConditions.push({
                    email: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    phoneNumber: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    businessName: { contains: searchTerm, mode: "insensitive" },
                });
            }
            const whereCondition = searchConditions.length ? { OR: searchConditions } : {};
            // Fetch total count for pagination
            const totalResults = await prisma.technicianQuestionnaire.count({
                where: whereCondition,
            });
            const totalPages = Math.ceil(totalResults / limit);
            // Fetch technician questionnaire with pagination & search
            const technicianRequests = await prisma.technicianQuestionnaire.findMany({
                where: whereCondition,
                skip,
                take: limit,
            });
            // Fetch user details for each technician request
            const enrichedRequests = await Promise.all(technicianRequests.map(async (request) => {
                const user = await prisma.user.findUnique({
                    where: { email: request.email },
                });
                return { ...request, user };
            }));
            // Return paginated response
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: enrichedRequests,
            };
        }
        catch (error) {
            throw new Error(error.message || "Error fetching Technician Questionnaire");
        }
    },
    getShopOwnersRequest: async (page = 1, limit = 10, searchTerm) => {
        try {
            // Define pagination
            const skip = (page - 1) * limit;
            // Construct search conditions dynamically
            const searchConditions = [];
            if (searchTerm) {
                searchConditions.push({
                    email: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    phoneNumber: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    companyName: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    firstName: { contains: searchTerm, mode: "insensitive" },
                });
                searchConditions.push({
                    lastName: { contains: searchTerm, mode: "insensitive" },
                });
            }
            const whereCondition = searchConditions.length ? { OR: searchConditions } : {};
            // Fetch total count for pagination
            const totalResults = await prisma.shopOwnerQuestionnaire.count({
                where: whereCondition,
            });
            const totalPages = Math.ceil(totalResults / limit);
            // Fetch shop owner questionnaire with pagination & search
            const shopOwnerRequests = await prisma.shopOwnerQuestionnaire.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }, // Optional: order by latest
            });
            // Optionally enrich with user data if relevant (remove if not needed)
            const enrichedRequests = await Promise.all(shopOwnerRequests.map(async (request) => {
                const user = await prisma.user.findUnique({
                    where: { email: request.email },
                });
                return { ...request, user };
            }));
            // Return paginated response
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: enrichedRequests,
            };
        }
        catch (error) {
            throw new Error(error.message || "Error fetching Shop Owner Questionnaires");
        }
    },
    approveTechnician: async (userId) => {
        return await prisma.user.update({
            where: { id: userId },
            data: { technicianVerified: true },
        });
    },
    approveShopOwner: async (userId) => {
        return await prisma.user.update({
            where: { id: userId },
            data: { shopOwnerVerified: true },
        });
    },
    changePassword: async (email, changePasswordDTO) => {
        try {
            // Fetch the user from the database by email
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error("User not found");
            }
            const isOldPasswordValid = await bcryptjs_1.default.compare(changePasswordDTO.oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new Error("Old password is incorrect");
            }
            if (changePasswordDTO.newPassword !== changePasswordDTO.confirmNewPassword) {
                throw new Error("New password and confirmation do not match");
            }
            const hashedNewPassword = await bcryptjs_1.default.hash(changePasswordDTO.newPassword, 10);
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedNewPassword,
                },
            });
            (0, email_Service_1.sendPasswordChangeEmail)(user.email, user.firstName);
            return { message: "Password successfully updated" };
        }
        catch (error) {
            throw new Error(error.message || "Error changing password");
        }
    },
    forgotPassword: async (email) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (!existingUser) {
                throw new middleware_1.AppError(400, `No user found with email: ${email}`);
            }
            const otp = (0, util_1.generateOTP)();
            const otpHash = await bcryptjs_1.default.hash(otp, 10);
            const otpExpiresAt = new Date();
            otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 30);
            await prisma.user.update({
                where: { email },
                data: {
                    otpHash,
                    otpExpiresAt,
                },
            });
            await (0, email_Service_1.sendOTPEmail)(existingUser.email, otp);
            return {
                message: "Please check your email for an OTP to reset your password.",
            };
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, "An error occurred while processing your request.");
        }
    },
    resetPassword: async (resetPassDTO) => {
        try {
            // Validate required fields
            const { email, otp, newPassword, confirmNewPassword } = resetPassDTO;
            if (!email || !otp || !newPassword || !confirmNewPassword) {
                throw new middleware_1.AppError(400, "Email, OTP, new password, and confirmation are required");
            }
            // Check if the user exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (!existingUser || !existingUser.otpHash) {
                throw new middleware_1.AppError(404, "User not found or OTP not generated");
            }
            // Validate OTP
            const isOTPValid = await bcryptjs_1.default.compare(otp, existingUser.otpHash);
            if (!isOTPValid) {
                throw new middleware_1.AppError(400, "Invalid OTP");
            }
            // Check if OTP has expired
            if (existingUser.otpExpiresAt &&
                new Date(existingUser.otpExpiresAt) < new Date()) {
                throw new middleware_1.AppError(400, "OTP has expired");
            }
            // Validate password match
            if (newPassword !== confirmNewPassword) {
                throw new middleware_1.AppError(400, "New password and confirmation do not match");
            }
            // Optionally: Check password strength (e.g., length, complexity) before hashing
            if (newPassword.length < 8) {
                throw new middleware_1.AppError(400, "Password must be at least 8 characters long");
            }
            const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
            await prisma.user.update({
                where: { email: existingUser.email },
                data: {
                    password: hashedNewPassword,
                    otpHash: null,
                    otpExpiresAt: null,
                },
            });
            await (0, email_Service_1.sendPasswordChangeEmail)(existingUser.email, existingUser.firstName);
            return { message: "Password successfully updated" };
        }
        catch (err) {
            const statusCode = err instanceof middleware_1.AppError ? err.statusCode : 500;
            throw new middleware_1.AppError(statusCode, err.message || "An error occured");
        }
    },
};

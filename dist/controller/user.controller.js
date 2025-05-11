"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const services_1 = require("../services");
exports.userController = {
    // Create a new user
    createUser: async (req, res, next) => {
        try {
            const data = req.body;
            const user = await services_1.userService.createUser(data);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // User login
    login: async (req, res, next) => {
        try {
            const data = req.body;
            const user = await services_1.userService.loginUser(data);
            if (user.refreshToken) {
                res.cookie("refreshToken", user.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    verify: async (req, res, next) => {
        try {
            const data = req.body;
            const user = await services_1.userService.verifyUser(data);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // User login
    refresh: async (req, res, next) => {
        try {
            console.log("Here");
            console.log("refreshTOken", req.cookies);
            const user = await services_1.userService.refresh(req.body.id, req.body.refreshToken || req.cookies.refreshToken);
            if (user.refreshToken) {
                res.cookie("refreshToken", user.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // Update an existing user
    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await services_1.userService.updateUser(id, updateData);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    },
    // Get all users
    getAllUsers: async (req, res, next) => {
        try {
            // Extract query parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchTerm = req.query.searchTerm;
            const roleId = req.query.roleId;
            // Call userService with the extracted parameters
            const users = await services_1.userService.getAllUsers(page, limit, searchTerm, roleId);
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    },
    // Get user by ID
    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await services_1.userService.getUserById(id);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    getUser: async (req, res, next) => {
        try {
            const user = await services_1.userService.getUserByEmail(req.user.email);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // Get user by email
    getUserByEmail: async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await services_1.userService.getUserByEmail(email);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    managePermissions: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { permissionsToAdd, permissionsToRemove } = req.body;
            const user = await services_1.userService.managePermissions(userId, permissionsToAdd, permissionsToRemove);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    addTechnicianQuestionnaire: async (req, res, next) => {
        try {
            const user = await services_1.userService.addTechnicianQuestionnaire(req.body);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    addShopOwnersQuestionnaire: async (req, res, next) => {
        try {
            const user = await services_1.userService.addShopOwnersQuestionnaire(req.body);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    getTechnicianRequest: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchTerm = req.query.searchTerm;
            const response = await services_1.userService.getTechnicianRequest(page, limit, searchTerm);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    },
    getShopOwnwersRequest: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchTerm = req.query.searchTerm;
            const response = await services_1.userService.getShopOwnersRequest(page, limit, searchTerm);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    },
    approveTechnician: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const response = await services_1.userService.approveTechnician(userId);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    },
    approveShopOwner: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const response = await services_1.userService.approveShopOwner(userId);
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    },
    ChangePassword: async (req, res, next) => {
        try {
            const email = req.user.email;
            const user = await services_1.userService.changePassword(email, req.body);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const user = await services_1.userService.forgotPassword(req.body.email);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const user = await services_1.userService.resetPassword(req.body);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
};

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config";
export const verifyToken = (token, type) => {
    try {
        const decoded = jwt.verify(token, type === "refresh" ? JWT_REFRESH_SECRET : JWT_SECRET);
        if (typeof decoded === "string") {
            return null;
        }
        return decoded;
    }
    catch {
        return null;
    }
};
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
    };
    const accessTokenExpiresIn = "1h";
    const refreshTokenExpiresIn = "7d";
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: refreshTokenExpiresIn,
    });
    return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
};

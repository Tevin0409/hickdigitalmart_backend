import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'string') {
            return null; 
        }
        return decoded as JwtPayload; 
    } catch {
        return null; 
    }
};

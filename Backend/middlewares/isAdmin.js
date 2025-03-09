import jwt from 'jsonwebtoken';
import { jwtSecretKey } from '../config.js'; 

export const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, jwtSecretKey);
        console.log("Decoded Token:", decoded); // Log the decoded token for debugging

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Error:", error); // Log the error for debugging
        return res.status(401).json({ message: "Invalid or expired token", error });
    }
};


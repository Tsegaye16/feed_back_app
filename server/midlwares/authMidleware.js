import jwt from "jsonwebtoken";
//import { Request, Response, NextFunction } from "express";




export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};


// export const authorizeRoles = (requiredRoles) => {
//     return (
//         req,
//         res,
//         next
// ) => {
//         if (req.user && requiredRoles.includes(req.user.role)) {
//             next();
//         } else {
//             res
//                 .status(403)
//                 .json({ message: "Access denied. Insufficient permissions." });
//         }
//     };
// };

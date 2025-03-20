const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const asyncHandler = require('./async');
import { Request, Response, NextFunction } from 'express';

// Custom interface for Request with user
interface AuthRequest extends Request {
    user?: any;
}

// Protect routes
const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // Token ni headerdan olish
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Token mavjudligini tekshirish
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Ushbu routega kirish uchun login qilishingiz kerak'
        });
    }

    try {
        // Token ni verify qilish
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // User ni topish
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Foydalanuvchi topilmadi'
            });
        }

        // Request ga user ni qo'shish
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Ushbu routega kirish uchun login qilishingiz kerak'
        });
    }
});

module.exports = { protect };

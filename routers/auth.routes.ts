import { Request, Response, Router } from 'express';
const upload = require("../middlewares/upload");
const passport = require("passport");
const authRoutes = Router();
const { registerUser, loginUser, uploadAvatar, sendOtp, forgetPassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth");

interface IUser {
    googleId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
}

interface IRequest extends Request {
    user?: IUser;
    isAuthenticated(): boolean;
    logout(callback: (err: any) => void): void;
}

// Mavjud routelar
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
authRoutes.post("/otp", sendOtp);
authRoutes.post("/forget", forgetPassword);

// Google auth routelari
authRoutes.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRoutes.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
    (req: IRequest, res: Response) => {
        res.json({ 
            success: true, 
            user: req.user 
        });
    }
);

// Login status tekshirish
authRoutes.get('/status', (req: IRequest, res: Response) => {
    if (req.isAuthenticated()) {
        res.json({ 
            isAuthenticated: true, 
            user: req.user 
        });
    } else {
        res.json({ 
            isAuthenticated: false 
        });
    }
});

// Google orqali logout
authRoutes.get('/logout', (req: IRequest, res: Response) => {
    req.logout((err: Error | null) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
});

module.exports = authRoutes;

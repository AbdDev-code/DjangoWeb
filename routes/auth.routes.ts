import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google auth route
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google auth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

// Middleware to check if user is authenticated
export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

export default router;

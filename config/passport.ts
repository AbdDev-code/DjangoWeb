const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

interface IUser {
    googleId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
}

passport.serializeUser((user: IUser, done: (err: any, id?: any) => void) => {
    done(null, user);
});

passport.deserializeUser((user: IUser, done: (err: any, user?: IUser) => void) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: IUser) => void) => {
            try {
                // Bu yerda foydalanuvchi ma'lumotlarini bazaga saqlash mumkin
                const user: IUser = {
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    firstName: profile.name?.givenName,
                    lastName: profile.name?.familyName,
                    photo: profile.photos?.[0]?.value
                };
                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

module.exports = passport;

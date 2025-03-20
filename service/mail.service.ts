import * as nodemailer from 'nodemailer';

export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendOtp(to: string): Promise<string> {
        const otp = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Email Verification OTP',
            html: `<h1>Your OTP: ${otp}</h1><p>Please use this code to verify your account.</p>`,
        });

        console.log(`Generated OTP for ${to}: ${otp}`);
        return otp;
    }

    async verifyOtp(userOtp: string, storedOtp: string): Promise<boolean> {
        return userOtp === storedOtp;
    }
}

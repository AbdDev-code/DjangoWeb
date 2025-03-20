const { User } = require("../models/user.model");
const asyncHandler = require("../middlewares/async");
import { Request, Response, NextFunction } from 'express';
import { MailService } from '../service/mail.service';

// @desc Register new user
// @route POST /api/v1/auth/register
exports.registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Barcha malumotlarni to'liq to'ldiring"
    });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tkazildi",
    data: user
  });
});

// @desc Login user 
// @method username or email 
// @route POST /api/v1/auth/login
exports.loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { username } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Barcha malumotlarni to'liq to'ldiring"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Foydalanuvchi topilmadi"
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Parol xato"
    });
  }

  const token = user.generateToken();
  res.status(200).json({
    success: true,
    message: "Foydalanuvchi tizimga muvaffaqiyatli kirdi",
    data: user,
    token
  });
});

// @desc Avatar upload
// @route POST /api/v1/auth/avatar
exports.uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {  
    return res.status(400).json({
      success: false,
      message: "Avatar tanlang"
    });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Foydalanuvchi topilmadi"
    });
  }

  user.avatar = file.path;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar muvaffaqiyatli yangilandi"
  });
});

// @desc Send OTP
// @route POST /api/v1/auth/otp
exports.sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email tanlang"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Foydalanuvchi topilmadi"
    });
  }

  const mailService = new MailService();
  const otp = await mailService.sendOtp(email);

  // Save OTP in user record
  user.otp = otp;
  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP muvaffaqiyatli yuborildi",
    data:otp
  });
});


// @desc Forget password
// @route POST /api/v1/auth/forget
exports.forgetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  if (!email) {
    return res.status(401).json({
      success: false,
      message: "Email manzilini kiriting"
    });
  }

  if (!otp) {
    return res.status(401).json({
      success: false,
      message: "Sizga yuborilgan kodni kiriting"
    });
  }

  if (!password) {
    return res.status(401).json({
      success: false,
      message: "Yangi parolingizni kiriting"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Foydalanuvchi topilmadi"
    });
  }

  if (otp !== user.otp) {
    return res.status(401).json({
      success: false,
      message: "Yuborilgan kod xato kiritildi"
    });
  }

  if (password.length <= 7) {
    return res.status(401).json({
      success: false,
      message: "Parol kamida 8 ta belgidan iborat bo'lishi lozim"
    });
  }

  // Parolni yangilash
  user.password = password;
  user.otp = ""; // OTP ni tozalash
  await user.save();

  res.status(200).json({
    success: true,
    message: "Parolingiz muvaffaqiyatli yangilandi"
  });
});


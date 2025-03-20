import { Document, Schema, model, CallbackWithoutResultAndOptionalError } from "mongoose";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: "student" | "admin" | "teacher";
  comparePassword(password: string): Promise<boolean>;
  generateToken(): string;
  verifyToken(token: string): any;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  avatar:{
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["student", "admin", "teacher"],
    default: "student",
  },
}, {
  timestamps: true,
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    if (!password || !this.password) {
      return false;
    }
    return await bcrypt.compare(String(password), String(this.password));
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

UserSchema.pre("save", async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// token create
UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// token verify
UserSchema.statics.verifyToken = function (token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const User = model<IUser>("User", UserSchema);

module.exports = { User };
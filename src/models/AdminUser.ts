import mongoose, { Schema, Document, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdminUser extends Document {
  username: string;
  email: string;
  password: string;
  adminId: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    adminId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return "ADM" + Date.now().toString().slice(-6);
      },
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator"],
      default: "admin",
    },
    permissions: [
      {
        type: String,
        enum: [
          "products:read",
          "products:write",
          "products:delete",
          "orders:read",
          "orders:write",
          "orders:delete",
          "users:read",
          "users:write",
          "users:delete",
          "analytics:read",
          "settings:read",
          "settings:write",
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: String,
      phone: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete (ret as any).password;
        delete (ret as any).loginAttempts;
        delete (ret as any).lockUntil;
        return ret;
      },
    },
  }
);

// ✅ Indexes
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ username: 1 });
adminUserSchema.index({ adminId: 1 });
adminUserSchema.index({ isActive: 1 });

// ✅ Hash password before saving
adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// ✅ Compare password
adminUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Check if locked
adminUserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// ✅ Increment login attempts
adminUserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

  if (this.lockUntil && this.lockUntil < new Date()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
  }

  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
  }

  await this.save();
};

// ✅ Reset login attempts on success
adminUserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLogin = new Date();
  await this.save();
};

// ✅ Safe export for hot reloads
const AdminUser =
  models.AdminUser || model<IAdminUser>("AdminUser", adminUserSchema);

export default AdminUser;

import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protectAdmin = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Admin authentication required.",
      });
    }

    const token = authHeader
      .slice(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Admin token is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const adminId =
      Number(decoded.id);

    if (
      !Number.isInteger(adminId) ||
      adminId <= 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin token.",
      });
    }

    if (
      String(decoded.role)
        .toUpperCase() !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin access required.",
      });
    }

    const admin =
      await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Admin account not found.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Admin account is disabled.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "ADMIN AUTH ERROR:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Admin session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid admin token.",
    });
  }
};
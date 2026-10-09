import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function createAdmin() {
  try {
    const name =
      process.env.ADMIN_NAME?.trim();

    const email =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      throw new Error(
        "ADMIN_EMAIL is not valid."
      );
    }

    if (password.length < 6) {
      throw new Error(
        "ADMIN_PASSWORD must be at least 6 characters."
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const existingAdmin =
      await prisma.admin.findUnique({
        where: {
          email,
        },
      });

    let admin;

    if (existingAdmin) {
      admin =
        await prisma.admin.update({
          where: {
            id:
              existingAdmin.id,
          },

          data: {
            name,
            email,
            password:
              hashedPassword,
            role:
              "ADMIN",
            isActive:
              true,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        });

      console.log(
        "Admin updated successfully:"
      );
    } else {
      admin =
        await prisma.admin.create({
          data: {
            name,
            email,
            password:
              hashedPassword,
            role:
              "ADMIN",
            isActive:
              true,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        });

      console.log(
        "Admin created successfully:"
      );
    }

    console.log(admin);
  } catch (error) {
    console.error(
      "Create Admin Error:",
      error
    );
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
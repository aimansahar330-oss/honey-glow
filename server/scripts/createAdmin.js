import "dotenv/config";

import bcrypt from "bcryptjs";

import prisma from "../src/lib/prisma.js";

async function createAdmin() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("Admin created successfully:");
    console.log(admin);
  } catch (error) {
    console.error("Create Admin Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
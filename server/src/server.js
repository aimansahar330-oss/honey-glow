import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "./lib/prisma.js";
import categoryRoutes from "./routes/category.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import {
  errorHandler,
  notFound,
} from "./middleware/errorHandler.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);



if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "HoneyGlow API is running",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/customers",
  customerRoutes
);
app.use(
  "/api/admin/dashboard",
  dashboardRoutes
);
app.use(
  "/api/admin/notifications",
  notificationRoutes
);
app.use("/api/admin/auth", adminAuthRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`HoneyGlow API running on port ${PORT}`);
});
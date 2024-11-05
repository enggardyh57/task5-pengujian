import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import booksRouter from "./routes/book";
import authRouter from "./routes/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Pengelolaan Buku Enggar Dyah Bintang Ayuna",
      version: "1.0.0",
      description: "API untuk manajemen buku",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/", authRouter);
app.use("/books", booksRouter);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/bukuBaru")
  .then(() => console.log("Koneksi ke MongoDB berhasil"))
  .catch((err) => console.error("Koneksi ke MongoDB gagal:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error occurred:", err); // Log detail kesalahan
  res.status(500).json({ message: "Something broke!", error: err.message }); // Kirim pesan kesalahan ke klien
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;

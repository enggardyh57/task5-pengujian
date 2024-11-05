import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

// Pengguna dummy untuk autentikasi dengan password yang di-hash
const users: { username: string; password: string }[] = [
  { username: "enggardyah", password: bcrypt.hashSync("1234", 10) },
  { username: "bintangayuna", password: bcrypt.hashSync("6789", 10) },
];

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login ke aplikasi
 *     description: Authenticate user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: enggardyah
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login berhasil dan mendapatkan token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 token:
 *                   type: string
 *                   example: your_jwt_token_here
 *       400:
 *         description: Permintaan tidak valid, nama pengguna atau kata sandi tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username dan password diperlukan.
 *       401:
 *         description: Tidak diizinkan, username dan password salah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal login
 */

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  console.log("Login request received"); 
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    console.error("Validation failed: Username or password is missing.");
    res.status(400).json({ message: "Username dan password diperlukan." });
    return;
  }

  const user = users.find((u) => u.username === username);
  console.log("User found:", user); 

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || "your_default_secret_key", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Login berhasil", token });
  } else {
    console.error("Login failed: Invalid username or password.");
    res.status(401).json({ message: "Gagal login" });
  }
});

export default router;

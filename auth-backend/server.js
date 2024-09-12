// server.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "your_secret_key"; // JWTのシークレットキー

// ユーザー登録API
app.post("/registerUser", authenticateToken, async (req, res) => {
  const {
    staffNumber,
    name,
    address,
    phoneNumber,
    dateOfBirth,
    email,
    password,
    employmentStatus,
    employmentStartDate,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        staffNumber,
        name,
        address,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        email,
        password: hashedPassword,
        employmentStatus,
        employmentStartDate: new Date(employmentStartDate),
        role: "staff", // デフォルトで "staff" 役割を付与
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// ログインAPI
app.post("/login", async (req, res) => {
  const { staffNumber, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { staffNumber },
    });

    // パスワードの比較 (ハッシュ化されたパスワードと入力されたパスワード)
    const validPassword = await bcrypt.compare(password, user.password);

    if (!user || !validPassword) {
      return res
        .status(401)
        .json({ error: "Invalid staff number or password" });
    }

    // JWTトークンを発行
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// 認証ミドルウェア
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// ユーザー情報取得API (認証必要)
app.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

// シフト提出API
app.post("/shifts", authenticateToken, async (req, res) => {
  const { userId, date, startTime, endTime } = req.body;

  try {
    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

    // シフトを作成
    const shift = await prisma.shift.create({
      data: {
        userId: Number(userId),
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        status: "pending",
      },
    });
    res.status(201).json(shift);
  } catch (err) {
    console.error("Error creating shift:", err);
    res.status(500).json({ error: "Failed to create shift" });
  }
});

// 特定のユーザーのシフト取得API
app.get("/shifts/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    if (req.user.userId !== Number(userId)) {
      return res
        .status(403)
        .json({ error: "Access denied. Cannot view other user shifts." });
    }

    // ユーザーのシフトを取得
    const shifts = await prisma.shift.findMany({
      where: { userId: Number(userId) },
    });
    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});

// すべてのシフト取得API (管理者用)
app.get("/shifts", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // すべてのシフトを取得
    const shifts = await prisma.shift.findMany();
    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err); // エラーログを出力
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});

// シフトの更新API（管理者のみ）
app.put("/shifts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // ステータスを更新
    const updatedShift = await prisma.shift.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedShift);
  } catch (err) {
    res.status(500).json({ error: "Failed to update shift" });
  }
});

// シフト削除API
app.delete("/shifts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.shift.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete shift" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

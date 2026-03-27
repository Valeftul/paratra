import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";

const router = Router();

// ─── ХРАНИЛИЩЕ В ПАМЯТИ (без БД) ───────────────────────
interface UserRecord {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: "admin" | "worker";
}

const users: UserRecord[] = [];

// Создаём дефолтного admin при старте сервера
(async () => {
  const hashed = await bcrypt.hash("admin123", 10);
  users.push({
    id: "1",
    username: "admin",
    password: hashed,
    displayName: "Администратор",
    role: "admin",
  });
  console.log("✅ Создан пользователь по умолчанию: admin / admin123");
})();

// ─── РОУТЫ ─────────────────────────────────────────────

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, displayName, role } = req.body;
  if (!username || !password || !displayName) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }
  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ error: "Пользователь уже существует" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser: UserRecord = {
    id: String(Date.now()),
    username,
    password: hashed,
    displayName,
    role: role === "admin" ? "admin" : "worker",
  };
  users.push(newUser);
  res.status(201).json({ message: "Пользователь создан", userId: newUser.id });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Введите логин и пароль" });
  }
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  (req.session as any).userId = user.id;
  (req.session as any).displayName = user.displayName;
  res.json({
    message: "Вход выполнен",
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  });
});

// POST /auth/logout
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Ошибка при выходе" });
    res.json({ message: "Выход выполнен" });
  });
});

// GET /auth/me
router.get("/me", (req: Request, res: Response) => {
  const userId = (req.session as any).userId;
  if (!userId) return res.json(null);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.json(null);
  res.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  });
});

export default router;

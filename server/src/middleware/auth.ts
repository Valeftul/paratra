import { Request, Response, NextFunction } from "express";

// Проверка авторизации — только по сессии, без БД
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Необходима авторизация" });
  }
  // Кладём userId в req для использования в роутах
  (req as any).user = { id: userId, _id: userId, displayName: (req.session as any).displayName };
  next();
}

// Проверка роли admin — пока пропускаем всех авторизованных
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(403).json({ error: "Недостаточно прав" });
  }
  next();
}
import { Router, Request, Response } from "express";
import { store } from "../store";
import { requireAuth } from "../middleware/auth";

const router = Router();

// ════════════════════════════════════════════════
//  DASHBOARD  GET /api/dashboard
// ════════════════════════════════════════════════
router.get("/dashboard", requireAuth, (_req: Request, res: Response) => {
  const products = store.products;
  const transactions = store.transactions;

  const lowStock = products.filter(p => p.quantity <= p.minQuantity);
  const warehouseValue = products.reduce((s, p) => s + p.quantity * p.purchasePrice, 0);

  const incomeSum = transactions.filter(t => t.type === "income")
    .reduce((s, t) => s + t.total, 0);
  const outcomeSum = transactions.filter(t => t.type === "outcome")
    .reduce((s, t) => s + t.total, 0);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  res.json({
    totalProducts: products.length,
    totalCategories: [...new Set(products.map(p => p.category))].length,
    lowStockProducts: lowStock,
    recentTransactions: recent,
    totalIncome: incomeSum,
    totalOutcome: outcomeSum,
    warehouseValue,
  });
});

// ════════════════════════════════════════════════
//  PRODUCTS
// ════════════════════════════════════════════════
router.get("/products", requireAuth, (req: Request, res: Response) => {
  let list = [...store.products];
  const { search, category, lowStock } = req.query;
  if (search) list = list.filter(p => p.name.toLowerCase().includes(String(search).toLowerCase()) || p.sku.toLowerCase().includes(String(search).toLowerCase()));
  if (category) list = list.filter(p => p.category === String(category));
  if (lowStock === "true") list = list.filter(p => p.quantity <= p.minQuantity);
  list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

router.get("/products/:id", requireAuth, (req: Request, res: Response) => {
  const p = store.products.find(p => p.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Товар не найден" });
  res.json(p);
});

router.post("/products", requireAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.sku || !data.category) {
    return res.status(400).json({ error: "Заполните обязательные поля" });
  }
  // Проверяем уникальность SKU
  if (store.products.find(p => p.sku === data.sku)) {
    return res.status(409).json({ error: "Товар с таким артикулом уже существует" });
  }
  const product = {
    id: store.nextId("products"),
    name: data.name,
    sku: data.sku,
    category: data.category,
    quantity: Number(data.quantity) || 0,
    unit: data.unit || "шт",
    purchasePrice: Number(data.purchasePrice) || 0,
    minQuantity: Number(data.minQuantity) || 0,
    supplier: data.supplier || "",
    description: data.description || "",
    updatedAt: new Date().toISOString(),
  };
  store.products.push(product);
  res.status(201).json(product);
});

router.put("/products/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Товар не найден" });
  store.products[idx] = { ...store.products[idx], ...req.body, id: store.products[idx].id, updatedAt: new Date().toISOString() };
  res.json(store.products[idx]);
});

router.delete("/products/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Товар не найден" });
  store.products.splice(idx, 1);
  res.json({ message: "Товар удалён" });
});

// ════════════════════════════════════════════════
//  SUPPLIERS
// ════════════════════════════════════════════════
router.get("/suppliers", requireAuth, (req: Request, res: Response) => {
  let list = [...store.suppliers];
  const { search } = req.query;
  if (search) list = list.filter(s => s.name.toLowerCase().includes(String(search).toLowerCase()));
  list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

router.get("/suppliers/:id", requireAuth, (req: Request, res: Response) => {
  const s = store.suppliers.find(s => s.id === Number(req.params.id));
  if (!s) return res.status(404).json({ error: "Поставщик не найден" });
  res.json(s);
});

router.post("/suppliers", requireAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name) return res.status(400).json({ error: "Укажите название поставщика" });
  const supplier = {
    id: store.nextId("suppliers"),
    name: data.name,
    contact: data.contact || "",
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    comment: data.comment || "",
    createdAt: new Date().toISOString(),
  };
  store.suppliers.push(supplier);
  res.status(201).json(supplier);
});

router.put("/suppliers/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.suppliers.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Поставщик не найден" });
  store.suppliers[idx] = { ...store.suppliers[idx], ...req.body, id: store.suppliers[idx].id };
  res.json(store.suppliers[idx]);
});

router.delete("/suppliers/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.suppliers.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Поставщик не найден" });
  store.suppliers.splice(idx, 1);
  res.json({ message: "Поставщик удалён" });
});

// ════════════════════════════════════════════════
//  TRANSACTIONS
// ════════════════════════════════════════════════
router.get("/transactions", requireAuth, (req: Request, res: Response) => {
  const { type, page = "1", limit = "20" } = req.query;
  let list = [...store.transactions];
  if (type) list = list.filter(t => t.type === String(type));
  list.sort((a, b) => b.id - a.id);

  const pageNum = parseInt(String(page));
  const limitNum = parseInt(String(limit));
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    transactions: paginated,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  });
});

router.post("/transactions", requireAuth, (req: Request, res: Response) => {
  const { type, product: productId, quantity, price, supplier, comment } = req.body;
  if (!type || !productId || !quantity || !price) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }

  const product = store.products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ error: "Товар не найден" });

  if ((type === "outcome" || type === "writeoff") && product.quantity < quantity) {
    return res.status(400).json({
      error: `Недостаточно товара. Доступно: ${product.quantity} ${product.unit}`,
    });
  }

  // Обновляем количество товара
  const delta = type === "income" ? Number(quantity) : -Number(quantity);
  const idx = store.products.findIndex(p => p.id === product.id);
  store.products[idx].quantity += delta;
  store.products[idx].updatedAt = new Date().toISOString();

  // Получаем displayName пользователя из сессии если есть
  const by = (req as any).user?.displayName || "Администратор";

  const transaction = {
    id: store.nextId("transactions"),
    type: type as "income" | "outcome" | "writeoff",
    product: product.name,
    sku: product.sku,
    productId: product.id,
    quantity: Number(quantity),
    unit: product.unit,
    price: Number(price),
    total: Number(quantity) * Number(price),
    supplier: supplier || "",
    by,
    comment: comment || "",
    date: new Date().toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
  };

  store.transactions.push(transaction);
  res.status(201).json(transaction);
});

// ════════════════════════════════════════════════
//  CONTRACTS
// ════════════════════════════════════════════════
router.get("/contracts", requireAuth, (req: Request, res: Response) => {
  let list = [...store.contracts];
  const { status, search } = req.query;

  // Автообновление просроченных
  const now = new Date();
  list.forEach(c => {
    if (c.status === "active" && new Date(c.endDate) < now) {
      c.status = "expired";
    }
  });

  if (status) list = list.filter(c => c.status === String(status));
  if (search) list = list.filter(c => c.clientName.toLowerCase().includes(String(search).toLowerCase()));
  list.sort((a, b) => b.id - a.id);
  res.json(list);
});

router.get("/contracts/:id", requireAuth, (req: Request, res: Response) => {
  const c = store.contracts.find(c => c.id === Number(req.params.id));
  if (!c) return res.status(404).json({ error: "Договор не найден" });
  res.json(c);
});

router.post("/contracts", requireAuth, (req: Request, res: Response) => {
  const data = req.body;
  const year = new Date().getFullYear();
  const num = store.contracts.length + 1;
  const end = new Date(data.startDate);
  end.setMonth(end.getMonth() + Number(data.durationMonths));

  const contract = {
    id: store.nextId("contracts"),
    number: `ДХ-${year}-${String(num).padStart(4, "0")}`,
    status: "active" as const,
    clientName: data.clientName || "",
    clientContact: data.clientContact || "",
    clientPhone: data.clientPhone || "",
    clientEmail: data.clientEmail || "",
    clientAddress: data.clientAddress || "",
    clientInn: data.clientInn || "",
    clientKpp: data.clientKpp || "",
    clientOgrn: data.clientOgrn || "",
    clientAccount: data.clientAccount || "",
    clientBik: data.clientBik || "",
    clientBank: data.clientBank || "",
    clientKorr: data.clientKorr || "",
    clientFactAddress: data.clientFactAddress || "",
    productName: data.productName || "",
    productSku: data.productSku || "",
    quantity: Number(data.quantity) || 0,
    unit: data.unit || "шт",
    purchasePrice: Number(data.purchasePrice) || 0,
    totalValue: Number(data.quantity) * Number(data.purchasePrice),
    storageArea: Number(data.storageArea) || 0,
    storageRate: Number(data.storageRate) || 0,
    storageCostPerMonth: Number(data.storageArea) * Number(data.storageRate),
    durationMonths: Number(data.durationMonths) || 0,
    totalStorageCost: Number(data.storageArea) * Number(data.storageRate) * Number(data.durationMonths),
    startDate: data.startDate || "",
    endDate: end.toISOString().split("T")[0],
    penaltyType: data.penaltyType || "percent",
    penaltyPercent: Number(data.penaltyPercent) || 1.5,
    penaltyPerDay: Number(data.penaltyPerDay) || 0,
    maxPenalty: Number(data.maxPenalty) || 0,
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };

  store.contracts.push(contract);
  res.status(201).json(contract);
});

router.put("/contracts/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.contracts.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Договор не найден" });

  const data = req.body;
  const updated = { ...store.contracts[idx], ...data, id: store.contracts[idx].id };

  // Пересчитываем поля если изменились
  if (data.quantity || data.purchasePrice) {
    updated.totalValue = (data.quantity || store.contracts[idx].quantity) *
      (data.purchasePrice || store.contracts[idx].purchasePrice);
  }
  if (data.storageArea || data.storageRate || data.durationMonths) {
    updated.storageCostPerMonth = updated.storageArea * updated.storageRate;
    updated.totalStorageCost = updated.storageCostPerMonth * updated.durationMonths;
  }
  if (data.startDate || data.durationMonths) {
    const end = new Date(updated.startDate);
    end.setMonth(end.getMonth() + Number(updated.durationMonths));
    updated.endDate = end.toISOString().split("T")[0];
  }

  store.contracts[idx] = updated;
  res.json(updated);
});

router.delete("/contracts/:id", requireAuth, (req: Request, res: Response) => {
  const idx = store.contracts.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Договор не найден" });
  store.contracts.splice(idx, 1);
  res.json({ message: "Договор удалён" });
});

// ════════════════════════════════════════════════
//  CATEGORIES (из товаров)
// ════════════════════════════════════════════════
router.get("/categories", requireAuth, (_req: Request, res: Response) => {
  const cats = [...new Set(store.products.map(p => p.category))].sort();
  res.json(cats.map(name => ({ name, count: store.products.filter(p => p.category === name).length })));
});

// ════════════════════════════════════════════════
//  ЗАЯВКИ С PUBLIC СТРАНИЦЫ
// ════════════════════════════════════════════════
interface PublicRequest {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  sectionId: string;
  area: number;
  storageRate: number;
  periodMonths: number;
  totalCost: number;
  startDate: string;
  comment: string;
  status: 'new' | 'processing' | 'converted' | 'rejected';
  createdAt: string;
}

const publicRequests: PublicRequest[] = [];
let nextReqId = 1;

// POST /api/public-requests — принять заявку с public.html (без авторизации)
router.post("/public-requests", (req: Request, res: Response) => {
  const { clientName, clientPhone, clientEmail, sectionId, area, storageRate, periodMonths, totalCost, startDate, comment } = req.body;
  if (!clientName || !clientPhone) {
    return res.status(400).json({ error: "Укажите имя и телефон" });
  }
  const request: PublicRequest = {
    id: nextReqId++,
    clientName, clientPhone, clientEmail: clientEmail || '',
    sectionId: sectionId || '', area: Number(area) || 0,
    storageRate: Number(storageRate) || 0, periodMonths: Number(periodMonths) || 0,
    totalCost: Number(totalCost) || 0, startDate: startDate || '',
    comment: comment || '', status: 'new',
    createdAt: new Date().toLocaleString("ru-RU"),
  };
  publicRequests.push(request);
  res.status(201).json({ message: "Заявка принята", id: request.id });
});

// GET /api/public-requests — список заявок для админки
router.get("/public-requests", requireAuth, (_req: Request, res: Response) => {
  res.json([...publicRequests].reverse());
});

// PUT /api/public-requests/:id — сменить статус заявки
router.put("/public-requests/:id", requireAuth, (req: Request, res: Response) => {
  const r = publicRequests.find(x => x.id === Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Заявка не найдена" });
  Object.assign(r, req.body, { id: r.id });
  res.json(r);
});

export default router;

// ─── ЦЕНТРАЛЬНОЕ ХРАНИЛИЩЕ В ПАМЯТИ ───────────────────────
// Все роуты читают и пишут сюда — данные едины для всех страниц

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  minQuantity: number;
  supplier: string;
  description: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: "income" | "outcome" | "writeoff";
  product: string;
  sku: string;
  productId: number;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  supplier: string;
  by: string;
  comment: string;
  date: string;
}

export interface Contract {
  id: number;
  number: string;
  status: "active" | "completed" | "expired" | "cancelled";
  clientName: string;
  clientContact: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientInn: string;
  clientKpp: string;
  clientOgrn: string;
  clientAccount: string;
  clientBik: string;
  clientBank: string;
  clientKorr: string;
  clientFactAddress: string;
  productName: string;
  productSku: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  totalValue: number;
  storageArea: number;
  storageRate: number;
  storageCostPerMonth: number;
  durationMonths: number;
  totalStorageCost: number;
  startDate: string;
  endDate: string;
  penaltyType: "percent" | "fixed";
  penaltyPercent: number;
  penaltyPerDay: number;
  maxPenalty: number;
  notes: string;
  createdAt: string;
}

// ─── НАЧАЛЬНЫЕ ДАННЫЕ ──────────────────────────────────────
const initialProducts: Product[] = [
  { id: 1, name: "Бумага А4, 500 листов", sku: "PAP-001", category: "Бумага и картон", quantity: 120, unit: "бл", purchasePrice: 180, minQuantity: 20, supplier: "ОфисСнаб", description: "", updatedAt: new Date().toISOString() },
  { id: 2, name: "Ручки шариковые синие", sku: "PEN-042", category: "Канцелярия", quantity: 8, unit: "уп", purchasePrice: 90, minQuantity: 15, supplier: "КанцОпт", description: "", updatedAt: new Date().toISOString() },
  { id: 3, name: "Картридж HP 85A", sku: "INK-017", category: "Расходники", quantity: 2, unit: "шт", purchasePrice: 900, minQuantity: 5, supplier: "ТехноДом", description: "Для HP LaserJet", updatedAt: new Date().toISOString() },
  { id: 4, name: "Маркер перманентный", sku: "MRK-008", category: "Канцелярия", quantity: 18, unit: "шт", purchasePrice: 35, minQuantity: 10, supplier: "КанцОпт", description: "", updatedAt: new Date().toISOString() },
  { id: 5, name: "Скрепки 50мм (кор)", sku: "CLP-003", category: "Канцелярия", quantity: 3, unit: "кор", purchasePrice: 25, minQuantity: 10, supplier: "КанцОпт", description: "", updatedAt: new Date().toISOString() },
  { id: 6, name: "Папки-регистраторы А4", sku: "FLD-022", category: "Канцелярия", quantity: 45, unit: "шт", purchasePrice: 85, minQuantity: 10, supplier: "ОфисСнаб", description: "", updatedAt: new Date().toISOString() },
  { id: 7, name: "Степлер настольный", sku: "STL-011", category: "Канцелярия", quantity: 12, unit: "шт", purchasePrice: 220, minQuantity: 5, supplier: "ОфисСнаб", description: "", updatedAt: new Date().toISOString() },
  { id: 8, name: "Блокноты А5 в клетку", sku: "NTB-033", category: "Бумага и картон", quantity: 4, unit: "шт", purchasePrice: 60, minQuantity: 15, supplier: "ПоставщикПлюс", description: "", updatedAt: new Date().toISOString() },
  { id: 9, name: "Клей-карандаш 21г", sku: "GLU-005", category: "Канцелярия", quantity: 30, unit: "шт", purchasePrice: 45, minQuantity: 10, supplier: "КанцОпт", description: "", updatedAt: new Date().toISOString() },
  { id: 10, name: "Лоток для бумаг", sku: "TRY-014", category: "Мебель", quantity: 7, unit: "шт", purchasePrice: 280, minQuantity: 3, supplier: "МебельОпт", description: "", updatedAt: new Date().toISOString() },
  { id: 11, name: "Пакеты фасовочные 1кг", sku: "PKG-031", category: "Упаковка", quantity: 0, unit: "шт", purchasePrice: 2, minQuantity: 100, supplier: "УпакСнаб", description: "", updatedAt: new Date().toISOString() },
  { id: 12, name: "Ножницы офисные 21см", sku: "SCS-009", category: "Канцелярия", quantity: 25, unit: "шт", purchasePrice: 120, minQuantity: 5, supplier: "ОфисСнаб", description: "", updatedAt: new Date().toISOString() },
];

const initialSuppliers: Supplier[] = [
  { id: 1, name: "ОфисСнаб", contact: "Петров Сергей", phone: "+7 (495) 123-45-67", email: "info@offissnab.ru", address: "г. Москва, ул. Офисная, 15", comment: "Основной поставщик", createdAt: new Date().toISOString() },
  { id: 2, name: "КанцОпт", contact: "Сидорова Елена", phone: "+7 (495) 234-56-78", email: "sales@kantopt.ru", address: "г. Москва, ул. Торговая, 8", comment: "Оптовые поставки", createdAt: new Date().toISOString() },
  { id: 3, name: "ТехноДом", contact: "Козлов Андрей", phone: "+7 (495) 345-67-89", email: "kozlov@technodom.ru", address: "г. Москва, пр. Ленина, 22", comment: "Картриджи", createdAt: new Date().toISOString() },
  { id: 4, name: "МебельОпт", contact: "Лебедева Ольга", phone: "+7 (812) 456-78-90", email: "mebopt@gmail.com", address: "г. СПб, ул. Промышленная, 5", comment: "Офисная мебель", createdAt: new Date().toISOString() },
  { id: 5, name: "УпакСнаб", contact: "Новиков Дмитрий", phone: "+7 (495) 567-89-01", email: "d.novikov@upak.ru", address: "г. Москва, Варшавское ш., 100", comment: "Упаковка", createdAt: new Date().toISOString() },
  { id: 6, name: "ПоставщикПлюс", contact: "Морозова Татьяна", phone: "+7 (499) 678-90-12", email: "t.morozova@pplus.ru", address: "г. Москва, ул. Новая, 3", comment: "Бумага и блокноты", createdAt: new Date().toISOString() },
];

const now = new Date();
const dAgo = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); };

const initialTransactions: Transaction[] = [
  { id: 1, type: "income", product: "Бумага А4, 500 листов", sku: "PAP-001", productId: 1, quantity: 50, unit: "бл", price: 180, total: 9000, supplier: "ОфисСнаб", by: "Алексей И.", comment: "", date: dAgo(0) },
  { id: 2, type: "outcome", product: "Ручки шариковые синие", sku: "PEN-042", productId: 2, quantity: 10, unit: "уп", price: 150, total: 1500, supplier: "", by: "Мария С.", comment: "Для отдела продаж", date: dAgo(0) },
  { id: 3, type: "writeoff", product: "Картридж HP 85A", sku: "INK-017", productId: 3, quantity: 2, unit: "шт", price: 900, total: 1800, supplier: "", by: "Алексей И.", comment: "Закончился ресурс", date: dAgo(0) },
  { id: 4, type: "income", product: "Маркер перманентный", sku: "MRK-008", productId: 4, quantity: 100, unit: "шт", price: 35, total: 3500, supplier: "КанцОпт", by: "Иван П.", comment: "", date: dAgo(1) },
  { id: 5, type: "outcome", product: "Скрепки 50мм (кор)", sku: "CLP-003", productId: 5, quantity: 5, unit: "кор", price: 50, total: 250, supplier: "", by: "Мария С.", comment: "", date: dAgo(1) },
  { id: 6, type: "income", product: "Папки-регистраторы А4", sku: "FLD-022", productId: 6, quantity: 20, unit: "шт", price: 85, total: 1700, supplier: "ОфисСнаб", by: "Иван П.", comment: "", date: dAgo(2) },
  { id: 7, type: "outcome", product: "Бумага А4, 500 листов", sku: "PAP-001", productId: 1, quantity: 15, unit: "бл", price: 250, total: 3750, supplier: "", by: "Алексей И.", comment: "Бухгалтерия", date: dAgo(3) },
  { id: 8, type: "income", product: "Картридж HP 85A", sku: "INK-017", productId: 3, quantity: 5, unit: "шт", price: 900, total: 4500, supplier: "ТехноДом", by: "Иван П.", comment: "Срочная закупка", date: dAgo(5) },
  { id: 9, type: "income", product: "Скрепки 50мм (кор)", sku: "CLP-003", productId: 5, quantity: 30, unit: "кор", price: 25, total: 750, supplier: "КанцОпт", by: "Иван П.", comment: "", date: dAgo(7) },
  { id: 10, type: "outcome", product: "Ножницы офисные 21см", sku: "SCS-009", productId: 12, quantity: 5, unit: "шт", price: 120, total: 600, supplier: "", by: "Мария С.", comment: "", date: dAgo(9) },
];

const initialContracts: Contract[] = [
  {
    id: 1, number: "ДХ-2025-0001", status: "active",
    clientName: "ООО Ромашка", clientContact: "Иванов И.И.", clientPhone: "+7 (495) 123-45-67",
    clientEmail: "ivanov@romashka.ru", clientAddress: "г. Москва, ул. Цветочная, 5", clientInn: "7700123456",
    clientKpp: "770101001", clientOgrn: "1027700000001", clientAccount: "40702810000000000001",
    clientBik: "044525225", clientBank: "ПАО Сбербанк", clientKorr: "30101810400000000225",
    clientFactAddress: "",
    productName: "Бумага А4, 500 листов", productSku: "PAP-001", quantity: 1000, unit: "бл",
    purchasePrice: 180, totalValue: 180000,
    storageArea: 50, storageRate: 1200, storageCostPerMonth: 60000, durationMonths: 3, totalStorageCost: 180000,
    startDate: "2025-01-15", endDate: "2025-04-15",
    penaltyType: "percent", penaltyPercent: 1.5, penaltyPerDay: 0, maxPenalty: 0,
    notes: "Хранить в сухом помещении", createdAt: "2025-01-15"
  },
  {
    id: 2, number: "ДХ-2025-0002", status: "expired",
    clientName: "ИП Сидоров А.В.", clientContact: "Сидоров А.В.", clientPhone: "+7 (999) 234-56-78",
    clientEmail: "sidorov@mail.ru", clientAddress: "г. Москва, ул. Торговая, 12", clientInn: "771234567890",
    clientKpp: "", clientOgrn: "312771234567890", clientAccount: "40802810000000000002",
    clientBik: "044525225", clientBank: "ПАО Сбербанк", clientKorr: "30101810400000000225",
    clientFactAddress: "",
    productName: "Картридж HP 85A", productSku: "INK-017", quantity: 50, unit: "шт",
    purchasePrice: 900, totalValue: 45000,
    storageArea: 20, storageRate: 1500, storageCostPerMonth: 30000, durationMonths: 2, totalStorageCost: 60000,
    startDate: "2024-11-01", endDate: "2025-01-01",
    penaltyType: "fixed", penaltyPercent: 1.5, penaltyPerDay: 1500, maxPenalty: 30000,
    notes: "", createdAt: "2024-11-01"
  },
];

// ─── САМО ХРАНИЛИЩЕ ────────────────────────────────────────
export const store = {
  products: [...initialProducts] as Product[],
  suppliers: [...initialSuppliers] as Supplier[],
  transactions: [...initialTransactions] as Transaction[],
  contracts: [...initialContracts] as Contract[],

  // Счётчики ID
  _nextId: {
    products: initialProducts.length + 1,
    suppliers: initialSuppliers.length + 1,
    transactions: initialTransactions.length + 1,
    contracts: initialContracts.length + 1,
  },

  nextId(entity: keyof typeof this._nextId): number {
    return this._nextId[entity]++;
  },
};

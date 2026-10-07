import packageJson from "../package.json";
import releaseInfo from "../release-info.json";

// ─── Константы справочников ─────────────────────────────────────────────────

export const APP_VERSION = releaseInfo.version || packageJson.version;

export const DEFAULT_PRODUCT_TYPES = [
  "Визитки", "Листовки", "Буклеты", "Флаеры", "Брошюры", "Каталоги",
  "Воблеры", "Бейджи", "Календари", "Плакаты", "Наклейки", "Открытка", "Конверты", "Сертификаты", "Бланки",
  "Папки", "Блокноты", "Кубарики", "Бумажные Пакеты", "Другое...",
];

export const DEFAULT_PAPER_SIZES = [
  "A6 (105×148 мм)", "A5 (148×210 мм)", "A4 (210×297 мм)",
  "A3 (297×420 мм)", "A2 (420×594 мм)", "A1 (594×841 мм)",
  "A0 (841×1189 мм)", "Евро (100×210 мм)", "Нестандартный",
];

export const DEFAULT_POCKET_CALENDAR_SIZES = [
  "70×100",
  "Нестандартный",
];

export const DEFAULT_BUSINESS_CARD_SIZES = [
  "90×50 мм",
  "85×55 мм",
  "Евро-визитка 85×54 мм",
  "Нестандартный",
];

export const DEFAULT_ENVELOPE_SIZES = [
  "E65 / Евро (110×220 мм)", "C3 (324×458 мм)", "C4 (229×324 мм)",
  "C5 (162×229 мм)", "C6 (114×162 мм)", "C65 (114×229 мм)",
  "DL (110×220 мм)", "B4 (250×353 мм)", "B5 (176×250 мм)",
  "B6 (125×176 мм)", "Каталожный C4 с расширением", "Нестандартный",
];

export const DEFAULT_DENSITIES = [
  "80 г/м² (офисная)", "90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²",
  "170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²", "400 г/м²",
];

export const PAPER_TYPE_OPTIONS = ["Мелованная", "Офсетная", "Каландр", "Картон", "Без бумаги", "Давальческая", "Дизайнерская"] as const;
export type PaperTypeOption = typeof PAPER_TYPE_OPTIONS[number];
export const BAG_PAPER_TYPE_OPTIONS = PAPER_TYPE_OPTIONS;
export type BagPaperTypeOption = PaperTypeOption;

export const DEFAULT_PAPER_LIBRARY = {
  coated: ["115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²"],
  offset: ["80 г/м²", "90 г/м²", "100 г/м²", "115 г/м²", "130 г/м²", "150 г/м²"],
  calender: ["90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²"],
  cardboard: ["270 г/м²"],
  designer: ["Sirio Color", "Touch Cover", "Curious Metallic", "Nettuno", "Constellation"],
};

export type PaperLibraryKey = keyof typeof DEFAULT_PAPER_LIBRARY;

export const PAPER_TYPE_TO_LIBRARY_KEY: Record<PaperTypeOption, PaperLibraryKey> = {
  "Мелованная": "coated",
  "Офсетная": "offset",
  "Каландр": "calender",
  "Картон": "cardboard",
  "Без бумаги": "coated",
  "Давальческая": "coated",
  "Дизайнерская": "designer",
};

export const DEFAULT_COLORS = [
  "1+0 (чёрно-белая, одна сторона)", "1+1 (чёрно-белая, две стороны)",
  "4+0 (полноцвет, одна сторона)", "4+4 (полноцвет, две стороны)",
  "4+1 (полноцвет + чб)", "Пантон (Pantone)",
];
export const AUTO_REVERSE_COLOR = "4+4 (полноцвет, две стороны)";

export const STICKER_COLOR_MODES = ["1+0", "4+0", "5+0"];

export const DEFAULT_POST_PROCESSING = [
  "Перфорация",
  "Сверление отверстий",
  "Тиснение фольгой",
  "Фольгирование",
  "УФ-лак",
  "Прикатка магнита",
  "Скругление углов",
  "Раскрой IECHO",
  "Сортировка/упаковка",
];

export const DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES = [
  "Обложка",
  "Подложка",
  "Листы блока",
  "Вкладыш",
  "Разделитель",
  "Фотостраница",
  "Другое",
] as const;

export const DEFAULT_BINDING_TYPES = [
  "Скоба", "Термобиндер", "PUR-клей", "Пружина", "Без сшивки",
];

export const DEFAULT_LAMINATION_KINDS = ["Глянцевая", "Матовая", "Софт (Soft-Touch)", "Нестандартный"];
export const DEFAULT_LAMINATION_THICKNESS = ["30 мк", "80 мк", "125 мк"];

export const SPRING_COLORS = [
  "Белая", "Чёрная", "Серебро", "Другой цвет...",
];

export type SpringSpec = { diameter: string; pitch: "2:1" | "3:1"; capacityMm: number; subcontract: boolean; note?: string };
export const SPRING_SPECS: SpringSpec[] = [
  { diameter: "6.4 мм", pitch: "2:1", capacityMm: 4.5, subcontract: false },
  { diameter: "8 мм", pitch: "2:1", capacityMm: 6, subcontract: false },
  { diameter: "9.5 мм", pitch: "2:1", capacityMm: 7.5, subcontract: false },
  { diameter: "11 мм", pitch: "2:1", capacityMm: 9, subcontract: false },
  { diameter: "12.7 мм", pitch: "2:1", capacityMm: 10.5, subcontract: false },
  { diameter: "14.3 мм", pitch: "2:1", capacityMm: 12, subcontract: false },
  { diameter: "16 мм", pitch: "3:1", capacityMm: 14.3, subcontract: true },
  { diameter: "19 мм", pitch: "3:1", capacityMm: 16.4, subcontract: true },
  { diameter: "22.2 мм", pitch: "3:1", capacityMm: 20.6, subcontract: true },
  { diameter: "25.4 мм", pitch: "3:1", capacityMm: 23.8, subcontract: true },
];
export const DRILL_DIAMETERS = ["2 мм", "3 мм", "4 мм", "5 мм", "6 мм", "8 мм", "10 мм", "12 мм"];
export const CALENDAR_OFFSET_COLORS = ["Серый", "Жёлтый", "Голубой", "3в1 (серый)"];
export const BAG_COLOR_OPTIONS = ["Белый", "Чёрный", "Синий", "Красный", "Золото", "Серебро", "Другой цвет..."];
export const BAG_HANDLE_TYPES = ["Верёвка", "Лента"];
// Картинки успеха: обычные с весом 1, Exclusive — 1 к 10, Legendary — 1 к 50.
export const SUCCESS_IMAGE_NAMES = ["Cat.png", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"];
export const RARE_SUCCESS_IMAGE_NAMES = ["Exclusive.png", "Legendary.png", "Mific.png"];
export const SUCCESS_IMAGE_WEIGHTS: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  SUCCESS_IMAGE_NAMES.forEach((name) => { map[name] = 1; });
  map["Exclusive.png"] = 0.1;
  map["Legendary.png"] = 0.02;
  map["Mific.png"] = 0.0005;
  return map;
})();
export const SUCCESS_IMAGE_SRCS = [...SUCCESS_IMAGE_NAMES, ...RARE_SUCCESS_IMAGE_NAMES].map((name) => `${import.meta.env.BASE_URL}${name}`);
export const STICKER_MATERIALS = [
  "Самоклеящаяся бумага без просечки",
  "Самоклеящаяся бумага с просечкой",
  "Полилазер белый матовый",
  "Полилазер белый глянцевый",
  "Полилазер прозрачный",
];

export const KASHUROVKA_BASE_TYPES = [
  "Переплётный картон 1.75 мм",
];

export const KASHUROVKA_LINER_TYPES = [
  "Мелованная 150 г/м²", "Мелованная 170 г/м²", "Мелованная 200 г/м²",
  "Мелованная 250 г/м²", "Дизайнерская 150 г/м²", "Дизайнерская 200 г/м²",
  "Крафт 150 г/м²", "Крафт 200 г/м²",
];

export const FORSAC_PAPER_TYPES = [
  "Мелованная 115 г/м²", "Мелованная 130 г/м²", "Мелованная 150 г/м²",
  "Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²",
  "Офсетная 80 г/м²", "Офсетная 90 г/м²", "Офсетная 115 г/м²",
  "Дизайнерская 120 г/м²", "Дизайнерская 150 г/м²", "Дизайнерская 200 г/м²",
  "Крафт 90 г/м²", "Крафт 120 г/м²", "Крафт 150 г/м²",
];

export const DEFAULT_MANAGERS = [
  "Алёна", "Аня", "Катя", "Кристина", "Лиза", "Татьяна Почебыт"
];

export const DEFAULT_AD_MANAGERS = ["Оля"];

export const DEFAULT_PAPER_PROFILES = {
  common: ["80 г/м² (офисная)", "90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²"],
  heavy: ["170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²", "400 г/м²"],
  notebookCover: ["200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²"],
  notebookBlock: ["80 г/м² (офисная)", "90 г/м²", "100 г/м²", "120 г/м²"],
  calendarBase: ["Мелованная 350 г/м²", "Картон 270 г/м²", "Другое..."],
  calendarGridDigital: ["115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "Мелованная 200 г/м²"],
  calendarGridOffset: ["Офсетная 80 г/м²", "Офсетная 90 г/м²"],
  bag: ["170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "Крафт 120 г/м²", "Крафт 150 г/м²"],
  sticker: STICKER_MATERIALS,
  kashLiner: ["Мелованная 150 г/м²", "Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²", "Дизайнерская 150 г/м²", "Крафт 150 г/м²"],
  kashForsac: ["Мелованная 130 г/м²", "Мелованная 150 г/м²", "Офсетная 80 г/м²", "Офсетная 90 г/м²", "Дизайнерская 120 г/м²"],
  slip: ["Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²", "Дизайнерская 200 г/м²"],
};

export type PaperProfileKey = keyof typeof DEFAULT_PAPER_PROFILES;

export const PAPER_PROFILE_LABELS: Record<PaperProfileKey, string> = {
  common: "Бумаги для стандартной продукции",
  heavy: "Плотные бумаги / обложки",
  notebookCover: "Бумаги для обложек блокнотов",
  notebookBlock: "Бумаги для блоков блокнотов",
  calendarBase: "Материалы для оснований календарей",
  calendarGridDigital: "Материалы для календарной сетки (цифра)",
  calendarGridOffset: "Материалы для календарной сетки (офсет)",
  bag: "Материалы для пакетов",
  sticker: "Материалы для наклеек",
  kashLiner: "Лайнеры для кашировки",
  kashForsac: "Материалы форзаца",
  slip: "Бумаги для слип-кашировки",
};

export const LS_KEYS = {
  productTypes: "dict_productTypes",
  productTemplates: "dict_productTemplates",
  paperSizes: "dict_paperSizes",
  pocketCalendarSizes: "dict_pocketCalendarSizes",
  businessCardSizes: "dict_businessCardSizes",
  paperLibrary: "dict_paperLibrary",
  envelopeSizes: "dict_envelopeSizes",
  densities: "dict_densities",
  colors: "dict_colors",
  postProcessing: "dict_postProcessing",
  bindingTypes: "dict_bindingTypes",
  laminationKinds: "dict_laminationKinds",
  laminationThickness: "dict_laminationThickness",
  springSpecs: "dict_springSpecs",
  notebookCompositionPartTypes: "dict_notebookCompositionPartTypes",
  managers: "dict_managers",
  adManagers: "dict_adManagers",
  managerMarkerState: "dict_managerMarkerState",
  paperProfiles: "dict_paperProfiles",
  sheetName: "config_sheetName",
  updateSummaryVersion: "update_summary_version",
  successImageStats: "success_image_stats",
};

export type ProductLayoutKind =
  | "standard"
  | "businessCard"
  | "catalog"
  | "brochure"
  | "calendar"
  | "notebook"
  | "envelope"
  | "bag"
  | "sticker"
  | "wobbler"
  | "badge"
  | "cubes";

export type ProductTemplateFieldKey = "size" | "paper" | "color" | "lamination" | "postProcessing";

export interface ProductTemplateFieldConfig {
  label: string;
  required: boolean;
}

export interface ProductTemplateFlags {
  showSize: boolean;
  showPaper: boolean;
  showColor: boolean;
  showLamination: boolean;
  showPostProcessing: boolean;
}

export interface ProductTemplateConfig {
  kind: ProductLayoutKind;
  flags: ProductTemplateFlags;
  fields: Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>;
}

export type ProductTemplateStore = Record<string, ProductTemplateConfig>;

export const PRODUCT_TEMPLATE_FIELD_KEYS: ProductTemplateFieldKey[] = ["size", "paper", "color", "lamination", "postProcessing"];

export const DEFAULT_PRODUCT_TEMPLATE_FIELDS: Record<ProductTemplateFieldKey, ProductTemplateFieldConfig> = {
  size: { label: "Размер / формат", required: true },
  paper: { label: "Бумага / материал", required: true },
  color: { label: "Цветность", required: true },
  lamination: { label: "Ламинация", required: true },
  postProcessing: { label: "Обработка", required: true },
};

export const DEFAULT_PRODUCT_TEMPLATE_FLAGS: Record<ProductLayoutKind, ProductTemplateFlags> = {
  standard: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  businessCard: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  catalog: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  brochure: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  calendar: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  notebook: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  envelope: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  bag: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  sticker: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  wobbler: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  badge: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  cubes: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
};

export const DEFAULT_PRODUCT_TEMPLATE_KINDS: Record<string, ProductLayoutKind> = {
  "Визитки": "businessCard",
  "Листовки": "standard",
  "Буклеты": "standard",
  "Флаеры": "standard",
  "Брошюры": "brochure",
  "Каталоги": "catalog",
  "Воблеры": "wobbler",
  "Бейджи": "badge",
  "Календари": "calendar",
  "Плакаты": "standard",
  "Наклейки": "sticker",
  "Открытка": "standard",
  "Конверты": "envelope",
  "Сертификаты": "standard",
  "Бланки": "standard",
  "Папки": "standard",
  "Блокноты": "notebook",
  "Бумажные Пакеты": "bag",
  "Кубарики": "cubes",
  "Другое...": "standard",
};

export const DEFAULT_PRODUCT_TEMPLATES: ProductTemplateStore = Object.fromEntries(
  Object.entries(DEFAULT_PRODUCT_TEMPLATE_KINDS).map(([name, kind]) => [
    name,
    {
      kind,
      flags: { ...DEFAULT_PRODUCT_TEMPLATE_FLAGS[kind] },
      fields: Object.fromEntries(
        PRODUCT_TEMPLATE_FIELD_KEYS.map((key) => [key, { ...DEFAULT_PRODUCT_TEMPLATE_FIELDS[key] }]),
      ) as Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>,
    },
  ]),
) as ProductTemplateStore;

export const PRODUCT_LAYOUT_OPTIONS: Array<{ value: ProductLayoutKind; label: string }> = [
  { value: "standard", label: "Стандарт" },
  { value: "businessCard", label: "Визитки" },
  { value: "catalog", label: "Каталог" },
  { value: "brochure", label: "Брошюра" },
  { value: "calendar", label: "Календарь" },
  { value: "notebook", label: "Блокнот" },
  { value: "envelope", label: "Конверт" },
  { value: "bag", label: "Пакеты" },
  { value: "sticker", label: "Наклейки" },
  { value: "wobbler", label: "Воблер" },
  { value: "badge", label: "Бейдж" },
  { value: "cubes", label: "Кубарики" },
];

export const PRODUCT_LAYOUT_META: Record<ProductLayoutKind, { title: string; description: string }> = {
  standard: {
    title: "Стандарт",
    description: "Универсальный шаблон для обычных изделий без особых правил.",
  },
  businessCard: {
    title: "Визитки",
    description: "Подходит для изделий, где важны формат, бумага и цветность.",
  },
  catalog: {
    title: "Каталог",
    description: "Для многостраничных изделий с акцентом на бумагу и постобработку.",
  },
  brochure: {
    title: "Брошюра",
    description: "Для изделий с акцентом на формат, бумагу и склейку/сшивку.",
  },
  calendar: {
    title: "Календарь",
    description: "Для календарей с отдельными параметрами шапки, сетки и основания.",
  },
  notebook: {
    title: "Блокнот",
    description: "Для блокнотов, где важно число листов, обложка и блок.",
  },
  envelope: {
    title: "Конверт",
    description: "Для конвертов с собственными правилами по бумаге и цветности.",
  },
  bag: {
    title: "Пакеты",
    description: "Для бумажных пакетов с выбором ручек, люверсов и сборки.",
  },
  sticker: {
    title: "Наклейки",
    description: "Для наклеек и этикеток, где часть полей может не понадобиться.",
  },
  wobbler: {
    title: "Воблер",
    description: "Для воблеров с учётом плоттера, ножки и материала.",
  },
  badge: {
    title: "Бейдж",
    description: "Для бейджей и пропусков с отдельными требованиями к отверстиям.",
  },
  cubes: {
    title: "Кубарики",
    description: "Для блоков кубариков с размером, бумагой, цветностью и количеством листов.",
  },
};

export const runtimeState = {
  productTemplates: { ...DEFAULT_PRODUCT_TEMPLATES } as ProductTemplateStore,
  springSpecs: [...SPRING_SPECS] as SpringSpec[],
};

export const UPDATE_SUMMARY_POINTS = [
  ...(Array.isArray(releaseInfo.startMessage) ? releaseInfo.startMessage : []),
];
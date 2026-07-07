import { Fragment, useEffect, useRef, useState } from "react";
import packageJson from "../package.json";

// ─── Константы справочников ─────────────────────────────────────────────────

const APP_VERSION = packageJson.version;

const DEFAULT_PRODUCT_TYPES = [
  "Визитки", "Листовки", "Буклеты", "Флаеры", "Брошюры", "Каталоги",
  "Воблеры", "Бейджи", "Календари", "Плакаты", "Наклейки", "Открытка", "Конверты", "Сертификаты", "Бланки",
  "Папки", "Блокноты", "Бумажные Пакеты", "Другое...",
];

const DEFAULT_PAPER_SIZES = [
  "A6 (105×148 мм)", "A5 (148×210 мм)", "A4 (210×297 мм)",
  "A3 (297×420 мм)", "A2 (420×594 мм)", "A1 (594×841 мм)",
  "A0 (841×1189 мм)", "Евро (100×210 мм)", "Нестандартный",
];

const DEFAULT_POCKET_CALENDAR_SIZES = [
  "70×100",
  "Нестандартный",
];

const DEFAULT_BUSINESS_CARD_SIZES = [
  "90×50 мм",
  "85×55 мм",
  "Евро-визитка 85×54 мм",
  "Нестандартный",
];

const DEFAULT_ENVELOPE_SIZES = [
  "E65 / Евро (110×220 мм)", "C3 (324×458 мм)", "C4 (229×324 мм)",
  "C5 (162×229 мм)", "C6 (114×162 мм)", "C65 (114×229 мм)",
  "DL (110×220 мм)", "B4 (250×353 мм)", "B5 (176×250 мм)",
  "B6 (125×176 мм)", "Каталожный C4 с расширением", "Нестандартный",
];

const DEFAULT_DENSITIES = [
  "80 г/м² (офисная)", "90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²",
  "170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²", "400 г/м²",
];

const PAPER_TYPE_OPTIONS = ["Мелованная", "Офсетная", "Каландр", "Картон", "Без бумаги", "Давальческая", "Дизайнерская"] as const;
type PaperTypeOption = typeof PAPER_TYPE_OPTIONS[number];
const BAG_PAPER_TYPE_OPTIONS = PAPER_TYPE_OPTIONS;
type BagPaperTypeOption = PaperTypeOption;

const DEFAULT_PAPER_LIBRARY = {
  coated: ["115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²"],
  offset: ["80 г/м²", "90 г/м²", "100 г/м²", "115 г/м²", "130 г/м²", "150 г/м²"],
  calender: ["90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²"],
  cardboard: ["270 г/м²"],
  designer: ["Sirio Color", "Touch Cover", "Curious Metallic", "Nettuno", "Constellation"],
};

type PaperLibraryKey = keyof typeof DEFAULT_PAPER_LIBRARY;

const PAPER_TYPE_TO_LIBRARY_KEY: Record<PaperTypeOption, PaperLibraryKey> = {
  "Мелованная": "coated",
  "Офсетная": "offset",
  "Каландр": "calender",
  "Картон": "cardboard",
  "Без бумаги": "coated",
  "Давальческая": "coated",
  "Дизайнерская": "designer",
};

const DEFAULT_COLORS = [
  "1+0 (чёрно-белая, одна сторона)", "1+1 (чёрно-белая, две стороны)",
  "4+0 (полноцвет, одна сторона)", "4+4 (полноцвет, две стороны)",
  "4+1 (полноцвет + чб)", "Пантон (Pantone)",
];
const AUTO_REVERSE_COLOR = "4+4 (полноцвет, две стороны)";

const STICKER_COLOR_MODES = ["1+0", "4+0", "5+0"];

const DEFAULT_POST_PROCESSING = [
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

const DEFAULT_BINDING_TYPES = [
  "Скоба", "Термобиндер", "PUR-клей", "Пружина",
];

const DEFAULT_LAMINATION_KINDS = ["Глянцевая", "Матовая", "Софт (Soft-Touch)"];
const DEFAULT_LAMINATION_THICKNESS = ["30 мк", "80 мк", "125 мк"];

const SPRING_COLORS = [
  "Прозрачная", "Чёрная", "Белая", "Синяя", "Красная", "Зелёная", "Жёлтая",
  "Серебряная", "Золотая", "Другой цвет...",
];

const SPRING_DIAMETERS = [
  "6 мм", "8 мм", "10 мм", "12 мм", "14 мм", "16 мм", "19 мм",
  "22 мм", "25 мм", "28 мм", "32 мм", "38 мм", "45 мм", "51 мм",
];
const DRILL_DIAMETERS = ["2 мм", "3 мм", "4 мм", "5 мм", "6 мм", "8 мм", "10 мм", "12 мм"];
const CALENDAR_OFFSET_COLORS = ["Серый", "Жёлтый", "Голубой", "3в1 (серый)"];
const BAG_COLOR_OPTIONS = ["Белый", "Чёрный", "Синий", "Красный", "Золото", "Серебро", "Другой цвет..."];
const BAG_HANDLE_TYPES = ["Верёвка", "Лента"];
const CAT_IMAGE_SRC = `${import.meta.env.BASE_URL}Cat.png`;
const STICKER_MATERIALS = [
  "Самоклеящаяся бумага без просечки",
  "Самоклеящаяся бумага с просечкой",
  "Полилазер белый матовый",
  "Полилазер белый глянцевый",
  "Полилазер прозрачный",
];

const KASHUROVKA_BASE_TYPES = [
  "Переплётный картон 1.5 мм", "Переплётный картон 2.0 мм",
  "Переплётный картон 2.5 мм", "Переплётный картон 3.0 мм",
  "Микрогофрокартон", "Картон 300 г/м²", "Картон 400 г/м²", "Картон 500 г/м²",
];

const KASHUROVKA_LINER_TYPES = [
  "Мелованная 150 г/м²", "Мелованная 170 г/м²", "Мелованная 200 г/м²",
  "Мелованная 250 г/м²", "Дизайнерская 150 г/м²", "Дизайнерская 200 г/м²",
  "Крафт 150 г/м²", "Крафт 200 г/м²",
];

const FORSAC_PAPER_TYPES = [
  "Мелованная 115 г/м²", "Мелованная 130 г/м²", "Мелованная 150 г/м²",
  "Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²",
  "Офсетная 80 г/м²", "Офсетная 90 г/м²", "Офсетная 115 г/м²",
  "Дизайнерская 120 г/м²", "Дизайнерская 150 г/м²", "Дизайнерская 200 г/м²",
  "Крафт 90 г/м²", "Крафт 120 г/м²", "Крафт 150 г/м²",
];

const DEFAULT_MANAGERS = [
  "Алёна", "Аня", "Катя", "Кристина", "Лиза", "Татьяна Почебыт"
];

const DEFAULT_AD_MANAGERS = ["Оля"];

const DEFAULT_PAPER_PROFILES = {
  common: ["80 г/м² (офисная)", "90 г/м²", "115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²", "200 г/м²"],
  heavy: ["170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²", "400 г/м²"],
  notebookCover: ["200 г/м²", "250 г/м²", "300 г/м²", "350 г/м²"],
  notebookBlock: ["80 г/м² (офисная)", "90 г/м²", "100 г/м²", "120 г/м²"],
  calendarBase: ["Картон 250 г/м²", "Картон 300 г/м²", "Картон 350 г/м²", "Переплётный картон 1.5 мм"],
  calendarGridDigital: ["115 г/м²", "130 г/м²", "150 г/м²", "170 г/м²"],
  calendarGridOffset: ["Офсетная 80 г/м²", "Офсетная 90 г/м²"],
  bag: ["170 г/м²", "200 г/м²", "250 г/м²", "300 г/м²", "Крафт 120 г/м²", "Крафт 150 г/м²"],
  sticker: STICKER_MATERIALS,
  kashLiner: ["Мелованная 150 г/м²", "Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²", "Дизайнерская 150 г/м²", "Крафт 150 г/м²"],
  kashForsac: ["Мелованная 130 г/м²", "Мелованная 150 г/м²", "Офсетная 80 г/м²", "Офсетная 90 г/м²", "Дизайнерская 120 г/м²"],
  slip: ["Мелованная 170 г/м²", "Мелованная 200 г/м²", "Мелованная 250 г/м²", "Дизайнерская 200 г/м²"],
};

type PaperProfileKey = keyof typeof DEFAULT_PAPER_PROFILES;

const PAPER_PROFILE_LABELS: Record<PaperProfileKey, string> = {
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

const LS_KEYS = {
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
  managers: "dict_managers",
  adManagers: "dict_adManagers",
  managerMarkerState: "dict_managerMarkerState",
  paperProfiles: "dict_paperProfiles",
  sheetName: "config_sheetName",
  updateSummaryVersion: "update_summary_version",
};

type ProductLayoutKind =
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
  | "badge";

type ProductTemplateFieldKey = "size" | "paper" | "color" | "lamination" | "postProcessing";

interface ProductTemplateFieldConfig {
  label: string;
  required: boolean;
}

interface ProductTemplateFlags {
  showSize: boolean;
  showPaper: boolean;
  showColor: boolean;
  showLamination: boolean;
  showPostProcessing: boolean;
}

interface ProductTemplateConfig {
  kind: ProductLayoutKind;
  flags: ProductTemplateFlags;
  fields: Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>;
}

type ProductTemplateStore = Record<string, ProductTemplateConfig>;

const PRODUCT_TEMPLATE_FIELD_KEYS: ProductTemplateFieldKey[] = ["size", "paper", "color", "lamination", "postProcessing"];

const DEFAULT_PRODUCT_TEMPLATE_FIELDS: Record<ProductTemplateFieldKey, ProductTemplateFieldConfig> = {
  size: { label: "Размер / формат", required: true },
  paper: { label: "Бумага / материал", required: true },
  color: { label: "Цветность", required: true },
  lamination: { label: "Ламинация", required: true },
  postProcessing: { label: "Обработка", required: true },
};

const DEFAULT_PRODUCT_TEMPLATE_FLAGS: Record<ProductLayoutKind, ProductTemplateFlags> = {
  standard: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  businessCard: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  catalog: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  brochure: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  calendar: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  notebook: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  envelope: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  bag: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  sticker: { showSize: true, showPaper: true, showColor: true, showLamination: false, showPostProcessing: true },
  wobbler: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
  badge: { showSize: true, showPaper: true, showColor: true, showLamination: true, showPostProcessing: true },
};

const DEFAULT_PRODUCT_TEMPLATE_KINDS: Record<string, ProductLayoutKind> = {
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
  "Другое...": "standard",
};

const DEFAULT_PRODUCT_TEMPLATES: ProductTemplateStore = Object.fromEntries(
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

const PRODUCT_LAYOUT_OPTIONS: Array<{ value: ProductLayoutKind; label: string }> = [
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
];

const PRODUCT_LAYOUT_META: Record<ProductLayoutKind, { title: string; description: string }> = {
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
};

let runtimeProductTemplates: ProductTemplateStore = { ...DEFAULT_PRODUCT_TEMPLATES };

const UPDATE_SUMMARY_POINTS = [
  "Убрана кнопка сохранения текстового ТЗ в папку с заказом. (Файл теперь автоматически сохраняется при публикации заявки)",
  "В блокноты добавлена возможность выбора материалов отдельно для подложки.",
  "Прочие Исправления и доработки.",
];

function loadList(key: string, defaults: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaults;
    }
  } catch {}
  return defaults;
}

function saveList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function loadPaperLibrary(): typeof DEFAULT_PAPER_LIBRARY {
  try {
    const raw = localStorage.getItem(LS_KEYS.paperLibrary);
    if (!raw) return DEFAULT_PAPER_LIBRARY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PAPER_LIBRARY;

    const next = { ...DEFAULT_PAPER_LIBRARY };
    (Object.keys(DEFAULT_PAPER_LIBRARY) as PaperLibraryKey[]).forEach((key) => {
      const value = parsed[key];
      next[key] = Array.isArray(value) ? mergeUniqueStrings(value, DEFAULT_PAPER_LIBRARY[key]) : DEFAULT_PAPER_LIBRARY[key];
    });
    return next;
  } catch {
    return DEFAULT_PAPER_LIBRARY;
  }
}

function savePaperLibrary(library: typeof DEFAULT_PAPER_LIBRARY) {
  localStorage.setItem(LS_KEYS.paperLibrary, JSON.stringify(library));
}

function loadPaperProfiles(): typeof DEFAULT_PAPER_PROFILES {
  try {
    const raw = localStorage.getItem(LS_KEYS.paperProfiles);
    if (!raw) return DEFAULT_PAPER_PROFILES;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PAPER_PROFILES;

    const next = { ...DEFAULT_PAPER_PROFILES };
    (Object.keys(DEFAULT_PAPER_PROFILES) as PaperProfileKey[]).forEach((key) => {
      const value = parsed[key];
      next[key] = Array.isArray(value) ? value : DEFAULT_PAPER_PROFILES[key];
    });
    return next;
  } catch {
    return DEFAULT_PAPER_PROFILES;
  }
}

function savePaperProfiles(profiles: typeof DEFAULT_PAPER_PROFILES) {
  localStorage.setItem(LS_KEYS.paperProfiles, JSON.stringify(profiles));
}

type ManagerMarkerState = {
  managerMarkers: Record<string, string>;
  managerMarkerCounter: number;
};

function loadManagerMarkerState(): ManagerMarkerState {
  try {
    const raw = localStorage.getItem(LS_KEYS.managerMarkerState);
    if (!raw) return { managerMarkers: {}, managerMarkerCounter: 0 };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { managerMarkers: {}, managerMarkerCounter: 0 };

    const managerMarkers = parsed.managerMarkers && typeof parsed.managerMarkers === "object"
      ? Object.entries(parsed.managerMarkers).reduce((acc, [key, value]) => {
        const name = normalizeManagerName(key);
        const marker = typeof value === "string" ? value.trim() : "";
        if (name && marker) acc[name] = marker;
        return acc;
      }, {} as Record<string, string>)
      : {};

    const managerMarkerCounter = Number.isFinite(Number(parsed.managerMarkerCounter))
      ? Math.max(0, Number(parsed.managerMarkerCounter))
      : 0;

    return { managerMarkers, managerMarkerCounter };
  } catch {
    return { managerMarkers: {}, managerMarkerCounter: 0 };
  }
}

function saveManagerMarkerState(state: ManagerMarkerState) {
  localStorage.setItem(LS_KEYS.managerMarkerState, JSON.stringify(state));
}

function parseManagerMarkerIndex(marker: string): number {
  const match = /^#(\d+)$/.exec(String(marker || "").trim());
  return match ? Number(match[1]) : 0;
}

function normalizeManagerMarkerState(
  nextManagers: string[],
  previousManagers: string[] = [],
  previousMarkers: Record<string, string> = {},
  previousCounter = 0,
): ManagerMarkerState {
  const normalizedNext = normalizeStringList(nextManagers);
  const normalizedPrev = normalizeStringList(previousManagers);
  const nextSet = new Set(normalizedNext);
  const prevSet = new Set(normalizedPrev);
  const prevMarkerMap = Object.entries(previousMarkers || {}).reduce((acc, [key, value]) => {
    const name = normalizeManagerName(key);
    const marker = typeof value === "string" ? value.trim() : "";
    if (name && marker) acc[name] = marker;
    return acc;
  }, {} as Record<string, string>);

  const result: Record<string, string> = {};
  const usedMarkers = new Set<string>();
  let counter = Math.max(0, previousCounter || 0);

  normalizedNext.forEach((name) => {
    const marker = prevMarkerMap[name];
    if (marker) {
      result[name] = marker;
      usedMarkers.add(marker);
      counter = Math.max(counter, parseManagerMarkerIndex(marker));
    }
  });

  const removed = normalizedPrev.filter((name) => !nextSet.has(name));
  const added = normalizedNext.filter((name) => !prevSet.has(name));

  if (removed.length === added.length && removed.length > 0) {
    removed.forEach((oldName, index) => {
      const newName = added[index];
      if (!newName || result[newName]) return;
      const marker = prevMarkerMap[oldName];
      if (marker && !usedMarkers.has(marker)) {
        result[newName] = marker;
        usedMarkers.add(marker);
        counter = Math.max(counter, parseManagerMarkerIndex(marker));
      }
    });
  }

  normalizedNext.forEach((name) => {
    if (result[name]) return;
    let nextIndex = Math.max(counter + 1, 1);
    let marker = `#${nextIndex}`;
    while (usedMarkers.has(marker)) {
      nextIndex += 1;
      marker = `#${nextIndex}`;
    }
    result[name] = marker;
    usedMarkers.add(marker);
    counter = nextIndex;
  });

  return { managerMarkers: result, managerMarkerCounter: counter };
}

function mergeUniqueStrings(primary: string[], fallback: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  [...primary, ...fallback].forEach((item) => {
    const value = typeof item === "string" ? item.trim() : "";
    if (!value || seen.has(value)) return;
    seen.add(value);
    result.push(value);
  });

  return result;
}

function normalizeStringList(items: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  items.forEach((item) => {
    const value = typeof item === "string" ? item.trim() : "";
    if (!value || seen.has(value)) return;
    seen.add(value);
    result.push(value);
  });

  return result;
}

function normalizeTemplateFlags(flags: unknown, fallbackKind: ProductLayoutKind): ProductTemplateFlags {
  const fallback = DEFAULT_PRODUCT_TEMPLATE_FLAGS[fallbackKind] || DEFAULT_PRODUCT_TEMPLATE_FLAGS.standard;
  const source = flags && typeof flags === "object" ? flags as Record<string, unknown> : {};
  return {
    showSize: typeof source.showSize === "boolean" ? source.showSize : fallback.showSize,
    showPaper: typeof source.showPaper === "boolean" ? source.showPaper : fallback.showPaper,
    showColor: typeof source.showColor === "boolean" ? source.showColor : fallback.showColor,
    showLamination: typeof source.showLamination === "boolean" ? source.showLamination : fallback.showLamination,
    showPostProcessing: typeof source.showPostProcessing === "boolean" ? source.showPostProcessing : fallback.showPostProcessing,
  };
}

function normalizeTemplateFields(fields: unknown): Record<ProductTemplateFieldKey, ProductTemplateFieldConfig> {
  const source = fields && typeof fields === "object" ? fields as Record<string, unknown> : {};
  return PRODUCT_TEMPLATE_FIELD_KEYS.reduce((acc, key) => {
    const raw = source[key];
    const fallback = DEFAULT_PRODUCT_TEMPLATE_FIELDS[key];
    const label = raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).label === "string"
      ? String((raw as Record<string, unknown>).label).trim() || fallback.label
      : fallback.label;
    const required = raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).required === "boolean"
      ? Boolean((raw as Record<string, unknown>).required)
      : fallback.required;
    acc[key] = { label, required };
    return acc;
  }, {} as Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>);
}

function normalizeProductTemplatesPayload(payload: any): ProductTemplateStore {
  const source = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const result: ProductTemplateStore = {};

  Object.entries(DEFAULT_PRODUCT_TEMPLATES).forEach(([name, template]) => {
    const entry = source[name];
    const kind = template.kind;
    result[name] = {
      kind,
      flags: normalizeTemplateFlags(entry && typeof entry === "object" ? (entry as Record<string, unknown>).flags : undefined, kind),
      fields: normalizeTemplateFields(entry && typeof entry === "object" ? (entry as Record<string, unknown>).fields : undefined),
    };
  });

  Object.entries(source).forEach(([name, value]) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName || result[cleanName] || !value || typeof value !== "object") return;
    const raw = value as Record<string, unknown>;
    const kind = (Object.keys(DEFAULT_PRODUCT_TEMPLATE_FLAGS) as ProductLayoutKind[]).includes(String(raw.kind) as ProductLayoutKind)
      ? (String(raw.kind) as ProductLayoutKind)
      : "standard";
    result[cleanName] = {
      kind,
      flags: normalizeTemplateFlags(raw.flags, kind),
      fields: normalizeTemplateFields(raw.fields),
    };
  });

  return result;
}

function loadProductTemplates(): ProductTemplateStore {
  try {
    const raw = localStorage.getItem(LS_KEYS.productTemplates);
    if (!raw) return { ...DEFAULT_PRODUCT_TEMPLATES };
    return normalizeProductTemplatesPayload(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PRODUCT_TEMPLATES };
  }
}

function saveProductTemplates(templates: ProductTemplateStore) {
  localStorage.setItem(LS_KEYS.productTemplates, JSON.stringify(templates));
}

function createProductTemplateConfig(kind: ProductLayoutKind, base?: Partial<ProductTemplateConfig>): ProductTemplateConfig {
  const resolvedKind = (Object.keys(DEFAULT_PRODUCT_TEMPLATE_FLAGS) as ProductLayoutKind[]).includes(String(base?.kind || kind) as ProductLayoutKind)
    ? (String(base?.kind || kind) as ProductLayoutKind)
    : kind;
  return {
    kind: resolvedKind,
    flags: {
      ...DEFAULT_PRODUCT_TEMPLATE_FLAGS[resolvedKind],
      ...(base?.flags || {}),
    },
    fields: normalizeTemplateFields(base?.fields),
  };
}

function syncProductTemplatesToTypes(templates: ProductTemplateStore, productTypes: string[]): ProductTemplateStore {
  const next: ProductTemplateStore = {};
  const types = new Set(productTypes.map((name) => normalizeTemplateName(name)).filter(Boolean));

  productTypes.forEach((name) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    next[cleanName] = createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || templates[cleanName]?.kind || "standard", templates[cleanName]);
  });

  Object.keys(templates).forEach((name) => {
    if (!types.has(name)) return;
    if (!next[name]) next[name] = createProductTemplateConfig(templates[name].kind, templates[name]);
  });

  return next;
}

function createDefaultManagerMarkers(managers: string[]): ManagerMarkerState {
  return normalizeManagerMarkerState(managers, [], {}, 0);
}

function normalizeDictsPayload(payload: any): Dicts {
  const normalizeList = (value: unknown) => (Array.isArray(value) ? normalizeStringList(value) : []);
  const normalizeObject = (value: unknown, keys: string[]) => {
    const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return keys.reduce((acc, key) => {
      acc[key] = normalizeList(source[key]);
      return acc;
    }, {} as Record<string, string[]>);
  };

  const productTypes = ensureProductTypes(mergeUniqueStrings(normalizeList(payload?.productTypes), Object.keys(normalizeProductTemplatesPayload(payload?.productTemplates))));
  const productTemplates = syncProductTemplatesToTypes(normalizeProductTemplatesPayload(payload?.productTemplates), productTypes);

  return {
    productTypes,
    productTemplates,
    paperSizes: normalizeList(payload?.paperSizes),
    pocketCalendarSizes: normalizeList(payload?.pocketCalendarSizes),
    businessCardSizes: normalizeList(payload?.businessCardSizes),
    envelopeSizes: normalizeList(payload?.envelopeSizes),
    densities: normalizeList(payload?.densities),
    colors: normalizeList(payload?.colors),
    postProcessing: mergeUniqueStrings(normalizeList(payload?.postProcessing), DEFAULT_POST_PROCESSING),
    bindingTypes: normalizeList(payload?.bindingTypes),
    laminationKinds: normalizeList(payload?.laminationKinds),
    laminationThickness: normalizeList(payload?.laminationThickness),
    managers: normalizeList(payload?.managers),
    adManagers: normalizeList(payload?.adManagers).length ? normalizeList(payload?.adManagers) : [...DEFAULT_AD_MANAGERS],
    ...normalizeManagerMarkerState(
      normalizeList(payload?.managers),
      normalizeList(payload?.managers),
      payload?.managerMarkers && typeof payload.managerMarkers === "object" ? payload.managerMarkers as Record<string, string> : {},
      Number(payload?.managerMarkerCounter) || 0,
    ),
    paperProfiles: normalizeObject(payload?.paperProfiles, Object.keys(DEFAULT_PAPER_PROFILES)),
    paperLibrary: normalizeObject(payload?.paperLibrary, Object.keys(DEFAULT_PAPER_LIBRARY)),
  };
}

// ─── Интерфейсы ─────────────────────────────────────────────────────────────

interface Dicts {
  productTypes: string[]; paperSizes: string[]; envelopeSizes: string[];
  pocketCalendarSizes: string[];
  businessCardSizes: string[];
  densities: string[]; colors: string[]; postProcessing: string[];
  bindingTypes: string[]; laminationKinds: string[]; laminationThickness: string[];
  managers: string[];
  adManagers: string[];
  managerMarkers: Record<string, string>;
  managerMarkerCounter: number;
  productTemplates: ProductTemplateStore;
  paperProfiles: typeof DEFAULT_PAPER_PROFILES;
  paperLibrary: typeof DEFAULT_PAPER_LIBRARY;
}

function createInitialDicts(): Dicts {
  const managerState = loadManagerMarkerState();
  const managers = loadList(LS_KEYS.managers, DEFAULT_MANAGERS);
  const adManagers = loadList(LS_KEYS.adManagers, DEFAULT_AD_MANAGERS);
  const normalizedManagers = normalizeManagerMarkerState(managers, managers, managerState.managerMarkers, managerState.managerMarkerCounter);

  const productTypes = ensureProductTypes(mergeUniqueStrings(loadList(LS_KEYS.productTypes, DEFAULT_PRODUCT_TYPES), Object.keys(loadProductTemplates())));
  const productTemplates = syncProductTemplatesToTypes(loadProductTemplates(), productTypes);
  runtimeProductTemplates = productTemplates;

  return {
    productTypes,
    productTemplates,
    paperSizes: loadList(LS_KEYS.paperSizes, DEFAULT_PAPER_SIZES),
    pocketCalendarSizes: loadList(LS_KEYS.pocketCalendarSizes, DEFAULT_POCKET_CALENDAR_SIZES),
    businessCardSizes: loadList(LS_KEYS.businessCardSizes, DEFAULT_BUSINESS_CARD_SIZES),
    envelopeSizes: loadList(LS_KEYS.envelopeSizes, DEFAULT_ENVELOPE_SIZES),
    densities: loadList(LS_KEYS.densities, DEFAULT_DENSITIES),
    colors: loadList(LS_KEYS.colors, DEFAULT_COLORS),
    postProcessing: mergeUniqueStrings(loadList(LS_KEYS.postProcessing, DEFAULT_POST_PROCESSING), DEFAULT_POST_PROCESSING),
    bindingTypes: loadList(LS_KEYS.bindingTypes, DEFAULT_BINDING_TYPES),
    laminationKinds: loadList(LS_KEYS.laminationKinds, DEFAULT_LAMINATION_KINDS),
    laminationThickness: loadList(LS_KEYS.laminationThickness, DEFAULT_LAMINATION_THICKNESS),
    managers: normalizeStringList(managers),
    adManagers: normalizeStringList(adManagers),
    managerMarkers: normalizedManagers.managerMarkers,
    managerMarkerCounter: normalizedManagers.managerMarkerCounter,
    paperProfiles: loadPaperProfiles(),
    paperLibrary: loadPaperLibrary(),
  };
}

function createResetDicts(): Dicts {
  const managerState = createDefaultManagerMarkers(DEFAULT_MANAGERS);
  const productTypes = ensureProductTypes(mergeUniqueStrings([...DEFAULT_PRODUCT_TYPES], Object.keys(DEFAULT_PRODUCT_TEMPLATES)));
  const productTemplates = syncProductTemplatesToTypes({ ...DEFAULT_PRODUCT_TEMPLATES }, productTypes);
  runtimeProductTemplates = productTemplates;

  return {
    productTypes,
    productTemplates,
    paperSizes: [...DEFAULT_PAPER_SIZES],
    pocketCalendarSizes: [...DEFAULT_POCKET_CALENDAR_SIZES],
    businessCardSizes: [...DEFAULT_BUSINESS_CARD_SIZES],
    envelopeSizes: [...DEFAULT_ENVELOPE_SIZES],
    densities: [...DEFAULT_DENSITIES],
    colors: [...DEFAULT_COLORS],
    postProcessing: [...DEFAULT_POST_PROCESSING],
    bindingTypes: [...DEFAULT_BINDING_TYPES],
    laminationKinds: [...DEFAULT_LAMINATION_KINDS],
    laminationThickness: [...DEFAULT_LAMINATION_THICKNESS],
    managers: [...DEFAULT_MANAGERS],
    adManagers: [...DEFAULT_AD_MANAGERS],
    managerMarkers: managerState.managerMarkers,
    managerMarkerCounter: managerState.managerMarkerCounter,
    paperProfiles: { ...DEFAULT_PAPER_PROFILES },
    paperLibrary: { ...DEFAULT_PAPER_LIBRARY },
  };
}

type PaperFinish = "Матовая" | "Глянцевая";
interface LaminationBlock { enabled: boolean; side: string; thickness: string; kind: string; }
interface KashurovkaBlock {
  enabled: boolean; baseType: string; linerType: string; linerSize: string; connectionType: string; turnoverType: string;
  forsacEnabled: boolean; forsacPaper: string; forsacSize: string; forsacPrintMode: string;
  linerFinish: PaperFinish; linerColor: string; linerLamination: LaminationBlock; forsacFinish: PaperFinish; forsacColor: string; forsacLamination: LaminationBlock;
  slimPaperTop: string; slimPaperBottom: string; slimPaperTopLamination: LaminationBlock; slimPaperBottomLamination: LaminationBlock;
  slimPaperTopFinish: PaperFinish; slimPaperTopColor: string; slimPaperBottomFinish: PaperFinish; slimPaperBottomColor: string;
  linerPaperType: PaperTypeOption | ""; linerPaperCustomName: string; linerPaperDensity: string;
  forsacPaperType: PaperTypeOption | ""; forsacPaperCustomName: string; forsacPaperDensity: string;
  slimPaperTopPaperType: PaperTypeOption | ""; slimPaperTopPaperCustomName: string; slimPaperTopPaperDensity: string;
  slimPaperBottomPaperType: PaperTypeOption | ""; slimPaperBottomPaperCustomName: string; slimPaperBottomPaperDensity: string;
}

const defaultLaminationBlock = (): LaminationBlock => ({ enabled: false, side: "Односторонняя", thickness: "80 мк", kind: "Глянцевая" });
const defaultKashurovkaBlock = (): KashurovkaBlock => ({
  enabled: false, baseType: "", linerType: "", linerSize: "", connectionType: "Каширование", turnoverType: "Без заворота",
  forsacEnabled: false, forsacPaper: "", forsacSize: "", forsacPrintMode: "Белые",
  linerFinish: "Матовая", linerColor: "", linerLamination: defaultLaminationBlock(), forsacFinish: "Матовая", forsacColor: "", forsacLamination: defaultLaminationBlock(),
  slimPaperTop: "", slimPaperBottom: "", slimPaperTopLamination: defaultLaminationBlock(), slimPaperBottomLamination: defaultLaminationBlock(),
  slimPaperTopFinish: "Матовая", slimPaperTopColor: "", slimPaperBottomFinish: "Матовая", slimPaperBottomColor: "",
  linerPaperType: "", linerPaperCustomName: "", linerPaperDensity: "",
  forsacPaperType: "", forsacPaperCustomName: "", forsacPaperDensity: "",
  slimPaperTopPaperType: "", slimPaperTopPaperCustomName: "", slimPaperTopPaperDensity: "",
  slimPaperBottomPaperType: "", slimPaperBottomPaperCustomName: "", slimPaperBottomPaperDensity: "",
});

interface FormData {
  orderNumber: string; clientName: string; managerName: string; deadline: string; deadlineTime: string; quantity: string;
  cellBooking: string;
  productType: string; productTypeCustom: string; paperSize: string; paperSizeCustom: string; envelopeSize: string; envelopeSizeCustom: string;
  businessCardSize: string; businessCardSizeCustom: string;
  paperType: PaperTypeOption | ""; paperCustomName: string; density: string; densityFinish: PaperFinish; colorProof: string; colorMode: string; pageCount: string; coverUseKash: boolean; coverPaperType: PaperTypeOption | ""; coverPaperCustomName: string; coverDensity: string; coverFinish: PaperFinish; coverColor: string; coverLamination: LaminationBlock;
  backingEnabled: boolean; backingPaperType: PaperTypeOption | ""; backingPaperCustomName: string; backingDensity: string; backingFinish: PaperFinish; backingColor: string; backingLamination: LaminationBlock;
  catalogFormat: string; catalogFormatCustom: string;
  brochureFormat: string; brochureFormatCustom: string;
  blockPaperType: PaperTypeOption | ""; blockPaperCustomName: string; blockDensity: string; blockFinish: PaperFinish; blockColor: string; blockLamination: LaminationBlock; blockPages: string;
  adBlocks: string; calendarKind: string; wallMountType: string; wallMountDesc: string; gridType: string; hasPlanka: boolean; plankaDesc: string; hasRigel: boolean;
  calendarBaseUseKash: boolean; calendarBaseMaterial: string; calendarBaseFinish: PaperFinish; calendarBaseLamination: LaminationBlock; calendarBaseBigovkaLines: string; calendarGridMaterial: string; calendarGridFinish: PaperFinish; calendarGridColorMode: string; calendarOffsetColor: string;
  calendarHeaderPaperType: PaperTypeOption | ""; calendarHeaderPaperCustomName: string; calendarHeaderPaperDensity: string; calendarHeaderPaperFinish: PaperFinish;
  postProcessing: string[]; foilColor: string; uvType: string; bigkovka: boolean; bigkovkaLines: string; drillingDiameter: string;
  falcovka: boolean;
  lamination: LaminationBlock; kashurovka: KashurovkaBlock;
  binding: boolean; bindingType: string; stapleCount: string; staplePosition: string; springColor: string; springColorCustom: string; springDiameter: string; springPosition: string; springHidden: boolean;
  subcontractWorks: SubcontractWork[];
  bagPaperType: BagPaperTypeOption | ""; bagHeight: string; bagWidth: string; bagDepth: string; bagPartsCount: string; bagExternalSheets: boolean; bagEyeletColor: string; bagEyeletColorCustom: string; bagHandleColor: string; bagHandleColorCustom: string; bagHandlePipsik: string;
  stickerMaterial: string; stickerFinish: PaperFinish; stickerPlotterCut: boolean; stickerPacks: boolean;
  ownReverse: boolean;
  wobblerPlotterCut: boolean; wobblerFootGlue: boolean;
  otherHoleEnabled: boolean; otherHoleType: string; otherHoleDiameter: string;
  badgeHoleType: string;
  badgeHoleDiameter: string;
  badgeHoleCount: string;
  bagHandleType: string;
  fileLink: string; notes: string;
}

interface AdFormData {
  orderNumber: string;
  clientName: string;
  managerName: string;
  deadline: string;
  deadlineTime: string;
  fileCount: string;
  fileLink: string;
  notes: string;
}

interface ReservedAssignment {
  rowNumber: number;
  orderNumber: string;
  managerMarker: string;
  sheetName: string;
}

interface SubcontractWork {
  id: string;
  note: string;
  date: string;
  time: string;
}

interface ClientStore {
  byManager: Record<string, string[]>;
}

interface PresetEntry {
  id: string;
  name: string;
  data: Partial<FormData>;
  createdAt: string;
  updatedAt: string;
}

interface PresetStore {
  byManager: Record<string, PresetEntry[]>;
}

function createSubcontractWork(): SubcontractWork {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    note: "",
    date: "",
    time: "",
  };
}

function createEmptyClientStore(): ClientStore {
  return { byManager: {} };
}

function createEmptyPresetStore(): PresetStore {
  return { byManager: {} };
}

function createDefaultForm(): FormData {
  return {
    orderNumber: "", clientName: "", managerName: "", deadline: "", deadlineTime: "", quantity: "",
    cellBooking: "",
    productType: "", productTypeCustom: "", paperSize: "", paperSizeCustom: "", envelopeSize: "", envelopeSizeCustom: "",
    businessCardSize: "", businessCardSizeCustom: "",
    paperType: "", paperCustomName: "", density: "", densityFinish: "Матовая", colorProof: "Не надо", colorMode: "", pageCount: "", coverUseKash: false, coverPaperType: "", coverPaperCustomName: "", coverDensity: "", coverFinish: "Матовая", coverColor: "", coverLamination: defaultLaminationBlock(),
    backingEnabled: false, backingPaperType: "", backingPaperCustomName: "", backingDensity: "", backingFinish: "Матовая", backingColor: "", backingLamination: defaultLaminationBlock(),
    catalogFormat: "", catalogFormatCustom: "",
    brochureFormat: "", brochureFormatCustom: "",
    blockPaperType: "", blockPaperCustomName: "", blockDensity: "", blockFinish: "Матовая", blockColor: "", blockLamination: defaultLaminationBlock(), blockPages: "",
    adBlocks: "3", calendarKind: "Настенный", wallMountType: "Ригель", wallMountDesc: "", gridType: "Цифра", hasPlanka: false, plankaDesc: "", hasRigel: false,
    calendarBaseUseKash: false, calendarBaseMaterial: "", calendarBaseFinish: "Матовая", calendarBaseLamination: defaultLaminationBlock(), calendarBaseBigovkaLines: "", calendarGridMaterial: "", calendarGridFinish: "Матовая", calendarGridColorMode: "", calendarOffsetColor: "Серый",
    calendarHeaderPaperType: "", calendarHeaderPaperCustomName: "", calendarHeaderPaperDensity: "", calendarHeaderPaperFinish: "Матовая",
    postProcessing: [], foilColor: "", uvType: "Обычный", bigkovka: false, bigkovkaLines: "1", drillingDiameter: "", falcovka: false,
    lamination: defaultLaminationBlock(), kashurovka: defaultKashurovkaBlock(),
    binding: false, bindingType: "Скоба", stapleCount: "Одна", staplePosition: "Лево", springColor: "Белая", springColorCustom: "", springDiameter: "8 мм", springPosition: "По широкой стороне", springHidden: false,
    subcontractWorks: [],
    bagPaperType: "", bagHeight: "", bagWidth: "", bagDepth: "", bagPartsCount: "Из 2-х частей", bagExternalSheets: false, bagEyeletColor: "Белый", bagEyeletColorCustom: "", bagHandleType: "Верёвка", bagHandleColor: "Белый", bagHandleColorCustom: "", bagHandlePipsik: "Без пипсика",
    stickerMaterial: "", stickerFinish: "Матовая", stickerPlotterCut: false, stickerPacks: false,
    ownReverse: false,
    wobblerPlotterCut: false, wobblerFootGlue: false,
    otherHoleEnabled: false, otherHoleType: "", otherHoleDiameter: "",
    badgeHoleType: "",
    badgeHoleDiameter: "",
    badgeHoleCount: "1",
    fileLink: "", notes: "",
  };
}

function createDefaultAdForm(): AdFormData {
  return {
    orderNumber: "",
    clientName: "Оскар-Арт",
    managerName: DEFAULT_AD_MANAGERS[0] || "Оля",
    deadline: "",
    deadlineTime: "",
    fileCount: "",
    fileLink: "",
    notes: "",
  };
}

const defaultForm: FormData = createDefaultForm();
const defaultAdForm: AdFormData = createDefaultAdForm();

const PRESET_EXCLUDED_FIELDS = new Set<keyof FormData>([
  "orderNumber",
  "clientName",
  "managerName",
  "deadline",
  "deadlineTime",
  "cellBooking",
  "fileLink",
  "subcontractWorks",
]);

function isPlainObject(value: unknown): value is Record<string, any> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function buildPresetPayload(form: FormData): Partial<FormData> {
  const defaults = createDefaultForm();

  function cleanValue(value: any, defaultValue: any, path: string[]): any {
    const topKey = path[0] as keyof FormData | undefined;
    if (path.length === 1 && topKey && PRESET_EXCLUDED_FIELDS.has(topKey)) return undefined;

    if (value === undefined || value === null) return undefined;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      if (typeof defaultValue === "string" && trimmed === defaultValue) return undefined;
      return trimmed;
    }

    if (typeof value === "boolean") {
      return value === defaultValue ? undefined : value;
    }

    if (typeof value === "number") {
      return value === defaultValue ? undefined : value;
    }

    if (Array.isArray(value)) {
      if (topKey === "subcontractWorks") return undefined;
      const cleanedItems = value
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (isPlainObject(item)) {
            const cleanedItem = cleanValue(item, {}, path.concat("[]"));
            return cleanedItem;
          }
          return item;
        })
        .filter((item) => {
          if (typeof item === "string") return !!item;
          if (Array.isArray(item)) return item.length > 0;
          if (isPlainObject(item)) return Object.keys(item).length > 0;
          return item !== undefined && item !== null && item !== false;
        });

      if (!cleanedItems.length) return undefined;
      if (Array.isArray(defaultValue) && JSON.stringify(cleanedItems) === JSON.stringify(defaultValue)) return undefined;
      return cleanedItems;
    }

    if (isPlainObject(value)) {
      const result: Record<string, any> = {};
      const keys = new Set([...Object.keys(value), ...Object.keys(isPlainObject(defaultValue) ? defaultValue : {})]);
      keys.forEach((key) => {
        const child = cleanValue(value[key], isPlainObject(defaultValue) ? defaultValue[key] : undefined, path.concat(key));
        if (child !== undefined) result[key] = child;
      });
      return Object.keys(result).length > 0 ? result : undefined;
    }

    return value === defaultValue ? undefined : value;
  }

  return cleanValue(form, defaults, []) || {};
}

function mergePresetIntoForm(base: FormData, presetData: Partial<FormData>): FormData {
  const mergeValue = (current: any, patch: any): any => {
    if (patch === undefined) return current;
    if (Array.isArray(patch)) return patch.map((item) => (isPlainObject(item) ? mergeValue({}, item) : item));
    if (isPlainObject(patch)) {
      const currentObject = isPlainObject(current) ? current : {};
      const result: Record<string, any> = { ...currentObject };
      Object.entries(patch).forEach(([key, value]) => {
        result[key] = mergeValue(currentObject[key], value);
      });
      return result;
    }
    return patch;
  };

  return mergeValue(base, presetData) as FormData;
}

// ─── Вспомогательные функции ────────────────────────────────────────────────

const MULTIBLOCK_TYPES = ["Каталоги", "Брошюры"];
const PRODUCT_TYPE_ALIASES: Record<string, string> = {
  "Открытки": "Открытка",
  "Сертификат": "Сертификаты",
};
function normalizeTemplateName(name: string): string {
  const clean = name.trim();
  return PRODUCT_TYPE_ALIASES[clean] || clean;
}

function getProductTemplate(name: string): ProductTemplateConfig {
  const normalizedName = normalizeTemplateName(name);
  const store = runtimeProductTemplates;
  const fallbackKind = DEFAULT_PRODUCT_TEMPLATE_KINDS[normalizedName] || "standard";
  const existing = store[normalizedName];
  return {
    kind: existing?.kind || fallbackKind,
    flags: existing?.flags || { ...DEFAULT_PRODUCT_TEMPLATE_FLAGS[fallbackKind] },
    fields: existing?.fields || createProductTemplateConfig(fallbackKind).fields,
  };
}

function getProductLayoutKind(name: string): ProductLayoutKind {
  return getProductTemplate(name).kind;
}

function isLayout(name: string, kind: ProductLayoutKind): boolean {
  return getProductLayoutKind(name) === kind;
}

function getProductTemplateFieldConfig(productType: string, fieldKey: ProductTemplateFieldKey): ProductTemplateFieldConfig {
  const template = getProductTemplate(productType);
  return template.fields[fieldKey] || DEFAULT_PRODUCT_TEMPLATE_FIELDS[fieldKey];
}

function getProductTemplateFieldLabel(productType: string, fieldKey: ProductTemplateFieldKey): string {
  return getProductTemplateFieldConfig(productType, fieldKey).label;
}

function isProductTemplateFieldRequired(productType: string, fieldKey: ProductTemplateFieldKey): boolean {
  return getProductTemplateFieldConfig(productType, fieldKey).required;
}

const isMultiBlock = (pt: string) => ["catalog", "brochure"].includes(getProductLayoutKind(pt));
const isCatalog = (pt: string) => getProductLayoutKind(pt) === "catalog";
const isBrochure = (pt: string) => getProductLayoutKind(pt) === "brochure";
const isCalendar = (pt: string) => isLayout(pt, "calendar");
const isNotebook = (pt: string) => isLayout(pt, "notebook");
const isEnvelope = (pt: string) => isLayout(pt, "envelope");
const isBusinessCard = (pt: string) => isLayout(pt, "businessCard");
const isBag = (pt: string) => isLayout(pt, "bag") || pt === "Пакеты";
const isSticker = (pt: string) => isLayout(pt, "sticker");
const PAPER_FINISHES: PaperFinish[] = ["Матовая", "Глянцевая"];

function isPocketCalendar(form: FormData): boolean {
  return isCalendar(form.productType) && form.calendarKind === "Карманный";
}

function ensureProductTypes(list: string[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  list.forEach((item) => {
    const clean = normalizeTemplateName(item);
    if (!clean || clean === "Пакеты") return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    normalized.push(clean);
  });

  const additions = ["Бумажные Пакеты", "Воблеры", "Бейджи"];
  additions.forEach((item) => {
    const clean = normalizeTemplateName(item);
    const key = clean.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(clean);
    }
  });
  return normalized;
}

function resolveProductName(form: FormData): string {
  return form.productType === "Другое..." ? form.productTypeCustom.trim() : form.productType;
}

function formatProductNameForTZ(form: FormData, lower = false): string {
  const product = resolveProductName(form);
  if (!product) return "";
  const text = isSticker(form.productType) && form.stickerPacks
    ? product.replace(/наклейки/gi, "Стикерпаки")
    : product;
  return lower ? text.toLowerCase() : text;
}

function formatNotebookColorText(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed === "Без печати") return "без печати";
  return normalizeColorMode(trimmed);
}

function normalizeMaterial(material: string): string {
  return material.replace(/\s*\(.*\)/, "").trim();
}

function normalizeColorMode(value: string | null | undefined): string {
  return String(value || "").replace(/\s*\(.*\)/, "").trim();
}

function stripParentheticalNote(value: string): string {
  return value.replace(/\s*\([^)]*\)/g, "").trim();
}

function normalizeTimeInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  const hoursRaw = digits.slice(0, 2);
  const minutesRaw = digits.slice(2, 4);
  const hours = Math.min(Number(hoursRaw || "0"), 23);
  const minutes = Math.min(Number(minutesRaw || "0"), 59);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getTodayLocalIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDateForFilename(isoDate: string): string {
  if (!isoDate) return getTodayLocalIso().split("-").reverse().join(".");
  return isoDate.split("-").reverse().join(".");
}

function getCurrentDateTimeForFilename(): string {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
  return `${date} ${time}`;
}

function getLaminationSideNotation(side: string): string {
  return side === "Двухсторонняя" ? "1+1" : "1+0";
}

function formatLamination(value: LaminationBlock): string {
  if (!value.enabled) return "Без ламинации";
  return `${getLaminationSideNotation(value.side)}, ${value.kind}, ${value.thickness}`;
}

function formatLaminationCompact(value: LaminationBlock): string {
  if (!value.enabled) return "без лам.";
  const kindLower = value.kind.toLowerCase();
  if (kindLower.includes("карм")) {
    return `лам. карм.${value.thickness ? ` ${value.thickness}` : ""}`;
  }
  const kind = value.kind === "Глянцевая" ? "глян." : value.kind === "Матовая" ? "мат." : "софт";
  return `лам. ${getLaminationSideNotation(value.side)} ${kind} ${value.thickness}`;
}

function formatFileCountText(value: string): string {
  const normalized = String(value || "").replace(/[^\d]/g, "").trim();
  if (!normalized) return "";
  const count = Number(normalized);
  if (!Number.isFinite(count) || count <= 0) return normalized;
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = "файлов";
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "файл";
    else if (mod10 >= 2 && mod10 <= 4) word = "файла";
  }
  return `${count} ${word}`;
}

function generateAdShortTZ(form: AdFormData): string {
  return [form.fileLink.trim(), formatFileCountText(form.fileCount), form.notes.trim()].filter(Boolean).join("\n");
}

function formatPaperSelection(type: PaperTypeOption | "", value: string, customName = "", envelopeLabel = false): string {
  const trimmedValue = normalizeMaterial(value);
  const trimmedCustom = customName.trim();
  if (!type) return trimmedCustom || trimmedValue;
  if (type === "Без бумаги") return envelopeLabel ? "Готовые конверты" : type;
  if (type === "Давальческая") return type;
  if (type === "Дизайнерская") {
    return trimmedCustom ? `Дизайнерская бумага ${trimmedCustom}` : "Дизайнерская бумага";
  }
  return trimmedValue ? `${type} ${trimmedValue}` : type;
}

function formatPaperSelectionWithFinish(type: PaperTypeOption | "", value: string, customName: string, finish: PaperFinish, envelopeLabel = false): string {
  const paper = formatPaperSelection(type, value, customName, envelopeLabel);
  if (!paper) return "";
  if (type === "Без бумаги" || type === "Давальческая") return paper;
  return `${paper}, ${finish.toLowerCase()}`;
}

function formatPaperSelectionForTZ(type: PaperTypeOption | "", value: string, customName = "", envelopeLabel = false): string {
  if (type === "Без бумаги") return "";
  return formatPaperSelection(type, value, customName, envelopeLabel);
}

function formatPaperSelectionWithFinishForTZ(type: PaperTypeOption | "", value: string, customName: string, finish: PaperFinish, envelopeLabel = false): string {
  if (type === "Без бумаги") return "";
  return formatPaperSelectionWithFinish(type, value, customName, finish, envelopeLabel);
}

function isPaperlessPaperType(type: PaperTypeOption | ""): boolean {
  return type === "Без бумаги" || type === "Давальческая";
}

function isCoated115Paper(type: PaperTypeOption | "", density: string): boolean {
  return type === "Мелованная" && normalizeMaterial(density) === "115 г/м²";
}

function paperFinishOptionsForSelection(type: PaperTypeOption | "", density: string): PaperFinish[] {
  return isCoated115Paper(type, density) ? ["Матовая"] : PAPER_FINISHES;
}

function requiresPaperDensity(type: PaperTypeOption | ""): boolean {
  return !!type && type !== "Дизайнерская" && type !== "Без бумаги" && type !== "Давальческая";
}

type PaperSelectionValue = {
  type: PaperTypeOption | "";
  value: string;
  customName: string;
  finish: PaperFinish;
};

function paperSelectionKey(selection: PaperSelectionValue): string {
  return [
    selection.type,
    normalizeMaterial(selection.value).toLowerCase(),
    selection.customName.trim().toLowerCase(),
    selection.finish,
  ].join("|");
}

function isSamePaperSelection(left: PaperSelectionValue, right: PaperSelectionValue): boolean {
  return !!formatPaperSelectionWithFinish(left.type, left.value, left.customName, left.finish)
    && paperSelectionKey(left) === paperSelectionKey(right);
}

function getCurrentLocalTimeIso(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function isDateTimeInPast(date: string, time: string): boolean {
  if (!date || date !== getTodayLocalIso()) return false;
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  return time < getCurrentLocalTimeIso();
}

function isDeadlineTimeInPast(deadline: string, time: string): boolean {
  return isDateTimeInPast(deadline, time);
}

function formatDateTimeText(date: string, time: string): string {
  const dateText = date ? date.split("-").reverse().join(".") : "—";
  return time ? `${dateText} ${time}` : dateText;
}

function formatQuantityText(value: string): string {
  const normalized = String(value || "").replace(/\s+/g, "").trim();
  if (!normalized) return "—";
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return normalized;
  return parsed.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
}

function getActiveSubcontractWorks(form: FormData): SubcontractWork[] {
  return form.subcontractWorks.filter((work) => work.note.trim() || work.date || work.time);
}

function normalizeClientName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeManagerName(value: string): string {
  return normalizeClientName(value);
}

function getClientSuggestions(store: ClientStore, managerName: string): string[] {
  const managerKey = normalizeManagerName(managerName);
  const allValues = managerKey
    ? store.byManager[managerKey] || []
    : Object.values(store.byManager).flat();

  const seen = new Set<string>();
  const result: string[] = [];
  allValues.forEach((item) => {
    const value = normalizeClientName(item);
    if (!value) return;
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(value);
  });
  return result.sort((left, right) => left.localeCompare(right, "ru", { sensitivity: "base", numeric: true }));
}

function getPaperLibraryItems(library: typeof DEFAULT_PAPER_LIBRARY, type: PaperTypeOption | ""): string[] {
  if (!type) return [];
  return library[PAPER_TYPE_TO_LIBRARY_KEY[type]] || [];
}

function parseWeight(material: string): number {
  const match = material.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

const UNCOATED_THICKNESS_MM: Record<number, number> = {
  80: 0.1,
  90: 0.11,
  100: 0.12,
  115: 0.135,
  120: 0.14,
  130: 0.155,
  150: 0.18,
  170: 0.205,
  200: 0.24,
};

const COATED_MATTE_THICKNESS_MM: Record<number, number> = {
  105: 0.095,
  115: 0.103,
  128: 0.125,
  130: 0.127,
  150: 0.145,
  157: 0.152,
  170: 0.162,
  200: 0.19,
  250: 0.255,
  300: 0.305,
  350: 0.36,
};

const COATED_GLOSS_THICKNESS_MM: Record<number, number> = {
  105: 0.092,
  115: 0.1,
  128: 0.12,
  130: 0.123,
  150: 0.14,
  157: 0.148,
  170: 0.158,
  200: 0.185,
  250: 0.25,
  300: 0.295,
  350: 0.35,
};

function interpolateThickness(gsm: number, table: Record<number, number>): number | null {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (keys.length === 0) return null;
  if (table[gsm]) return table[gsm];
  if (gsm < keys[0]) return table[keys[0]];
  if (gsm > keys[keys.length - 1]) return table[keys[keys.length - 1]];
  for (let i = 0; i < keys.length - 1; i += 1) {
    const left = keys[i];
    const right = keys[i + 1];
    if (gsm > left && gsm < right) {
      const ratio = (gsm - left) / (right - left);
      return table[left] + (table[right] - table[left]) * ratio;
    }
  }
  return null;
}

function estimateThicknessMm(material: string, finish: PaperFinish = "Матовая"): number {
  const gsm = parseWeight(material);
  if (!gsm) return 0;

  const normalized = material.toLowerCase();
  const isKraft = normalized.includes("крафт");
  const isOffice = normalized.includes("офис") || normalized.includes("офсет");
  const isCoatedByName = normalized.includes("мелов");

  if (isKraft) return Math.max(gsm / 670, 0.08);

  if (isOffice || (!isCoatedByName && finish === "Матовая")) {
    return interpolateThickness(gsm, UNCOATED_THICKNESS_MM) ?? Math.max(gsm / 750, 0.06);
  }

  const coatedTable = finish === "Глянцевая" ? COATED_GLOSS_THICKNESS_MM : COATED_MATTE_THICKNESS_MM;
  return interpolateThickness(gsm, coatedTable) ?? Math.max(gsm / (finish === "Глянцевая" ? 1080 : 980), 0.06);
}

function getSpringColor(form: FormData): string {
  return form.springColor === "Другой цвет..." ? form.springColorCustom.trim() : form.springColor;
}

function getBagColor(value: string, custom: string): string {
  return value === "Другой цвет..." ? custom.trim() : value;
}

function getBagHandleText(form: FormData): string {
  const color = getBagColor(form.bagHandleColor, form.bagHandleColorCustom);
  if (form.bagHandleType === "Лента") {
    return color ? `лента, ${color}` : "лента";
  }
  const pipsik = form.bagHandlePipsik.trim().toLowerCase();
  if (!color) return pipsik;
  return pipsik ? `${color}, ${pipsik}` : color;
}

function formatBagPaperSelection(form: FormData): string {
  const density = normalizeMaterial(form.density);
  if (!form.bagPaperType) return density;
  return density ? `${form.bagPaperType} ${density}` : form.bagPaperType;
}

function buildSpringSuggestion(form: FormData): { thickness: number; diameter: string } | null {
  if (form.bindingType !== "Пружина") return null;

  const sheetCount = isNotebook(form.productType)
    ? Number(form.blockPages)
    : isMultiBlock(form.productType)
      ? Number(form.pageCount) / 2
      : 0;

  if (!sheetCount) return null;

  const bodyThickness = estimateThicknessMm(
    isNotebook(form.productType) ? form.blockDensity : isMultiBlock(form.productType) ? form.blockDensity : form.density,
    isNotebook(form.productType) ? form.blockFinish : isMultiBlock(form.productType) ? form.blockFinish : form.densityFinish,
  );
  if (!bodyThickness) return null;

  const coverMaterial = form.coverUseKash ? form.kashurovka.linerType : form.coverDensity;
  const coverFinish = form.coverUseKash ? form.kashurovka.linerFinish : form.coverFinish;
  const coverThickness = (isNotebook(form.productType) || isMultiBlock(form.productType))
    ? estimateThicknessMm(coverMaterial, coverFinish)
    : 0;

  const thickness = sheetCount * bodyThickness + (coverThickness ? 2 * coverThickness : 0);
  const target = Math.ceil(thickness + 2);
  const nearest = SPRING_DIAMETERS.find((item) => parseWeight(item) >= target) ?? SPRING_DIAMETERS[SPRING_DIAMETERS.length - 1];
  return { thickness, diameter: nearest };
}

function formatMaterialWithFinish(material: string, finish: PaperFinish): string {
  return material ? `${material}, ${finish.toLowerCase()}` : material;
}

function formatColorWithReverse(value: string, ownReverse: boolean): string {
  const color = normalizeColorMode(value) || "—";
  return ownReverse ? `${color} (свой оборот)` : color;
}

function formatShortColor(value: string, ownReverse = false): string {
  const normalized = normalizeColorMode(value);
  const base = (normalized.split(/\s+/)[0] || "").trim();
  if (!base) return "";
  return ownReverse ? `${base} (свой оборот)` : base;
}

function formatHoleSelectionText(type: string, diameter = "", count = ""): string {
  const holeType = type.trim();
  if (!holeType) return "";

  const diameterText = diameter.trim();
  const countText = count.trim();

  if (holeType === "Круглое") {
    const parts = ["круглое отверстие"];
    if (countText) parts.push(`${countText}шт`);
    if (diameterText) parts.push(`Ø ${diameterText}`);
    return parts.join(" ").trim();
  }

  return `${holeType.toLowerCase()} отверстие`;
}

function formatPostProcessingShortText(item: string, form: FormData): string {
  if (item.includes("Перфорация")) return "перфор.";
  if (item.includes("Сверление отверстий")) return `сверление отверстий${form.drillingDiameter ? ` Ø ${form.drillingDiameter}` : ""}`;
  if (item.includes("Тиснение")) return `тиснение${form.foilColor ? " " + form.foilColor : ""}`;
  if (item.includes("Фольгирование")) return `фольгирование${form.foilColor ? " " + form.foilColor : ""}`;
  if (item.includes("УФ-лак")) return form.uvType === "Текстурный" ? "УФ-лак текстурный" : "УФ-лак";
  if (item.includes("Прикатка магнита")) return "прикатка магнита";
  if (item.includes("Скругление")) return "скругл. углов";
  return item.toLowerCase();
}

function formatPostProcessingFullText(item: string, form: FormData): string {
  if (item.includes("Перфорация")) return " [x] Перфорация";
  if (item.includes("Сверление отверстий")) return ` [x] Сверление отверстий${form.drillingDiameter ? ` — Ø ${form.drillingDiameter}` : ""}`;
  if (item.includes("Тиснение")) return ` [x] Тиснение фольгой${form.foilColor ? ` — цвет фольги: ${form.foilColor}` : ""}`;
  if (item.includes("Фольгирование")) return ` [x] Фольгирование${form.foilColor ? ` — цвет фольги: ${form.foilColor}` : ""}`;
  if (item.includes("УФ-лак")) return ` [x] ${form.uvType === "Текстурный" ? "УФ-лак текстурный" : "УФ-лак"}`;
  if (item.includes("Прикатка магнита")) return " [x] Прикатка магнита";
  if (item.includes("Скругление")) return " [x] Скругление углов";
  return ` [x] ${item}`;
}

function getDisplaySize(form: FormData): string {
  if (isEnvelope(form.productType)) return form.envelopeSize === "Нестандартный" ? form.envelopeSizeCustom : form.envelopeSize;
  if (form.productType === "Визитки") return form.businessCardSize === "Нестандартный" ? form.businessCardSizeCustom : form.businessCardSize;
  if (isBag(form.productType)) return form.bagWidth || form.bagHeight || form.bagDepth ? `${form.bagWidth || "?"}×${form.bagHeight || "?"}×${form.bagDepth || "?"} мм` : "";
  if (isCatalog(form.productType)) return form.catalogFormat === "Нестандартный" ? form.catalogFormatCustom : form.catalogFormat;
  if (isBrochure(form.productType)) return form.brochureFormat === "Нестандартный" ? form.brochureFormatCustom : form.brochureFormat;
  if (isPocketCalendar(form)) return form.paperSize === "Нестандартный" ? form.paperSizeCustom : form.paperSize;
  if (!isMultiBlock(form.productType) && !isCalendar(form.productType)) return form.paperSize === "Нестандартный" ? form.paperSizeCustom : form.paperSize;
  return "";
}

function generateShortTZ(form: FormData): string {
  const parts: string[] = [];
  const product = formatProductNameForTZ(form, true);
  const templateFlags = getProductTemplate(form.productType).flags;
  if (product) parts.push(product);
  const size = getDisplaySize(form);
  if (size) parts.push(size.split(/\s*[(/]/)[0].trim());

  if (isMultiBlock(form.productType)) {
    if (form.pageCount) parts.push(`${form.pageCount} стр.`);
    const coverSelection = { type: form.coverPaperType, value: form.coverDensity, customName: form.coverPaperCustomName, finish: form.coverFinish };
    const blockSelection = { type: form.blockPaperType, value: form.blockDensity, customName: form.blockPaperCustomName, finish: form.blockFinish };
    const samePaper = isSamePaperSelection(coverSelection, blockSelection);
    const covParts = [
      formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish),
      form.coverColor.split(/\s/)[0],
      form.coverLamination.enabled ? getLaminationShort(form.coverLamination) : "",
    ].filter(Boolean);
    const blkParts = [
      samePaper ? "" : formatPaperSelectionWithFinishForTZ(form.blockPaperType, form.blockDensity, form.blockPaperCustomName, form.blockFinish),
      form.blockColor.split(/\s/)[0],
      form.blockLamination.enabled ? getLaminationShort(form.blockLamination) : "",
    ].filter(Boolean);
    if (covParts.length) parts.push(samePaper ? covParts.join(" ") : `обложка: ${covParts.join(" ")}`);
    if (blkParts.length) parts.push(samePaper ? blkParts.join(" ") : `блок: ${blkParts.join(" ")}`);
  } else if (isNotebook(form.productType)) {
    if (form.blockPages) parts.push(`${form.blockPages} листов в блоке`);
    const coverParts = [
      formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish),
      formatNotebookColorText(form.coverColor),
      form.coverLamination.enabled ? getLaminationShort(form.coverLamination) : "",
    ].filter(Boolean);
    if (coverParts.length) {
      parts.push(form.backingEnabled ? `обложка: ${coverParts.join(" ")}` : `обложка/подложка: ${coverParts.join(" ")}`);
    }
    if (form.backingEnabled) {
      const backingParts = [
        formatPaperSelectionWithFinishForTZ(form.backingPaperType, form.backingDensity, form.backingPaperCustomName, form.backingFinish),
        formatNotebookColorText(form.backingColor) || "без печати",
        form.backingLamination.enabled ? getLaminationShort(form.backingLamination) : "",
      ].filter(Boolean);
      if (backingParts.length) parts.push(`подложка: ${backingParts.join(" ")}`);
    }
  } else if (isCalendar(form.productType)) {
    parts.push(form.calendarKind.toLowerCase());
    if (form.calendarKind === "Настенный" && form.adBlocks) parts.push(`${form.adBlocks} рекл. блока`);
    if (form.calendarKind === "Настенный") {
      const headerPaper = formatPaperSelectionWithFinishForTZ(
        form.calendarHeaderPaperType,
        form.calendarHeaderPaperDensity,
        form.calendarHeaderPaperCustomName,
        form.calendarHeaderPaperFinish,
      );
      if (headerPaper) parts.push(`шапка ${headerPaper}`);
    }
    if (form.gridType === "Цифра") {
      const gridMaterial = normalizeMaterial(form.calendarGridMaterial);
      const gridColor = form.calendarGridColorMode ? form.calendarGridColorMode.split(/\s/)[0] : "";
      if (gridMaterial || gridColor) parts.push(`Сетка: ${[gridMaterial, gridColor].filter(Boolean).join(" ")}`);
    } else if (form.gridType === "Офсет") {
      const gridMaterial = normalizeMaterial(form.calendarGridMaterial);
      const gridColor = form.calendarOffsetColor || "";
      parts.push(`Сетка: офсет${gridMaterial || gridColor ? `, ${[gridMaterial, gridColor].filter(Boolean).join(" ")}` : ""}`);
    }
    if (form.calendarKind === "Настольный" && form.calendarBaseMaterial) {
      parts.push(`Основание: ${normalizeMaterial(form.calendarBaseMaterial)} ${form.calendarBaseFinish.toLowerCase()}`);
    }
  } else if (isBag(form.productType)) {
    if (!form.bagExternalSheets) {
      const bagPaper = formatBagPaperSelection(form);
      if (bagPaper) parts.push(`${bagPaper} ${form.densityFinish.toLowerCase()}`);
      if (form.colorMode) parts.push(form.colorMode.split(/\s/)[0]);
    }
    if (form.bagPartsCount) parts.push(form.bagPartsCount.toLowerCase());
    if (form.bagExternalSheets) parts.push("сборка из сторонних листов");
    if (form.bagHandleType !== "Лента") {
      const eyeletColor = getBagColor(form.bagEyeletColor, form.bagEyeletColorCustom);
      if (eyeletColor) parts.push(`люверсы: ${eyeletColor.toLowerCase()}`);
    }
    const handleText = getBagHandleText(form);
    if (handleText) parts.push(`ручки: ${handleText.toLowerCase()}`);
  } else if (isSticker(form.productType)) {
    if (form.stickerMaterial) parts.push(`${normalizeMaterial(form.stickerMaterial)} ${form.stickerFinish.toLowerCase()}`.toLowerCase());
    if (form.colorMode) parts.push(formatShortColor(form.colorMode));
    if (form.stickerPlotterCut) parts.push("плоттерная резка");
  } else if (form.productType === "Воблеры") {
    const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
    if (paperText) parts.push(`${paperText}${form.paperType === "Дизайнерская" ? "" : ` ${form.densityFinish.toLowerCase()}`}`.trim());
    if (form.colorMode) parts.push(formatShortColor(form.colorMode));
    if (form.wobblerPlotterCut) parts.push("плоттерная резка");
    if (form.wobblerFootGlue) parts.push("приклейка ножки");
  } else if (form.productType === "Бейджи") {
    const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
    if (paperText) parts.push(`${paperText}${form.paperType === "Дизайнерская" ? "" : ` ${form.densityFinish.toLowerCase()}`}`.trim());
    if (form.colorMode) parts.push(formatShortColor(form.colorMode, form.ownReverse));
    if (form.badgeHoleType) {
      const holeText = formatHoleSelectionText(form.badgeHoleType, form.badgeHoleDiameter, form.badgeHoleCount);
      parts.push(holeText);
    }
  } else {
    const envelopePaperless = isEnvelope(form.productType) && form.paperType === "Без бумаги";
    if (templateFlags.showPaper && !envelopePaperless) {
      const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
      if (paperText) parts.push(`${paperText}${form.paperType === "Дизайнерская" ? "" : ` ${form.densityFinish.toLowerCase()}`}`.trim());
    }
    if (templateFlags.showColor && isEnvelope(form.productType)) {
      parts.push(formatShortColor(form.colorMode, form.ownReverse) || "—");
    } else if (templateFlags.showColor && form.colorMode) {
      parts.push(formatShortColor(form.colorMode, form.ownReverse && form.productType === "Листовки"));
    }
  }

  if (form.lamination.enabled && !isMultiBlock(form.productType) && !isNotebook(form.productType) && !isCalendar(form.productType)) {
    parts.push(getLaminationShort(form.lamination));
  }

  if (templateFlags.showPostProcessing && form.postProcessing.length > 0) {
    const ppShort = form.postProcessing.map((p) => formatPostProcessingShortText(p, form));
    parts.push(...ppShort);
  }

  if (form.bigkovka) {
    const lines = form.bigkovkaLines || "?";
    parts.push(`${lines} биговк${lines === "1" ? "а" : "и"}`);
  }
  if (form.falcovka) {
    parts.push("фальцовка");
  }

  if (isCalendar(form.productType) && form.calendarKind === "Настольный" && form.calendarBaseBigovkaLines) {
    parts.push(`${form.calendarBaseBigovkaLines} биговк основания`);
  }

  if (form.kashurovka.enabled) parts.push(getKashShortTZ(form));

  if (isCalendar(form.productType) && form.calendarBaseLamination.enabled) parts.push(`осн. ${getLaminationShort(form.calendarBaseLamination)}`);
  if (isPocketCalendar(form)) {
    const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
    if (paperText) parts.push(`${paperText}${form.paperType === "Дизайнерская" ? "" : ` ${form.densityFinish.toLowerCase()}`}`.trim());
    if (form.colorMode) parts.push(form.colorMode.split(/\s/)[0]);
    if (form.lamination.enabled) parts.push(getLaminationShort(form.lamination));
  }

  if (form.binding && form.bindingType) {
    if (form.bindingType === "Скоба") {
      const pos = form.stapleCount === "Одна" ? `, ${form.staplePosition.toLowerCase()}` : "";
      parts.push(`${form.stapleCount === "Две" ? "две скобы" : "одна скоба"}${pos}`);
    } else if (form.bindingType === "Пружина") {
      const col = getSpringColor(form);
      const dia = form.springDiameter;
      parts.push(`пружина${col ? " " + col.toLowerCase() : ""}${dia ? " " + dia : ""}${form.springPosition ? `, ${form.springPosition.toLowerCase()}` : ""}${form.springHidden ? ", скрытая" : ", открытая"}`);
    } else parts.push(form.bindingType.toLowerCase());
  }

  const notesBlock = form.notes.trim();
  const colorProofNote = form.colorProof === "Надо"
    ? "Показать перед тиражом"
    : form.colorProof === "Есть образец"
      ? "Показать перед тиражом, есть образец цвета"
      : "";

  const blocks = [parts.join(" / "), notesBlock, colorProofNote].filter(Boolean);
  return blocks.join("\n\n");
}

function generateTZ(form: FormData, _tzNumber: number): string {
  const deadlineFormatted = form.deadline ? (form.deadlineTime ? `${form.deadline.split("-").reverse().join(".")} в ${form.deadlineTime}` : form.deadline.split("-").reverse().join(".")) : "—";
  const product = formatProductNameForTZ(form);
  const size = getDisplaySize(form);
  const cleanSize = size ? stripParentheticalNote(size) : "";
  const activeSubcontractWorks = getActiveSubcontractWorks(form);
  const templateFlags = getProductTemplate(form.productType).flags;

  const lines: string[] = [];
  lines.push(` ЗАКАЗ № ${form.orderNumber || "БЕЗ НОМЕРА"}`);
  lines.push("============================================================");
  lines.push(` Срок сдачи : ${deadlineFormatted}`);
  lines.push(` ЗАКАЗЧИК : ${form.clientName || "—"}`);
  lines.push(` МЕНЕДЖЕР : ${form.managerName || "—"}`);
  lines.push(` ТИРАЖ : ${form.quantity ? `${formatQuantityText(form.quantity)} экз.` : "—"}`);
  if (activeSubcontractWorks.length > 0) {
    lines.push("");
    lines.push(" ПОДРЯДНЫЕ РАБОТЫ");
    lines.push(" ----------------");
    activeSubcontractWorks.forEach((work, index) => {
      lines.push(` ${work.note.trim() || "—"}`);
      lines.push(` ${formatDateTimeText(work.date, work.time)}`);
      if (index < activeSubcontractWorks.length - 1) lines.push("");
    });
  }
  if (form.colorProof && form.colorProof !== "Не надо") lines.push(` ЦВЕТОПРОБА : ${form.colorProof}`);
  lines.push("");
  lines.push(" ПАРАМЕТРЫ ИЗДЕЛИЯ");
  lines.push(" -----------------");
  lines.push(` Тип изделия : ${product || "—"}`);

  if (cleanSize && !isBag(form.productType)) lines.push(` Формат : ${cleanSize}`);

  if (isMultiBlock(form.productType)) {
    lines.push(` Страниц (с обложкой) : ${form.pageCount || "—"}`);
    lines.push("");
    lines.push(" ОБЛОЖКА");
    if (form.coverUseKash) lines.push(" Обложка задаётся в блоке кашировки");
    else {
      lines.push(` Бумага : ${formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish) || "—"}`);
      lines.push(` Цветность : ${normalizeColorMode(form.coverColor) || "—"}`);
      if (form.coverLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.coverLamination)}`);
    }
    lines.push(" БЛОК");
    const coverSelection = { type: form.coverPaperType, value: form.coverDensity, customName: form.coverPaperCustomName, finish: form.coverFinish };
    const blockSelection = { type: form.blockPaperType, value: form.blockDensity, customName: form.blockPaperCustomName, finish: form.blockFinish };
    lines.push(` Бумага : ${isSamePaperSelection(coverSelection, blockSelection) ? "как у обложки" : (formatPaperSelectionWithFinishForTZ(form.blockPaperType, form.blockDensity, form.blockPaperCustomName, form.blockFinish) || "—")}`);
    lines.push(` Цветность : ${normalizeColorMode(form.blockColor) || "—"}`);
    if (form.blockLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.blockLamination)}`);
  } else if (isNotebook(form.productType)) {
    lines.push(` Листов в блоке : ${form.blockPages || "—"}`);
    lines.push("");
    lines.push(form.backingEnabled ? " ОБЛОЖКА" : " ОБЛОЖКА/ПОДЛОЖКА");
    if (form.coverUseKash) lines.push(" Обложка задаётся в блоке кашировки");
    else {
      lines.push(` Бумага : ${formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish) || "—"}`);
      lines.push(` Цветность : ${formatNotebookColorText(form.coverColor) || "—"}`);
      if (form.coverLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.coverLamination)}`);
    }
    if (form.backingEnabled) {
      lines.push("");
      lines.push(" ПОДЛОЖКА");
      lines.push(` Бумага : ${formatPaperSelectionWithFinishForTZ(form.backingPaperType, form.backingDensity, form.backingPaperCustomName, form.backingFinish) || "—"}`);
      lines.push(` Цветность : ${formatNotebookColorText(form.backingColor) || "без печати"}`);
      if (form.backingLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.backingLamination)}`);
    }
    lines.push("");
    lines.push(" БЛОК");
    lines.push(` Бумага : ${formatPaperSelectionWithFinishForTZ(form.blockPaperType, form.blockDensity, form.blockPaperCustomName, form.blockFinish) || "—"}`);
    lines.push(` Цветность : ${normalizeColorMode(form.blockColor) || "—"}`);
    if (form.blockLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.blockLamination)}`);
  } else if (isCalendar(form.productType)) {
    lines.push(` Вид календаря : ${form.calendarKind || "—"}`);
    if (form.calendarKind === "Настенный") {
      lines.push(` Рекламных блоков : ${form.adBlocks || "—"}`);
      const headerPaper = formatPaperSelectionWithFinishForTZ(
        form.calendarHeaderPaperType,
        form.calendarHeaderPaperDensity,
        form.calendarHeaderPaperCustomName,
        form.calendarHeaderPaperFinish,
      );
      if (headerPaper) lines.push(` Шапка : ${headerPaper}`);
      lines.push(` Крепление : ${form.wallMountType || "—"}`);
      lines.push(` Описание крепления : ${form.wallMountDesc || "—"}`);
    } else {
      if (form.calendarBaseUseKash) lines.push(" Основание задаётся в блоке кашировки");
      else {
        lines.push(` Основание : ${formatMaterialWithFinish(form.calendarBaseMaterial, form.calendarBaseFinish) || "—"}`);
        if (form.calendarBaseLamination.enabled) lines.push(` Ламинация основания : ${formatLamination(form.calendarBaseLamination)}`);
      }
      if (form.calendarBaseBigovkaLines) lines.push(` Биговка основания : ${form.calendarBaseBigovkaLines} линий`);
      lines.push(` Тип сетки : ${form.gridType || "—"}`);
      lines.push(` Материал сетки : ${formatMaterialWithFinish(form.calendarGridMaterial, form.calendarGridFinish) || "—"}`);
      lines.push(` ${form.gridType === "Цифра" ? "Цветность сетки" : "Цвет офсета"} : ${form.gridType === "Цифра" ? normalizeColorMode(form.calendarGridColorMode) || "—" : normalizeColorMode(form.calendarOffsetColor) || "—"}`);
    }
    if (form.calendarKind === "Карманный") {
      const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
      const paperLine = paperText
        ? `${paperText}${form.paperType === "Дизайнерская" ? "" : `, ${form.densityFinish.toLowerCase()}`}`
        : "—";
      lines.push(` Материал : ${paperLine}`);
      lines.push(` Цветность : ${normalizeColorMode(form.colorMode) || "—"}`);
      if (form.lamination.enabled) lines.push(` Ламинация : ${formatLamination(form.lamination)}`);
    }
  } else if (isBag(form.productType)) {
    if (!form.bagExternalSheets) {
      const bagPaper = formatBagPaperSelection(form);
      lines.push(` Бумага : ${bagPaper ? `${bagPaper}, ${form.densityFinish.toLowerCase()}` : "—"}`);
      lines.push(` Цветность : ${normalizeColorMode(form.colorMode) || "—"}`);
    }
    lines.push(` Размер Ш×В×Г : ${size || "—"}`);
    lines.push(` Количество частей : ${form.bagPartsCount || "—"}`);
    if (form.bagExternalSheets) lines.push(" Сборка из сторонних листов : Да");
    if (form.bagHandleType !== "Лента") {
      lines.push(` Цвет люверсов : ${getBagColor(form.bagEyeletColor, form.bagEyeletColorCustom) || "—"}`);
    }
    lines.push(` Цвет ручек : ${getBagHandleText(form) || "—"}`);
  } else if (isSticker(form.productType)) {
    lines.push(` Материал : ${formatMaterialWithFinish(form.stickerMaterial, form.stickerFinish) || "—"}`);
    lines.push(` Плоттерная резка : ${form.stickerPlotterCut ? "Да" : "Нет"}`);
    lines.push(` Цветность : ${normalizeColorMode(form.colorMode) || "—"}`);
  } else if (form.productType === "Воблеры") {
    const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
    const paperLine = paperText
      ? `${paperText}${form.paperType === "Дизайнерская" ? "" : `, ${form.densityFinish.toLowerCase()}`}`
      : "—";
    lines.push(` Материал : ${paperLine}`);
    lines.push(` Цветность : ${normalizeColorMode(form.colorMode) || "—"}`);
    if (form.wobblerPlotterCut) lines.push(" Плоттерная резка");
    if (form.wobblerFootGlue) lines.push(" Приклейка ножки");
  } else if (form.productType === "Бейджи") {
    const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
    const paperLine = paperText
      ? `${paperText}${form.paperType === "Дизайнерская" ? "" : `, ${form.densityFinish.toLowerCase()}`}`
      : "—";
    lines.push(` Материал : ${paperLine}`);
    lines.push(` Цветность : ${formatColorWithReverse(form.colorMode, form.ownReverse)}`);
    if (form.badgeHoleType) {
      const holeText = formatHoleSelectionText(form.badgeHoleType, form.badgeHoleDiameter, form.badgeHoleCount);
      lines.push(` Отверстие : ${holeText}`);
    } else lines.push(" Отверстие : —");
  } else {
    if (form.kashurovka.enabled) lines.push(" Базовые материалы задаются в блоке кашировки");
    else {
      const envelopePaperless = isEnvelope(form.productType) && form.paperType === "Без бумаги";
      if (templateFlags.showPaper && !envelopePaperless) {
        const paperText = formatPaperSelectionForTZ(form.paperType, form.density, form.paperCustomName) || normalizeMaterial(form.density);
        const paperLine = paperText
          ? `${paperText}${form.paperType === "Дизайнерская" ? "" : `, ${form.densityFinish.toLowerCase()}`}`
          : "—";
        lines.push(` Материал : ${paperLine}`);
      }
    }
    if (templateFlags.showColor && !form.kashurovka.enabled) {
      lines.push(` Цветность : ${formatColorWithReverse(form.colorMode, form.ownReverse && form.productType === "Листовки")}`);
    }
  }
  lines.push("");

  if (templateFlags.showLamination && !isMultiBlock(form.productType) && !isNotebook(form.productType) && !isCalendar(form.productType) && form.lamination.enabled) {
    lines.push(" ЛАМИНАЦИЯ");
    lines.push(" ---------");
    lines.push(` Ламинация : ${formatLamination(form.lamination)}`);
    lines.push("");
  }

  if (templateFlags.showPostProcessing && form.postProcessing.length > 0) {
    lines.push(" ОБРАБОТКА");
    lines.push(" ---------");
    form.postProcessing.forEach((p) => {
      lines.push(formatPostProcessingFullText(p, form));
    });
    lines.push("");
  }

  if (form.bigkovka) {
    lines.push(" БИГОВКА");
    lines.push(" -------");
    lines.push(` Кол-во линий: ${form.bigkovkaLines || "—"}`);
    lines.push("");
  }
  if (form.falcovka) {
    lines.push(" ФАЛЬЦОВКА");
    lines.push(" ---------");
    lines.push(" Нужна : Да");
    lines.push("");
  }

  if (form.kashurovka.enabled) {
    lines.push(" КАШИРОВКА");
    lines.push(" ---------");
    lines.push(` Тип соединения : ${form.kashurovka.connectionType}`);
    if (form.kashurovka.connectionType === "Слим-каширование") {
      lines.push(` Бумага 1 : ${formatMaterialWithFinish(form.kashurovka.slimPaperTop, form.kashurovka.slimPaperTopFinish) || "—"}`);
      lines.push(` Цветность бумаги 1 : ${form.kashurovka.slimPaperTopColor || "—"}`);
      lines.push(` Ламинация бумаги 1 : ${formatLamination(form.kashurovka.slimPaperTopLamination)}`);
      lines.push(` Бумага 2 : ${formatMaterialWithFinish(form.kashurovka.slimPaperBottom, form.kashurovka.slimPaperBottomFinish) || "—"}`);
      lines.push(` Цветность бумаги 2 : ${form.kashurovka.slimPaperBottomColor || "—"}`);
      lines.push(` Ламинация бумаги 2 : ${formatLamination(form.kashurovka.slimPaperBottomLamination)}`);
    } else {
      lines.push(` Основа : ${form.kashurovka.baseType || "—"}`);
      lines.push(` Лайнер : ${formatMaterialWithFinish(form.kashurovka.linerType, form.kashurovka.linerFinish) || "—"}`);
      lines.push(` Цветность лайнера : ${form.kashurovka.linerColor || "—"}`);
      lines.push(` Ламинация лайнера : ${formatLamination(form.kashurovka.linerLamination)}`);
      if (form.kashurovka.linerSize) lines.push(` Размер лайнера : ${form.kashurovka.linerSize}`);
      lines.push(` Заворот : ${form.kashurovka.turnoverType}`);
    }
    if (form.kashurovka.forsacEnabled) {
      lines.push(` Форзац : ${formatMaterialWithFinish(form.kashurovka.forsacPaper, form.kashurovka.forsacFinish) || "—"}`);
      lines.push(` Цветность форзаца : ${form.kashurovka.forsacColor || "—"}`);
      lines.push(` Ламинация форзаца : ${formatLamination(form.kashurovka.forsacLamination)}`);
      lines.push(` Режим форзаца : ${form.kashurovka.forsacPrintMode}`);
      if (form.kashurovka.forsacSize) lines.push(` Размер форзаца : ${form.kashurovka.forsacSize}`);
    }
    lines.push("");
  }

  if (form.binding) {
    lines.push(" СШИВКА / ПЕРЕПЛЁТ");
    lines.push(" -----------------");
    if (form.bindingType === "Скоба") {
      lines.push(` Тип : Скоба (${form.stapleCount})`);
      if (form.stapleCount === "Одна") lines.push(` Расположение: ${form.staplePosition}`);
    } else if (form.bindingType === "Пружина") {
      const col = getSpringColor(form);
      lines.push(` Тип : Пружина`);
      if (col) lines.push(` Цвет : ${col}`);
      if (form.springDiameter) lines.push(` Диаметр : ${form.springDiameter}`);
      lines.push(` Расположение : ${form.springPosition}`);
      lines.push(` Скрытая пружина : ${form.springHidden ? "Да" : "Нет"}`);
    } else lines.push(` Тип : ${form.bindingType || "не указан"}`);
    lines.push("");
  }

  if (form.notes.trim()) {
    lines.push(" ДОПОЛНИТЕЛЬНО");
    lines.push(" -------------");
    form.notes.split("\n").forEach((l) => lines.push(` ${l}`));
    lines.push("");
  }

  lines.push(` ТИРАЖ : ${form.quantity ? `${formatQuantityText(form.quantity)} экз.` : "—"}`);

  return lines.join("\n");
}

function getTZNumber(): number {
  const stored = localStorage.getItem("tz_counter");
  const n = stored ? parseInt(stored) + 1 : 1;
  localStorage.setItem("tz_counter", String(n));
  return n;
}

// ─── Вспомогательные компоненты ──────────────────────────────────────────────

function YesNo({ value, onChange, disabled = false }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex gap-1">
      <button type="button" disabled={disabled} onClick={() => onChange(true)} className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>Да</button>
      <button type="button" disabled={disabled} onClick={() => onChange(false)} className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${!value ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>Нет</button>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer";

function fieldClass(invalid: boolean) {
  return `${inputClass} ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

function selectFieldClass(invalid: boolean) {
  return `${selectClass} ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

function actionFieldClass(invalid: boolean) {
  return `${inputClass} flex items-center justify-between gap-3 text-left shadow-sm hover:bg-slate-50 ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

type UiIconName =
  | "folder"
  | "printer"
  | "file"
  | "calendar"
  | "badge"
  | "palette"
  | "scissors"
  | "book"
  | "sparkles"
  | "ruler"
  | "clipboard"
  | "settings"
  | "save"
  | "copy"
  | "warning"
  | "download"
  | "check"
  | "close"
  | "clock"
  | "eye"
  | "flash"
  | "lock"
  | "note"
  | "package"
  | "gear";

function UiIcon({ name, className = "h-4 w-4" }: { name: UiIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === "folder" && <>
        <path {...common} d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5V17A2 2 0 0 1 19 19H5a2 2 0 0 1-2-2V7.5Z" />
      </>}
      {name === "printer" && <>
        <rect {...common} x="6" y="4" width="12" height="6" rx="1.5" />
        <path {...common} d="M6 10H5a2 2 0 0 0-2 2v4h4" />
        <path {...common} d="M18 10h1a2 2 0 0 1 2 2v4h-4" />
        <rect {...common} x="7" y="13" width="10" height="7" rx="1.5" />
      </>}
      {name === "file" && <>
        <path {...common} d="M7 3.75h6l4 4V20.25A1.75 1.75 0 0 1 15.25 22h-8.5A1.75 1.75 0 0 1 5 20.25V5.5A1.75 1.75 0 0 1 6.75 3.75Z" />
        <path {...common} d="M13 3.75V7a1 1 0 0 0 1 1h3" />
      </>}
      {name === "calendar" && <>
        <rect {...common} x="4" y="5.5" width="16" height="14.5" rx="2" />
        <path {...common} d="M4 9h16" />
        <path {...common} d="M8 3.5v4M16 3.5v4" />
      </>}
      {name === "badge" && <>
        <rect {...common} x="4" y="4" width="16" height="16" rx="3" />
        <path {...common} d="M8 10h8M8 14h5" />
      </>}
      {name === "palette" && <>
        <path {...common} d="M12 4a8 8 0 1 0 0 16h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h1a3 3 0 0 0 0-6Z" />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <circle cx="7.5" cy="13" r="1" fill="currentColor" />
        <circle cx="10.8" cy="16" r="1" fill="currentColor" />
      </>}
      {name === "scissors" && <>
        <circle {...common} cx="7" cy="7" r="2" />
        <circle {...common} cx="7" cy="17" r="2" />
        <path {...common} d="M8.4 8.4 20 4M8.4 15.6 20 20M8.2 7.8 15 12" />
      </>}
      {name === "book" && <>
        <path {...common} d="M6 4.5h8a3 3 0 0 1 3 3V20H9a3 3 0 0 0-3 3V4.5Z" />
        <path {...common} d="M6 4.5h8a3 3 0 0 1 3 3V20" />
        <path {...common} d="M9 8h5M9 12h5" />
      </>}
      {name === "sparkles" && <>
        <path {...common} d="M12 3.5 13.8 8l4.7 1.8-4.7 1.8L12 16l-1.8-4.4-4.7-1.8L10.2 8 12 3.5Z" />
        <path {...common} d="M18 12.5 18.7 14.3 20.5 15l-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
      </>}
      {name === "ruler" && <>
        <rect {...common} x="4.5" y="7" width="15" height="10" rx="2" transform="rotate(-15 12 12)" />
        <path {...common} d="M8 9.5v2M10.5 8.8v2M13 8v2M15.5 7.3v2" />
      </>}
      {name === "clipboard" && <>
        <rect {...common} x="7" y="5" width="10" height="16" rx="2" />
        <path {...common} d="M9 5.5V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5v1" />
        <path {...common} d="M9 10h6M9 13h6M9 16h4" />
      </>}
      {name === "settings" && <>
        <circle {...common} cx="12" cy="12" r="3.5" />
        <path {...common} d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M16.4 7.6l1.4-1.4M6.2 17.8l1.4-1.4" />
      </>}
      {name === "save" && <>
        <path {...common} d="M5 4.5h11l3 3V19.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-15Z" />
        <path {...common} d="M8 4.5V10h8V4.5" />
        <path {...common} d="M8 15h8" />
      </>}
      {name === "copy" && <>
        <rect {...common} x="9" y="3.5" width="10" height="12" rx="2" />
        <rect {...common} x="5" y="8.5" width="10" height="12" rx="2" />
      </>}
      {name === "warning" && <>
        <path {...common} d="M12 4 21 19H3L12 4Z" />
        <path {...common} d="M12 9v4M12 16.5h.01" />
      </>}
      {name === "download" && <>
        <path {...common} d="M12 4.5v9" />
        <path {...common} d="M8.5 10.5 12 14l3.5-3.5" />
        <path {...common} d="M5 18.5h14" />
      </>}
      {name === "check" && <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="m8.5 12.5 2.5 2.5 4.5-5" />
      </>}
      {name === "close" && <>
        <path {...common} d="M7 7l10 10M17 7 7 17" />
      </>}
      {name === "clock" && <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="M12 8v4l3 2" />
      </>}
      {name === "eye" && <>
        <path {...common} d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
        <circle {...common} cx="12" cy="12" r="2.5" />
      </>}
      {name === "flash" && <>
        <path {...common} d="M13 2.5 5 13h5l-1 8.5 9-11h-5l1-8Z" />
      </>}
      {name === "lock" && <>
        <rect {...common} x="6.5" y="10" width="11" height="9" rx="2" />
        <path {...common} d="M8.5 10V8.5a3.5 3.5 0 0 1 7 0V10" />
      </>}
      {name === "note" && <>
        <path {...common} d="M6 4.5h9l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5.5A1 1 0 0 1 6 4.5Z" />
        <path {...common} d="M10 4.5V8h3.5" />
        <path {...common} d="M8 12h8M8 15h8" />
      </>}
      {name === "package" && <>
        <path {...common} d="M4.5 8 12 4l7.5 4-7.5 4-7.5-4Z" />
        <path {...common} d="M4.5 8V16l7.5 4 7.5-4V8" />
        <path {...common} d="M12 12v8" />
      </>}
      {name === "gear" && <>
        <circle {...common} cx="12" cy="12" r="3.2" />
        <path {...common} d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M16.8 7.2l1.6-1.6M5.6 18.4l1.6-1.6" />
      </>}
    </svg>
  );
}

const EMOJI_FONT = {
  fontFamily: '"Segoe UI Symbol","Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',
};

const SECTION_ICON_PREFIXES: Array<[string, UiIconName]> = [
  ["🖨", "printer"],
  ["🗂", "folder"],
  ["✂️", "scissors"],
  ["📐", "ruler"],
  ["📚", "book"],
  ["📝", "note"],
  ["📣", "flash"],
];

const DICT_ICON_MAP: Record<string, UiIconName> = {
  "👤": "folder",
  "🖨": "printer",
  "📄": "file",
  "📅": "calendar",
  "🪪": "badge",
  "🟫": "package",
  "✏️": "clipboard",
  "✉️": "package",
  "🎨": "palette",
  "✂️": "scissors",
  "📚": "book",
  "✨": "sparkles",
  "📏": "ruler",
};

function getSectionIcon(title: string): { icon: UiIconName | null; text: string } {
  for (const [prefix, icon] of SECTION_ICON_PREFIXES) {
    if (title.startsWith(prefix)) {
      return { icon, text: title.slice(prefix.length).trimStart() };
    }
  }
  return { icon: null, text: title };
}

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  const parsed = getSectionIcon(title);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`px-4 py-2.5 bg-gradient-to-r ${accent || "from-slate-50 to-white"} border-b border-slate-100`}>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {parsed.icon && <UiIcon name={parsed.icon} className="h-4 w-4 text-slate-500" />}
          <span>{parsed.text}</span>
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function DateTimeField({
  dateFieldName,
  timeFieldName,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  invalidDate,
  invalidTime,
}: {
  dateFieldName: string;
  timeFieldName: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  invalidDate: boolean;
  invalidTime: boolean;
}) {
  const timePickerRef = useRef<HTMLInputElement | null>(null);
  const todayIso = getTodayLocalIso();

  return (
    <div className="flex gap-2 w-full">
      <input
        data-field={dateFieldName}
        type="date"
        min={todayIso}
        className={`${fieldClass(invalidDate)} min-w-[150px] flex-1`}
        value={dateValue}
        onChange={(e) => {
          if (e.target.value && e.target.value < todayIso) return;
          onDateChange(e.target.value);
        }}
      />
      <input
        data-field={timeFieldName}
        type="text"
        inputMode="numeric"
        className={`${fieldClass(invalidTime)} w-28 min-w-0 shrink`}
        placeholder="ЧЧ:ММ"
        value={timeValue}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          const next = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
          onTimeChange(next);
        }}
        onBlur={(e) => onTimeChange(normalizeTimeInput(e.target.value))}
      />
      <input
        data-field={timeFieldName}
        ref={timePickerRef}
        type="time"
        className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
        min={dateValue === todayIso ? getCurrentLocalTimeIso() : undefined}
        value={/^\d{2}:\d{2}$/.test(timeValue) ? timeValue : ""}
        onChange={(e) => onTimeChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          timePickerRef.current?.showPicker?.();
          timePickerRef.current?.focus();
        }}
        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-slate-600 hover:bg-slate-50 transition-colors"
        aria-label="Открыть выбор времени"
      >
        <UiIcon name="clock" className="h-4 w-4" />
      </button>
    </div>
  );
}

type UpdateStatus = "idle" | "checking" | "available" | "downloading" | "downloaded" | "error";

type UpdateState = {
  status: UpdateStatus;
  version?: string;
  releaseName?: string;
  notes?: string;
  percent?: number;
  transferred?: number;
  total?: number;
  bytesPerSecond?: number;
  error?: string;
};

function formatBytes(bytes?: number) {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) return "0 Б";
  const units = ["Б", "КБ", "МБ", "ГБ"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatSpeed(bytesPerSecond?: number) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return null;
  return `${formatBytes(bytesPerSecond)}/с`;
}

function UpdateNotice({
  state,
  onDownload,
  onInstall,
  onClose,
}: {
  state: UpdateState | null;
  onDownload: () => void | Promise<void>;
  onInstall: () => void | Promise<void>;
  onClose: () => void;
}) {
  if (!state || state.status === "idle") return null;

  const percent = Math.max(0, Math.min(100, state.percent ?? 0));
  const fileInfo = state.total ? `${formatBytes(state.transferred)} / ${formatBytes(state.total)}` : null;
  const speed = formatSpeed(state.bytesPerSecond);
  const title =
    state.status === "checking"
      ? "Проверяем обновления"
      : state.status === "available"
        ? "Доступна новая версия"
        : state.status === "downloading"
          ? "Скачиваем обновление"
          : state.status === "downloaded"
            ? "Обновление готово"
            : "Ошибка обновления";

  return (
    <div className="fixed right-4 bottom-4 z-[60] w-[min(92vw,420px)]">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-4 py-3 text-white">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              {state.status === "checking" && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {state.status === "available" && <UiIcon name="download" className="h-4 w-4 text-white" />}
              {state.status === "downloading" && <UiIcon name="clock" className="h-4 w-4 text-white" />}
              {state.status === "downloaded" && <UiIcon name="check" className="h-4 w-4 text-white" />}
              {state.status === "error" && <UiIcon name="warning" className="h-4 w-4 text-white" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-0.5 text-xs text-white/70">
                {state.version ? `Версия ${state.version}` : "Пожалуйста, подождите"}
                {state.releaseName ? ` • ${state.releaseName}` : ""}
              </div>
            </div>
            {(state.status === "available" || state.status === "error") && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Закрыть окно обновления"
              >
                <UiIcon name="close" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4">
          {state.status === "checking" && (
            <div className="space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
              <p className="text-sm text-slate-600">Смотрим GitHub Releases и проверяем, есть ли версия новее.</p>
            </div>
          )}

          {state.status === "available" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Найдена новая версия. Можно скачать её сейчас, а установка завершится после перезапуска.
              </p>
              {state.notes && <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 whitespace-pre-wrap">{state.notes}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDownload}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Скачать обновление
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Позже
                </button>
              </div>
            </div>
          )}

          {state.status === "downloading" && (
            <div className="space-y-3">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span>{percent.toFixed(0)}%</span>
                <span>{fileInfo}</span>
              </div>
              <div className="text-xs text-slate-500">
                {speed ? `Скорость ${speed}` : "Скачиваем..."}
              </div>
            </div>
          )}

          {state.status === "downloaded" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Обновление загружено. Нажмите кнопку ниже, чтобы приложение перезапустилось и установило новую версию.
              </p>
              <button
                type="button"
                onClick={onInstall}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Перезапустить и установить
              </button>
            </div>
          )}

          {state.status === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Не удалось проверить или скачать обновление.
              </p>
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                {state.error || "Неизвестная ошибка"}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpdateSummaryModal({
  version,
  onClose,
}: {
  version: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <UiIcon name="check" className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold">Обновление прошло успешно</div>
              <div className="mt-1 text-sm text-white/80">
                Версия {version}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-600">
            Вот что нового в этой сборке:
          </p>
          <ul className="space-y-2">
            {UPDATE_SUMMARY_POINTS.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="mt-0.5 text-emerald-500">•</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Компоненты-Блоки ────────────────────────────────────────────────────────

function LaminationBlockComponent({ label, value, onChange, laminationKinds, laminationThickness }: any) {
  const upd = (key: string, val: any) => onChange({ ...value, [key]: val });
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-2 border-l-2 border-blue-100 mt-2">
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Сторонность</label><select value={value.side} className={selectClass} onChange={(e) => upd("side", e.target.value)}><option>Односторонняя</option><option>Двухсторонняя</option></select></div>
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Толщина</label><select value={value.thickness} className={selectClass} onChange={(e) => upd("thickness", e.target.value)}>{laminationThickness.map((t: string) => <option key={t}>{t}</option>)}</select></div>
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Вид</label><select value={value.kind} className={selectClass} onChange={(e) => upd("kind", e.target.value)}>{laminationKinds.map((k: string) => <option key={k}>{k}</option>)}</select></div>
        </div>
      )}
    </div>
  );
}

function PaperFinishField({
  label = "Поверхность",
  value,
  onChange,
  options = PAPER_FINISHES,
}: {
  label?: string;
  value: PaperFinish;
  onChange: (value: PaperFinish) => void;
  options?: PaperFinish[];
}) {
  return (
    <Field label={label}>
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`px-3 py-1 text-xs rounded-md transition-all ${value === item ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {item === "Матовая" ? "Мат" : "Глянец"}
          </button>
        ))}
      </div>
    </Field>
  );
}

function PaperSelectionField({
  label,
  typeValue,
  materialValue,
  customValue,
  library,
  onTypeChange,
  onMaterialChange,
  onCustomChange,
  typeFieldName,
  materialFieldName,
  customFieldName,
  showValidation,
  invalidType,
  invalidMaterial,
  invalidCustom,
  typeOptionLabels,
  productType,
  disabled = false,
}: {
  label: string;
  typeValue: PaperTypeOption | "";
  materialValue: string;
  customValue: string;
  library: typeof DEFAULT_PAPER_LIBRARY;
  onTypeChange: (value: PaperTypeOption | "") => void;
  onMaterialChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  typeFieldName: string;
  materialFieldName: string;
  customFieldName: string;
  showValidation: boolean;
  invalidType: boolean;
  invalidMaterial: boolean;
  invalidCustom: boolean;
  typeOptionLabels?: Partial<Record<PaperTypeOption, string>>;
  productType?: string;
  disabled?: boolean;
}) {
  const isDesigner = typeValue === "Дизайнерская";
  const isCardboard = typeValue === "Картон";
  const isPaperless = typeValue === "Без бумаги" || typeValue === "Давальческая";
  const isEnvelopePaper = productType === "Конверты";
  const items = typeValue ? getPaperLibraryItems(library, typeValue) : [];
  const effectiveMaterialValue = isCardboard && !materialValue && items[0] ? items[0] : materialValue;

  useEffect(() => {
    if (!isCardboard || disabled || !items.length || materialValue) return;
    onMaterialChange(items[0]);
  }, [disabled, isCardboard, items, materialValue, onMaterialChange]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
        {label}<span className="text-red-400 ml-0.5">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select
          data-field={typeFieldName}
          value={typeValue}
          disabled={disabled}
          className={selectFieldClass(showValidation && invalidType)}
          onChange={(e) => onTypeChange(e.target.value as PaperTypeOption | "")}
        >
          <option value="">— тип бумаги —</option>
          {PAPER_TYPE_OPTIONS.map((item) => <option key={item} value={item}>{typeOptionLabels?.[item] || (isEnvelopePaper && item === "Без бумаги" ? "Готовые конверты" : item)}</option>)}
        </select>
        {isDesigner ? (
          <div>
            <input
              data-field={customFieldName}
              list={`designer-paper-suggestions-${customFieldName}`}
              value={customValue}
              disabled={disabled}
              className={fieldClass(showValidation && invalidCustom)}
              placeholder="Название дизайнерской бумаги"
              onChange={(e) => onCustomChange(e.target.value)}
            />
            <datalist id={`designer-paper-suggestions-${customFieldName}`}>
              {library.designer.map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
        ) : isPaperless ? (
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Материал и плотность не требуются
          </div>
        ) : (
          <select
            data-field={materialFieldName}
            value={effectiveMaterialValue}
            disabled={disabled || !typeValue}
            className={selectFieldClass(showValidation && invalidMaterial)}
            onChange={(e) => onMaterialChange(e.target.value)}
          >
            <option value="">— плотность —</option>
            {items.map((item) => <option key={item}>{item}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}

function KashurovkaBlockComponent({ value, onChange, paperProfiles, paperLibrary, laminationKinds, laminationThickness, colors, showValidation = false, requiredFields = [] }: any) {
  const upd = (key: string, val: any) => onChange({ ...value, [key]: val });
  const isSlim = value.connectionType === "Слим-каширование";
  const isRequired = (field: string) => showValidation && requiredFields.includes(field);
  const syncPaper = (keys: {
    typeKey: string;
    customKey: string;
    densityKey: string;
    legacyKey: string;
  }, type: PaperTypeOption | "", density: string, customName: string) => {
    onChange({
      ...value,
      [keys.typeKey]: type,
      [keys.densityKey]: density,
      [keys.customKey]: customName,
      [keys.legacyKey]: formatPaperSelection(type, density, customName),
    });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Кашировка</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-violet-200 mt-3">
          <Field label="Тип кашировки">
            <div className="flex gap-2">
              {["Каширование", "Слим-каширование"].map((ct) => (
                <button key={ct} type="button" onClick={() => upd("connectionType", ct)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.connectionType === ct ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{ct}</button>
              ))}
            </div>
          </Field>

          {!isSlim && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Основа"><select value={value.baseType} className={selectClass} onChange={(e) => upd("baseType", e.target.value)}><option value="">— выберите —</option>{KASHUROVKA_BASE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <PaperSelectionField
                  label="Лайнер"
                  typeValue={value.linerPaperType}
                  materialValue={value.linerPaperDensity}
                  customValue={value.linerPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    value.linerPaperType,
                    nextDensity,
                    value.linerPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    value.linerPaperType,
                    value.linerPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="linerPaperType"
                  materialFieldName="linerPaperDensity"
                  customFieldName="linerPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashLinerPaperType")}
                  invalidMaterial={isRequired("kashLinerPaperDensity")}
                  invalidCustom={isRequired("kashLinerPaperCustomName")}
                />
                <PaperFinishField value={value.linerFinish} options={paperFinishOptionsForSelection(value.linerPaperType, value.linerPaperDensity)} onChange={(v) => upd("linerFinish", v)} />
                <Field label="Цветность лайнера"><select value={value.linerColor} className={selectClass} onChange={(e) => upd("linerColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <Field label="Тип заворота"><div className="flex gap-2">{["С заворотом", "Без заворота"].map((tt) => <button key={tt} type="button" onClick={() => upd("turnoverType", tt)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.turnoverType === tt ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{tt}</button>)}</div></Field>
                <div className="md:col-span-2"><Field label="Размер лайнера (мм)"><input className={inputClass} placeholder="Например: 210×297 мм" value={value.linerSize} onChange={(e) => upd("linerSize", e.target.value)} /></Field></div>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация лайнера" value={value.linerLamination} onChange={(v: LaminationBlock) => upd("linerLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>

              <div className="pt-2 border-t border-violet-100">
                <div className="flex items-center gap-3 mb-3"><span className="text-xs font-medium text-slate-600 uppercase">Форзац</span><YesNo value={value.forsacEnabled} onChange={(v) => upd("forsacEnabled", v)} /></div>
                {value.forsacEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l-2 border-violet-100">
                    <PaperSelectionField
                      label="Бумага форзаца"
                      typeValue={value.forsacPaperType}
                      materialValue={value.forsacPaperDensity}
                      customValue={value.forsacPaperCustomName}
                      library={paperLibrary}
                      onTypeChange={(nextType) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        nextType,
                        "",
                        "",
                      )}
                      onMaterialChange={(nextDensity) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        value.forsacPaperType,
                        nextDensity,
                        value.forsacPaperCustomName,
                      )}
                      onCustomChange={(nextCustom) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        value.forsacPaperType,
                        value.forsacPaperDensity,
                        nextCustom,
                      )}
                      typeFieldName="forsacPaperType"
                      materialFieldName="forsacPaperDensity"
                      customFieldName="forsacPaperCustomName"
                      showValidation={showValidation}
                      invalidType={isRequired("kashForsacPaperType")}
                      invalidMaterial={isRequired("kashForsacPaperDensity")}
                      invalidCustom={isRequired("kashForsacPaperCustomName")}
                    />
                    <PaperFinishField value={value.forsacFinish} options={paperFinishOptionsForSelection(value.forsacPaperType, value.forsacPaperDensity)} onChange={(v) => upd("forsacFinish", v)} />
                    <Field label="Цветность форзаца"><select value={value.forsacColor} className={selectClass} onChange={(e) => upd("forsacColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                    <Field label="Печать на форзаце"><select value={value.forsacPrintMode} className={selectClass} onChange={(e) => upd("forsacPrintMode", e.target.value)}><option>Белые</option><option>С печатью</option></select></Field>
                    <Field label="Размер форзаца (мм)"><input className={inputClass} placeholder="Например: 200×290 мм" value={value.forsacSize} onChange={(e) => upd("forsacSize", e.target.value)} /></Field>
                    <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация форзаца" value={value.forsacLamination} onChange={(v: LaminationBlock) => upd("forsacLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
                  </div>
                )}
              </div>
            </>
          )}

          {isSlim && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PaperSelectionField
                  label="Бумага 1"
                  typeValue={value.slimPaperTopPaperType}
                  materialValue={value.slimPaperTopPaperDensity}
                  customValue={value.slimPaperTopPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    value.slimPaperTopPaperType,
                    nextDensity,
                    value.slimPaperTopPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    value.slimPaperTopPaperType,
                    value.slimPaperTopPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="slimPaperTopPaperType"
                  materialFieldName="slimPaperTopPaperDensity"
                  customFieldName="slimPaperTopPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashSlimPaperTopPaperType")}
                  invalidMaterial={isRequired("kashSlimPaperTopPaperDensity")}
                  invalidCustom={isRequired("kashSlimPaperTopPaperCustomName")}
                />
                <PaperFinishField value={value.slimPaperTopFinish} options={paperFinishOptionsForSelection(value.slimPaperTopPaperType, value.slimPaperTopPaperDensity)} onChange={(v) => upd("slimPaperTopFinish", v)} />
                <Field label="Цветность бумаги 1"><select value={value.slimPaperTopColor} className={selectClass} onChange={(e) => upd("slimPaperTopColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 1" value={value.slimPaperTopLamination} onChange={(v: LaminationBlock) => upd("slimPaperTopLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PaperSelectionField
                  label="Бумага 2"
                  typeValue={value.slimPaperBottomPaperType}
                  materialValue={value.slimPaperBottomPaperDensity}
                  customValue={value.slimPaperBottomPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    value.slimPaperBottomPaperType,
                    nextDensity,
                    value.slimPaperBottomPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    value.slimPaperBottomPaperType,
                    value.slimPaperBottomPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="slimPaperBottomPaperType"
                  materialFieldName="slimPaperBottomPaperDensity"
                  customFieldName="slimPaperBottomPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashSlimPaperBottomPaperType")}
                  invalidMaterial={isRequired("kashSlimPaperBottomPaperDensity")}
                  invalidCustom={isRequired("kashSlimPaperBottomPaperCustomName")}
                />
                <PaperFinishField value={value.slimPaperBottomFinish} options={paperFinishOptionsForSelection(value.slimPaperBottomPaperType, value.slimPaperBottomPaperDensity)} onChange={(v) => upd("slimPaperBottomFinish", v)} />
                <Field label="Цветность бумаги 2"><select value={value.slimPaperBottomColor} className={selectClass} onChange={(e) => upd("slimPaperBottomColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 2" value={value.slimPaperBottomLamination} onChange={(v: LaminationBlock) => upd("slimPaperBottomLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getLaminationShort(value: LaminationBlock): string {
  return formatLaminationCompact(value);
}

function getKashShortTZ(form: FormData): string {
  if (!form.kashurovka.enabled) return "";
  const value = form.kashurovka;
  if (value.connectionType === "Слим-каширование") {
    const paper1 = [normalizeMaterial(value.slimPaperTop), value.slimPaperTopFinish.toLowerCase(), value.slimPaperTopColor.split(/\s/)[0], getLaminationShort(value.slimPaperTopLamination)].filter(Boolean).join(" ");
    const paper2 = [normalizeMaterial(value.slimPaperBottom), value.slimPaperBottomFinish.toLowerCase(), value.slimPaperBottomColor.split(/\s/)[0], getLaminationShort(value.slimPaperBottomLamination)].filter(Boolean).join(" ");
    return `слим-каширование: бум.1 ${paper1 || "—"}; бум.2 ${paper2 || "—"}`;
  }

  const parts = [
    "каширование",
    value.baseType ? `осн. ${value.baseType}` : "",
    value.linerType ? `лайнер ${[normalizeMaterial(value.linerType), value.linerFinish.toLowerCase(), value.linerColor.split(/\s/)[0], getLaminationShort(value.linerLamination)].filter(Boolean).join(" ")}` : "",
    value.forsacEnabled ? `форзац ${[normalizeMaterial(value.forsacPaper), value.forsacFinish.toLowerCase(), value.forsacColor.split(/\s/)[0], getLaminationShort(value.forsacLamination)].filter(Boolean).join(" ")}` : "",
    value.turnoverType ? value.turnoverType.toLowerCase() : "",
  ].filter(Boolean);

  return parts.join(", ");
}

function ShortTZPanel({ form }: { form: FormData }) {
  const [copied, setCopied] = useState(false);
  const shortText = generateShortTZ(form);
  const [flash, setFlash] = useState(false);
  const prevShort = useRef(shortText);
  const shortLines = shortText ? shortText.split("\n") : [];

  useEffect(() => {
    if (prevShort.current !== shortText && shortText) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevShort.current = shortText;
      return () => clearTimeout(t);
    }
    prevShort.current = shortText;
  }, [shortText]);

  function handleCopy() {
    if (!shortText) return;
    navigator.clipboard.writeText(shortText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${shortText ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50" : "border-slate-200 bg-white"}`}>
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-emerald-100">
        <UiIcon name="flash" className="h-5 w-5 text-emerald-500" />
        <h2 className="text-sm font-semibold text-slate-700">Краткое ТЗ</h2>
        <span className="text-xs text-slate-400 ml-1">— автоматически формируется из данных формы</span>
        {shortText && (
          <button onClick={handleCopy} className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${copied ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"}`}>
            {copied ? <><UiIcon name="check" className="h-4 w-4" />Скопировано!</> : <><UiIcon name="clipboard" className="h-4 w-4" />Копировать</>}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        {shortText ? (
          <>
            <div className={`font-mono text-sm leading-relaxed text-slate-800 select-all rounded-lg px-3 py-2 bg-white border border-emerald-100 transition-all duration-300 whitespace-pre-wrap ${flash ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}>
              {shortLines.map((line, lineIndex) => (
                line === "" ? (
                  <div key={lineIndex} className="h-3" />
                ) : (
                  <div key={lineIndex} className={`${lineIndex > 0 ? "mt-1" : ""} text-slate-700`}>
                    {lineIndex === 0
                      ? line.split(" / ").map((segment, i, arr) => (
                      <span key={i}>
                        <span className="text-slate-800">{segment}</span>
                        {i < arr.length - 1 && <span className="text-emerald-400 font-bold mx-1">/</span>}
                      </span>
                      ))
                      : line}
                  </div>
                )
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shortLines[0]?.split(" / ").map((seg, i) => (
                <span key={`main-${i}`} className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{seg}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic px-3 py-2">Заполните поля формы — краткое ТЗ появится здесь автоматически…</p>
        )}
      </div>
    </div>
  );
}

function AdShortTZPanel({ form }: { form: AdFormData }) {
  const [copied, setCopied] = useState(false);
  const shortText = generateAdShortTZ(form);
  const [flash, setFlash] = useState(false);
  const prevShort = useRef(shortText);
  const shortLines = shortText ? shortText.split("\n") : [];

  useEffect(() => {
    if (prevShort.current !== shortText && shortText) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevShort.current = shortText;
      return () => clearTimeout(t);
    }
    prevShort.current = shortText;
  }, [shortText]);

  function handleCopy() {
    if (!shortText) return;
    navigator.clipboard.writeText(shortText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${shortText ? "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50" : "border-slate-200 bg-white"}`}>
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-orange-100">
        <UiIcon name="flash" className="h-5 w-5 text-orange-500" />
        <h2 className="text-sm font-semibold text-slate-700">Короткое ТЗ</h2>
        <span className="text-xs text-slate-400 ml-1">— автоматически формируется из данных формы</span>
        {shortText && (
          <button onClick={handleCopy} className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${copied ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"}`}>
            {copied ? <><UiIcon name="check" className="h-4 w-4" />Скопировано!</> : <><UiIcon name="clipboard" className="h-4 w-4" />Копировать</>}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        {shortText ? (
          <>
            <div className={`font-mono text-sm leading-relaxed text-slate-800 select-all rounded-lg px-3 py-2 bg-white border border-orange-100 transition-all duration-300 whitespace-pre-wrap ${flash ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
              {shortLines.map((line, lineIndex) => (
                <div key={lineIndex} className={`${lineIndex > 0 ? "mt-1" : ""} text-slate-700`}>
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shortLines.map((line, i) => (
                <span key={`ad-${i}`} className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{line}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic px-3 py-2">Заполните поля формы — короткая реклама появится здесь автоматически…</p>
        )}
      </div>
    </div>
  );
}

function DictEditor({
  title,
  icon,
  items,
  locked = [],
  onChange,
  renderSuffix,
}: {
  title: string;
  icon: string;
  items: string[];
  locked?: string[];
  onChange: (items: string[]) => void;
  renderSuffix?: (item: string) => React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  function add() { const v = input.trim(); if (!v || items.includes(v)) return; onChange([...items, v]); setInput(""); }
  function remove(idx: number) { if (locked.includes(items[idx])) return; onChange(items.filter((_, i) => i !== idx)); }
  function moveUp(idx: number) { if (idx === 0) return; const arr = [...items]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; onChange(arr); }
  function moveDown(idx: number) { if (idx === items.length - 1) return; const arr = [...items]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; onChange(arr); }
  function startEdit(idx: number) { setEditIdx(idx); setEditVal(items[idx]); }
  function commitEdit() { if (editIdx === null) return; const v = editVal.trim(); if (v && !items.some((it, i) => it === v && i !== editIdx)) { const arr = [...items]; arr[editIdx] = v; onChange(arr); } setEditIdx(null); setEditVal(""); }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-2">
        <UiIcon name={DICT_ICON_MAP[icon] || "file"} className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="ml-auto text-xs text-slate-400">{items.length} {"\u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432"}</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            return (
              <div key={`${item}-${idx}`} className="flex items-center gap-1.5 group">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="w-5 h-4 flex items-center justify-center text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(idx)} disabled={idx === items.length - 1} className="w-5 h-4 flex items-center justify-center text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors text-xs leading-none">▼</button>
                </div>
                {editIdx === idx ? (
                  <input autoFocus className="flex-1 rounded-lg border border-blue-400 bg-blue-50 px-2 py-1 text-sm focus:outline-none" value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditIdx(null); }} />
                ) : (
                  <span className="flex-1 text-sm text-slate-700 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 truncate flex items-center gap-2 min-w-0">
                    <span className="truncate">{item}</span>
                    {renderSuffix && renderSuffix(item)}
                    {locked.includes(item) && <span className="ml-auto text-xs text-slate-400 italic">{"\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043e"}</span>}
                  </span>
                )}
                {editIdx === idx ? (
                  <div className="flex gap-1">
                    <button onClick={commitEdit} className="px-2 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">OK</button>
                    <button onClick={() => setEditIdx(null)} className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-xs hover:bg-slate-300 transition-colors">{"\u041e\u0442\u043c\u0435\u043d\u0430"}</button>
                  </div>
                ) : (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(idx)} className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 text-xs hover:bg-amber-100 transition-colors" title={"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c"}>{"\u0420\u0435\u0434."}</button>
                    {!locked.includes(item) && <button onClick={() => remove(idx)} className="px-2 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs hover:bg-red-100 transition-colors" title={"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}>{"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}</button>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <input className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder={"\u041d\u043e\u0432\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
          <button onClick={add} disabled={!input.trim() || items.includes(input.trim())} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400">{"+ \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c"}</button>
        </div>
      </div>
    </div>
  );
}

function ProductTemplateEditor({
  productTypes,
  templates,
  onProductTypesChange,
  onChange,
}: {
  productTypes: string[];
  templates: ProductTemplateStore;
  onProductTypesChange: (next: string[]) => void;
  onChange: (next: ProductTemplateStore) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [renameDraft, setRenameDraft] = useState("");

  const rows = productTypes
    .map((name) => normalizeTemplateName(name))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base", numeric: true }));

  useEffect(() => {
    if (!rows.length) {
      setSelectedName("");
      return;
    }
    if (!selectedName || !rows.includes(selectedName)) {
      setSelectedName(rows[0]);
    }
  }, [rows, selectedName]);

  useEffect(() => {
    if (!showModal) setNewTypeName("");
  }, [showModal]);

  const activeName = selectedName || rows[0] || "";
  const activeTemplate = activeName
    ? templates[activeName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[activeName] || "standard")
    : null;

  useEffect(() => {
    setRenameDraft(activeName);
  }, [activeName]);

  const updateTemplate = (name: string, patch: Partial<ProductTemplateConfig>) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    const current = templates[cleanName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || "standard");
    const mergedFields = patch.fields ? { ...current.fields, ...(patch.fields || {}) } : current.fields;
    const nextTemplate = createProductTemplateConfig(patch.kind || current.kind, {
      ...current,
      ...patch,
      flags: { ...current.flags, ...(patch.flags || {}) },
      fields: mergedFields,
    });
    onChange({ ...templates, [cleanName]: nextTemplate });
  };

  const resetTemplate = (name: string) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    onChange({
      ...templates,
      [cleanName]: createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || "standard"),
    });
  };

  const addProductType = () => {
    const cleanName = normalizeTemplateName(newTypeName);
    if (!cleanName) return;
    if (rows.includes(cleanName)) {
      setSelectedName(cleanName);
      setShowModal(true);
      return;
    }
    onProductTypesChange([...productTypes, cleanName]);
    setSelectedName(cleanName);
    setNewTypeName("");
  };

  const renameProductType = () => {
    const oldName = normalizeTemplateName(activeName);
    const newName = normalizeTemplateName(renameDraft);
    if (!oldName || !newName || oldName === newName) return;
    if (rows.includes(newName)) return;
    const nextTypes = productTypes.map((name) => (normalizeTemplateName(name) === oldName ? newName : name));
    const nextTemplates = { ...templates };
    nextTemplates[newName] = nextTemplates[oldName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[newName] || "standard");
    delete nextTemplates[oldName];
    onProductTypesChange(nextTypes);
    onChange(nextTemplates);
    setSelectedName(newName);
    setRenameDraft(newName);
  };

  const activeFlags = activeTemplate?.flags || DEFAULT_PRODUCT_TEMPLATE_FLAGS.standard;
  const activeFields = activeTemplate?.fields || createProductTemplateConfig(activeTemplate?.kind || "standard").fields;
  const enabledFields = [
    activeFlags.showSize ? activeFields.size.label || "Размер" : null,
    activeFlags.showPaper ? activeFields.paper.label || "Бумага" : null,
    activeFlags.showColor ? activeFields.color.label || "Цветность" : null,
    activeFlags.showLamination ? activeFields.lamination.label || "Ламинация" : null,
    activeFlags.showPostProcessing ? activeFields.postProcessing.label || "Обработка" : null,
  ].filter(Boolean) as string[];
  const layoutMeta = activeTemplate ? PRODUCT_LAYOUT_META[activeTemplate.kind] : PRODUCT_LAYOUT_META.standard;
  const fieldRows: Array<{ key: ProductTemplateFieldKey; title: string; desc: string }> = [
    { key: "size", title: "Размер / формат", desc: "Формат, размер или страницы, которые нужны этому изделию." },
    { key: "paper", title: "Бумага / материал", desc: "Тип бумаги, материал или плотность, если они используются." },
    { key: "color", title: "Цветность", desc: "Красочность и оборот, если это нужно показывать менеджеру." },
    { key: "lamination", title: "Ламинация", desc: "Параметры ламинации для этого типа продукции." },
    { key: "postProcessing", title: "Обработка", desc: "Биговка, фальцовка, перфорация и другие операции." },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 bg-gradient-to-r from-slate-50 to-white px-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
            <UiIcon name="settings" className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-800">Шаблоны продукции</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">
              Отдельное окно для настройки, какие поля показывать у каждого вида изделий. Здесь удобнее править шаблоны, не перегружая справочники.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">{rows.length} шаблонов</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Сохраняется локально на ПК</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">Можно вернуть к стандарту</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Открыть конструктор
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
          <div
            className="relative z-10 flex h-[min(90vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <UiIcon name="settings" className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold">Конструктор шаблонов продукции</div>
                    <div className="mt-1 text-sm text-white/70">
                      Настраиваем внешний вид изделий, чтобы менеджеру показывались только нужные поля.
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Закрыть
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_1fr]">
              <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50/80 lg:border-b-0 lg:border-r">
                <div className="border-b border-slate-200 px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800">Список изделий</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Выберите изделие слева. Справа меняются только настройки выбранного шаблона.
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      {rows.length}
                    </span>
                  </div>
                  <div className="mt-3.5 flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                      placeholder="Новый тип изделия"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addProductType();
                      }}
                    />
                    <button
                      type="button"
                      onClick={addProductType}
                      disabled={!newTypeName.trim()}
                    className="shrink-0 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    + Добавить
                  </button>
                </div>
                  <div className="mt-2 text-[11px] leading-5 text-slate-500">
                    Новый тип сразу появится в списке и получит шаблон по умолчанию.
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                  {rows.map((name) => {
                    const template = templates[name] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[name] || "standard");
                    const kindInfo = PRODUCT_LAYOUT_META[template.kind];
                    const isActive = name === activeName;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedName(name)}
                        className={`mb-2 w-full rounded-2xl border px-3.5 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-800">{name}</div>
                            <div className="mt-0.5 text-xs leading-5 text-slate-500">{kindInfo.title}</div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {template.kind === "standard" ? "base" : "custom"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {!rows.length && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                      Сначала добавьте типы изделий в справочнике, потом здесь можно будет настроить их шаблоны.
                    </div>
                  )}
                </div>
              </aside>

              <section className="min-h-0 overflow-y-auto p-4 sm:p-5">
                {!activeTemplate ? (
                  <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <div className="max-w-md">
                      <div className="text-base font-semibold text-slate-800">Нет доступных шаблонов</div>
                      <div className="mt-2 text-sm leading-6 text-slate-500">
                        Добавьте хотя бы один тип изделия, и справа появятся настройки для его шаблона.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">{activeName}</h3>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              {layoutMeta.title}
                            </span>
                          </div>
                          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{layoutMeta.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => resetTemplate(activeName)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          Сбросить
                        </button>
                      </div>
                      <div className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Включено:</span>{" "}
                        {enabledFields.length ? enabledFields.join(", ") : "ничего не выводится"}
                      </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_0.95fr]">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Название типа</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Здесь можно переименовать тип изделия прямо в справочнике.
                        </div>
                        <div className="mt-3 flex gap-2">
                          <input
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={renameProductType}
                            disabled={!renameDraft.trim() || renameDraft.trim() === activeName}
                            className="rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
                          >
                            Переименовать
                          </button>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Тип конструкции</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Определяет базовую логику шаблона и набор стандартных правил.
                        </div>
                        <select
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
                          value={activeTemplate.kind}
                          onChange={(e) => updateTemplate(activeName, { kind: e.target.value as ProductLayoutKind })}
                        >
                          {PRODUCT_LAYOUT_OPTIONS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-slate-900">Поля и обязательность</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Тут задаётся не только видимость поля, но и является ли оно обязательным для отправки.
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {fieldRows.map((item) => {
                          const visibleKey = ({
                            size: "showSize",
                            paper: "showPaper",
                            color: "showColor",
                            lamination: "showLamination",
                            postProcessing: "showPostProcessing",
                          } as const)[item.key];
                          const fieldConfig = activeFields[item.key] || DEFAULT_PRODUCT_TEMPLATE_FIELDS[item.key];
                          const isVisible = activeTemplate.flags[visibleKey];
                          return (
                            <div key={item.key} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 xl:grid-cols-[1.25fr_1fr_auto_auto] xl:items-center">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                                <div className="mt-0.5 text-xs leading-5 text-slate-500">{item.desc}</div>
                              </div>
                              <input
                                className="min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                                value={fieldConfig.label}
                                onChange={(e) =>
                                  updateTemplate(activeName, {
                                    fields: {
                                      [item.key]: { ...fieldConfig, label: e.target.value },
                                    } as Partial<Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>>,
                                  })
                                }
                              />
                              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  checked={isVisible}
                                  onChange={(e) =>
                                    updateTemplate(activeName, {
                                      flags: { [visibleKey]: e.target.checked } as Partial<ProductTemplateFlags>,
                                    })
                                  }
                                />
                                <span>Показывать</span>
                              </label>
                              <label className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${isVisible ? "border-slate-200 bg-white text-slate-700" : "border-slate-200 bg-slate-100 text-slate-400"}`}>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  checked={fieldConfig.required}
                                  disabled={!isVisible}
                                  onChange={(e) =>
                                    updateTemplate(activeName, {
                                      fields: {
                                        [item.key]: { ...fieldConfig, required: e.target.checked },
                                      } as Partial<Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>>,
                                    })
                                  }
                                />
                                <span>Обязательное</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-900">Подсказка</div>
                        <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                          <p>Это окно заменяет старый блок в справочниках и позволяет не перегружать список настроек.</p>
                          <p>Если поле скрыто, оно автоматически перестаёт быть обязательным.</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Кратко сейчас</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {enabledFields.length ? (
                            enabledFields.map((item) => (
                              <span key={item} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500">Поля скрыты</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LegacyApp() {
  const [dicts, setDicts] = useState<Dicts>(() => createInitialDicts());

  const [sheetName, setSheetName] = useState(() => localStorage.getItem(LS_KEYS.sheetName) || "Печать_2026");

  useEffect(() => { saveList(LS_KEYS.productTypes, dicts.productTypes); }, [dicts.productTypes]);
  useEffect(() => { saveProductTemplates(dicts.productTemplates); }, [dicts.productTemplates]);
  useEffect(() => { saveList(LS_KEYS.paperSizes, dicts.paperSizes); }, [dicts.paperSizes]);
  useEffect(() => { saveList(LS_KEYS.pocketCalendarSizes, dicts.pocketCalendarSizes); }, [dicts.pocketCalendarSizes]);
  useEffect(() => { saveList(LS_KEYS.businessCardSizes, dicts.businessCardSizes); }, [dicts.businessCardSizes]);
  useEffect(() => { saveList(LS_KEYS.envelopeSizes, dicts.envelopeSizes); }, [dicts.envelopeSizes]);
  useEffect(() => { saveList(LS_KEYS.densities, dicts.densities); }, [dicts.densities]);
  useEffect(() => { saveList(LS_KEYS.colors, dicts.colors); }, [dicts.colors]);
  useEffect(() => { saveList(LS_KEYS.postProcessing, dicts.postProcessing); }, [dicts.postProcessing]);
  useEffect(() => { saveList(LS_KEYS.bindingTypes, dicts.bindingTypes); }, [dicts.bindingTypes]);
  useEffect(() => { saveList(LS_KEYS.laminationKinds, dicts.laminationKinds); }, [dicts.laminationKinds]);
  useEffect(() => { saveList(LS_KEYS.laminationThickness, dicts.laminationThickness); }, [dicts.laminationThickness]);
  useEffect(() => { saveList(LS_KEYS.managers, dicts.managers); }, [dicts.managers]);
  useEffect(() => { saveList(LS_KEYS.adManagers, dicts.adManagers); }, [dicts.adManagers]);
  useEffect(() => { saveManagerMarkerState({ managerMarkers: dicts.managerMarkers, managerMarkerCounter: dicts.managerMarkerCounter }); }, [dicts.managerMarkers, dicts.managerMarkerCounter]);
  useEffect(() => { savePaperProfiles(dicts.paperProfiles); }, [dicts.paperProfiles]);
  useEffect(() => { savePaperLibrary(dicts.paperLibrary); }, [dicts.paperLibrary]);
  useEffect(() => { runtimeProductTemplates = dicts.productTemplates; }, [dicts.productTemplates]);
  useEffect(() => { localStorage.setItem(LS_KEYS.sheetName, sheetName); }, [sheetName]);

  useEffect(() => {
    let cancelled = false;

    async function loadClientStore() {
      const result = await (window as any).electronAPI?.loadClientStore?.();
      if (cancelled) return;
      if (result?.success && result.store) {
        setClientStore(result.store);
      } else {
        setClientStore(createEmptyClientStore());
      }
    }

    loadClientStore();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPresetStore() {
      const result = await (window as any).electronAPI?.loadPresetStore?.();
      if (cancelled) return;
      if (result?.success && result.store) {
        setPresetStore(result.store);
      } else {
        setPresetStore(createEmptyPresetStore());
      }
    }

    loadPresetStore();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = (window as any).electronAPI?.onUpdateStatus?.((payload: UpdateState | null) => {
      if (!payload || payload.status === "idle") {
        setUpdateState(null);
        return;
      }
      setUpdateState(payload);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    const shownVersion = localStorage.getItem(LS_KEYS.updateSummaryVersion) || "";
    if (shownVersion !== APP_VERSION) {
      setShowUpdateSummaryModal(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapCloudDicts() {
      setDictSyncBusy("loading");
      const result = await (window as any).electronAPI?.loadConfigSheet?.();
      if (cancelled) return;

      if (result?.success && result.hasConfig && result.config) {
        const cloudDicts = normalizeDictsPayload(result.config);
        setDicts(cloudDicts);
        setDictSource("cloud");
        setDictSyncMsg(null);
      } else if (result?.success && !result.hasConfig) {
        setDictSource("local");
        setDictSyncMsg("На листе __CONFIG__ пока нет сохранённой базы справочников.");
      } else if (result && !result.success) {
        setDictSource("local");
        setDictSyncMsg(`Не удалось загрузить справочники из Google Таблицы: ${result.error}`);
      }

      setDictSyncBusy("idle");
    }

    bootstrapCloudDicts();
    return () => { cancelled = true; };
  }, []);

  function updateDict<K extends keyof Dicts>(key: K, val: string[]) {
    setDicts((prev) => {
      const next = { ...prev, [key]: val } as Dicts;
      if (key === "productTypes") {
        next.productTemplates = syncProductTemplatesToTypes(prev.productTemplates, val);
      }
      return next;
    });
  }

  function updateManagers(nextManagers: string[]) {
    setDicts((prev) => {
      const normalizedManagers = normalizeStringList(nextManagers);
      const nextState = normalizeManagerMarkerState(normalizedManagers, prev.managers, prev.managerMarkers, prev.managerMarkerCounter);
      return {
        ...prev,
        managers: normalizedManagers,
        managerMarkers: nextState.managerMarkers,
        managerMarkerCounter: nextState.managerMarkerCounter,
      };
    });
  }

  function updateAdManagers(nextManagers: string[]) {
    setDicts((prev) => ({
      ...prev,
      adManagers: normalizeStringList(nextManagers),
    }));
  }

  function updatePaperLibrary(key: PaperLibraryKey, val: string[]) {
    setDicts((prev) => ({ ...prev, paperLibrary: { ...prev.paperLibrary, [key]: val } }));
  }

  function updateProductTemplate(name: string, patch: Partial<ProductTemplateConfig>) {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    setDicts((prev) => {
      const current = prev.productTemplates[cleanName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || "standard");
      const nextTemplate = createProductTemplateConfig(patch.kind || current.kind, {
        ...current,
        ...patch,
        flags: { ...current.flags, ...(patch.flags || {}) },
      });
      return {
        ...prev,
        productTemplates: {
          ...prev.productTemplates,
          [cleanName]: nextTemplate,
        },
      };
    });
  }

  async function rememberClientIfNeeded() {
    const clientName = normalizeClientName(form.clientName);
    const managerName = normalizeManagerName(form.managerName);
    if (!clientName || !managerName) return;

    const result = await (window as any).electronAPI?.saveClientEntry?.({ managerName, clientName });
    if (result?.success && result.store) {
      setClientStore(result.store);
    }
  }

  function buildPresetDefaultName() {
    const quantity = form.quantity.trim() ? formatQuantityText(form.quantity) : "";
    const product = resolveProductName(form);
    const parts = [quantity, product].filter(Boolean);
    return parts.join(" ").trim() || "Новый пресет";
  }

  function openPresetSaveModal() {
    setPresetNameDraft(buildPresetDefaultName());
    setPresetMsg(null);
    setPresetSaveStatus("idle");
    setShowPresetSaveModal(true);
  }

  async function saveCurrentPreset() {
    try {
      const presetName = presetNameDraft.trim();
      if (!presetName) {
        setPresetMsg("Введите название пресета.");
        setPresetSaveStatus("error");
        return;
      }

      setPresetSaveStatus("saving");
      const presetData = buildPresetPayload(form);
      const result = await (window as any).electronAPI?.savePresetEntry?.({
        managerName: form.managerName,
        presetName,
        presetData,
      });

      if (!result?.success || !result.store) {
        setPresetMsg(result?.error ? `Не удалось сохранить пресет: ${result.error}` : "Не удалось сохранить пресет.");
        setPresetSaveStatus("error");
        return;
      }

      setPresetStore(result.store);
      const savedPreset = Object.values(result.store.byManager || {})
        .flat()
        .find((preset: PresetEntry) => preset.name.toLowerCase() === presetName.toLowerCase());
      setSelectedPresetId(savedPreset?.id || "");
      setPresetSearchDraft(savedPreset?.name || presetName);
      setPresetNameDraft("");
      setPresetMsg(`Пресет "${presetName}" сохранён.`);
      setPresetSaveStatus("success");
    } catch (error) {
      setPresetMsg(error instanceof Error ? `Не удалось сохранить пресет: ${error.message}` : "Не удалось сохранить пресет.");
      setPresetSaveStatus("error");
    }
  }

  function clearReservation() {
    setReservedAssignment(null);
    setReserveState("idle");
    setReserveMsg(null);
  }

  async function handleReserveAssignment() {
    try {
      const isAdsTab = activeTab === "ads";
      const currentForm = isAdsTab ? adForm : form;
      const managerName = currentForm.managerName.trim();

      if (!managerName) {
        setReserveState("error");
        setReserveMsg("Сначала выберите менеджера.");
        return;
      }

      const managerMarker = isAdsTab
        ? normalizeManagerName(managerName)
        : (dicts.managerMarkers[normalizeManagerName(managerName)] || "");
      if (!managerMarker) {
        setReserveState("error");
        setReserveMsg("У выбранного менеджера не назначен маркер.");
        return;
      }

      setReserveState("saving");
      setReserveMsg(null);

      const result = await (window as any).electronAPI?.reserveRow?.({
        kind: isAdsTab ? "ads" : "form",
        formData: isAdsTab ? undefined : form,
        adData: isAdsTab ? adForm : undefined,
        sheetName,
        managerMarker,
        reservedRowNumber: reservedAssignment?.rowNumber || 0,
      });

      if (!result?.success) {
        setReserveState("error");
        setReserveMsg(result?.error ? `Не удалось присвоить номер: ${result.error}` : "Не удалось присвоить номер.");
        return;
      }

      const nextOrderNumber = String(result.orderNumber || "").trim();
      if (isAdsTab) {
        setAdForm((prev) => ({ ...prev, orderNumber: nextOrderNumber || prev.orderNumber }));
      } else {
        setForm((prev) => ({ ...prev, orderNumber: nextOrderNumber || prev.orderNumber }));
      }
      setReservedAssignment({
        rowNumber: Number(result.rowNumber) || 0,
        orderNumber: nextOrderNumber,
        managerMarker,
        sheetName,
      });
      setReserveState("success");
      setReserveMsg(`Номер ${nextOrderNumber || "—"} присвоен. Строка № ${result.rowNumber} зарезервирована.`);
    } catch (error) {
      setReserveState("error");
      setReserveMsg(error instanceof Error ? `Не удалось присвоить номер: ${error.message}` : "Не удалось присвоить номер.");
    }
  }

  function applyPreset(presetId: string) {
    setSelectedPresetId(presetId);
    if (!presetId) return;

    const preset = availablePresets.find((item) => item.id === presetId);
    if (!preset) return;
    setPresetSearchDraft(preset.name);

    setForm((prev) => ({
      ...mergePresetIntoForm(createDefaultForm(), preset.data),
      orderNumber: "",
      clientName: prev.clientName,
      managerName: prev.managerName,
      deadline: prev.deadline,
      deadlineTime: prev.deadlineTime,
      cellBooking: prev.cellBooking,
      fileLink: prev.fileLink,
    }));
    clearReservation();
    setShowValidation(false);
    setSavedMsg(null);
  }

  async function loadDictsFromCloud(manual = false) {
    setDictSyncBusy("loading");
    const result = await (window as any).electronAPI?.loadConfigSheet?.();

    if (result?.success && result.hasConfig && result.config) {
      const cloudDicts = normalizeDictsPayload(result.config);
      setDicts(cloudDicts);
      setDictSource("cloud");
      setDictSyncMsg(null);
    } else if (result?.success && !result.hasConfig) {
      setDictSource("local");
      setDictSyncMsg("На листе __CONFIG__ ещё нет сохранённых справочников.");
    } else if (result && !result.success) {
      setDictSource("local");
      setDictSyncMsg(`Ошибка загрузки справочников: ${result.error}`);
    } else if (manual) {
      setDictSource("local");
      setDictSyncMsg("Не удалось получить данные из Google Таблицы.");
    }

    setDictSyncBusy("idle");
  }

  async function saveDictsToCloud() {
    setDictSyncBusy("saving");
    const normalizedDicts = normalizeDictsPayload(dicts);
    const result = await (window as any).electronAPI?.saveConfigSheet?.({ config: normalizedDicts, appVersion: APP_VERSION });
    if (result?.success) {
      setDicts(normalizedDicts);
      setDictSource("cloud");
      setDictSyncMsg(`Справочники сохранены в Google Таблицу. Обновлено: ${new Date(result.updatedAt).toLocaleString("ru-RU")}`);
    } else {
      setDictSource("local");
      setDictSyncMsg(`Ошибка сохранения справочников: ${result?.error || "неизвестная ошибка"}`);
    }
    setDictSyncBusy("idle");
  }

  function resetDicts() {
    if (confirm("Сбросить все справочники к значениям по умолчанию?")) {
      setDicts(createResetDicts());
    }
  }

  const [form, setForm] = useState<FormData>(() => createDefaultForm());
  const [adForm, setAdForm] = useState<AdFormData>(() => createDefaultAdForm());
  const [clientStore, setClientStore] = useState<ClientStore>(() => createEmptyClientStore());
  const [presetStore, setPresetStore] = useState<PresetStore>(() => createEmptyPresetStore());
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [presetMsg, setPresetMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "ads" | "dicts">("form");
  const [showValidation, setShowValidation] = useState(false);
  const [showAdValidation, setShowAdValidation] = useState(false);
  
  const [isDictLocked, setIsDictLocked] = useState(true);
  const [dictPassword, setDictPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dictSectionQuery, setDictSectionQuery] = useState("");
  const [dictSyncMsg, setDictSyncMsg] = useState<string | null>(null);
  const [dictSyncBusy, setDictSyncBusy] = useState<"idle" | "loading" | "saving">("idle");
  const [dictSource, setDictSource] = useState<"unknown" | "cloud" | "local">("unknown");

  const [showPreview, setShowPreview] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCellBookingModal, setShowCellBookingModal] = useState(false);
  const [showPresetSaveModal, setShowPresetSaveModal] = useState(false);
  const [showUpdateSummaryModal, setShowUpdateSummaryModal] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [sendAutoSaveMsg, setSendAutoSaveMsg] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [updateState, setUpdateState] = useState<UpdateState | null>(null);
  const [cellBookingDraftCount, setCellBookingDraftCount] = useState("");
  const [presetNameDraft, setPresetNameDraft] = useState("");
  const [presetSearchDraft, setPresetSearchDraft] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [presetSaveStatus, setPresetSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [reservedAssignment, setReservedAssignment] = useState<ReservedAssignment | null>(null);
  const [reserveState, setReserveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [reserveMsg, setReserveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!reservedAssignment) return;
    if (reservedAssignment.sheetName === sheetName) return;
    setForm((prev) => ({ ...prev, orderNumber: "" }));
    clearReservation();
  }, [sheetName, reservedAssignment]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value } as FormData;
      if (key === "managerName") {
        next.orderNumber = "";
      }
      return next;
    });
    if (key === "managerName") {
      setReservedAssignment(null);
      setReserveState("idle");
      setReserveMsg(null);
    }
  }

  function updateAd<K extends keyof AdFormData>(key: K, value: AdFormData[K]) {
    setAdForm((prev) => {
      const next = { ...prev, [key]: value } as AdFormData;
      if (key === "managerName") {
        next.orderNumber = "";
      }
      return next;
    });
    if (key === "managerName") {
      setReservedAssignment(null);
      setReserveState("idle");
      setReserveMsg(null);
    }
  }

  useEffect(() => {
    if (!dicts.adManagers.length) return;
    if (dicts.adManagers.includes(adForm.managerName)) return;
    setAdForm((prev) => ({ ...prev, managerName: dicts.adManagers[0] || DEFAULT_AD_MANAGERS[0] || "Оля" }));
  }, [dicts.adManagers, adForm.managerName]);

  function updateSubcontractWork(id: string, patch: Partial<SubcontractWork>) {
    setForm((prev) => ({
      ...prev,
      subcontractWorks: prev.subcontractWorks.map((work) => (work.id === id ? { ...work, ...patch } : work)),
    }));
  }

  function addSubcontractWork() {
    setForm((prev) => ({ ...prev, subcontractWorks: [...prev.subcontractWorks, createSubcontractWork()] }));
  }

  function removeSubcontractWork(id: string) {
    setForm((prev) => ({ ...prev, subcontractWorks: prev.subcontractWorks.filter((work) => work.id !== id) }));
  }

  function openCellBookingModal() {
    setCellBookingDraftCount(form.cellBooking);
    setShowCellBookingModal(true);
  }

  function saveCellBookingModal() {
    setForm((prev) => ({ ...prev, cellBooking: cellBookingDraftCount.replace(/[^\d]/g, "") }));
    setShowCellBookingModal(false);
  }

  const availablePresets = Object.entries(presetStore.byManager || {}).flatMap(([managerName, presets]) =>
    presets.map((preset) => ({ ...preset, managerName }))
  );

  useEffect(() => {
    if (!selectedPresetId) return;
    if (!availablePresets.some((preset) => preset.id === selectedPresetId)) {
      setSelectedPresetId("");
    }
  }, [availablePresets, selectedPresetId]);

  const required = getRequiredFields(form);
  const requiredLabels = required.map((field) => {
    if (field === "deadlineTime" && isDeadlineTimeInPast(form.deadline, form.deadlineTime)) {
      return "Нельзя указывать прошедшее время сдачи";
    }
    if (field === "subcontractTimePast") {
      return "Нельзя указывать прошедшее время подряда";
    }
    return REQUIRED_FIELD_LABELS[field] ?? field;
  });
  const adRequired = getRequiredAdFields(adForm);
  const adRequiredLabels = adRequired.map((field) => REQUIRED_FIELD_LABELS[field] ?? field);
  const todayIso = getTodayLocalIso();
  const springSuggestion = form.bindingType === "Пружина" ? buildSpringSuggestion(form) : null;
  const springDiameterIsCustomOrder = springSuggestion ? parseWeight(springSuggestion.diameter) > 16 : false;
  const missingFileLink = !form.fileLink.trim();
  const adMissingFileLink = !adForm.fileLink.trim();
  const dictSections = [
    {
      key: "managers",
      title: "Менеджеры",
      icon: "👤",
      element: (
        <DictEditor
          title="Менеджеры"
          icon="👤"
          items={dicts.managers}
          renderSuffix={(item) => {
            const marker = dicts.managerMarkers[normalizeManagerName(item)] || "";
            return marker ? <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">{marker}</span> : null;
          }}
          onChange={updateManagers}
        />
      ),
    },
    {
      key: "adManagers",
      title: "Менеджеры рекламы",
      icon: "📣",
      element: (
        <DictEditor
          title="Менеджеры рекламы"
          icon="📣"
          items={dicts.adManagers}
          onChange={updateAdManagers}
        />
      ),
    },
    { key: "productTypes", title: "Типы изделий", icon: "🖨", element: <DictEditor title="Типы изделий" icon="🖨" items={dicts.productTypes} locked={["Другое..."]} onChange={(v) => updateDict("productTypes", v)} /> },
    { key: "productTemplates", title: "Шаблоны продукции", icon: "⚙️", element: <ProductTemplateEditor productTypes={dicts.productTypes} templates={dicts.productTemplates} onProductTypesChange={(next) => updateDict("productTypes", next)} onChange={(next) => setDicts((prev) => ({ ...prev, productTemplates: next }))} /> },
    { key: "paperSizes", title: "Форматы бумаги", icon: "📄", element: <DictEditor title="Форматы бумаги" icon="📄" items={dicts.paperSizes} locked={["Нестандартный"]} onChange={(v) => updateDict("paperSizes", v)} /> },
    { key: "pocketCalendarSizes", title: "Форматы карманных календарей", icon: "📅", element: <DictEditor title="Форматы карманных календарей" icon="📅" items={dicts.pocketCalendarSizes} locked={["70×100", "Нестандартный"]} onChange={(v) => updateDict("pocketCalendarSizes", v)} /> },
    { key: "businessCardSizes", title: "Форматы визиток", icon: "🪪", element: <DictEditor title="Форматы визиток" icon="🪪" items={dicts.businessCardSizes} locked={["Нестандартный"]} onChange={(v) => updateDict("businessCardSizes", v)} /> },
    { key: "paperLibrary-coated", title: "Бумага: мелованная", icon: "📄", element: <DictEditor title="Бумага: мелованная" icon="📄" items={dicts.paperLibrary.coated} onChange={(v) => updatePaperLibrary("coated", v)} /> },
    { key: "paperLibrary-offset", title: "Бумага: офсетная", icon: "📄", element: <DictEditor title="Бумага: офсетная" icon="📄" items={dicts.paperLibrary.offset} onChange={(v) => updatePaperLibrary("offset", v)} /> },
    { key: "paperLibrary-calender", title: "Бумага: каландр", icon: "📄", element: <DictEditor title="Бумага: каландр" icon="📄" items={dicts.paperLibrary.calender} onChange={(v) => updatePaperLibrary("calender", v)} /> },
    { key: "paperLibrary-cardboard", title: "Плотность картона", icon: "🟫", element: <DictEditor title="Плотность картона" icon="🟫" items={dicts.paperLibrary.cardboard} locked={["270 г/м²"]} onChange={(v) => updatePaperLibrary("cardboard", v)} /> },
    { key: "paperLibrary-designer", title: "Бумага: дизайнерская", icon: "✏️", element: <DictEditor title="Бумага: дизайнерская" icon="✏️" items={dicts.paperLibrary.designer} onChange={(v) => updatePaperLibrary("designer", v)} /> },
    { key: "envelopeSizes", title: "Форматы конвертов", icon: "✉️", element: <DictEditor title="Форматы конвертов" icon="✉️" items={dicts.envelopeSizes} locked={["Нестандартный"]} onChange={(v) => updateDict("envelopeSizes", v)} /> },
    { key: "colors", title: "Цветность / красочность", icon: "🎨", element: <DictEditor title="Цветность / красочность" icon="🎨" items={dicts.colors} onChange={(v) => updateDict("colors", v)} /> },
    { key: "postProcessing", title: "Послепечатная обработка", icon: "✂️", element: <DictEditor title="Послепечатная обработка" icon="✂️" items={dicts.postProcessing} onChange={(v) => updateDict("postProcessing", v)} /> },
    { key: "bindingTypes", title: "Типы сшивки / переплёта", icon: "📚", element: <DictEditor title="Типы сшивки / переплёта" icon="📚" items={dicts.bindingTypes} onChange={(v) => updateDict("bindingTypes", v)} /> },
    { key: "laminationKinds", title: "Виды ламинации", icon: "✨", element: <DictEditor title="Виды ламинации" icon="✨" items={dicts.laminationKinds} onChange={(v) => updateDict("laminationKinds", v)} /> },
    { key: "laminationThickness", title: "Толщина ламинации", icon: "📏", element: <DictEditor title="Толщина ламинации" icon="📏" items={dicts.laminationThickness} onChange={(v) => updateDict("laminationThickness", v)} /> },
    ...(Object.keys(PAPER_PROFILE_LABELS) as PaperProfileKey[]).map((key) => ({
      key,
      title: PAPER_PROFILE_LABELS[key],
      icon: "📚",
      element: <DictEditor key={key} title={PAPER_PROFILE_LABELS[key]} icon="📚" items={dicts.paperProfiles[key]} onChange={(v) => setDicts((prev) => ({ ...prev, paperProfiles: { ...prev.paperProfiles, [key]: v } }))} />
    }))
  ];
  const filteredDictSections = dictSections.filter((section) => section.title.toLowerCase().includes(dictSectionQuery.trim().toLowerCase()));

  function focusFirstInvalidField(fields: string[]) {
    const first = fields[0];
    if (!first) return;
    const element = document.querySelector(`[data-field="${first}"]`) as HTMLElement | null;
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      window.setTimeout(() => element.focus(), 180);
    }
  }

  useEffect(() => {
    const suggestion = buildSpringSuggestion(form);
    if (suggestion && form.bindingType === "Пружина" && form.springDiameter !== suggestion.diameter) {
      setForm((prev) => ({ ...prev, springDiameter: suggestion.diameter }));
    }
  }, [form.productType, form.bindingType, form.pageCount, form.blockPages, form.density, form.densityFinish, form.blockDensity, form.blockFinish, form.coverDensity, form.coverFinish, form.coverUseKash, form.kashurovka.linerType, form.kashurovka.linerFinish, form.springDiameter]);

  useEffect(() => {
    const next: Partial<FormData> = {};
    if (isCoated115Paper(form.paperType, form.density) && form.densityFinish !== "Матовая") next.densityFinish = "Матовая";
    if (isCoated115Paper(form.coverPaperType, form.coverDensity) && form.coverFinish !== "Матовая") next.coverFinish = "Матовая";
    if (isCoated115Paper(form.blockPaperType, form.blockDensity) && form.blockFinish !== "Матовая") next.blockFinish = "Матовая";
    if (isCoated115Paper(form.calendarHeaderPaperType, form.calendarHeaderPaperDensity) && form.calendarHeaderPaperFinish !== "Матовая") next.calendarHeaderPaperFinish = "Матовая";
    if (Object.keys(next).length > 0) {
      setForm((prev) => ({ ...prev, ...next }));
    }
  }, [
    form.paperType,
    form.density,
    form.densityFinish,
    form.coverPaperType,
    form.coverDensity,
    form.coverFinish,
    form.blockPaperType,
    form.blockDensity,
    form.blockFinish,
    form.calendarHeaderPaperType,
    form.calendarHeaderPaperDensity,
    form.calendarHeaderPaperFinish,
  ]);

  useEffect(() => {
    if (showValidation && required.length === 0) setShowValidation(false);
  }, [required.length, showValidation]);

  useEffect(() => {
    const invalidClasses = ["border-red-500", "bg-red-50", "ring-2", "ring-red-200", "shadow-sm", "shadow-red-100"];
    const marked = Array.from(document.querySelectorAll<HTMLElement>("[data-field]"));

    marked.forEach((element) => {
      element.classList.remove(...invalidClasses);
    });

    if (!showValidation) return;

    required.forEach((field) => {
      const element = document.querySelector<HTMLElement>(`[data-field="${field}"]`);
      if (element) element.classList.add(...invalidClasses);
    });
  }, [showValidation, required]);

  useEffect(() => {
    const invalidClasses = ["border-red-500", "bg-red-50", "ring-2", "ring-red-200", "shadow-sm", "shadow-red-100"];
    if (!showAdValidation) return;

    adRequired.forEach((field) => {
      const element = document.querySelector<HTMLElement>(`[data-field="${field}"]`);
      if (element) element.classList.add(...invalidClasses);
    });
  }, [showAdValidation, adRequired]);

  function validateThen(action: () => void) {
    if (required.length > 0) {
      setShowValidation(true);
      focusFirstInvalidField(required);
      return;
    }
    action();
  }

  function validateAdsThen(action: () => void) {
    if (adRequired.length > 0) {
      setShowAdValidation(true);
      focusFirstInvalidField(adRequired);
      return;
    }
    action();
  }

  function togglePostProcessing(item: string) {
    setForm((prev) => ({
      ...prev,
      postProcessing: prev.postProcessing.includes(item)
        ? prev.postProcessing.filter((x) => x !== item)
        : [...prev.postProcessing, item],
      drillingDiameter: prev.postProcessing.includes("Сверление отверстий") && item === "Сверление отверстий"
        ? ""
        : prev.drillingDiameter,
    }));
  }

  function handlePreview() {
    const n = parseInt(localStorage.getItem("tz_counter") || "0") + 1;
    const nextText = generateTZ(form, n);
    setPreviewText(nextText);
    setShowPreview(false);
    window.setTimeout(() => setShowPreview(true), 0);
  }

  async function saveTzFile(targetForm: FormData) {
    const n = getTZNumber();
    const text = generateTZ(targetForm, n);
    const orderTag = targetForm.orderNumber.trim()
      ? targetForm.orderNumber.trim()
      : (targetForm.clientName.trim() || `TZ-${String(n).padStart(4, "0")}`);
    const safeOrderTag = orderTag.replace(/[/:*?"<>|]/g, "_");
    const filename = `TZ-${safeOrderTag} от ${getCurrentDateTimeForFilename()}.txt`;
    const result = await (window as any).electronAPI?.saveTxt?.({
      text,
      filename,
      preferredDir: targetForm.fileLink,
    });
    return { ...result, filename };
  }

  function handleReset() {
    setShowResetConfirm(true);
  }

  function confirmReset() {
    if (activeTab === "ads") {
      setAdForm(createDefaultAdForm());
      setShowAdValidation(false);
    } else {
      setForm(createDefaultForm());
      setShowValidation(false);
      clearReservation();
    }
    setSavedMsg(null);
    setPresetMsg(null);
    setSelectedPresetId("");
    setPresetSearchDraft("");
    setShowResetConfirm(false);
  }

  async function handleDownloadUpdate() {
    setUpdateState((prev) => (prev ? { ...prev, status: "downloading" } : prev));
    const result = await (window as any).electronAPI?.downloadUpdate?.();
    if (result && !result.success) {
      setUpdateState({ status: "error", error: result.error || "Не удалось скачать обновление" });
    }
  }

  async function handleInstallUpdate() {
    await (window as any).electronAPI?.installUpdate?.();
  }

  function closeUpdateNotice() {
    setUpdateState(null);
  }

  function closeUpdateSummaryModal() {
    localStorage.setItem(LS_KEYS.updateSummaryVersion, APP_VERSION);
    setShowUpdateSummaryModal(false);
  }

  async function handleRealSend() {
    setSendState("loading");
    setSendAutoSaveMsg("");
    try {
      const isAdsTab = activeTab === "ads";
      const result = await (window as any).electronAPI.sendToSheet(
        isAdsTab
          ? {
              kind: "ads",
              adData: adForm,
              shortTz: generateAdShortTZ(adForm),
              sheetName: sheetName,
              managerMarker: normalizeManagerName(adForm.managerName),
              reservedRowNumber: reservedAssignment?.rowNumber || 0,
              reservedManagerMarker: reservedAssignment?.managerMarker || normalizeManagerName(adForm.managerName),
              reservedSheetName: reservedAssignment?.sheetName || "",
            }
          : {
              formData: form,
              shortTz: generateShortTZ(form),
              sheetName: sheetName,
              managerMarker: dicts.managerMarkers[normalizeManagerName(form.managerName)] || "",
              reservedRowNumber: reservedAssignment?.rowNumber || 0,
              reservedManagerMarker: reservedAssignment?.managerMarker || "",
              reservedSheetName: reservedAssignment?.sheetName || "",
            },
      );
      if (result.success) {
        if (isAdsTab) {
          setAdForm((prev) => ({
            ...prev,
            orderNumber: result.orderNumber,
            fileLink: "",
            fileCount: "",
            notes: "",
          }));
          clearReservation();
        } else {
          const nextOrderNumber = result.orderNumber || form.orderNumber;
          const nextForm = { ...form, orderNumber: nextOrderNumber };
          update("orderNumber", nextOrderNumber);
          await rememberClientIfNeeded();
          const saveResult = await saveTzFile(nextForm);
          if (saveResult?.success) {
            const saveText = saveResult.autoSaved
              ? `ТЗ автоматически сохранено в папку заказа: ${saveResult.filePath}`
              : `ТЗ автоматически сохранено: ${saveResult.filePath || saveResult.filename}`;
            setSavedMsg(saveText);
            setSendAutoSaveMsg(saveText);
          } else {
            const errorText = saveResult?.error ? `Заявка отправлена, но ТЗ не сохранилось: ${saveResult.error}` : "Заявка отправлена, но ТЗ не сохранилось";
            setSavedMsg(errorText);
            setSendAutoSaveMsg(errorText);
          }
          setTimeout(() => setSavedMsg(null), 5000);
          update("cellBooking", "");
          clearReservation();
        }
        setSendState("done");
      } else {
        console.error(result.error);
        setSendState("error");
        setSendAutoSaveMsg("");
      }
    } catch (e) {
      setSendState("error");
      setSendAutoSaveMsg("");
    }
  }

  const pt = form.productType;
  const multiBlock = isMultiBlock(pt);
  const calendar = isCalendar(pt);
  const notebook = isNotebook(pt);
  const envelope = isEnvelope(pt);
  const bag = isBag(pt);
  const sticker = isSticker(pt);
  const brochure = isBrochure(pt);
  const wobbler = pt === "Воблеры";
  const badge = pt === "Бейджи";
  const templateFlags = getProductTemplate(pt).flags;
  const templateSizeLabel = getProductTemplateFieldLabel(pt, "size");
  const templatePaperLabel = getProductTemplateFieldLabel(pt, "paper");
  const templateColorLabel = getProductTemplateFieldLabel(pt, "color");
  const templateLaminationLabel = getProductTemplateFieldLabel(pt, "lamination");
  const templatePostProcessingLabel = getProductTemplateFieldLabel(pt, "postProcessing");
  const deskCalendarBigovkaActive = calendar && form.calendarKind === "Настольный" && !!form.calendarBaseBigovkaLines && form.calendarBaseBigovkaLines !== "0";
  const clientSuggestionItems = getClientSuggestions(clientStore, form.managerName);

  const isFormValid = required.length === 0;
  const isAdFormValid = adRequired.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col">
      <UpdateNotice
        state={updateState}
        onDownload={handleDownloadUpdate}
        onInstall={handleInstallUpdate}
        onClose={closeUpdateNotice}
      />
      {showUpdateSummaryModal && (
        <UpdateSummaryModal version={APP_VERSION} onClose={closeUpdateSummaryModal} />
      )}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow">
            <UiIcon name="file" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-none">ТЗ Оскар-Принт</h1>
            <p className="text-xs text-slate-500">
              Формирование технического задания
              <span className="ml-2 text-[10px] text-slate-400">v{APP_VERSION}</span>
            </p>
          </div>
          <div className="ml-auto flex gap-2"><button onClick={handleReset} className="text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">Очистить</button></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 mt-4">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-3">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-200 w-fit">
            <button onClick={() => setActiveTab("form")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "form" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}><UiIcon name="clipboard" className="h-4 w-4" />Форма ТЗ</button>
            <button onClick={() => setActiveTab("ads")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "ads" ? "bg-orange-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}><UiIcon name="flash" className="h-4 w-4" />Реклама</button>
            <button onClick={() => setActiveTab("dicts")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "dicts" ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}><UiIcon name="settings" className="h-4 w-4" />Справочники</button>
          </div>
          {activeTab === "form" && (
            <div className="w-full lg:flex-1 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-slate-200 min-w-0">
              <div className="flex items-center gap-3 w-full">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide whitespace-nowrap">Пресет</label>
                <div className="min-w-0 flex-1 w-full">
                  <input
                    value={presetSearchDraft}
                    list="presetSuggestions"
                    autoComplete="off"
                    className={`${inputClass} min-w-0 w-full`}
                    placeholder={availablePresets.length > 0 ? "Начните вводить название пресета" : "Пока нет сохранённых пресетов"}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setPresetSearchDraft(nextValue);
                      const trimmed = nextValue.trim().toLowerCase();
                      if (!trimmed) {
                        setSelectedPresetId("");
                        return;
                      }
                      const exactPreset = availablePresets.find((preset) => preset.name.trim().toLowerCase() === trimmed);
                      if (exactPreset) applyPreset(exactPreset.id);
                      else setSelectedPresetId("");
                    }}
                    disabled={availablePresets.length === 0}
                  />
                  <datalist id="presetSuggestions">
                    {availablePresets.map((preset) => (
                      <option key={preset.id} value={preset.name} label={preset.managerName ? `${preset.name} · ${preset.managerName}` : preset.name} />
                    ))}
                  </datalist>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Подсказки фильтруются автоматически по введённым буквам.</p>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 py-4 flex-1">
        {dictSource === "local" && dictSyncBusy === "idle" && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Локально
          </div>
        )}
        {activeTab === "form" && showValidation && required.length > 0 && <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm font-medium"><div>Заполните обязательные поля.</div><div className="mt-1 text-xs text-red-600">{requiredLabels.join(", ")}</div></div>}
        {activeTab === "ads" && showAdValidation && adRequired.length > 0 && <div className="mb-4 bg-orange-50 border border-orange-300 text-orange-700 rounded-xl px-4 py-3 text-sm font-medium"><div>Заполните обязательные поля.</div><div className="mt-1 text-xs text-orange-600">{adRequiredLabels.join(", ")}</div></div>}

        {activeTab === "form" && (
          <div className="space-y-4">
            <Section title="🗂 Реквизиты заказа">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Заказчик" required>
                  <input
                    data-field="clientName"
                    type="text"
                    list="clientNameSuggestions"
                    autoComplete="off"
                    className={fieldClass(showValidation && required.includes("clientName"))}
                    placeholder="ООО «Название» или ФИО"
                    value={form.clientName}
                    onChange={(e) => update("clientName", e.target.value)}
                  />
                  <datalist id="clientNameSuggestions">
                    {clientSuggestionItems.map((client) => <option key={client} value={client} />)}
                  </datalist>
                  <p className="text-[11px] text-slate-400">Подсказки берутся из локального списка на этом ПК.</p>
                </Field>
                <Field label="Менеджер" required>
                  <select data-field="managerName" className={selectFieldClass(showValidation && required.includes("managerName"))} value={form.managerName} onChange={(e) => update("managerName", e.target.value)}>
                    <option value="">— выберите —</option>
                    {dicts.managers.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Номер заказа">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className={inputClass + " bg-yellow-50 font-bold flex-1 min-w-0"}
                        placeholder="подставится автоматически"
                        value={form.orderNumber}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleReserveAssignment}
                        disabled={reserveState === "saving"}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
                          reserveState === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        } ${reserveState === "saving" ? "opacity-70 cursor-wait" : ""}`}
                      >
                        {reserveState === "saving" ? "Присваиваем..." : "Присвоить"}
                      </button>
                    </div>
                    {(reserveMsg || reservedAssignment) && (
                      <p className={`text-[11px] leading-4 ${reserveState === "error" ? "text-red-500" : "text-emerald-600"}`}>
                        {reserveMsg || (reservedAssignment ? `Зарезервирована строка № ${reservedAssignment.rowNumber}.` : "")}
                      </p>
                    )}
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr_0.95fr] gap-4 items-start">
                <Field label="Тираж (экземпляров)" required>
                  <input data-field="quantity" type="number" min={1} className={fieldClass(showValidation && required.includes("quantity"))} placeholder="Например: 1000" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
                </Field>
                <Field label="Срок сдачи" required>
                  <DateTimeField
                    dateFieldName="deadline"
                    timeFieldName="deadlineTime"
                    dateValue={form.deadline}
                    timeValue={form.deadlineTime}
                    invalidDate={showValidation && required.includes("deadline")}
                    invalidTime={showValidation && required.includes("deadlineTime")}
                    onDateChange={(value) => update("deadline", value)}
                    onTimeChange={(value) => update("deadlineTime", value)}
                  />
                </Field>
                <Field label="Бронь ячеек">
                  <button
                    type="button"
                    onClick={openCellBookingModal}
                    className={actionFieldClass(false)}
                  >
                    <span className={`${form.cellBooking ? "text-slate-800 font-medium" : "text-slate-400"}`}>
                      {form.cellBooking ? `Бронь: ${form.cellBooking} ${Number(form.cellBooking) === 1 ? "строка" : "строк"}` : "Бронь ячеек"}
                    </span>
                    <span className="text-slate-400 shrink-0">＋</span>
                  </button>
                </Field>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">Подрядные работы</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Дополнительные пояснения и даты для ячейки со сроком сдачи</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSubcontractWork}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-base leading-none">＋</span> Добавить
                  </button>
                </div>
                {form.subcontractWorks.length === 0 ? (
                  <p className="text-xs text-slate-400">Добавьте подрядную работу, если нужно указать отдельную дату с пояснением.</p>
                ) : (
                  <div className="space-y-3">
                    {form.subcontractWorks.map((work, index) => {
                      const hasAnyValue = !!work.note.trim() || !!work.date || !!work.time;
                      const invalidNote = showValidation && hasAnyValue && !work.note.trim();
                      const invalidDate = showValidation && hasAnyValue && !work.date;
                      const invalidTime = showValidation && hasAnyValue && (!work.time || isDateTimeInPast(work.date, work.time));
                      const isPastTime = showValidation && hasAnyValue && work.date && work.time && isDateTimeInPast(work.date, work.time);
                      return (
                        <div key={work.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Подрядная работа {index + 1}</div>
                            <button
                              type="button"
                              onClick={() => removeSubcontractWork(work.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-white text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                            >
                              Удалить
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Информация" required>
                              <input
                                type="text"
                                className={fieldClass(invalidNote)}
                                placeholder="Например: Отправить на склейку"
                                value={work.note}
                                onChange={(e) => updateSubcontractWork(work.id, { note: e.target.value })}
                              />
                            </Field>
                            <Field label="Дата и время" required>
                              <DateTimeField
                                dateFieldName={`subcontractDate-${work.id}`}
                                timeFieldName={`subcontractTime-${work.id}`}
                                dateValue={work.date}
                                timeValue={work.time}
                                invalidDate={invalidDate}
                                invalidTime={invalidTime}
                                onDateChange={(value) => updateSubcontractWork(work.id, { date: value })}
                                onTimeChange={(value) => updateSubcontractWork(work.id, { time: value })}
                              />
                              {isPastTime && <p className="text-xs text-red-500 mt-1">Нельзя указывать прошедшее время.</p>}
                            </Field>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Section>

            <Section title="🖨 Параметры изделия">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Тип изделия" required>
                  <select data-field="productType" value={form.productType} className={selectFieldClass(showValidation && required.includes("productType"))} onChange={(e) => { setForm((prev) => ({ ...createDefaultForm(), orderNumber: prev.orderNumber, clientName: prev.clientName, managerName: prev.managerName, deadline: prev.deadline, deadlineTime: prev.deadlineTime, quantity: prev.quantity, cellBooking: prev.cellBooking, subcontractWorks: prev.subcontractWorks, productType: e.target.value })); setShowValidation(false); }}>
                    <option value="">— выберите —</option>{dicts.productTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  {pt === "Другое..." && <input data-field="productTypeCustom" className={`${fieldClass(showValidation && required.includes("productTypeCustom"))} mt-2`} placeholder="Укажите тип изделия" value={form.productTypeCustom} onChange={(e) => update("productTypeCustom", e.target.value)} />}
                </Field>
                {pt === "Визитки" ? (
                  <Field label={templateSizeLabel} required>
                    <select data-field="businessCardSize" value={form.businessCardSize} className={selectFieldClass(showValidation && required.includes("businessCardSize"))} onChange={(e) => update("businessCardSize", e.target.value)}>
                      <option value="">— выберите —</option>{dicts.businessCardSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    {form.businessCardSize === "Нестандартный" && <input data-field="businessCardSizeCustom" className={`${fieldClass(showValidation && required.includes("businessCardSizeCustom"))} mt-2`} placeholder="Например: 85×55 мм" value={form.businessCardSizeCustom} onChange={(e) => update("businessCardSizeCustom", e.target.value)} />}
                  </Field>
                ) : !envelope && !multiBlock && !calendar && !bag && (
                  <Field label={templateSizeLabel} required>
                    <select data-field="paperSize" value={form.paperSize} className={selectFieldClass(showValidation && required.includes("paperSize"))} onChange={(e) => update("paperSize", e.target.value)}>
                      <option value="">— выберите —</option>{dicts.paperSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    {form.paperSize === "Нестандартный" && <input data-field="paperSizeCustom" className={`${fieldClass(showValidation && required.includes("paperSizeCustom"))} mt-2`} placeholder="Например: 150×210 мм" value={form.paperSizeCustom} onChange={(e) => update("paperSizeCustom", e.target.value)} />}
                  </Field>
                )}
                {envelope && (
                  <Field label={templateSizeLabel} required>
                    <select data-field="envelopeSize" value={form.envelopeSize} className={selectFieldClass(showValidation && required.includes("envelopeSize"))} onChange={(e) => update("envelopeSize", e.target.value)}>
                      <option value="">— выберите —</option>{dicts.envelopeSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    {form.envelopeSize === "Нестандартный" && <input data-field="envelopeSizeCustom" className={`${fieldClass(showValidation && required.includes("envelopeSizeCustom"))} mt-2`} placeholder="Например: 160×230 мм" value={form.envelopeSizeCustom} onChange={(e) => update("envelopeSizeCustom", e.target.value)} />}
                  </Field>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Цветопроба">
                  <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1 shadow-sm gap-1">
                    {["Не надо", "Надо", "Есть образец"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => update("colorProof", item)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all ${form.colorProof === item ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </Field>
                {sticker && (
                  <Field label="Стикерпаки">
                    <YesNo value={form.stickerPacks} onChange={(value) => update("stickerPacks", value)} />
                  </Field>
                )}
              </div>

              {templateFlags.showPaper && !multiBlock && !notebook && !calendar && !bag && !form.kashurovka.enabled && pt && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {!sticker && (
                    <PaperSelectionField
                      label={templatePaperLabel}
                      typeValue={form.paperType}
                      materialValue={form.density}
                      customValue={form.paperCustomName}
                      library={dicts.paperLibrary}
                      productType={form.productType}
                      onTypeChange={(value) => {
                        update("paperType", value);
                        update("density", "");
                        update("paperCustomName", "");
                      }}
                      onMaterialChange={(value) => update("density", value)}
                      onCustomChange={(value) => update("paperCustomName", value)}
                      typeFieldName="paperType"
                      materialFieldName="density"
                      customFieldName="paperCustomName"
                      showValidation={showValidation}
                      invalidType={showValidation && required.includes("paperType")}
                      invalidMaterial={showValidation && required.includes("density")}
                      invalidCustom={showValidation && required.includes("paperCustomName")}
                    />
                  )}
                  {sticker && <Field label="Материал" required><select data-field="stickerMaterial" value={form.stickerMaterial} className={selectFieldClass(showValidation && required.includes("stickerMaterial"))} onChange={(e) => update("stickerMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.sticker.map((d) => <option key={d}>{d}</option>)}</select></Field>}
                  {templateFlags.showColor && !bag && (
                    <>
                      <PaperFinishField
                        value={sticker ? form.stickerFinish : form.densityFinish}
                        options={sticker ? PAPER_FINISHES : paperFinishOptionsForSelection(form.paperType, form.density)}
                        onChange={(value) => update(sticker ? "stickerFinish" : "densityFinish", value as never)}
                      />
                      <Field label={templateColorLabel} required><select data-field="colorMode" value={form.colorMode} disabled={(pt === "Листовки" || badge) && form.ownReverse} className={`${selectFieldClass(showValidation && required.includes("colorMode"))} ${(pt === "Листовки" || badge) && form.ownReverse ? "opacity-50 cursor-not-allowed" : ""}`} onChange={(e) => update("colorMode", e.target.value)}><option value="">— выберите —</option>{(sticker ? STICKER_COLOR_MODES : dicts.colors).map((c) => <option key={c}>{c}</option>)}</select></Field>
                    </>
                  )}
                  {(pt === "Листовки" || badge) && (
                    <Field label="Свой оборот">
                      <YesNo value={form.ownReverse} onChange={(value) => { update("ownReverse", value); if (value) update("colorMode", AUTO_REVERSE_COLOR); }} />
                    </Field>
                  )}
                </div>
              )}

              {sticker && (
                <div className="mt-4">
                  <div className="flex flex-col gap-2 max-w-xs">
                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Плоттерная резка</span>
                    <YesNo value={form.stickerPlotterCut} onChange={(v) => update("stickerPlotterCut", v)} />
                  </div>
                </div>
              )}

              {wobbler && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Плоттерная резка">
                    <YesNo value={form.wobblerPlotterCut} onChange={(value) => update("wobblerPlotterCut", value)} />
                  </Field>
                  <Field label="Ножка приклеивается">
                    <YesNo value={form.wobblerFootGlue} onChange={(value) => update("wobblerFootGlue", value)} />
                  </Field>
                </div>
              )}

              {badge && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Отверстие для бейджа" required>
                    <select
                      data-field="badgeHoleType"
                      value={form.badgeHoleType}
                      className={selectFieldClass(showValidation && required.includes("badgeHoleType"))}
                      onChange={(e) => {
                        update("badgeHoleType", e.target.value);
                        if (e.target.value !== "Круглое") {
                          update("badgeHoleCount", "");
                          update("badgeHoleDiameter", "");
                        }
                        else if (!form.badgeHoleCount) update("badgeHoleCount", "1");
                      }}
                    >
                      <option value="">— выберите —</option>
                      {["Круглое", "Овальное", "Евро"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </Field>
                  <div className="space-y-4">
                    {form.badgeHoleType === "Круглое" && (
                      <>
                        <Field label="Количество отверстий" required>
                          <select
                            data-field="badgeHoleCount"
                            value={form.badgeHoleCount}
                            className={selectFieldClass(showValidation && required.includes("badgeHoleCount"))}
                            onChange={(e) => update("badgeHoleCount", e.target.value)}
                          >
                            <option value="">— выберите —</option>
                            {["1", "2"].map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </Field>
                        <Field label="Диаметр отверстия">
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="Например: 5 мм"
                            value={form.badgeHoleDiameter}
                            onChange={(e) => update("badgeHoleDiameter", e.target.value)}
                          />
                        </Field>
                      </>
                    )}
                  </div>
                </div>
              )}

              {(multiBlock || notebook) && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label={multiBlock ? "Количество страниц с обложкой" : "Количество листов в блоке"} required={!multiBlock}>
                      <input data-field={multiBlock ? "pageCount" : "blockPages"} type="number" min={2} className={`${fieldClass(showValidation && required.includes(multiBlock ? "pageCount" : "blockPages"))} max-w-xs`} value={multiBlock ? form.pageCount : form.blockPages} onChange={(e) => update(multiBlock ? "pageCount" : "blockPages", e.target.value as never)} />
                      {multiBlock && form.pageCount && <p className="text-xs text-slate-500 mt-1">Это {Number(form.pageCount) / 2} листов в блоке.</p>}
                      {notebook && form.blockPages && <p className="text-xs text-slate-500 mt-1">Это {Number(form.blockPages) * 2} страниц в блоке.</p>}
                    </Field>
                    {(isCatalog(pt) || brochure) && (
                      <Field label={brochure ? "Формат брошюры" : "Формат продукции"} required>
                        <select
                          data-field={brochure ? "brochureFormat" : "catalogFormat"}
                          value={brochure ? form.brochureFormat : form.catalogFormat}
                          className={selectFieldClass(showValidation && required.includes(brochure ? "brochureFormat" : "catalogFormat"))}
                          onChange={(e) => {
                            if (brochure) {
                              update("brochureFormat", e.target.value);
                              if (e.target.value !== "Нестандартный") update("brochureFormatCustom", "");
                            } else {
                              update("catalogFormat", e.target.value);
                              if (e.target.value !== "Нестандартный") update("catalogFormatCustom", "");
                            }
                          }}
                        >
                          <option value="">— выберите —</option>
                          {dicts.paperSizes.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {(brochure ? form.brochureFormat : form.catalogFormat) === "Нестандартный" && (
                          <input
                            data-field={brochure ? "brochureFormatCustom" : "catalogFormatCustom"}
                            className={`${fieldClass(showValidation && required.includes(brochure ? "brochureFormatCustom" : "catalogFormatCustom"))} mt-2`}
                            placeholder="Например: 210×297 мм"
                            value={brochure ? form.brochureFormatCustom : form.catalogFormatCustom}
                            onChange={(e) => update(brochure ? "brochureFormatCustom" : "catalogFormatCustom", e.target.value)}
                          />
                        )}
                      </Field>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-1.5"><UiIcon name="book" className="h-4 w-4" />Обложка</h3>
                      <Field label="Обложка с кашированием">
                        <YesNo value={form.coverUseKash} onChange={(value) => {
                          update("coverUseKash", value);
                          if (value && !form.kashurovka.enabled) update("kashurovka", { ...form.kashurovka, enabled: true });
                        }} />
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <PaperSelectionField
                            label="Бумага обложки"
                            typeValue={form.coverPaperType}
                            materialValue={form.coverDensity}
                            customValue={form.coverPaperCustomName}
                            library={dicts.paperLibrary}
                            productType={form.productType}
                            onTypeChange={(value) => {
                              update("coverPaperType", value);
                              update("coverDensity", "");
                              update("coverPaperCustomName", "");
                            }}
                            onMaterialChange={(value) => update("coverDensity", value)}
                            onCustomChange={(value) => update("coverPaperCustomName", value)}
                            typeFieldName="coverPaperType"
                            materialFieldName="coverDensity"
                            customFieldName="coverPaperCustomName"
                            showValidation={showValidation}
                            invalidType={showValidation && required.includes("coverPaperType")}
                            invalidMaterial={showValidation && required.includes("coverDensity")}
                            invalidCustom={showValidation && required.includes("coverPaperCustomName")}
                            disabled={form.coverUseKash}
                          />
                        </div>
                        <div className={form.coverUseKash ? "opacity-50 pointer-events-none" : ""}><PaperFinishField label="Поверхность обложки" value={form.coverFinish} options={paperFinishOptionsForSelection(form.coverPaperType, form.coverDensity)} onChange={(value) => update("coverFinish", value)} /></div>
                        <Field label="Цветность обложки" required><select data-field="coverColor" value={form.coverColor} disabled={form.coverUseKash} className={`${selectFieldClass(showValidation && required.includes("coverColor"))} ${form.coverUseKash ? "opacity-50 cursor-not-allowed" : ""}`} onChange={(e) => update("coverColor", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}</select></Field>
                      </div>
                      <div className={form.coverUseKash ? "opacity-50 pointer-events-none" : ""}>
                        <LaminationBlockComponent label="Ламинация обложки" value={form.coverLamination} onChange={(v: any) => update("coverLamination", v)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                      </div>
                      {form.coverUseKash && <p className="text-xs text-slate-500">Бумага, цветность и ламинация обложки задаются в блоке кашировки.</p>}
                      {notebook && (
                        <div className="pt-2 border-t border-blue-100 space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-blue-700">Подложка</h4>
                            <p className="text-xs text-slate-500 mt-1">Выбирать только если подложка отличается от обложки.</p>
                          </div>
                          <Field label="Подложка">
                            <YesNo value={form.backingEnabled} onChange={(value) => update("backingEnabled", value)} />
                          </Field>
                          {form.backingEnabled && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                  <PaperSelectionField
                                    label="Бумага подложки"
                                    typeValue={form.backingPaperType}
                                    materialValue={form.backingDensity}
                                    customValue={form.backingPaperCustomName}
                                    library={dicts.paperLibrary}
                                    productType={form.productType}
                                    onTypeChange={(value) => {
                                      update("backingPaperType", value);
                                      update("backingDensity", "");
                                      update("backingPaperCustomName", "");
                                    }}
                                    onMaterialChange={(value) => update("backingDensity", value)}
                                    onCustomChange={(value) => update("backingPaperCustomName", value)}
                                    typeFieldName="backingPaperType"
                                    materialFieldName="backingDensity"
                                    customFieldName="backingPaperCustomName"
                                    showValidation={showValidation}
                                    invalidType={showValidation && required.includes("backingPaperType")}
                                    invalidMaterial={showValidation && required.includes("backingDensity")}
                                    invalidCustom={showValidation && required.includes("backingPaperCustomName")}
                                  />
                                </div>
                                <PaperFinishField label="Поверхность подложки" value={form.backingFinish} options={paperFinishOptionsForSelection(form.backingPaperType, form.backingDensity)} onChange={(value) => update("backingFinish", value)} />
                                <Field label="Цветность подложки">
                                  <select value={form.backingColor} className={selectClass} onChange={(e) => update("backingColor", e.target.value)}>
                                    <option value="">Без печати</option>
                                    {dicts.colors.map((c) => <option key={c}>{c}</option>)}
                                  </select>
                                </Field>
                              </div>
                              <LaminationBlockComponent label="Ламинация подложки" value={form.backingLamination} onChange={(v: any) => update("backingLamination", v)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5"><UiIcon name="book" className="h-4 w-4" />Блок</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <PaperSelectionField
                            label="Бумага блока"
                            typeValue={form.blockPaperType}
                            materialValue={form.blockDensity}
                            customValue={form.blockPaperCustomName}
                            library={dicts.paperLibrary}
                            productType={form.productType}
                            onTypeChange={(value) => {
                              update("blockPaperType", value);
                              update("blockDensity", "");
                              update("blockPaperCustomName", "");
                            }}
                            onMaterialChange={(value) => update("blockDensity", value)}
                            onCustomChange={(value) => update("blockPaperCustomName", value)}
                            typeFieldName="blockPaperType"
                            materialFieldName="blockDensity"
                            customFieldName="blockPaperCustomName"
                            showValidation={showValidation}
                            invalidType={showValidation && required.includes("blockPaperType")}
                            invalidMaterial={showValidation && required.includes("blockDensity")}
                            invalidCustom={showValidation && required.includes("blockPaperCustomName")}
                          />
                        </div>
                        <PaperFinishField label="Поверхность блока" value={form.blockFinish} options={paperFinishOptionsForSelection(form.blockPaperType, form.blockDensity)} onChange={(value) => update("blockFinish", value)} />
                        <Field label="Цветность блока" required><select data-field="blockColor" value={form.blockColor} className={selectFieldClass(showValidation && required.includes("blockColor"))} onChange={(e) => update("blockColor", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}</select></Field>
                      </div>
                      <LaminationBlockComponent label="Ламинация блока" value={form.blockLamination} onChange={(v: any) => update("blockLamination", v)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                    </div>
                  </div>
                </div>
              )}

              {calendar && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Вид календаря" required><select data-field="calendarKind" value={form.calendarKind} className={selectFieldClass(showValidation && required.includes("calendarKind"))} onChange={(e) => update("calendarKind", e.target.value)}><option>Настенный</option><option>Настольный</option><option>Карманный</option></select></Field>
                    {form.calendarKind === "Настенный" && <Field label="Количество рекламных блоков" required><input data-field="adBlocks" type="number" min={1} className={fieldClass(showValidation && required.includes("adBlocks"))} value={form.adBlocks} onChange={(e) => update("adBlocks", e.target.value)} /></Field>}
                  </div>
                  {form.calendarKind === "Настенный" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <PaperSelectionField
                        label="Бумага шапки"
                        typeValue={form.calendarHeaderPaperType}
                        materialValue={form.calendarHeaderPaperDensity}
                        customValue={form.calendarHeaderPaperCustomName}
                        library={dicts.paperLibrary}
                        productType={form.productType}
                        onTypeChange={(value) => {
                          update("calendarHeaderPaperType", value);
                          update("calendarHeaderPaperDensity", "");
                          update("calendarHeaderPaperCustomName", "");
                        }}
                        onMaterialChange={(value) => update("calendarHeaderPaperDensity", value)}
                        onCustomChange={(value) => update("calendarHeaderPaperCustomName", value)}
                        typeFieldName="calendarHeaderPaperType"
                        materialFieldName="calendarHeaderPaperDensity"
                        customFieldName="calendarHeaderPaperCustomName"
                        showValidation={showValidation}
                        invalidType={showValidation && required.includes("calendarHeaderPaperType")}
                        invalidMaterial={showValidation && required.includes("calendarHeaderPaperDensity")}
                        invalidCustom={showValidation && required.includes("calendarHeaderPaperCustomName")}
                      />
                      <PaperFinishField label="Поверхность шапки" value={form.calendarHeaderPaperFinish} options={paperFinishOptionsForSelection(form.calendarHeaderPaperType, form.calendarHeaderPaperDensity)} onChange={(value) => update("calendarHeaderPaperFinish", value)} />
                      <Field label="Тип подвеса"><select value={form.wallMountType} className={selectClass} onChange={(e) => update("wallMountType", e.target.value)}><option>Ригель</option><option>Планка</option></select></Field>
                      <Field label="Описание ригеля / планки" required><input data-field="wallMountDesc" className={fieldClass(showValidation && required.includes("wallMountDesc"))} value={form.wallMountDesc} onChange={(e) => update("wallMountDesc", e.target.value)} /></Field>
                    </div>
                  )}
                  {form.calendarKind === "Настольный" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Основание с кашированием">
                        <YesNo value={form.calendarBaseUseKash} onChange={(value) => {
                          update("calendarBaseUseKash", value);
                          if (value && !form.kashurovka.enabled) update("kashurovka", { ...form.kashurovka, enabled: true });
                        }} />
                      </Field>
                      <Field label="Материал основания" required><select data-field="calendarBaseMaterial" value={form.calendarBaseMaterial} disabled={form.calendarBaseUseKash} className={`${selectFieldClass(showValidation && required.includes("calendarBaseMaterial"))} ${form.calendarBaseUseKash ? "opacity-50 cursor-not-allowed" : ""}`} onChange={(e) => update("calendarBaseMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.calendarBase.map((d) => <option key={d}>{d}</option>)}</select></Field>
                      <div className={form.calendarBaseUseKash ? "opacity-50 pointer-events-none" : ""}><PaperFinishField value={form.calendarBaseFinish} onChange={(value) => update("calendarBaseFinish", value)} /></div>
                      <div className={`md:col-span-2 ${form.calendarBaseUseKash ? "opacity-50 pointer-events-none" : ""}`}>
                        <LaminationBlockComponent label="Ламинация основания" value={form.calendarBaseLamination} onChange={(value) => update("calendarBaseLamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                      </div>
                      {form.calendarBaseUseKash && <p className="md:col-span-2 text-xs text-slate-500">Основание настольного календаря задаётся через блок кашировки.</p>}
                      <Field label="Количество биговок основания"><input type="number" min={0} max={20} className={inputClass} value={form.calendarBaseBigovkaLines} onChange={(e) => { update("calendarBaseBigovkaLines", e.target.value); if (e.target.value && e.target.value !== "0" && form.bigkovka) update("bigkovka", false); }} placeholder="0" /></Field>
                      <Field label="Тип сетки"><select value={form.gridType} className={selectClass} onChange={(e) => update("gridType", e.target.value)}><option>Цифра</option><option>Офсет</option></select></Field>
                      {form.gridType === "Цифра" ? (
                        <>
                          <Field label="Бумага сетки"><select value={form.calendarGridMaterial} className={selectClass} onChange={(e) => update("calendarGridMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.calendarGridDigital.map((d) => <option key={d}>{d}</option>)}</select></Field>
                          <PaperFinishField value={form.calendarGridFinish} onChange={(value) => update("calendarGridFinish", value)} />
                          <Field label="Цветность сетки"><select value={form.calendarGridColorMode} className={selectClass} onChange={(e) => update("calendarGridColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((d) => <option key={d}>{d}</option>)}</select></Field>
                        </>
                      ) : (
                        <>
                          <Field label="Бумага сетки"><select value={form.calendarGridMaterial} className={selectClass} onChange={(e) => update("calendarGridMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.calendarGridOffset.map((d) => <option key={d}>{d}</option>)}</select></Field>
                          <PaperFinishField value={form.calendarGridFinish} onChange={(value) => update("calendarGridFinish", value)} />
                          <Field label="Цвет офсета"><select value={form.calendarOffsetColor} className={selectClass} onChange={(e) => update("calendarOffsetColor", e.target.value)}>{CALENDAR_OFFSET_COLORS.map((d) => <option key={d}>{d}</option>)}</select></Field>
                        </>
                      )}
                    </div>
                  )}
                  {form.calendarKind === "Карманный" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label={templateSizeLabel} required>
                        <select data-field="paperSize" value={form.paperSize} className={selectFieldClass(showValidation && required.includes("paperSize"))} onChange={(e) => update("paperSize", e.target.value)}>
                          <option value="">— выберите —</option>{dicts.pocketCalendarSizes.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {form.paperSize === "Нестандартный" && <input data-field="paperSizeCustom" className={`${fieldClass(showValidation && required.includes("paperSizeCustom"))} mt-2`} placeholder="Например: 150×210 мм" value={form.paperSizeCustom} onChange={(e) => update("paperSizeCustom", e.target.value)} />}
                      </Field>
                      <PaperSelectionField
                        label={templatePaperLabel}
                        typeValue={form.paperType}
                        materialValue={form.density}
                        customValue={form.paperCustomName}
                        library={dicts.paperLibrary}
                        productType={form.productType}
                        onTypeChange={(value) => {
                          update("paperType", value);
                          update("density", "");
                          update("paperCustomName", "");
                        }}
                        onMaterialChange={(value) => update("density", value)}
                        onCustomChange={(value) => update("paperCustomName", value)}
                        typeFieldName="paperType"
                        materialFieldName="density"
                        customFieldName="paperCustomName"
                        showValidation={showValidation}
                        invalidType={showValidation && required.includes("paperType")}
                        invalidMaterial={showValidation && required.includes("density")}
                        invalidCustom={showValidation && required.includes("paperCustomName")}
                      />
                      <PaperFinishField value={form.densityFinish} onChange={(value) => update("densityFinish", value)} />
                      <Field label={templateColorLabel} required><select data-field="colorMode" value={form.colorMode} className={selectFieldClass(showValidation && required.includes("colorMode"))} onChange={(e) => update("colorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}</select></Field>
                    </div>
                  )}
                </div>
              )}

              {bag && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Ширина" required><input data-field="bagWidth" type="number" className={fieldClass(showValidation && required.includes("bagWidth"))} value={form.bagWidth} onChange={(e) => update("bagWidth", e.target.value)} /></Field>
                    <Field label="Высота" required><input data-field="bagHeight" type="number" className={fieldClass(showValidation && required.includes("bagHeight"))} value={form.bagHeight} onChange={(e) => update("bagHeight", e.target.value)} /></Field>
                    <Field label="Глубина" required><input data-field="bagDepth" type="number" className={fieldClass(showValidation && required.includes("bagDepth"))} value={form.bagDepth} onChange={(e) => update("bagDepth", e.target.value)} /></Field>
                  </div>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${form.bagExternalSheets ? "opacity-60" : ""}`}>
                    {!form.bagExternalSheets && (
                      <>
                        <Field label={templatePaperLabel} required>
                          <select value={form.bagPaperType} className={selectFieldClass(showValidation && required.includes("bagPaperType"))} onChange={(e) => update("bagPaperType", e.target.value)}>
                            <option value="">— выберите —</option>
                            {BAG_PAPER_TYPE_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </Field>
                        <Field label="Плотность бумаги" required>
                          <select data-field="density" value={form.density} className={selectFieldClass(showValidation && required.includes("density"))} onChange={(e) => update("density", e.target.value)}>
                            <option value="">— выберите —</option>{dicts.paperProfiles.bag.map((d) => <option key={d}>{d}</option>)}
                          </select>
                        </Field>
                        <PaperFinishField value={form.densityFinish} options={PAPER_FINISHES} onChange={(value) => update("densityFinish", value)} />
                        <Field label="Цветность" required>
                          <select data-field="colorMode" value={form.colorMode} className={selectFieldClass(showValidation && required.includes("colorMode"))} onChange={(e) => update("colorMode", e.target.value)}>
                            <option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </Field>
                      </>
                    )}
                    <Field label="Количество частей" required>
                      <select value={form.bagPartsCount} className={selectFieldClass(showValidation && required.includes("bagPartsCount"))} onChange={(e) => update("bagPartsCount", e.target.value)}>
                        <option value="Из 2-х частей">Из 2-х частей</option>
                        <option value="Из 4-х частей">Из 4-х частей</option>
                      </select>
                    </Field>
                    <Field label="Тип ручек">
                      <select value={form.bagHandleType} className={selectClass} onChange={(e) => update("bagHandleType", e.target.value)}>
                        {BAG_HANDLE_TYPES.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                    <Field label="Сборка из сторонних листов">
                      <YesNo value={form.bagExternalSheets} onChange={(v) => update("bagExternalSheets", v)} />
                    </Field>
                    {form.bagHandleType !== "Лента" ? (
                      <>
                        <Field label="Цвет люверсов"><select value={form.bagEyeletColor} className={selectClass} onChange={(e) => update("bagEyeletColor", e.target.value)}>{BAG_COLOR_OPTIONS.map((c) => <option key={c}>{c}</option>)}</select>{form.bagEyeletColor === "Другой цвет..." && <input className={`${inputClass} mt-2`} value={form.bagEyeletColorCustom} onChange={(e) => update("bagEyeletColorCustom", e.target.value)} />}</Field>
                        <Field label="Цвет ручек"><select value={form.bagHandleColor} className={selectClass} onChange={(e) => update("bagHandleColor", e.target.value)}>{BAG_COLOR_OPTIONS.map((c) => <option key={c}>{c}</option>)}</select>{form.bagHandleColor === "Другой цвет..." && <input className={`${inputClass} mt-2`} value={form.bagHandleColorCustom} onChange={(e) => update("bagHandleColorCustom", e.target.value)} />}</Field>
                        <Field label="Пипсик на ручках" required>
                          <select value={form.bagHandlePipsik} className={selectFieldClass(showValidation && required.includes("bagHandlePipsik"))} onChange={(e) => update("bagHandlePipsik", e.target.value)}>
                            <option value="Без пипсика">Без пипсика</option>
                            <option value="С пипсиком">С пипсиком</option>
                          </select>
                        </Field>
                      </>
                    ) : (
                      <Field label="Цвет ленты"><select value={form.bagHandleColor} className={selectClass} onChange={(e) => update("bagHandleColor", e.target.value)}>{BAG_COLOR_OPTIONS.map((c) => <option key={c}>{c}</option>)}</select>{form.bagHandleColor === "Другой цвет..." && <input className={`${inputClass} mt-2`} value={form.bagHandleColorCustom} onChange={(e) => update("bagHandleColorCustom", e.target.value)} />}</Field>
                    )}
                  </div>
                </div>
              )}

              {templateFlags.showLamination && !multiBlock && !notebook && !calendar && !form.kashurovka.enabled && pt && (
                <div className="mt-4 p-3 rounded-xl border border-slate-100 bg-slate-50"><LaminationBlockComponent label={templateLaminationLabel} value={form.lamination} onChange={(v: any) => update("lamination", v)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} /></div>
              )}
            </Section>

            {templateFlags.showPostProcessing && (
              <Section title={`✂️ ${templatePostProcessingLabel}`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {dicts.postProcessing.map((item) => (
                    <label key={item} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${form.postProcessing.includes(item) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>
                      <input type="checkbox" checked={form.postProcessing.includes(item)} onChange={() => togglePostProcessing(item)} className="accent-blue-600" />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
                {form.postProcessing.includes("Сверление отверстий") && (
                  <div className="mt-3">
                    <Field label="Диаметр сверления" required>
                      <select
                        data-field="drillingDiameter"
                        value={form.drillingDiameter}
                        className={selectFieldClass(showValidation && required.includes("drillingDiameter"))}
                        onChange={(e) => update("drillingDiameter", e.target.value)}
                      >
                        <option value="">— выберите —</option>
                        {DRILL_DIAMETERS.map((diameter) => <option key={diameter}>{diameter}</option>)}
                      </select>
                    </Field>
                  </div>
                )}
                {(form.postProcessing.includes("Тиснение фольгой") || form.postProcessing.includes("Фольгирование")) && <div className="mt-3"><Field label="Цвет фольги"><input type="text" className={`${inputClass} max-w-xs`} placeholder="Например: золото, серебро, красная..." value={form.foilColor} onChange={(e) => update("foilColor", e.target.value)} /></Field></div>}
                {form.postProcessing.includes("УФ-лак") && <div className="mt-3"><Field label="Вид УФ-лака"><div className="flex gap-2">{["Обычный", "Текстурный"].map((t) => (<button key={t} type="button" onClick={() => update("uvType", t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.uvType === t ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{t}</button>))}</div></Field></div>}
              </Section>
            )}

            <Section title="📐 Биговка">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start ${deskCalendarBigovkaActive ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-4 flex-wrap">
                  <YesNo value={form.bigkovka} onChange={(v) => update("bigkovka", v)} disabled={deskCalendarBigovkaActive} />
                  {form.bigkovka && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-600">Количество линий:</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        disabled={deskCalendarBigovkaActive}
                        className={`${inputClass} w-20 ${deskCalendarBigovkaActive ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={form.bigkovkaLines}
                        onChange={(e) => update("bigkovkaLines", e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  )}
                  {deskCalendarBigovkaActive && <p className="text-xs text-slate-500">Биговка уже указана в настройках основания настольного календаря.</p>}
                </div>
                <div className="flex items-center gap-2 md:justify-start md:pl-2">
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Фальцовка</span>
                  <YesNo value={form.falcovka} onChange={(v) => update("falcovka", v)} disabled={deskCalendarBigovkaActive} />
                </div>
              </div>
            </Section>

            <Section title="🗂 Кашировка" accent="from-violet-50 to-white">
              <KashurovkaBlockComponent value={form.kashurovka} onChange={(v: any) => {
                update("kashurovka", v);
                if (!v.enabled) {
                  if (form.coverUseKash) update("coverUseKash", false);
                  if (form.calendarBaseUseKash) update("calendarBaseUseKash", false);
                }
              }} paperProfiles={dicts.paperProfiles} paperLibrary={dicts.paperLibrary} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} colors={dicts.colors} showValidation={showValidation} requiredFields={required} />
            </Section>

            <Section title="📚 Сшивка / Переплёт">
              <div className="space-y-4">
                <YesNo value={form.binding} onChange={(v) => update("binding", v)} />
                {form.binding && (
                  <div className="space-y-4">
                    <Field label="Тип сшивки"><div className="flex flex-wrap gap-2">{dicts.bindingTypes.map((b) => (<button key={b} type="button" onClick={() => update("bindingType", b)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.bindingType === b ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{b}</button>))}</div></Field>
                    {form.bindingType === "Скоба" && (
                      <div className="pl-3 border-l-2 border-blue-100 space-y-3">
                        <Field label="Количество скоб"><div className="flex gap-2">{["Одна", "Две"].map((cnt) => (<button key={cnt} type="button" onClick={() => update("stapleCount", cnt)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.stapleCount === cnt ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{cnt}</button>))}</div></Field>
                        {form.stapleCount === "Одна" && <Field label="Расположение скобы"><div className="flex gap-2">{["Лево", "Право"].map((pos) => (<button key={pos} type="button" onClick={() => update("staplePosition", pos)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.staplePosition === pos ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{pos}</button>))}</div></Field>}
                      </div>
                    )}
                    {form.bindingType === "Пружина" && (
                      <div className="pl-3 border-l-2 border-blue-100 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Field label="Цвет пружины"><select value={form.springColor} className={selectClass} onChange={(e) => update("springColor", e.target.value)}><option value="">— выберите —</option>{SPRING_COLORS.map((c) => <option key={c}>{c}</option>)}</select>{form.springColor === "Другой цвет..." && <input className={`${inputClass} mt-2`} placeholder="Укажите цвет" value={form.springColorCustom} onChange={(e) => update("springColorCustom", e.target.value)} />}</Field>
                          <Field label="Диаметр пружины">
                            <select value={form.springDiameter} className={selectClass} onChange={(e) => update("springDiameter", e.target.value)}><option value="">— выберите —</option>{SPRING_DIAMETERS.map((d) => <option key={d}>{d}</option>)}</select>
                            {springSuggestion && <p className="text-xs text-slate-500 mt-1">Диаметр подбирается автоматически по толщине блока и обложки, но его можно скорректировать вручную.</p>}
                            {springDiameterIsCustomOrder && <p className="text-xs font-semibold text-amber-700 mt-1">Внимание, пружина ЗАКАЗНАЯ, перфорация 2:1</p>}
                          </Field>
                          <Field label="Расположение">
                            <select value={form.springPosition} className={selectClass} onChange={(e) => update("springPosition", e.target.value)}>
                              <option>По широкой стороне</option>
                              <option>По узкой стороне</option>
                            </select>
                          </Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field label="Скрытая пружина"><YesNo value={form.springHidden} onChange={(v) => update("springHidden", v)} /></Field>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>

            <Section title="🔗 Ссылка на файлы заказа" accent="from-orange-50 to-amber-50">
              <input type="text" className={`${inputClass} border-orange-200 bg-orange-50/70 focus:ring-orange-400`} placeholder="Укажите путь к папке заказа, например D:\\Заказы\\2249" value={form.fileLink} onChange={(e) => update("fileLink", e.target.value)} />
            </Section>

            <Section title="📝 Дополнительные примечания">
              <textarea rows={3} className={`${inputClass} resize-none`} placeholder="Любые дополнительные требования, пожелания..." value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </Section>

            <ShortTZPanel form={form} />

            <div className="flex flex-wrap gap-3 pb-8">
              <button type="button" onClick={() => validateThen(handlePreview)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"><UiIcon name="eye" className="h-4 w-4" /> Предпросмотр</button>
              <button type="button" onClick={() => validateThen(() => setShowSend(true))} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow transition-all ${isFormValid ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}><UiIcon name="clipboard" className="h-4 w-4" /> Отправить в таблицу</button>
              <button type="button" onClick={openPresetSaveModal} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"><UiIcon name="save" className="h-4 w-4" /> Сохранить пресет</button>
              {savedMsg && <div className={`self-center rounded-xl border px-4 py-2 text-sm font-medium ${savedMsg.startsWith("Ошибка") ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{savedMsg}</div>}
              {!isFormValid && <p className="text-xs text-slate-500 self-center">* Заполните обязательные поля</p>}
            </div>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="space-y-4">
            <Section title="📣 Реклама" accent="from-orange-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Field label="Заказчик">
                  <input
                    type="text"
                    className="bg-slate-50"
                    value={adForm.clientName}
                    readOnly
                  />
                </Field>
                <Field label="Менеджер" required>
                  <select
                    data-field="adManagerName"
                    className={selectFieldClass(showAdValidation && adRequired.includes("adManagerName"))}
                    value={adForm.managerName}
                    onChange={(e) => updateAd("managerName", e.target.value)}
                  >
                    {(dicts.adManagers.length ? dicts.adManagers : DEFAULT_AD_MANAGERS).map((manager) => (
                      <option key={manager}>{manager}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Номер заказа">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="bg-yellow-50 font-bold flex-1 min-w-0"
                        placeholder="подставится автоматически"
                        value={adForm.orderNumber}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleReserveAssignment}
                        disabled={reserveState === "saving"}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0 ${
                          reserveState === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        } ${reserveState === "saving" ? "opacity-70 cursor-wait" : ""}`}
                      >
                        {reserveState === "saving" ? "Присваиваем..." : "Присвоить"}
                      </button>
                    </div>
                    {(reserveMsg || reservedAssignment) && (
                      <p className={`text-[11px] leading-4 ${reserveState === "error" ? "text-red-500" : "text-emerald-600"}`}>
                        {reserveMsg || (reservedAssignment ? `Зарезервирована строка № ${reservedAssignment.rowNumber}.` : "")}
                      </p>
                    )}
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-4 items-start">
                <Field label="Количество файлов">
                  <input
                    data-field="adFileCount"
                    type="number"
                    min={1}
                    className={inputClass}
                    placeholder="Например: 3"
                    value={adForm.fileCount}
                    onChange={(e) => updateAd("fileCount", e.target.value)}
                  />
                </Field>
                <Field label="Срок сдачи" required>
                  <DateTimeField
                    dateFieldName="adDeadline"
                    timeFieldName="adDeadlineTime"
                    dateValue={adForm.deadline}
                    timeValue={adForm.deadlineTime}
                    invalidDate={showAdValidation && adRequired.includes("adDeadline")}
                    invalidTime={showAdValidation && adRequired.includes("adDeadlineTime")}
                    onDateChange={(value) => updateAd("deadline", value)}
                    onTimeChange={(value) => updateAd("deadlineTime", value)}
                  />
                </Field>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                <Field label="Ссылка на файлы" required>
                  <input
                    data-field="adFileLink"
                    type="text"
                    className={fieldClass(showAdValidation && adRequired.includes("adFileLink"))}
                    placeholder="https://..."
                    value={adForm.fileLink}
                    onChange={(e) => updateAd("fileLink", e.target.value)}
                  />
                </Field>

                <Field label="Дополнительные примечания">
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Любые уточнения по рекламному заказу..."
                    value={adForm.notes}
                    onChange={(e) => updateAd("notes", e.target.value)}
                  />
                </Field>
              </div>
            </Section>

            <AdShortTZPanel form={adForm} />

            <div className="flex flex-wrap gap-3 pb-8">
              <button
                type="button"
                onClick={() => validateAdsThen(() => setShowSend(true))}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold shadow transition-all ${isAdFormValid ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`}
              >
                <UiIcon name="clipboard" className="h-4 w-4" /> Отправить в таблицу
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <UiIcon name="close" className="h-4 w-4" /> Очистить
              </button>
            </div>
          </div>
        )}

        {/* ═══ СПРАВОЧНИКИ ══════════════════════════════════════════════════════ */}
        {activeTab === "dicts" && (
          <div className="space-y-4 pb-6">
            {isDictLocked ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <UiIcon name="lock" className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">{"\u0421\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a\u0438 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b"}</h2>
                <p className="text-sm text-slate-500 mb-6">{"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f"}</p>
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder={"\u041f\u0430\u0440\u043e\u043b\u044c"}
                      className={inputClass}
                      style={{ width: '200px' }}
                      value={dictPassword}
                      onChange={(e) => {
                        setDictPassword(e.target.value);
                        setPasswordError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (dictPassword === "123321") {
                            setIsDictLocked(false);
                            setPasswordError("");
                          } else {
                            setPasswordError("\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c!");
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (dictPassword === "123321") {
                          setIsDictLocked(false);
                          setPasswordError("");
                        } else {
                          setPasswordError("\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c!");
                        }
                      }}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {"\u0412\u043e\u0439\u0442\u0438"}
                    </button>
                  </div>
                  {passwordError && <p className="text-sm font-bold text-red-500">{passwordError}</p>}
                </div>
              </div>
            ) : (
              <>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-start gap-3">
                  <UiIcon name="settings" className="h-6 w-6 text-indigo-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-indigo-800">{"\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u0441\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a\u043e\u0432"}</p>
                    <p className="text-xs text-indigo-600 mt-0.5">{"\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0445\u0440\u0430\u043d\u044f\u0442\u0441\u044f \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e \u0438 \u043c\u043e\u0433\u0443\u0442 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u0447\u0435\u0440\u0435\u0437 \u0441\u043a\u0440\u044b\u0442\u044b\u0439 \u043b\u0438\u0441\u0442 __CONFIG__ \u0432 Google \u0422\u0430\u0431\u043b\u0438\u0446\u0435. \u041f\u043e\u0438\u0441\u043a \u043d\u0438\u0436\u0435 \u0444\u0438\u043b\u044c\u0442\u0440\u0443\u0435\u0442 \u0438\u043c\u0435\u043d\u043d\u043e \u0433\u0440\u0443\u043f\u043f\u044b \u0441\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u044e."}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-900">{"\u0418\u043c\u044f \u043b\u0438\u0441\u0442\u0430 \u0432 Google \u0422\u0430\u0431\u043b\u0438\u0446\u0435:"}</span>
                      <input className="px-3 py-1.5 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
                    </div>
                    {dictSyncMsg && <p className={`mt-3 text-xs font-medium ${dictSyncMsg.startsWith("Ошибка") || dictSyncMsg.startsWith("Не удалось") ? "text-red-600" : "text-emerald-700"}`}>{dictSyncMsg}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => loadDictsFromCloud(true)} disabled={dictSyncBusy !== "idle"} className="text-xs px-3 py-1.5 rounded-lg border border-sky-300 text-sky-700 hover:bg-sky-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">{dictSyncBusy === "loading" ? "⟳ Загрузка..." : "☁️ Загрузить из Google"}</button>
                    <button onClick={saveDictsToCloud} disabled={dictSyncBusy !== "idle"} className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">{dictSyncBusy === "saving" ? "⟳ Сохранение..." : "☁️ Сохранить в Google"}</button>
                    <button onClick={() => { setIsDictLocked(true); setDictPassword(""); }} className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"><UiIcon name="lock" className="h-4 w-4" /> Закрыть доступ</button>
                    <button onClick={resetDicts} className="text-xs px-3 py-1.5 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-100 transition-colors whitespace-nowrap">↺ Сбросить всё</button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{"\u041f\u043e\u0438\u0441\u043a \u0433\u0440\u0443\u043f\u043f\u044b \u0441\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a\u0430"}</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={"\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: \u043b\u0430\u043c\u0438\u043d\u0430\u0446\u0438\u044f, \u0431\u0443\u043c\u0430\u0433\u0430, \u043a\u043e\u043d\u0432\u0435\u0440\u0442\u044b..."}
                    value={dictSectionQuery}
                    onChange={(e) => setDictSectionQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDictSections.map((section) => (
                    <Fragment key={section.key}>{section.element}</Fragment>
                  ))}
                </div>
                {filteredDictSections.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                    {"\u041f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0435 \u0433\u0440\u0443\u043f\u043f\u044b \u0441\u043f\u0440\u0430\u0432\u043e\u0447\u043d\u0438\u043a\u043e\u0432 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b."}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><UiIcon name="eye" className="h-4 w-4" /> Предпросмотр ТЗ</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowPreview(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><UiIcon name="close" className="h-4 w-4" /></button>
              </div>
            </div>
            <pre className="p-5 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-auto flex-1">{previewText}</pre>
          </div>
        </div>
      )}

      {/* МОДАЛКА ОТПРАВКИ */}
      {showSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { if(sendState === "idle" || sendState === "done" || sendState === "error") { setSendAutoSaveMsg(""); setShowSend(false); } }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 z-10 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2"><UiIcon name="clipboard" className="h-5 w-5" /> Отправить в таблицу</h2>
            
            {sendState === "idle" && (
              <>
                {activeTab === "ads" ? (
                  <>
                    <p className="text-sm text-slate-600 mb-4">Рекламный заказ будет отправлен в Google Таблицу. Проверьте ключевые поля:</p>
                    {adMissingFileLink && (
                      <div className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                        <div className="font-semibold">Внимание: ссылка на файлы не указана.</div>
                        <div className="mt-1 text-amber-800">Без ссылки отправка невозможна.</div>
                      </div>
                    )}
                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">№ заказа</span><span className="font-medium text-slate-800">{adForm.orderNumber || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Заказчик</span><span className="font-medium text-slate-800">{adForm.clientName || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Менеджер</span><span className="font-medium text-slate-800">{adForm.managerName || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Количество файлов</span><span className="font-medium text-slate-800">{adForm.fileCount ? formatFileCountText(adForm.fileCount) : "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Ссылка</span><span className="font-medium text-slate-800 break-all text-right max-w-[55%]">{adForm.fileLink || "—"}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-500">Срок</span><span className="font-medium text-slate-800">{adForm.deadline ? `${adForm.deadline.split("-").reverse().join(".")}${adForm.deadlineTime ? " " + adForm.deadlineTime : ""}` : "—"}</span></div>
                    </div>
                    {adForm.notes.trim() && <div className="mb-6 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 whitespace-pre-wrap">{adForm.notes}</div>}
                    <div className="flex gap-2">
                      <button onClick={handleRealSend} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow">Отправить</button>
                      <button onClick={() => setShowSend(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Отмена</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-600 mb-4">Данные заказа будут отправлены в Google Таблицу. Проверьте ключевые поля:</p>
                    {missingFileLink && (
                      <div className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
                        <div className="font-semibold">Внимание: ссылка на файлы заказа не указана.</div>
                        <div className="mt-1 text-amber-800">Задание можно отправить в работу, но папка файлов не будет проставлена автоматически.</div>
                      </div>
                    )}
                    <div className="space-y-2 text-sm mb-6">
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">№ заказа</span><span className="font-medium text-slate-800">{form.orderNumber || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Заказчик</span><span className="font-medium text-slate-800">{form.clientName || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Изделие</span><span className="font-medium text-slate-800">{form.productType === "Другое..." ? form.productTypeCustom : form.productType || "—"}</span></div>
                      <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Тираж</span><span className="font-medium text-slate-800">{form.quantity ? `${formatQuantityText(form.quantity)} шт.` : "—"}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-500">Срок</span><span className="font-medium text-slate-800">{form.deadline ? `${form.deadline.split("-").reverse().join(".")}${form.deadlineTime ? " " + form.deadlineTime : ""}` : "—"}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleRealSend} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow">{missingFileLink ? "Продолжить" : "Отправить"}</button>
                      <button onClick={() => setShowSend(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">{missingFileLink ? "Вернуться" : "Отмена"}</button>
                    </div>
                  </>
                )}
              </>
            )}

            {sendState === "loading" && (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="relative w-14 h-14"><div className="absolute inset-0 rounded-full border-4 border-indigo-100" /><div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" /></div>
                <p className="text-sm text-slate-600 font-medium">Отправка данных…</p>
              </div>
            )}

            {sendState === "done" && (
              <div className="flex flex-col items-center py-8 gap-5">
                <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-50 shadow-lg">
                  <div className="aspect-square w-full">
                    <img
                      src={CAT_IMAGE_SRC}
                      alt="Кот"
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                </div>
                <p className="text-sm text-emerald-700 font-semibold text-center">Данные успешно отправлены!</p>
                {sendAutoSaveMsg && <p className="text-xs text-slate-500 text-center leading-5 px-2 max-w-md">{sendAutoSaveMsg}</p>}
                <button onClick={() => { setSendState("idle"); setSendAutoSaveMsg(""); setShowSend(false); }} className="px-6 py-2 w-full max-w-sm rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">Отлично</button>
              </div>
            )}

            {sendState === "error" && (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">❌</div>
                <p className="text-sm text-red-600 font-semibold">Ошибка отправки. Попробуйте снова.</p>
                <div className="flex gap-2 w-full">
                  <button onClick={handleRealSend} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Повторить</button>
                  <button onClick={() => { setSendState("idle"); setShowSend(false); }} className="px-6 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Закрыть</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 z-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="font-semibold text-slate-800 text-lg">Очистить форму?</h2>
              <p className="text-sm text-slate-500 mt-1">Все введённые данные будут удалены.</p>
            </div>
            <div className="px-5 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowResetConfirm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Отмена</button>
              <button type="button" onClick={confirmReset} className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Очистить</button>
            </div>
          </div>
        </div>
      )}

      {showCellBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCellBookingModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 z-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="font-semibold text-slate-800 text-lg">Бронь ячеек</h2>
              <p className="text-sm text-slate-500 mt-1">Укажите, сколько строк нужно зарезервировать.</p>
            </div>
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Всего строк</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  placeholder="Например: 4"
                  value={cellBookingDraftCount}
                  onChange={(e) => setCellBookingDraftCount(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400">Укажите общее количество строк, включая первую заявку. Например: 4 = 1 заявка + 3 брони.</p>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowCellBookingModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Отмена</button>
              <button type="button" onClick={saveCellBookingModal} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {showPresetSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowPresetSaveModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 z-10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
              <h2 className="font-semibold text-slate-800 text-lg">Сохранить пресет</h2>
              <p className="text-sm text-slate-500 mt-1">Будут сохранены только заполненные поля, кроме заказчика, даты, ссылки и брони.</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {presetMsg && (
                <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  presetSaveStatus === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {presetMsg}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Название пресета</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Например: 100 визиток"
                  value={presetNameDraft}
                  onChange={(e) => {
                    setPresetNameDraft(e.target.value);
                    setPresetMsg(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveCurrentPreset();
                    }
                  }}
                />
              </div>
              <p className="text-xs text-slate-400">Пресет сохранится локально на этом компьютере и будет доступен только для этого менеджера.</p>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowPresetSaveModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Отмена</button>
              {presetSaveStatus === "success" ? (
                <button type="button" onClick={() => setShowPresetSaveModal(false)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">Закрыть</button>
              ) : (
                <button type="button" onClick={saveCurrentPreset} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors" disabled={presetSaveStatus === "saving"}>
                  {presetSaveStatus === "saving" ? "Сохранение..." : "Сохранить"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getRequiredFields(form: FormData): string[] {
  const errors: string[] = [];
  const product = resolveProductName(form);
  const pocketCalendar = isPocketCalendar(form);
  const templateFlags = getProductTemplate(form.productType).flags;
  const templateSizeRequired = isProductTemplateFieldRequired(form.productType, "size");
  const templatePaperRequired = templateFlags.showPaper && isProductTemplateFieldRequired(form.productType, "paper");
  const templateColorRequired = templateFlags.showColor && isProductTemplateFieldRequired(form.productType, "color");
  if (!form.clientName.trim()) errors.push("clientName");
  if (!form.managerName) errors.push("managerName");
  if (!form.deadline || form.deadline < getTodayLocalIso()) errors.push("deadline");
  if (isDeadlineTimeInPast(form.deadline, form.deadlineTime)) errors.push("deadlineTime");
  form.subcontractWorks.forEach((work) => {
    const hasAnyValue = !!work.note.trim() || !!work.date || !!work.time;
    if (!hasAnyValue) return;
    if (!work.note.trim()) errors.push("subcontractNote");
    if (!work.date) errors.push("subcontractDate");
    if (!work.time) errors.push("subcontractTime");
    else if (isDateTimeInPast(work.date, work.time)) errors.push("subcontractTimePast");
  });
  if (!form.productType) errors.push("productType");
  if (form.productType === "Другое..." && !product) errors.push("productTypeCustom");
  if (!form.quantity) errors.push("quantity");
  if (pocketCalendar) {
    if (templateSizeRequired) {
      if (!form.paperSize) errors.push("paperSize");
      if (form.paperSize === "Нестандартный" && !form.paperSizeCustom.trim()) errors.push("paperSizeCustom");
    }
    if (templatePaperRequired && !form.kashurovka.enabled) {
      if (!form.paperType) errors.push("paperType");
      else if (form.paperType === "Дизайнерская" ? !form.paperCustomName.trim() : requiresPaperDensity(form.paperType) && !form.density.trim()) {
        errors.push(form.paperType === "Дизайнерская" ? "paperCustomName" : "density");
      }
      if (templateColorRequired && !form.colorMode && !isPaperlessPaperType(form.paperType)) errors.push("colorMode");
    }
  } else if (isEnvelope(form.productType)) {
    if (templateSizeRequired) {
      if (!form.envelopeSize) errors.push("envelopeSize");
      if (form.envelopeSize === "Нестандартный" && !form.envelopeSizeCustom.trim()) errors.push("envelopeSizeCustom");
    }
    if (templatePaperRequired && !form.kashurovka.enabled) {
      if (!form.paperType) errors.push("paperType");
      else if (form.paperType === "Дизайнерская" ? !form.paperCustomName.trim() : requiresPaperDensity(form.paperType) && !form.density.trim()) {
        errors.push(form.paperType === "Дизайнерская" ? "paperCustomName" : "density");
      }
      if (templateColorRequired && !form.colorMode && !isPaperlessPaperType(form.paperType)) errors.push("colorMode");
    }
  } else if (isBusinessCard(form.productType)) {
    if (templateSizeRequired) {
      if (!form.businessCardSize) errors.push("businessCardSize");
      if (form.businessCardSize === "Нестандартный" && !form.businessCardSizeCustom.trim()) errors.push("businessCardSizeCustom");
    }
  } else if (isCatalog(form.productType)) {
    if (templateSizeRequired) {
      if (!form.catalogFormat) errors.push("catalogFormat");
      if (form.catalogFormat === "Нестандартный" && !form.catalogFormatCustom.trim()) errors.push("catalogFormatCustom");
    }
  } else if (isBrochure(form.productType)) {
    if (templateSizeRequired) {
      if (!form.brochureFormat) errors.push("brochureFormat");
      if (form.brochureFormat === "Нестандартный" && !form.brochureFormatCustom.trim()) errors.push("brochureFormatCustom");
    }
  } else if (!isMultiBlock(form.productType) && !isCalendar(form.productType) && !isBag(form.productType) && !isSticker(form.productType)) {
    if (templateSizeRequired) {
      if (!form.paperSize) errors.push("paperSize");
      if (form.paperSize === "Нестандартный" && !form.paperSizeCustom.trim()) errors.push("paperSizeCustom");
    }
  }
  if (isMultiBlock(form.productType) || isNotebook(form.productType)) {
    if (isNotebook(form.productType) && !form.blockPages) errors.push("blockPages");
    if (!form.coverUseKash) {
      if (!form.coverPaperType) errors.push("coverPaperType");
      else if (form.coverPaperType === "Дизайнерская" ? !form.coverPaperCustomName.trim() : requiresPaperDensity(form.coverPaperType) && !form.coverDensity.trim()) {
        errors.push(form.coverPaperType === "Дизайнерская" ? "coverPaperCustomName" : "coverDensity");
      }
    }
    if (!form.coverUseKash && !form.coverColor && !isPaperlessPaperType(form.coverPaperType)) errors.push("coverColor");
    if (isNotebook(form.productType) && form.backingEnabled) {
      if (!form.backingPaperType) errors.push("backingPaperType");
      else if (form.backingPaperType === "Дизайнерская" ? !form.backingPaperCustomName.trim() : requiresPaperDensity(form.backingPaperType) && !form.backingDensity.trim()) {
        errors.push(form.backingPaperType === "Дизайнерская" ? "backingPaperCustomName" : "backingDensity");
      }
    }
    if (!form.blockPaperType) errors.push("blockPaperType");
    else if (form.blockPaperType === "Дизайнерская" ? !form.blockPaperCustomName.trim() : requiresPaperDensity(form.blockPaperType) && !form.blockDensity.trim()) {
      errors.push(form.blockPaperType === "Дизайнерская" ? "blockPaperCustomName" : "blockDensity");
    }
    if (!form.blockColor && !isPaperlessPaperType(form.blockPaperType)) errors.push("blockColor");
  } else if (isCalendar(form.productType)) {
    if (!form.calendarKind) errors.push("calendarKind");
    if (form.calendarKind === "Настенный" && !form.adBlocks) errors.push("adBlocks");
    if (form.calendarKind === "Настенный") {
      if (!form.calendarHeaderPaperType) errors.push("calendarHeaderPaperType");
      else if (form.calendarHeaderPaperType === "Дизайнерская" ? !form.calendarHeaderPaperCustomName.trim() : requiresPaperDensity(form.calendarHeaderPaperType) && !form.calendarHeaderPaperDensity.trim()) {
        errors.push(form.calendarHeaderPaperType === "Дизайнерская" ? "calendarHeaderPaperCustomName" : "calendarHeaderPaperDensity");
      }
    }
    if (form.calendarKind === "Настенный" && !form.wallMountDesc.trim()) errors.push("wallMountDesc");
    if (form.calendarKind === "Настольный" && !form.calendarBaseUseKash && !form.calendarBaseMaterial) errors.push("calendarBaseMaterial");
  } else if (isBag(form.productType)) {
    if (!form.bagExternalSheets) {
      if (templatePaperRequired) {
        if (!form.bagPaperType) errors.push("bagPaperType");
        if (!form.density) errors.push("density");
      }
      if (templateColorRequired && !form.colorMode) errors.push("colorMode");
    }
    if (!form.bagPartsCount) errors.push("bagPartsCount");
    if (form.bagHandleType !== "Лента" && !form.bagHandlePipsik) errors.push("bagHandlePipsik");
    if (templateSizeRequired) {
      if (!form.bagHeight) errors.push("bagHeight");
      if (!form.bagWidth) errors.push("bagWidth");
      if (!form.bagDepth) errors.push("bagDepth");
    }
  } else if (isSticker(form.productType)) {
    if (templatePaperRequired && !form.stickerMaterial) errors.push("stickerMaterial");
    if (templateColorRequired && !form.colorMode) errors.push("colorMode");
  } else if (form.productType === "Воблеры") {
    // No extra required fields beyond the base material/color block.
  } else if (form.productType === "Бейджи") {
    if (!form.badgeHoleType) errors.push("badgeHoleType");
    if (form.badgeHoleType === "Круглое" && !form.badgeHoleCount) errors.push("badgeHoleCount");
  } else if (!isEnvelope(form.productType) && !isCalendar(form.productType) && !form.kashurovka.enabled && templatePaperRequired) {
    if (!form.paperType) errors.push("paperType");
    else if (form.paperType === "Дизайнерская" ? !form.paperCustomName.trim() : requiresPaperDensity(form.paperType) && !form.density.trim()) {
      errors.push(form.paperType === "Дизайнерская" ? "paperCustomName" : "density");
    }
    if (templateColorRequired && !form.colorMode && !isPaperlessPaperType(form.paperType)) errors.push("colorMode");
  }
  if (form.kashurovka.enabled) {
    if (form.kashurovka.connectionType === "Слим-каширование") {
      if (!form.kashurovka.slimPaperTopPaperType) errors.push("kashSlimPaperTopPaperType");
      else if (form.kashurovka.slimPaperTopPaperType === "Дизайнерская" ? !form.kashurovka.slimPaperTopPaperCustomName.trim() : requiresPaperDensity(form.kashurovka.slimPaperTopPaperType) && !form.kashurovka.slimPaperTopPaperDensity.trim()) {
        errors.push(form.kashurovka.slimPaperTopPaperType === "Дизайнерская" ? "kashSlimPaperTopPaperCustomName" : "kashSlimPaperTopPaperDensity");
      }
      if (!form.kashurovka.slimPaperBottomPaperType) errors.push("kashSlimPaperBottomPaperType");
      else if (form.kashurovka.slimPaperBottomPaperType === "Дизайнерская" ? !form.kashurovka.slimPaperBottomPaperCustomName.trim() : requiresPaperDensity(form.kashurovka.slimPaperBottomPaperType) && !form.kashurovka.slimPaperBottomPaperDensity.trim()) {
        errors.push(form.kashurovka.slimPaperBottomPaperType === "Дизайнерская" ? "kashSlimPaperBottomPaperCustomName" : "kashSlimPaperBottomPaperDensity");
      }
    } else {
      if (!form.kashurovka.baseType) errors.push("kashBaseType");
      if (!form.kashurovka.linerPaperType) errors.push("kashLinerPaperType");
      else if (form.kashurovka.linerPaperType === "Дизайнерская" ? !form.kashurovka.linerPaperCustomName.trim() : requiresPaperDensity(form.kashurovka.linerPaperType) && !form.kashurovka.linerPaperDensity.trim()) {
        errors.push(form.kashurovka.linerPaperType === "Дизайнерская" ? "kashLinerPaperCustomName" : "kashLinerPaperDensity");
      }
      if (form.kashurovka.forsacEnabled) {
        if (!form.kashurovka.forsacPaperType) errors.push("kashForsacPaperType");
        else if (form.kashurovka.forsacPaperType === "Дизайнерская" ? !form.kashurovka.forsacPaperCustomName.trim() : requiresPaperDensity(form.kashurovka.forsacPaperType) && !form.kashurovka.forsacPaperDensity.trim()) {
          errors.push(form.kashurovka.forsacPaperType === "Дизайнерская" ? "kashForsacPaperCustomName" : "kashForsacPaperDensity");
        }
      }
    }
  }
  if (form.binding && form.bindingType === "Пружина" && !form.springDiameter) errors.push("springDiameter");
  if (templateFlags.showPostProcessing && (form.postProcessing.includes("Тиснение фольгой") || form.postProcessing.includes("Фольгирование")) && !form.foilColor.trim()) errors.push("foilColor");
  if (templateFlags.showPostProcessing && form.postProcessing.includes("Сверление отверстий") && !form.drillingDiameter.trim()) errors.push("drillingDiameter");
  return Array.from(new Set(errors));
}

function getRequiredAdFields(form: AdFormData): string[] {
  const errors: string[] = [];
  if (!form.managerName.trim()) errors.push("adManagerName");
  if (!form.deadline) errors.push("adDeadline");
  if (isDeadlineTimeInPast(form.deadline, form.deadlineTime)) errors.push("adDeadlineTime");
  if (!form.fileLink.trim()) errors.push("adFileLink");
  return Array.from(new Set(errors));
}

const REQUIRED_FIELD_LABELS: Record<string, string> = {
  clientName: "Заказчик",
  managerName: "Менеджер",
  adManagerName: "Менеджер",
  deadline: "Дата сдачи",
  adDeadline: "Дата сдачи",
  adDeadlineTime: "Время сдачи",
  adFileLink: "Ссылка на файлы",
  subcontractNote: "Информация подряда",
  subcontractDate: "Дата подряда",
  subcontractTime: "Время подряда",
  subcontractTimePast: "Нельзя указывать прошедшее время подряда",
  productType: "Тип изделия",
  productTypeCustom: "Свой тип изделия",
  quantity: "Тираж",
  paperSize: "Формат / размер",
  paperSizeCustom: "Нестандартный формат",
  businessCardSize: "Формат визиток",
  businessCardSizeCustom: "Нестандартный формат визиток",
  envelopeSize: "Формат конверта",
  envelopeSizeCustom: "Нестандартный формат конверта",
  paperType: "Тип бумаги",
  paperCustomName: "Название дизайнерской бумаги",
  density: "Материал / бумага",
  colorMode: "Цветность",
  colorProof: "Цветопроба",
  pageCount: "Количество страниц",
  catalogFormat: "Формат продукции",
  catalogFormatCustom: "Нестандартный формат продукции",
  brochureFormat: "Формат брошюры",
  brochureFormatCustom: "Нестандартный формат брошюры",
  blockPages: "Листов в блоке",
  coverDensity: "Плотность бумаги обложки",
  coverPaperType: "Тип бумаги обложки",
  coverPaperCustomName: "Название дизайнерской бумаги обложки",
  coverColor: "Цветность обложки",
  backingPaperType: "Тип бумаги подложки",
  backingDensity: "Плотность бумаги подложки",
  backingPaperCustomName: "Название дизайнерской бумаги подложки",
  backingColor: "Цветность подложки",
  blockDensity: "Плотность бумаги блока",
  blockPaperType: "Тип бумаги блока",
  blockPaperCustomName: "Название дизайнерской бумаги блока",
  blockColor: "Цветность блока",
  calendarKind: "Вид календаря",
  adBlocks: "Рекламные блоки",
  calendarHeaderPaperType: "Бумага шапки",
  calendarHeaderPaperDensity: "Плотность шапки",
  calendarHeaderPaperCustomName: "Название дизайнерской бумаги шапки",
  wallMountDesc: "Описание ригеля / планки",
  calendarBaseMaterial: "Материал основания",
  bagHeight: "Высота пакета",
  bagWidth: "Ширина пакета",
  bagDepth: "Глубина пакета",
  bagPaperType: "Тип бумаги пакета",
  bagPartsCount: "Количество частей пакета",
  bagExternalSheets: "Сборка из сторонних листов",
  bagHandlePipsik: "Пипсик на ручках",
  stickerMaterial: "Материал наклейки",
  badgeHoleType: "Отверстие бейджа",
  badgeHoleCount: "Количество отверстий бейджа",
  kashBaseType: "Основа кашировки",
  kashLinerPaperType: "Тип бумаги лайнера",
  kashLinerPaperDensity: "Плотность лайнера",
  kashLinerPaperCustomName: "Название дизайнерской бумаги лайнера",
  kashForsacPaperType: "Тип бумаги форзаца",
  kashForsacPaperDensity: "Плотность форзаца",
  kashForsacPaperCustomName: "Название дизайнерской бумаги форзаца",
  kashSlimPaperTopPaperType: "Тип бумаги 1 в слим-кашировке",
  kashSlimPaperTopPaperDensity: "Плотность бумаги 1 в слим-кашировке",
  kashSlimPaperTopPaperCustomName: "Название дизайнерской бумаги 1 в слим-кашировке",
  kashSlimPaperBottomPaperType: "Тип бумаги 2 в слим-кашировке",
  kashSlimPaperBottomPaperDensity: "Плотность бумаги 2 в слим-кашировке",
  kashSlimPaperBottomPaperCustomName: "Название дизайнерской бумаги 2 в слим-кашировке",
  springDiameter: "Диаметр пружины",
  foilColor: "Цвет фольги",
  drillingDiameter: "Диаметр сверления",
  deadlineTime: "Время сдачи",
};

function CompactApp() {
  return null;
}

export default LegacyApp;




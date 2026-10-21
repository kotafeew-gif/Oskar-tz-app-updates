import type {
  AdFormData, ClientStore, DesktopCalendarPart, Dicts, FormData,
  KashurovkaBlock, LaminationBlock, ManagerMarkerState, NotebookPart, OtherPaperEntry,
  PaperFinish, PaperSelectionValue, PresetEntry, PresetStore,
  QuarterAdPart, ReservedAssignment, SubcontractWork, SuccessImageStats,
} from "./types";
import {
  AUTO_REVERSE_COLOR, BAG_COLOR_OPTIONS, BAG_HANDLE_TYPES,
  CALENDAR_OFFSET_COLORS, DEFAULT_BINDING_TYPES,
  DEFAULT_BUSINESS_CARD_SIZES, DEFAULT_COLORS, DEFAULT_DENSITIES,
  DEFAULT_ENVELOPE_SIZES, DEFAULT_LAMINATION_KINDS,
  DEFAULT_LAMINATION_THICKNESS, DEFAULT_MANAGERS,
  DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES, DEFAULT_PAPER_LIBRARY,
  DEFAULT_PAPER_PROFILES, DEFAULT_PAPER_SIZES,
  DEFAULT_POCKET_CALENDAR_SIZES, DEFAULT_POST_PROCESSING,
  DEFAULT_PRODUCT_TEMPLATES, DEFAULT_PRODUCT_TYPES, DRILL_DIAMETERS,
  FORSAC_PAPER_TYPES, KASHUROVKA_BASE_TYPES, KASHUROVKA_LINER_TYPES,
  LS_KEYS, PAPER_PROFILE_LABELS, PAPER_TYPE_OPTIONS,
  PAPER_TYPE_TO_LIBRARY_KEY, STICKER_COLOR_MODES, STICKER_MATERIALS,
  DEFAULT_AD_MANAGERS, DEFAULT_PRODUCT_TEMPLATE_FIELDS,
  DEFAULT_PRODUCT_TEMPLATE_FLAGS, DEFAULT_PRODUCT_TEMPLATE_KINDS,
  PRODUCT_TEMPLATE_FIELD_KEYS, SPRING_SPECS,
  SUCCESS_IMAGE_NAMES, SUCCESS_IMAGE_SRCS, SUCCESS_IMAGE_WEIGHTS, runtimeState,
  type BagPaperTypeOption, type PaperLibraryKey, type PaperProfileKey,
  type PaperTypeOption, type ProductLayoutKind,
  type ProductTemplateConfig, type ProductTemplateFieldConfig,
  type ProductTemplateFieldKey, type ProductTemplateFlags,
  type ProductTemplateStore, type SpringSpec,
} from "./constants";

export function getRandomSuccessImageSrc(previousSrc = ""): string {
  if (SUCCESS_IMAGE_SRCS.length === 0) return "";
  if (SUCCESS_IMAGE_SRCS.length === 1) return SUCCESS_IMAGE_SRCS[0];

  const pool = SUCCESS_IMAGE_SRCS.filter((src) => src !== previousSrc);
  if (pool.length === 0) return SUCCESS_IMAGE_SRCS[0];

  const totalWeight = pool.reduce((sum, src) => sum + (SUCCESS_IMAGE_WEIGHTS[src.split("/").pop() || ""] ?? 1), 0);
  let pick = Math.random() * totalWeight;
  for (const src of pool) {
    const weight = SUCCESS_IMAGE_WEIGHTS[src.split("/").pop() || ""] ?? 1;
    if (pick < weight) return src;
    pick -= weight;
  }
  return pool[pool.length - 1];
}

export function loadList(key: string, defaults: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaults;
    }
  } catch {}
  return defaults;
}

export function saveList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function normalizeSpringSpecs(value: unknown): SpringSpec[] {
  if (!Array.isArray(value)) return [...SPRING_SPECS];
  const result: SpringSpec[] = value.map((item: any) => ({
    diameter: String(item?.diameter || "").trim(),
    pitch: (item?.pitch === "3:1" ? "3:1" : "2:1") as SpringSpec["pitch"],
    capacityMm: Number(item?.capacityMm) || 0,
    subcontract: Boolean(item?.subcontract),
    note: String(item?.note || "").trim(),
  })).filter((item: SpringSpec) => item.diameter && item.capacityMm > 0);
  return result.length ? result : [...SPRING_SPECS];
}

export function loadSpringSpecs(): SpringSpec[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.springSpecs);
    return normalizeSpringSpecs(raw ? JSON.parse(raw) : null);
  } catch {
    return [...SPRING_SPECS];
  }
}

export function saveSpringSpecs(specs: SpringSpec[]) {
  localStorage.setItem(LS_KEYS.springSpecs, JSON.stringify(specs));
}

export function loadPaperLibrary(): typeof DEFAULT_PAPER_LIBRARY {
  try {
    const raw = localStorage.getItem(LS_KEYS.paperLibrary);
    if (!raw) return DEFAULT_PAPER_LIBRARY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PAPER_LIBRARY;

    return normalizePaperLibrary(parsed);
  } catch {
    return DEFAULT_PAPER_LIBRARY;
  }
}

export function savePaperLibrary(library: typeof DEFAULT_PAPER_LIBRARY) {
  localStorage.setItem(LS_KEYS.paperLibrary, JSON.stringify(library));
}

export function loadPaperProfiles(): typeof DEFAULT_PAPER_PROFILES {
  try {
    const raw = localStorage.getItem(LS_KEYS.paperProfiles);
    if (!raw) return DEFAULT_PAPER_PROFILES;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PAPER_PROFILES;

    const next = { ...DEFAULT_PAPER_PROFILES };
    (Object.keys(DEFAULT_PAPER_PROFILES) as PaperProfileKey[]).forEach((key) => {
      const value = parsed[key];
      next[key] = key === "calendarBase"
        ? [...DEFAULT_PAPER_PROFILES.calendarBase]
        : Array.isArray(value) ? mergeUniqueStrings(value, DEFAULT_PAPER_PROFILES[key]) : DEFAULT_PAPER_PROFILES[key];
    });
    return next;
  } catch {
    return DEFAULT_PAPER_PROFILES;
  }
}

export function savePaperProfiles(profiles: typeof DEFAULT_PAPER_PROFILES) {
  localStorage.setItem(LS_KEYS.paperProfiles, JSON.stringify(profiles));
}

export function loadManagerMarkerState(): ManagerMarkerState {
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

export function saveManagerMarkerState(state: ManagerMarkerState) {
  localStorage.setItem(LS_KEYS.managerMarkerState, JSON.stringify(state));
}

export function parseManagerMarkerIndex(marker: string): number {
  const match = /^#(\d+)$/.exec(String(marker || "").trim());
  return match ? Number(match[1]) : 0;
}

export function normalizeManagerMarkerState(
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

export function mergeUniqueStrings(primary: string[], fallback: string[]): string[] {
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

export function normalizeStringList(items: unknown[]): string[] {
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

export function normalizePaperLibrary(value: unknown): typeof DEFAULT_PAPER_LIBRARY {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const normalizeKey = (key: PaperLibraryKey) => {
    const items = Array.isArray(source[key]) ? normalizeStringList(source[key] as unknown[]) : [];
    return items.length ? items : [...DEFAULT_PAPER_LIBRARY[key]];
  };

  return {
    coated: normalizeKey("coated"),
    offset: normalizeKey("offset"),
    calender: normalizeKey("calender"),
    cardboard: ["270 г/м²"],
    designer: normalizeKey("designer"),
  };
}

export function normalizeTemplateFlags(flags: unknown, fallbackKind: ProductLayoutKind): ProductTemplateFlags {
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

export function normalizeTemplateFields(fields: unknown): Record<ProductTemplateFieldKey, ProductTemplateFieldConfig> {
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

export function normalizeProductTemplatesPayload(payload: any): ProductTemplateStore {
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

export function loadProductTemplates(): ProductTemplateStore {
  try {
    const raw = localStorage.getItem(LS_KEYS.productTemplates);
    if (!raw) return { ...DEFAULT_PRODUCT_TEMPLATES };
    return normalizeProductTemplatesPayload(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PRODUCT_TEMPLATES };
  }
}

export function saveProductTemplates(templates: ProductTemplateStore) {
  localStorage.setItem(LS_KEYS.productTemplates, JSON.stringify(templates));
}

export function createProductTemplateConfig(kind: ProductLayoutKind, base?: Partial<ProductTemplateConfig>): ProductTemplateConfig {
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

export function applyProductTemplateMigrations(name: string, template: ProductTemplateConfig): ProductTemplateConfig {
  if (normalizeTemplateName(name) === "Наклейки" && template.kind === "sticker" && !template.flags.showLamination) {
    return {
      ...template,
      flags: {
        ...template.flags,
        showLamination: true,
      },
    };
  }
  return template;
}

export function syncProductTemplatesToTypes(templates: ProductTemplateStore, productTypes: string[]): ProductTemplateStore {
  const next: ProductTemplateStore = {};
  const types = new Set(productTypes.map((name) => normalizeTemplateName(name)).filter(Boolean));

  productTypes.forEach((name) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    next[cleanName] = applyProductTemplateMigrations(
      cleanName,
      createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || templates[cleanName]?.kind || "standard", templates[cleanName]),
    );
  });

  Object.keys(templates).forEach((name) => {
    if (!types.has(name)) return;
    if (!next[name]) next[name] = applyProductTemplateMigrations(name, createProductTemplateConfig(templates[name].kind, templates[name]));
  });

  return next;
}

export function createDefaultManagerMarkers(managers: string[]): ManagerMarkerState {
  return normalizeManagerMarkerState(managers, [], {}, 0);
}

export function normalizeDictsPayload(payload: any): Dicts {
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

  const springSpecs = normalizeSpringSpecs(payload?.springSpecs);

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
    notebookCompositionPartTypes: Array.isArray(payload?.notebookCompositionPartTypes)
      ? normalizeList(payload.notebookCompositionPartTypes)
      : [...DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES],
    laminationKinds: mergeUniqueStrings(normalizeList(payload?.laminationKinds), DEFAULT_LAMINATION_KINDS),
    laminationThickness: normalizeList(payload?.laminationThickness),
    springSpecs,
    managers: normalizeList(payload?.managers),
    adManagers: normalizeList(payload?.adManagers).length ? normalizeList(payload?.adManagers) : [...DEFAULT_AD_MANAGERS],
    ...normalizeManagerMarkerState(
      normalizeList(payload?.managers),
      normalizeList(payload?.managers),
      payload?.managerMarkers && typeof payload.managerMarkers === "object" ? payload.managerMarkers as Record<string, string> : {},
      Number(payload?.managerMarkerCounter) || 0,
    ),
    paperProfiles: Object.fromEntries((Object.keys(DEFAULT_PAPER_PROFILES) as PaperProfileKey[]).map((key) => [key, key === "calendarBase" ? [...DEFAULT_PAPER_PROFILES.calendarBase] : mergeUniqueStrings(normalizeList(payload?.paperProfiles?.[key]), DEFAULT_PAPER_PROFILES[key])])) as typeof DEFAULT_PAPER_PROFILES,
    paperLibrary: normalizePaperLibrary(payload?.paperLibrary),
  };
}

export function createInitialDicts(): Dicts {
  const managerState = loadManagerMarkerState();
  const managers = loadList(LS_KEYS.managers, DEFAULT_MANAGERS);
  const adManagers = loadList(LS_KEYS.adManagers, DEFAULT_AD_MANAGERS);
  const normalizedManagers = normalizeManagerMarkerState(managers, managers, managerState.managerMarkers, managerState.managerMarkerCounter);

  const productTypes = ensureProductTypes(mergeUniqueStrings(loadList(LS_KEYS.productTypes, DEFAULT_PRODUCT_TYPES), Object.keys(loadProductTemplates())));
  const productTemplates = syncProductTemplatesToTypes(loadProductTemplates(), productTypes);
  runtimeState.productTemplates = productTemplates;

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
    springSpecs: loadSpringSpecs(),
    notebookCompositionPartTypes: mergeUniqueStrings(loadList(LS_KEYS.notebookCompositionPartTypes, DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES as unknown as string[]), DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES as unknown as string[]),
    managers: normalizeStringList(managers),
    adManagers: normalizeStringList(adManagers),
    managerMarkers: normalizedManagers.managerMarkers,
    managerMarkerCounter: normalizedManagers.managerMarkerCounter,
    paperProfiles: loadPaperProfiles(),
    paperLibrary: loadPaperLibrary(),
  };
}

export function createResetDicts(): Dicts {
  const managerState = createDefaultManagerMarkers(DEFAULT_MANAGERS);
  const productTypes = ensureProductTypes(mergeUniqueStrings([...DEFAULT_PRODUCT_TYPES], Object.keys(DEFAULT_PRODUCT_TEMPLATES)));
  const productTemplates = syncProductTemplatesToTypes({ ...DEFAULT_PRODUCT_TEMPLATES }, productTypes);
  runtimeState.productTemplates = productTemplates;

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
    springSpecs: [...SPRING_SPECS],
    notebookCompositionPartTypes: [...DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES],
    managers: [...DEFAULT_MANAGERS],
    adManagers: [...DEFAULT_AD_MANAGERS],
    managerMarkers: managerState.managerMarkers,
    managerMarkerCounter: managerState.managerMarkerCounter,
    paperProfiles: { ...DEFAULT_PAPER_PROFILES },
    paperLibrary: { ...DEFAULT_PAPER_LIBRARY },
  };
}

export const defaultLaminationBlock = (): LaminationBlock => ({ enabled: false, side: "", thickness: "", kind: "", kindCustom: "" });
export const defaultKashurovkaBlock = (): KashurovkaBlock => ({
  enabled: false, baseType: "", baseCustomName: "", linerType: "", linerSize: "", connectionType: "Каширование", turnoverType: "Без заворота",
  forsacEnabled: false, forsacPaper: "", forsacSize: "", forsacPrintMode: "Белые",
  linerFinish: "Матовая", linerColor: "", linerLamination: defaultLaminationBlock(), forsacFinish: "Матовая", forsacColor: "", forsacLamination: defaultLaminationBlock(),
  slimPaperTop: "", slimPaperBottom: "", slimPaperTopLamination: defaultLaminationBlock(), slimPaperBottomLamination: defaultLaminationBlock(),
  slimPaperTopFinish: "Матовая", slimPaperTopColor: "", slimPaperBottomFinish: "Матовая", slimPaperBottomColor: "",
  linerPaperType: "", linerPaperCustomName: "", linerPaperDensity: "",
  forsacPaperType: "", forsacPaperCustomName: "", forsacPaperDensity: "",
  slimPaperTopPaperType: "", slimPaperTopPaperCustomName: "", slimPaperTopPaperDensity: "",
  slimPaperBottomPaperType: "", slimPaperBottomPaperCustomName: "", slimPaperBottomPaperDensity: "",
});

export function createSubcontractWork(): SubcontractWork {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    note: "",
    date: "",
    time: "",
  };
}

export function createQuarterAdPart(): QuarterAdPart {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    size: "",
    paperType: "Мелованная",
    paperCustomName: "",
    density: "",
    finish: "Матовая",
    lamination: defaultLaminationBlock(),
    colorMode: "",
  };
}

export const DESKTOP_CALENDAR_PART_TYPES = ["Обложка", "Календарный блок", "Лист с праздниками", "Другое"];

export function createDesktopCalendarPart(type = "Календарный блок"): DesktopCalendarPart {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    customName: "",
    size: "",
    quantity: "",
    paperType: "Мелованная",
    paperCustomName: "",
    density: "",
    finish: "Матовая",
    colorMode: "",
    lamination: defaultLaminationBlock(),
    note: "",
  };
}

export function createEmptySuccessImageStats(): SuccessImageStats {
  return { byImage: {}, byManager: {} };
}

export function loadSuccessImageStats(): SuccessImageStats {
  try {
    const raw = localStorage.getItem(LS_KEYS.successImageStats);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return createEmptySuccessImageStats();
    return {
      byImage: parsed.byImage && typeof parsed.byImage === "object" ? parsed.byImage : {},
      byManager: parsed.byManager && typeof parsed.byManager === "object" ? parsed.byManager : {},
    };
  } catch {
    return createEmptySuccessImageStats();
  }
}

export function createNotebookPart(): NotebookPart {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "Листы блока",
    quantity: "",
    offsetPrinting: false,
    paperType: "",
    paperCustomName: "",
    density: "",
    finish: "Матовая",
    color: "Без печати",
    lamination: defaultLaminationBlock(),
    note: "",
  };
}

export function createOtherPaperEntry(): OtherPaperEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    size: "",
    paperType: "",
    paperCustomName: "",
    density: "",
    finish: "Матовая",
    color: "Без печати",
    lamination: defaultLaminationBlock(),
    note: "",
  };
}

export function createEmptyClientStore(): ClientStore {
  return { byManager: {} };
}

export function createEmptyPresetStore(): PresetStore {
  return { byManager: {} };
}

export function createDefaultForm(): FormData {
  return {
    orderNumber: "", clientName: "", managerName: "", deadline: "", deadlineTime: "", quantity: "",
    cellBooking: "",
    productType: "", productTypeCustom: "", paperSize: "", paperSizeCustom: "", envelopeSize: "", envelopeSizeCustom: "",
    businessCardSize: "", businessCardSizeCustom: "",
    paperType: "", paperCustomName: "", density: "", densityFinish: "Матовая", colorProof: "Не надо", colorMode: "", pageCount: "", coverUseKash: false, coverPaperType: "", coverPaperCustomName: "", coverDensity: "", coverFinish: "Матовая", coverColor: "", coverLamination: defaultLaminationBlock(),
    backingEnabled: false, backingPaperType: "", backingPaperCustomName: "", backingDensity: "", backingFinish: "Матовая", backingColor: "", backingLamination: defaultLaminationBlock(),
    catalogFormat: "", catalogFormatCustom: "",
    brochureFormat: "", brochureFormatCustom: "",
    blockPaperType: "", blockPaperCustomName: "", blockDensity: "", blockFinish: "Матовая", blockColor: "", blockOffsetPrinting: false, blockLamination: defaultLaminationBlock(), blockPages: "",
    adBlocks: "3", calendarKind: "Настенный", wallMountType: "Ригель", wallMountDesc: "", wallMountColor: "", gridType: "Цифра", hasPlanka: false, plankaDesc: "", hasRigel: false,
    quarterPosterSize: "", quarterPosterPaperType: "Мелованная", quarterPosterPaperCustomName: "", quarterPosterDensity: "", quarterPosterFinish: "Матовая", quarterPosterColorMode: "", quarterPosterLamination: defaultLaminationBlock(), quarterAdBlocks: "1", quarterAdFieldsSame: false, quarterAdParts: [createQuarterAdPart()], quarterGridStandard: true, quarterGridName: "", quarterGridSize: "", quarterGridPaperType: "Мелованная", quarterGridPaperCustomName: "", quarterGridDensity: "", quarterGridFinish: "Матовая", quarterGridColorMode: "", quarterGridPrintMode: "У себя", quarterBackingEnabled: false, quarterBackingSize: "", quarterBackingPaperType: "Мелованная", quarterBackingPaperCustomName: "", quarterBackingDensity: "", quarterBackingFinish: "Матовая", quarterBackingColorMode: "", quarterMountType: "Планка", quarterMountColor: "Серебро", quarterSpringColor: "Белая", quarterCursorColor: "Красный", quarterCursorType: "Без резинки",
    calendarBaseUseKash: false, calendarBaseMaterial: "", calendarBaseCustomName: "", calendarBaseSize: "", calendarBaseColorMode: "", calendarBaseFinish: "Матовая", calendarBaseLamination: defaultLaminationBlock(), calendarBaseBigovkaLines: "", calendarGridMaterial: "", calendarGridPages: "", calendarGridSize: "", calendarGridFinish: "Матовая", calendarGridColorMode: "", calendarOffsetColor: "Серый",
    desktopCalendarCompositionEnabled: false, desktopCalendarParts: [],
    calendarHeaderPaperType: "", calendarHeaderPaperCustomName: "", calendarHeaderPaperDensity: "", calendarHeaderPaperFinish: "Матовая", calendarHeaderSize: "", calendarHeaderColorMode: "", calendarHeaderLamination: defaultLaminationBlock(),
    postProcessing: [], foilColor: "", uvType: "Обычный", bigkovka: false, bigkovkaLines: "1", drillingDiameter: "", falcovka: false,
    lamination: defaultLaminationBlock(), kashurovka: defaultKashurovkaBlock(),
    binding: false, bindingType: "Скоба", stapleCount: "Одна", staplePosition: "Лево", springColor: "Белая", springColorCustom: "", springDiameter: "", springDiameterStrict: false, springPosition: "По широкой стороне", springHidden: false,
    subcontractWorks: [], notebookCompositionEnabled: false, notebookParts: [], otherPaperEntries: [],
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

export function createDefaultAdForm(): AdFormData {
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

export const defaultForm: FormData = createDefaultForm();
export const defaultAdForm: AdFormData = createDefaultAdForm();

const PRESET_EXCLUDED_FIELDS = new Set<keyof FormData>([
  "orderNumber",
  "clientName",
  "managerName",
  "deadline",
  "deadlineTime",
  "cellBooking",
  "fileLink",
  "subcontractWorks",
  "quantity",
]);

export function isPlainObject(value: unknown): value is Record<string, any> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function buildPresetPayload(form: FormData): Partial<FormData> {
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

export function mergePresetIntoForm(base: FormData, presetData: Partial<FormData>): FormData {
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

  const normalizedPresetData: Partial<FormData> = {
    ...presetData,
    notebookParts: Array.isArray(presetData.notebookParts)
      ? presetData.notebookParts.map((part) => mergeValue(createNotebookPart(), part))
      : presetData.notebookParts,
    otherPaperEntries: Array.isArray(presetData.otherPaperEntries)
      ? presetData.otherPaperEntries.map((entry) => mergeValue(createOtherPaperEntry(), entry))
      : presetData.otherPaperEntries,
    desktopCalendarParts: Array.isArray(presetData.desktopCalendarParts)
      ? presetData.desktopCalendarParts.map((part) => mergeValue(createDesktopCalendarPart(String(part.type || "Календарный блок")), part))
      : presetData.desktopCalendarParts,
  };

  return mergeValue(base, normalizedPresetData) as FormData;
}

// ─── Вспомогательные функции ────────────────────────────────────────────────

const MULTIBLOCK_TYPES = ["Каталоги", "Брошюры"];
const PRODUCT_TYPE_ALIASES: Record<string, string> = {
  "Открытки": "Открытка",
  "Сертификат": "Сертификаты",
};
export function normalizeTemplateName(name: string): string {
  const clean = name.trim();
  return PRODUCT_TYPE_ALIASES[clean] || clean;
}

export function getProductTemplate(name: string): ProductTemplateConfig {
  const normalizedName = normalizeTemplateName(name);
  const store = runtimeState.productTemplates;
  const fallbackKind = DEFAULT_PRODUCT_TEMPLATE_KINDS[normalizedName] || "standard";
  const existing = store[normalizedName];
  return {
    kind: existing?.kind || fallbackKind,
    flags: existing?.flags || { ...DEFAULT_PRODUCT_TEMPLATE_FLAGS[fallbackKind] },
    fields: existing?.fields || createProductTemplateConfig(fallbackKind).fields,
  };
}

export function getProductLayoutKind(name: string): ProductLayoutKind {
  return getProductTemplate(name).kind;
}

export function isLayout(name: string, kind: ProductLayoutKind): boolean {
  return getProductLayoutKind(name) === kind;
}

export function getProductTemplateFieldConfig(productType: string, fieldKey: ProductTemplateFieldKey): ProductTemplateFieldConfig {
  const template = getProductTemplate(productType);
  return template.fields[fieldKey] || DEFAULT_PRODUCT_TEMPLATE_FIELDS[fieldKey];
}

export function getProductTemplateFieldLabel(productType: string, fieldKey: ProductTemplateFieldKey): string {
  return getProductTemplateFieldConfig(productType, fieldKey).label;
}

export function isProductTemplateFieldRequired(productType: string, fieldKey: ProductTemplateFieldKey): boolean {
  return getProductTemplateFieldConfig(productType, fieldKey).required;
}

export const isMultiBlock = (pt: string) => ["catalog", "brochure"].includes(getProductLayoutKind(pt));
export const isCatalog = (pt: string) => getProductLayoutKind(pt) === "catalog";
export const isBrochure = (pt: string) => getProductLayoutKind(pt) === "brochure";
export const isCalendar = (pt: string) => isLayout(pt, "calendar");
export const isNotebook = (pt: string) => isLayout(pt, "notebook");
export const isEnvelope = (pt: string) => isLayout(pt, "envelope");
export const isBusinessCard = (pt: string) => isLayout(pt, "businessCard");
export const isBag = (pt: string) => isLayout(pt, "bag") || pt === "Пакеты";
export const isSticker = (pt: string) => isLayout(pt, "sticker");
export const isCubariki = (pt: string) => isLayout(pt, "cubes") || normalizeTemplateName(pt) === "Кубарики";
export const PAPER_FINISHES: PaperFinish[] = ["Матовая", "Глянцевая"];

export function isPocketCalendar(form: FormData): boolean {
  return isCalendar(form.productType) && form.calendarKind === "Карманный";
}

export function ensureProductTypes(list: string[]): string[] {
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

  const additions = ["Бумажные Пакеты", "Воблеры", "Бейджи", "Кубарики"];
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

export function resolveProductName(form: FormData): string {
  return (form.productType === "Другое..." || form.productType === "Другое") ? form.productTypeCustom.trim() : form.productType;
}

export function formatProductNameForTZ(form: FormData, lower = false): string {
  const product = resolveProductName(form);
  if (!product) return "";
  const text = isSticker(form.productType) && form.stickerPacks
    ? product.replace(/наклейки/gi, "Стикерпаки")
    : product;
  return lower ? text.toLowerCase() : text;
}

export function formatNotebookColorText(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed === "Без печати") return "без печати";
  return normalizeColorMode(trimmed);
}

export function normalizeMaterial(material: string): string {
  return material.replace(/\s*\(.*\)/, "").trim();
}

export function normalizeColorMode(value: string | null | undefined): string {
  return String(value || "").replace(/\s*\(.*\)/, "").trim();
}

export function stripParentheticalNote(value: string): string {
  return value.replace(/\s*\([^)]*\)/g, "").trim();
}

export function getTodayLocalIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDateForFilename(isoDate: string): string {
  if (!isoDate) return getTodayLocalIso().split("-").reverse().join(".");
  return isoDate.split("-").reverse().join(".");
}

export function getCurrentDateTimeForFilename(): string {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
  return `${date} ${time}`;
}

export function getLaminationSideNotation(side: string): string {
  if (side === "Двухсторонняя") return "1+1";
  if (side === "Односторонняя") return "1+0";
  return "";
}

export function formatLamination(value: LaminationBlock): string {
  if (!value.enabled) return "Без ламинации";
  const kind = value.kind === "Нестандартный" ? (value.kindCustom || "Нестандартный") : value.kind;
  return [getLaminationSideNotation(value.side), kind, value.thickness].filter(Boolean).join(", ") || "Параметры не выбраны";
}

export function formatLaminationCompact(value: LaminationBlock): string {
  if (!value.enabled) return "без лам.";
  const kind = value.kind === "Нестандартный" ? (value.kindCustom || "Нестандартный") : value.kind;
  const kindLower = kind.toLowerCase();
  if (kindLower.includes("карм")) {
    return `лам. карм.${value.thickness ? ` ${value.thickness}` : ""}`;
  }
  const compactKind = kind === "Глянцевая" ? "глян." : kind === "Матовая" ? "мат." : kind ? (value.kind === "Нестандартный" ? kind : "софт") : "";
  return ["лам.", getLaminationSideNotation(value.side), compactKind, value.thickness].filter(Boolean).join(" ");
}

export function formatFileCountText(value: string): string {
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

export function generateAdShortTZ(form: AdFormData): string {
  return [form.fileLink.trim(), formatFileCountText(form.fileCount), form.notes.trim()].filter(Boolean).join("\n");
}

export function formatPaperSelection(type: PaperTypeOption | "", value: string, customName = "", envelopeLabel = false): string {
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

export function formatPaperSelectionWithFinish(type: PaperTypeOption | "", value: string, customName: string, finish: PaperFinish, envelopeLabel = false): string {
  const paper = formatPaperSelection(type, value, customName, envelopeLabel);
  if (!paper) return "";
  if (type === "Без бумаги" || type === "Давальческая") return paper;
  return type === "Мелованная" && finish === "Глянцевая" ? `Глянцевая ${paper}` : paper;
}

export function formatPaperSelectionForTZ(type: PaperTypeOption | "", value: string, customName = "", envelopeLabel = false): string {
  if (type === "Без бумаги") return "";
  return formatPaperSelection(type, value, customName, envelopeLabel);
}

export function formatPaperSelectionWithFinishForTZ(type: PaperTypeOption | "", value: string, customName: string, finish: PaperFinish, envelopeLabel = false): string {
  if (type === "Без бумаги") return "";
  const paper = formatPaperSelection(type, value, customName, envelopeLabel);
  if (!paper || type === "Давальческая") return paper;
  return type === "Мелованная" && finish === "Глянцевая" ? `Глянцевая ${paper}` : paper;
}

export function isPaperlessPaperType(type: PaperTypeOption | ""): boolean {
  return type === "Без бумаги" || type === "Давальческая";
}

export function isCoated115Paper(type: PaperTypeOption | "", density: string): boolean {
  return type === "Мелованная" && normalizeMaterial(density) === "115 г/м²";
}

export function paperFinishOptionsForSelection(type: PaperTypeOption | "", density: string): PaperFinish[] {
  return isCoated115Paper(type, density) ? ["Матовая"] : PAPER_FINISHES;
}

export function requiresPaperDensity(type: PaperTypeOption | ""): boolean {
  return !!type && type !== "Дизайнерская" && type !== "Без бумаги" && type !== "Давальческая";
}

export function paperSelectionKey(selection: PaperSelectionValue): string {
  return [
    selection.type,
    normalizeMaterial(selection.value).toLowerCase(),
    selection.customName.trim().toLowerCase(),
    selection.finish,
  ].join("|");
}

export function isSamePaperSelection(left: PaperSelectionValue, right: PaperSelectionValue): boolean {
  return !!formatPaperSelectionWithFinish(left.type, left.value, left.customName, left.finish)
    && paperSelectionKey(left) === paperSelectionKey(right);
}

export function getCurrentLocalTimeIso(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function isDateTimeInPast(date: string, time: string): boolean {
  if (!date || date !== getTodayLocalIso()) return false;
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  return time < getCurrentLocalTimeIso();
}

export function isDeadlineTimeInPast(deadline: string, time: string): boolean {
  return isDateTimeInPast(deadline, time);
}

export function formatDateTimeText(date: string, time: string): string {
  const dateText = date ? date.split("-").reverse().join(".") : "—";
  return time ? `${dateText} ${time}` : dateText;
}

export function formatQuantityText(value: string): string {
  const normalized = String(value || "").replace(/\s+/g, "").trim();
  if (!normalized) return "—";
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return normalized;
  return parsed.toLocaleString("ru-RU").replace(/\u00A0/g, " ");
}

export function getActiveSubcontractWorks(form: FormData): SubcontractWork[] {
  return form.subcontractWorks.filter((work) => work.note.trim() || work.date || work.time);
}

export function normalizeClientName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeManagerName(value: string): string {
  return normalizeClientName(value);
}

export function getClientSuggestions(store: ClientStore, managerName: string): string[] {
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

export function getPaperLibraryItems(library: typeof DEFAULT_PAPER_LIBRARY, type: PaperTypeOption | ""): string[] {
  if (!type) return [];
  return library[PAPER_TYPE_TO_LIBRARY_KEY[type]] || [];
}

export function parseWeight(material: string): number {
  const match = material.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

const MATERIAL_THICKNESS_MICRONS: Record<string, number> = {
  "офсет 80": 100, "офсет 100": 124, "офсет 120": 140, "офсет 160": 180,
  "каландр 90": 98, "каландр 100": 106, "каландр 120": 126, "каландр 160": 166,
  "каландр 200": 200, "каландр 250": 245, "каландр 300": 305, "каландр 350": 350,
  "мел мат 90": 80, "мел мат 115": 110, "мел мат 130": 131, "мел мат 150": 153,
  "мел мат 170": 175, "мел мат 200": 210, "мел мат 250": 250, "мел мат 300": 285, "мел мат 350": 340,
  "мел глянец 90": 75, "мел глянец 115": 91, "мел глянец 130": 105, "мел глянец 150": 125,
  "мел глянец 170": 147, "мел глянец 200": 176, "мел глянец 250": 225, "мел глянец 300": 270, "мел глянец 350": 330,
  "картон 270": 390,
  "пластиковая обложка гл": 200, "пластиковая обложка мат": 400,
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

export function interpolateThickness(gsm: number, table: Record<number, number>): number | null {
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

export function estimateThicknessMm(material: string, finish: PaperFinish = "Матовая"): number {
  const normalized = String(material || "").toLowerCase().replace(/\s+/g, " ").trim();
  const mmMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*мм/);
  if (mmMatch && (normalized.includes("картон") || normalized.includes("капа"))) return Number(mmMatch[1].replace(",", "."));
  const gsm = parseWeight(material);
  if (!gsm) return 0;

  const isPlasticCover = normalized.includes("пластиковая обложка");
  if (isPlasticCover) return (normalized.includes(" гл") ? 200 : 400) / 1000;

  const isOffset = normalized.includes("офсет") || normalized.includes("офис");
  const isCalender = normalized.includes("каландр");
  const isCoated = normalized.includes("мелован") || normalized.includes("мел ");
  const finishKey = finish === "Глянцевая" ? "мел глянец" : "мел мат";
  const densityKey = Number.isFinite(gsm) ? String(gsm) : "";
  const tableKey = isOffset ? `офсет ${densityKey}` : isCalender ? `каландр ${densityKey}` : isCoated ? `${finishKey} ${densityKey}` : `картон ${densityKey}`;
  const tableMicrons = MATERIAL_THICKNESS_MICRONS[tableKey];
  if (tableMicrons) return tableMicrons / 1000;

  const isKraft = normalized.includes("крафт");
  const isCoatedByName = normalized.includes("мелов");

  if (isKraft) return Math.max(gsm / 670, 0.08);

  if (isOffset || (!isCoatedByName && finish === "Матовая")) {
    return Math.max(gsm / 750, 0.06);
  }

  const coatedTable = finish === "Глянцевая" ? COATED_GLOSS_THICKNESS_MM : COATED_MATTE_THICKNESS_MM;
  return interpolateThickness(gsm, coatedTable) ?? Math.max(gsm / (finish === "Глянцевая" ? 1080 : 980), 0.06);
}

export function findSpringSpecForThickness(thickness: number): SpringSpec | null {
  if (!thickness || thickness <= 0) return null;
  const specs = runtimeState.springSpecs.length ? runtimeState.springSpecs : SPRING_SPECS;
  return specs.find((spec) => spec.capacityMm >= thickness) ?? specs[specs.length - 1];
}

export function getSpringColor(form: FormData): string {
  return form.springColor === "Другой цвет..." ? form.springColorCustom.trim() : form.springColor;
}

export function getSpringDiameterText(form: FormData): string {
  if (!form.springDiameter) return "";
  return form.springDiameterStrict ? `СТРОГО ${form.springDiameter}` : form.springDiameter;
}

export function getSpringSpecNote(spec: SpringSpec): string {
  return spec.note || (spec.subcontract ? "подряд" : "");
}

export function getSpringOutputParts(form: FormData): string[] {
  return [
    "пружина",
    getSpringColor(form)?.toLowerCase(),
    getSpringDiameterText(form),
    form.springPosition?.toLowerCase(),
    form.springHidden ? "скрытая" : "",
  ].filter(Boolean);
}

export function getBagColor(value: string, custom: string): string {
  return value === "Другой цвет..." ? custom.trim() : value;
}

export function getBagHandleText(form: FormData): string {
  const color = getBagColor(form.bagHandleColor, form.bagHandleColorCustom);
  if (form.bagHandleType === "Лента") {
    return color ? `лента, ${color}` : "лента";
  }
  const pipsik = form.bagHandlePipsik.trim().toLowerCase();
  if (!color) return pipsik;
  return pipsik ? `${color}, ${pipsik}` : color;
}

export function formatBagPaperSelection(form: FormData): string {
  const density = normalizeMaterial(form.density);
  if (!form.bagPaperType) return density;
  return density ? `${form.bagPaperType} ${density}` : form.bagPaperType;
}

export function buildSpringSuggestion(form: FormData): { thickness: number; diameter: string; capacityMm: number; pitch: SpringSpec["pitch"]; subcontract: boolean } | null {
  if (form.bindingType !== "Пружина") return null;

  if (isCalendar(form.productType) && form.calendarKind === "Настольный" && form.desktopCalendarCompositionEnabled) {
    let thickness = 0;
    if (form.calendarBaseUseKash && form.kashurovka.enabled) {
      const baseMaterial = form.kashurovka.baseType === "Другое..." ? form.kashurovka.baseCustomName : form.kashurovka.baseType;
      const baseThickness = estimateThicknessMm(baseMaterial);
      const linerThickness = estimateThicknessMm(form.kashurovka.linerPaperDensity || form.kashurovka.linerType, form.kashurovka.linerFinish);
      if (baseThickness && linerThickness) thickness += 2 * (baseThickness + linerThickness);
    } else {
      thickness += estimateThicknessMm(form.calendarBaseMaterial === "Другое..." ? form.calendarBaseCustomName : form.calendarBaseMaterial, form.calendarBaseFinish) || 0;
    }
    form.desktopCalendarParts.forEach((part) => {
      const partThickness = estimateThicknessMm(part.density, part.finish);
      const count = part.type === "Календарный блок" || part.type === "Лист с праздниками" ? Number(part.quantity) || 1 : 1;
      if (partThickness) thickness += partThickness * count;
    });
    if (!thickness) return null;
    const spring = findSpringSpecForThickness(thickness);
    return spring ? { thickness, diameter: spring.diameter, capacityMm: spring.capacityMm, pitch: spring.pitch, subcontract: spring.subcontract } : null;
  }

  if (isCalendar(form.productType) && form.calendarKind === "Настольный" && form.calendarBaseUseKash && form.kashurovka.enabled) {
    const baseMaterial = form.kashurovka.baseType === "Другое..." ? form.kashurovka.baseCustomName : form.kashurovka.baseType;
    const baseThickness = estimateThicknessMm(baseMaterial);
    const linerThickness = estimateThicknessMm(form.kashurovka.linerPaperDensity || form.kashurovka.linerType, form.kashurovka.linerFinish);
    const forsacThickness = form.kashurovka.forsacEnabled
      ? estimateThicknessMm(form.kashurovka.forsacPaperDensity || form.kashurovka.forsacPaper, form.kashurovka.forsacFinish)
      : 0;
    const gridPages = Number(form.calendarGridPages);
    const gridThickness = estimateThicknessMm(form.calendarGridMaterial, form.calendarGridFinish);
    if (!baseThickness || !linerThickness || !gridPages || !gridThickness) return null;

    const thickness = 2 * (baseThickness + linerThickness + forsacThickness) + gridPages * gridThickness + 2;
    const spring = findSpringSpecForThickness(thickness);
    return spring ? { thickness, diameter: spring.diameter, capacityMm: spring.capacityMm, pitch: spring.pitch, subcontract: spring.subcontract } : null;
  }

  if (isNotebook(form.productType) && form.notebookCompositionEnabled) {
    let thickness = 0;
    let hasKnownPart = false;

    form.notebookParts.forEach((part) => {
      const partThickness = estimateThicknessMm(part.density, part.finish);
      // Если офсет выбран без бумаги, часть не добавляет толщину. Если бумага указана,
      // её плотность всё равно должна участвовать в подборе пружины.
      if (part.offsetPrinting && !partThickness) return;
      if (!partThickness) return;
      const count = part.type === "Листы блока" || part.type === "Вкладыш"
        ? Number(part.quantity)
        : 1;
      if (!count) return;
      thickness += partThickness * count;
      hasKnownPart = true;
    });

    if (!hasKnownPart) return null;
    const spring = findSpringSpecForThickness(thickness);
    return spring ? { thickness, diameter: spring.diameter, capacityMm: spring.capacityMm, pitch: spring.pitch, subcontract: spring.subcontract } : null;
  }

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
  const spring = findSpringSpecForThickness(thickness);
  return spring ? { thickness, diameter: spring.diameter, capacityMm: spring.capacityMm, pitch: spring.pitch, subcontract: spring.subcontract } : null;
}

export function formatMaterialWithFinish(material: string, _finish: PaperFinish): string {
  return material;
}

export function formatFinishForTZ(finish: PaperFinish, type: PaperTypeOption | "" = ""): string {
  return type === "Мелованная" && finish === "Глянцевая" ? "глянцевая" : "";
}

export function isStandaloneShortPart(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized === "скругление углов"
    || normalized === "фальцовка"
    || normalized.startsWith("плоттерная")
    || normalized.startsWith("тиснение")
    || normalized.startsWith("фольгирование")
    || normalized.startsWith("уф-лак")
    || normalized.startsWith("прикатка")
    || normalized.startsWith("сверление")
    || normalized.startsWith("перфор")
    || normalized.startsWith("пружина")
    || normalized.includes("скоба")
    || normalized.includes("термобиндер")
    || normalized.includes("pur-клей")
    || normalized.startsWith("каширование")
    || normalized.startsWith("слим-каширование")
    || normalized.startsWith("осн.")
    || normalized.startsWith("крепление");
}

export function formatColorWithReverse(value: string, ownReverse: boolean): string {
  const color = normalizeColorMode(value) || "—";
  return ownReverse ? `${color} (свой оборот)` : color;
}

export function formatShortColor(value: string, ownReverse = false): string {
  const normalized = normalizeColorMode(value);
  const base = (normalized.split(/\s+/)[0] || "").trim();
  if (!base) return "";
  return ownReverse ? `${base} (свой оборот)` : base;
}

export function formatHoleSelectionText(type: string, diameter = "", count = ""): string {
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

export function formatPostProcessingShortText(item: string, form: FormData): string {
  if (item.includes("Перфорация")) return "перфор.";
  if (item.includes("Сверление отверстий")) return `сверление отверстий${form.drillingDiameter ? ` Ø ${form.drillingDiameter}` : ""}`;
  if (item.includes("Тиснение")) return `тиснение${form.foilColor ? " " + form.foilColor : ""}`;
  if (item.includes("Фольгирование")) return `фольгирование${form.foilColor ? " " + form.foilColor : ""}`;
  if (item.includes("УФ-лак")) return form.uvType === "Текстурный" ? "УФ-лак текстурный" : "УФ-лак";
  if (item.includes("Прикатка магнита")) return "прикатка магнита";
  if (item.includes("Скругление")) return "скругление углов";
  return item.toLowerCase();
}

export function formatPostProcessingFullText(item: string, form: FormData): string {
  if (item.includes("Перфорация")) return " [x] Перфорация";
  if (item.includes("Сверление отверстий")) return ` [x] Сверление отверстий${form.drillingDiameter ? ` — Ø ${form.drillingDiameter}` : ""}`;
  if (item.includes("Тиснение")) return ` [x] Тиснение фольгой${form.foilColor ? ` — цвет фольги: ${form.foilColor}` : ""}`;
  if (item.includes("Фольгирование")) return ` [x] Фольгирование${form.foilColor ? ` — цвет фольги: ${form.foilColor}` : ""}`;
  if (item.includes("УФ-лак")) return ` [x] ${form.uvType === "Текстурный" ? "УФ-лак текстурный" : "УФ-лак"}`;
  if (item.includes("Прикатка магнита")) return " [x] Прикатка магнита";
  if (item.includes("Скругление")) return " [x] Скругление углов";
  return ` [x] ${item}`;
}

export function getDisplaySize(form: FormData): string {
  if (isEnvelope(form.productType)) return form.envelopeSize === "Нестандартный" ? form.envelopeSizeCustom : form.envelopeSize;
  if (form.productType === "Визитки") return form.businessCardSize === "Нестандартный" ? form.businessCardSizeCustom : form.businessCardSize;
  if (isCubariki(form.productType)) return form.paperSize.trim();
  if (isBag(form.productType)) return form.bagWidth || form.bagHeight || form.bagDepth ? `${form.bagWidth || "?"}×${form.bagHeight || "?"}×${form.bagDepth || "?"} мм` : "";
  if (isCatalog(form.productType)) return form.catalogFormat === "Нестандартный" ? form.catalogFormatCustom : form.catalogFormat;
  if (isBrochure(form.productType)) return form.brochureFormat === "Нестандартный" ? form.brochureFormatCustom : form.brochureFormat;
  if (isPocketCalendar(form)) return form.paperSize === "Нестандартный" ? form.paperSizeCustom : form.paperSize;
  if (!isMultiBlock(form.productType) && !isCalendar(form.productType)) return form.paperSize === "Нестандартный" ? form.paperSizeCustom : form.paperSize;
  return "";
}

export function formatNotebookPartForTZ(part: NotebookPart): string {
  const details = [
    part.offsetPrinting ? "печать на офсете" : formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish),
    part.offsetPrinting ? "" : formatNotebookColorText(part.color),
    part.offsetPrinting ? "" : part.lamination.enabled ? getLaminationShort(part.lamination) : "",
    part.note.trim(),
  ].filter(Boolean);
  const quantity = part.quantity ? `${part.quantity} шт.` : "";
  return [part.type || "Часть", quantity, details.join(", ")].filter(Boolean).join(" — ");
}

export function formatQuarterCalendarShortLines(form: FormData): string[] {
  const lines = ["квартальный"];
  lines.push(`постер: ${[form.quarterPosterSize, formatPaperSelectionWithFinishForTZ(form.quarterPosterPaperType, form.quarterPosterDensity, form.quarterPosterPaperCustomName, form.quarterPosterFinish), normalizeColorMode(form.quarterPosterColorMode), form.quarterPosterLamination.enabled ? getLaminationShort(form.quarterPosterLamination) : ""].filter(Boolean).join(", ") || "—"}`);

  if (form.quarterAdParts.length) {
    lines.push(`рекламных полей: ${form.quarterAdParts.length}${form.quarterAdFieldsSame ? " (поля одинаковые)" : ""}`);
    const partsToShow = form.quarterAdFieldsSame ? form.quarterAdParts.slice(0, 1) : form.quarterAdParts;
    partsToShow.forEach((part, index) => {
      lines.push(`рекламное поле${form.quarterAdFieldsSame ? "" : ` ${index + 1}`}: ${[part.size, formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish), normalizeColorMode(part.colorMode), part.lamination.enabled ? getLaminationShort(part.lamination) : ""].filter(Boolean).join(", ") || "—"}`);
    });
  } else {
    lines.push("рекламных полей: —");
  }

  if (form.quarterGridStandard) {
    lines.push(`сетка стандартная: ${form.quarterGridName || "—"}`);
  } else {
    lines.push(`сетка индивидуальная: ${[form.quarterGridSize, formatPaperSelectionWithFinishForTZ(form.quarterGridPaperType, form.quarterGridDensity, form.quarterGridPaperCustomName, form.quarterGridFinish), normalizeColorMode(form.quarterGridColorMode), form.quarterGridPrintMode === "Офсет" ? "приедет с офсета" : form.quarterGridPrintMode].filter(Boolean).join(", ") || "—"}`);
  }

  const quarterFinishing = [
    form.quarterBackingEnabled ? `подложки ${form.quarterBackingSize || "—"}` : "",
    `крепление: ${[form.quarterMountType, form.quarterMountColor].filter(Boolean).join(", ") || "—"}`,
    `пружина: ${form.quarterSpringColor || "—"}`,
    `курсор: ${[form.quarterCursorColor, form.quarterCursorType].filter(Boolean).join(", ") || "—"}`,
  ].filter(Boolean);
  lines.push(quarterFinishing.join(" / "));
  return lines;
}

export function generateShortTZ(form: FormData): string {
  const parts: string[] = [];
  const product = formatProductNameForTZ(form, true);
  const templateFlags = getProductTemplate(form.productType).flags;
  const isDesktopCalendar = isCalendar(form.productType) && form.calendarKind === "Настольный";
  if (isDesktopCalendar) parts.push("календарь настольный");
  else if (product) parts.push(product);
  const size = isDesktopCalendar ? "" : getDisplaySize(form);
  if (size) parts.push(size.split(/\s*[(/]/)[0].trim());

  if (isMultiBlock(form.productType)) {
    if (form.pageCount) parts.push(`${form.pageCount} страниц с обложкой`);
    const coverSelection = { type: form.coverPaperType, value: form.coverDensity, customName: form.coverPaperCustomName, finish: form.coverFinish };
    const blockSelection = { type: form.blockPaperType, value: form.blockDensity, customName: form.blockPaperCustomName, finish: form.blockFinish };
    const samePaper = isSamePaperSelection(coverSelection, blockSelection);
    const covParts = [
      formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish),
      form.coverColor.split(/\s/)[0],
      form.coverLamination.enabled ? getLaminationShort(form.coverLamination) : "",
    ].filter(Boolean);
    const blkParts = [
      form.blockOffsetPrinting ? "приедет с офсета" : samePaper ? "" : formatPaperSelectionWithFinishForTZ(form.blockPaperType, form.blockDensity, form.blockPaperCustomName, form.blockFinish),
      form.blockOffsetPrinting ? "" : form.blockColor.split(/\s/)[0],
      form.blockOffsetPrinting ? "" : form.blockLamination.enabled ? getLaminationShort(form.blockLamination) : "",
    ].filter(Boolean);
    if (covParts.length) parts.push(samePaper ? covParts.join(" ") : `обложка: ${covParts.join(" ")}`);
    if (blkParts.length) parts.push(samePaper ? blkParts.join(" ") : `блок: ${blkParts.join(" ")}`);
  } else if (isNotebook(form.productType)) {
      if (form.blockPages) parts.push(`${form.blockPages} листов в блоке`);
      if (form.notebookCompositionEnabled) {
        parts.push("составной");
      const composition = form.notebookParts.map(formatNotebookPartForTZ).filter(Boolean);
      if (composition.length) parts.push(composition.join("\n"));
    }
    if (!form.notebookCompositionEnabled) {
      const coverParts = [
        formatPaperSelectionWithFinishForTZ(form.coverPaperType, form.coverDensity, form.coverPaperCustomName, form.coverFinish),
        formatNotebookColorText(form.coverColor),
        form.coverLamination.enabled ? getLaminationShort(form.coverLamination) : "",
      ].filter(Boolean);
      if (coverParts.length) {
        parts.push(form.backingEnabled ? `обложка: ${coverParts.join(" ")}` : `обложка/подложка: ${coverParts.join(" ")}`);
      }
      const blockParts = [
              form.blockOffsetPrinting ? `Блок — ${form.blockPages || "—"} листов, приедет с офсета` : formatPaperSelectionWithFinishForTZ(form.blockPaperType, form.blockDensity, form.blockPaperCustomName, form.blockFinish),
              form.blockOffsetPrinting ? "" : normalizeColorMode(form.blockColor),
              form.blockOffsetPrinting ? "" : form.blockLamination.enabled ? getLaminationShort(form.blockLamination) : "",
            ].filter(Boolean);
            if (blockParts.length) {
              const blockLine = `блок: ${blockParts.join(" ")}`;
              parts.push(form.blockPages ? `${blockLine}, ${form.blockPages} листов` : blockLine);
            }
      if (form.backingEnabled) {
        const backingParts = [
          formatPaperSelectionWithFinishForTZ(form.backingPaperType, form.backingDensity, form.backingPaperCustomName, form.backingFinish),
          formatNotebookColorText(form.backingColor) || "без печати",
          form.backingLamination.enabled ? getLaminationShort(form.backingLamination) : "",
        ].filter(Boolean);
        if (backingParts.length) parts.push(`подложка: ${backingParts.join(" ")}`);
      }
    }
  } else if (isCalendar(form.productType)) {
    if (form.calendarKind === "Квартальный") {
      parts.push(formatQuarterCalendarShortLines(form).join("\n"));
    } else if (!isDesktopCalendar) {
      parts.push(form.calendarKind.toLowerCase());
    }
    if (form.calendarKind !== "Квартальный" && form.calendarKind === "Настенный") {
      const baseName = form.calendarBaseMaterial === "Другое..." ? `${form.calendarBaseCustomName || "другое"} (под заказ)` : form.calendarBaseMaterial;
      const baseParts = [
        `подложка: ${form.calendarBaseSize || "—"}`,
        normalizeMaterial(baseName),
        formatFinishForTZ(form.calendarBaseFinish),
        normalizeColorMode(form.calendarBaseColorMode),
        form.calendarBaseLamination.enabled ? getLaminationShort(form.calendarBaseLamination) : "",
      ].filter(Boolean);
      if (baseParts.length) parts.push(baseParts.join(", "));
      const headerPaper = formatPaperSelectionWithFinishForTZ(
        form.calendarHeaderPaperType,
        form.calendarHeaderPaperDensity,
        form.calendarHeaderPaperCustomName,
        form.calendarHeaderPaperFinish,
      );
      const sheetParts = [
        `перекидные листы: ${form.calendarHeaderSize || "—"}`,
        headerPaper,
        normalizeColorMode(form.calendarHeaderColorMode),
        form.calendarHeaderLamination.enabled ? getLaminationShort(form.calendarHeaderLamination) : "",
      ].filter(Boolean);
      if (sheetParts.length) parts.push(sheetParts.join(", "));
      if (form.wallMountType) parts.push(`крепление: ${form.wallMountType.toLowerCase()}${form.wallMountColor ? `, ${form.wallMountColor.toLowerCase()}` : ""}`);
    }
    if (form.calendarKind !== "Квартальный" && form.calendarKind !== "Настольный" && form.calendarKind !== "Настенный" && form.gridType === "Цифра") {
      const gridMaterial = normalizeMaterial(form.calendarGridMaterial);
      const gridColor = form.calendarGridColorMode ? form.calendarGridColorMode.split(/\s/)[0] : "";
      if (gridMaterial || gridColor) parts.push(`Сетка: ${[gridMaterial, gridColor].filter(Boolean).join(" ")}`);
    } else if (form.calendarKind !== "Квартальный" && form.calendarKind !== "Настольный" && form.calendarKind !== "Настенный" && form.gridType === "Офсет") {
      const gridMaterial = normalizeMaterial(form.calendarGridMaterial);
      const gridColor = form.calendarOffsetColor || "";
      parts.push(`Сетка: офсет${gridMaterial || gridColor ? `, ${[gridMaterial, gridColor].filter(Boolean).join(" ")}` : ""}`);
    }
    if (form.calendarKind === "Настольный") {
      const baseParts = ["основание", "", `${form.calendarBaseSize || "—"},`];
      if (!form.calendarBaseUseKash) {
        const baseName = form.calendarBaseMaterial === "Другое..." ? `${form.calendarBaseCustomName || "другое"} (под заказ)` : form.calendarBaseMaterial;
        const material = [normalizeMaterial(baseName), formatFinishForTZ(form.calendarBaseFinish, "Мелованная"), normalizeColorMode(form.calendarBaseColorMode)].filter(Boolean).join(" ");
        if (material) baseParts.push(material);
        if (form.calendarBaseLamination.enabled) baseParts.push(`осн. ${getLaminationShort(form.calendarBaseLamination)}`);
      }
      if (form.calendarBaseBigovkaLines) {
        const count = Number(form.calendarBaseBigovkaLines);
        const suffix = count === 1 ? "биговка" : count >= 2 && count <= 4 ? "биговки" : "биговок";
        baseParts.push(`${form.calendarBaseBigovkaLines} ${suffix} основания`);
      }
      parts.push(baseParts.filter((part, index) => part || index === 0 || index === 1).join("\n"));
      if (form.kashurovka.enabled) parts.push(getDesktopCalendarKashShortTZ(form));
      parts.push("сетка");
      if (form.desktopCalendarCompositionEnabled) {
        const composition = form.desktopCalendarParts.map(formatDesktopCalendarPartShort).filter(Boolean);
        if (composition.length) parts.push(composition.join("\n"));
      } else if (form.calendarGridMaterial || form.calendarGridSize) {
        const gridParts = [
          form.calendarGridSize ? `${form.calendarGridSize}` : "",
          formatMaterialWithFinish(form.calendarGridMaterial, form.calendarGridFinish),
          form.calendarGridPages ? `${form.calendarGridPages} листов` : "",
          form.calendarGridColorMode ? normalizeColorMode(form.calendarGridColorMode) : form.calendarOffsetColor,
        ].filter(Boolean);
        parts.push(gridParts.join(", ") || "—");
      }
    }
  } else if (isCubariki(form.productType)) {
    const material = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish);
    const materialLine = [material, formatShortColor(form.colorMode)].filter(Boolean).join(", ");
    if (materialLine) parts.push(materialLine);
    if (form.blockPages) parts.push(`${form.blockPages} листов`);
  } else if (isBag(form.productType)) {
    if (!form.bagExternalSheets) {
      const bagPaper = formatBagPaperSelection(form);
      const bagMaterialLine = [bagPaper, formatShortColor(form.colorMode)].filter(Boolean).join(", ");
      if (bagMaterialLine) parts.push(bagMaterialLine);
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
    const stickerMaterialLine = [normalizeMaterial(form.stickerMaterial), formatShortColor(form.colorMode)].filter(Boolean).join(", ");
    if (stickerMaterialLine) parts.push(stickerMaterialLine.toLowerCase());
    if (form.stickerPlotterCut) parts.push("плоттерная резка");
  } else if (form.productType === "Другое..." || form.productType === "Другое") {
    const entries = form.otherPaperEntries.map(formatOtherPaperEntryForTZ).filter(Boolean);
    if (entries.length) parts.push(entries.join("\n"));
  } else if (form.productType === "Воблеры") {
    const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
    const paperLine = [paperText, formatShortColor(form.colorMode)].filter(Boolean).join(", ");
    if (paperLine) parts.push(paperLine);
    if (form.wobblerFootGlue) parts.push("приклейка ножки");
  } else if (form.productType === "Бейджи") {
    const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
    const paperLine = [paperText, formatShortColor(form.colorMode, form.ownReverse)].filter(Boolean).join(", ");
    if (paperLine) parts.push(paperLine);
    if (form.badgeHoleType) {
      const holeText = formatHoleSelectionText(form.badgeHoleType, form.badgeHoleDiameter, form.badgeHoleCount);
      parts.push(holeText);
    }
  } else {
    const envelopePaperless = isEnvelope(form.productType) && form.paperType === "Без бумаги";
    if (templateFlags.showPaper && !envelopePaperless) {
      const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
      const materialLine = [paperText, templateFlags.showColor ? formatShortColor(form.colorMode, form.ownReverse && (form.productType === "Листовки" || form.productType === "Листовка")) : ""].filter(Boolean).join(", ");
      if (materialLine) parts.push(materialLine);
      } else if (templateFlags.showColor) {
        const colorText = formatShortColor(form.colorMode, form.ownReverse) || "—";
        const last = parts[parts.length - 1];
        // Приклеиваем к предыдущему элементу (к размеру), если он не «standalone»-операция
        if (last && !isStandaloneShortPart(last)) {
          parts[parts.length - 1] = `${last}, ${colorText}`;
        } else {
          parts.push(colorText);
        }
      }
  }

  if (form.lamination.enabled && !isMultiBlock(form.productType) && !isNotebook(form.productType) && !isCalendar(form.productType)) {
    parts.push(getLaminationShort(form.lamination));
  }

  if (templateFlags.showPostProcessing && form.postProcessing.length > 0) {
    const ppShort = form.postProcessing.map((p) => formatPostProcessingShortText(p, form));
    parts.push(...ppShort);
  }

  if (form.bigkovka && !form.kashurovka.enabled) {
    const lines = form.bigkovkaLines || "?";
    parts.push(`${lines} биговк${lines === "1" ? "а" : "и"}`);
  }
  if (form.falcovka) {
    parts.push("фальцовка");
  }

  if (form.kashurovka.enabled && !(isCalendar(form.productType) && form.calendarKind === "Настольный")) {
    parts.push(getKashShortTZ(form));
  }

  if (isCalendar(form.productType) && form.calendarKind !== "Настольный" && form.calendarBaseLamination.enabled) parts.push(`осн. ${getLaminationShort(form.calendarBaseLamination)}`);
  if (isPocketCalendar(form)) {
    const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
    const paperLine = [paperText, formatShortColor(form.colorMode)].filter(Boolean).join(", ");
    if (paperLine) parts.push(paperLine);
    if (form.lamination.enabled) parts.push(getLaminationShort(form.lamination));
  }

  if (form.binding && form.bindingType) {
    if (form.bindingType === "Скоба") {
      const pos = form.stapleCount === "Одна" ? `, ${form.staplePosition.toLowerCase()}` : "";
      parts.push(`${form.stapleCount === "Две" ? "две скобы" : "одна скоба"}${pos}`);
    } else if (form.bindingType === "Пружина") {
      parts.push(getSpringOutputParts(form).join(" "));
    } else parts.push(form.bindingType.toLowerCase());
  }

  const notesBlock = form.notes.trim();
  const colorProofNote = form.colorProof === "Надо"
    ? "Показать перед тиражом"
    : form.colorProof === "Есть образец"
      ? "Показать перед тиражом, есть образец цвета"
      : "";

  let shortMain = parts.join("\n");
  if (isCalendar(form.productType) && form.calendarKind === "Настенный" && parts.length > 1) {
    shortMain = [parts.slice(0, 2).join(" / "), parts.slice(2, 4).filter(Boolean).join("\n"), ...parts.slice(4)].filter(Boolean).join("\n\n");
  }
  if (parts.length > 1 && !(isCalendar(form.productType) && form.calendarKind === "Настенный")) {
    const detailStart = size ? 2 : 1;
    const header = parts.slice(0, detailStart).join(" / ");
    const details = parts.slice(detailStart);
    const firstStandalone = details.findIndex(isStandaloneShortPart);
    const compactDetails = firstStandalone < 0 ? details : details.slice(0, firstStandalone);
    const standaloneDetails = firstStandalone < 0 ? [] : details.slice(firstStandalone);
    if (isCalendar(form.productType) || isMultiBlock(form.productType)) {
      shortMain = [header, ...parts.slice(detailStart)].filter(Boolean).join("\n\n");
    } else if (isNotebook(form.productType)) {
      shortMain = [header, compactDetails.join("\n"), ...standaloneDetails].filter(Boolean).join("\n\n");
    } else {
      shortMain = [header, compactDetails.join("\n"), ...standaloneDetails].filter(Boolean).join("\n\n");
    }
  }
  const blocks = [shortMain, notesBlock, colorProofNote].filter(Boolean);
  return blocks.join("\n\n");
}

export function generateTZ(form: FormData, _tzNumber: number): string {
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
    lines.push(` Страниц с обложкой : ${form.pageCount || "—"}`);
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
    if (form.notebookCompositionEnabled) {
      lines.push(" СОСТАВ БЛОКНОТА");
      lines.push(" -----------------");
      if (form.notebookParts.length === 0) lines.push(" Части не добавлены");
      form.notebookParts.forEach((part, index) => {
        lines.push(` ${index + 1}. ${part.type || "Часть"}${part.quantity ? ` — ${part.quantity} шт.` : ""}`);
        if (part.offsetPrinting) {
          lines.push("    Печать на офсете (бумага не указана)");
        } else {
          lines.push(`    Бумага : ${formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish) || "—"}`);
          lines.push(`    Цветность : ${formatNotebookColorText(part.color) || "—"}`);
          if (part.lamination.enabled) lines.push(`    Ламинация : ${formatLamination(part.lamination)}`);
        }
        if (part.note.trim()) lines.push(`    Примечание : ${part.note.trim()}`);
      });
    } else {
      lines.push(` Блок : ${form.blockPages || "—"} листов`);
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
      lines.push(` Цветность : ${form.blockOffsetPrinting ? "приедет с офсета" : normalizeColorMode(form.blockColor) || "—"}`);
      if (form.blockLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.blockLamination)}`);
    }
  } else if (isCalendar(form.productType)) {
    lines.push(` Вид календаря : ${form.calendarKind || "—"}`);
    if (form.calendarKind === "Квартальный") {
      lines.push(` Количество рекламных полей : ${form.quarterAdParts.length}`);
      lines.push(` Постер : ${form.quarterPosterSize || "—"}`);
      lines.push(` Бумага постера : ${formatPaperSelectionWithFinishForTZ(form.quarterPosterPaperType, form.quarterPosterDensity, form.quarterPosterPaperCustomName, form.quarterPosterFinish) || "—"}`);
      lines.push(` Цветность постера : ${normalizeColorMode(form.quarterPosterColorMode) || "—"}`);
      if (form.quarterPosterLamination.enabled) lines.push(` Ламинация постера : ${formatLamination(form.quarterPosterLamination)}`);
      const quarterAdPartsToShow = form.quarterAdFieldsSame ? form.quarterAdParts.slice(0, 1) : form.quarterAdParts;
      quarterAdPartsToShow.forEach((part, index) => {
        lines.push(` Рекламное поле${form.quarterAdFieldsSame ? "" : ` ${index + 1}`} : ${part.size || "—"}`);
        lines.push(`  Бумага : ${formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish) || "—"}`);
        lines.push(`  Цветность : ${normalizeColorMode(part.colorMode) || "—"}`);
        if (part.lamination.enabled) lines.push(`  Ламинация : ${formatLamination(part.lamination)}`);
      });
      lines.push(` Сетка : ${form.quarterGridStandard ? `стандартная, ${form.quarterGridName || "—"}` : `индивидуальная, ${form.quarterGridSize || "—"}`}`);
      if (!form.quarterGridStandard) {
        lines.push(` Бумага сетки : ${formatPaperSelectionWithFinishForTZ(form.quarterGridPaperType, form.quarterGridDensity, form.quarterGridPaperCustomName, form.quarterGridFinish) || "—"}`);
        lines.push(` Цветность сетки : ${normalizeColorMode(form.quarterGridColorMode) || "—"}`);
        lines.push(` Печать сетки : ${form.quarterGridPrintMode || "—"}${form.quarterGridPrintMode === "Офсет" ? " (сетка приедет с офсета)" : ""}`);
      }
      if (form.quarterBackingEnabled) {
        lines.push(` Подложки под сетку : ${form.quarterBackingSize || "—"}`);
        lines.push(` Бумага подложек : ${formatPaperSelectionWithFinishForTZ(form.quarterBackingPaperType, form.quarterBackingDensity, form.quarterBackingPaperCustomName, form.quarterBackingFinish) || "—"}`);
        lines.push(` Цветность подложек : ${normalizeColorMode(form.quarterBackingColorMode) || "—"}`);
      }
      lines.push(` Крепление : ${form.quarterMountType || "—"}${form.quarterMountColor ? `, ${form.quarterMountColor}` : ""}`);
      lines.push(` Цвет пружины : ${form.quarterSpringColor || "—"}`);
      lines.push(` Курсор : ${form.quarterCursorColor || "—"}, ${form.quarterCursorType || "—"}`);
    } else if (form.calendarKind === "Настенный") {
      const baseName = form.calendarBaseMaterial === "Другое..." ? `${form.calendarBaseCustomName || "другое"} (под заказ)` : form.calendarBaseMaterial;
      lines.push(` ПОДЛОЖКА`);
      lines.push(` Размер : ${form.calendarBaseSize || "—"}`);
      lines.push(` Материал : ${formatMaterialWithFinish(baseName, form.calendarBaseFinish) || "—"}`);
      lines.push(` Цветность : ${normalizeColorMode(form.calendarBaseColorMode) || "—"}`);
      if (form.calendarBaseLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.calendarBaseLamination)}`);
      lines.push(` ПЕРЕКИДНЫЕ ЛИСТЫ`);
      lines.push(` Размер : ${form.calendarHeaderSize || "—"}`);
      const headerPaper = formatPaperSelectionWithFinishForTZ(
        form.calendarHeaderPaperType,
        form.calendarHeaderPaperDensity,
        form.calendarHeaderPaperCustomName,
        form.calendarHeaderPaperFinish,
      );
      lines.push(` Материал : ${headerPaper || "—"}`);
      lines.push(` Цветность : ${normalizeColorMode(form.calendarHeaderColorMode) || "—"}`);
      if (form.calendarHeaderLamination.enabled) lines.push(` Ламинация : ${formatLamination(form.calendarHeaderLamination)}`);
      lines.push(` Крепление : ${form.wallMountType || "—"}`);
      lines.push(` Описание крепления : ${form.wallMountDesc || "—"}`);
    } else if (form.calendarKind === "Настольный") {
      lines.push(` Размер основания : ${form.calendarBaseSize || "—"}`);
      if (form.calendarBaseUseKash) lines.push(" Основание задаётся в блоке кашировки");
      else {
        const baseName = form.calendarBaseMaterial === "Другое..." ? `${form.calendarBaseCustomName || "другое"} (под заказ)` : form.calendarBaseMaterial;
        lines.push(` Основание : ${[formatMaterialWithFinish(baseName, form.calendarBaseFinish), normalizeColorMode(form.calendarBaseColorMode)].filter(Boolean).join(", ") || "—"}`);
        if (form.calendarBaseLamination.enabled) lines.push(` Ламинация основания : ${formatLamination(form.calendarBaseLamination)}`);
      }
      if (form.calendarBaseBigovkaLines) lines.push(` Биговка основания : ${form.calendarBaseBigovkaLines} линий`);
      if (form.desktopCalendarCompositionEnabled) {
        lines.push(" СОСТАВ КАЛЕНДАРЯ");
        lines.push(" -----------------");
        if (form.desktopCalendarParts.length === 0) lines.push(" Части не добавлены");
        form.desktopCalendarParts.forEach((part, index) => lines.push(...formatDesktopCalendarPartTZ(part, index)));
      } else {
        lines.push(` Блок/сетка : ${form.gridType || "—"}`);
        if (form.calendarGridSize) lines.push(` Размер перекидных листов : ${form.calendarGridSize}`);
        lines.push(` Материал блока/сетки : ${[formatMaterialWithFinish(form.calendarGridMaterial, form.calendarGridFinish), form.gridType === "Цифра" ? normalizeColorMode(form.calendarGridColorMode) : normalizeColorMode(form.calendarOffsetColor)].filter(Boolean).join(", ") || "—"}`);
        if (form.calendarGridPages) lines.push(` Количество листов сетки : ${form.calendarGridPages}`);
      }
    }
    if (form.calendarKind === "Карманный") {
      const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
      const paperLine = [paperText, normalizeColorMode(form.colorMode)].filter(Boolean).join(", ") || "—";
      lines.push(` Материал : ${paperLine}`);
      if (form.lamination.enabled) lines.push(` Ламинация : ${formatLamination(form.lamination)}`);
    }
  } else if (isCubariki(form.productType)) {
    const material = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish);
    const materialLine = [material, formatColorWithReverse(form.colorMode, false)].filter(Boolean).join(", ");
    lines.push(` Материал : ${materialLine || "—"}`);
    lines.push(` Листов в блоке : ${form.blockPages || "—"}`);
  } else if (isBag(form.productType)) {
    if (!form.bagExternalSheets) {
      const bagPaper = formatBagPaperSelection(form);
      const bagMaterialLine = [bagPaper, normalizeColorMode(form.colorMode)].filter(Boolean).join(", ");
      lines.push(` Бумага : ${bagMaterialLine || "—"}`);
    }
    lines.push(` Размер Ш×В×Г : ${size || "—"}`);
    lines.push(` Количество частей : ${form.bagPartsCount || "—"}`);
    if (form.bagExternalSheets) lines.push(" Сборка из сторонних листов : Да");
    if (form.bagHandleType !== "Лента") {
      lines.push(` Цвет люверсов : ${getBagColor(form.bagEyeletColor, form.bagEyeletColorCustom) || "—"}`);
    }
    lines.push(` Цвет ручек : ${getBagHandleText(form) || "—"}`);
  } else if (isSticker(form.productType)) {
    lines.push(` Материал : ${[normalizeMaterial(form.stickerMaterial), normalizeColorMode(form.colorMode)].filter(Boolean).join(", ") || "—"}`);
    lines.push(` Плоттерная резка : ${form.stickerPlotterCut ? "Да" : "Нет"}`);
  } else if (form.productType === "Другое..." || form.productType === "Другое") {
    lines.push(" ВИДЫ БУМАГИ");
    lines.push(" ------------");
    if (form.otherPaperEntries.length === 0) lines.push(" Не указаны");
    form.otherPaperEntries.forEach((entry, index) => {
      lines.push(` ${index + 1}. ${entry.size || "Размер не указан"}`);
      lines.push(`  Материал : ${formatPaperSelectionWithFinishForTZ(entry.paperType, entry.density, entry.paperCustomName, entry.finish) || "—"}`);
      lines.push(`  Цветность : ${normalizeColorMode(entry.color) || "—"}`);
      if (entry.lamination.enabled) lines.push(`  Ламинация : ${formatLamination(entry.lamination)}`);
      if (entry.note.trim()) lines.push(`  Примечание : ${entry.note.trim()}`);
    });
  } else if (form.productType === "Воблеры") {
    const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
    const paperLine = [paperText, normalizeColorMode(form.colorMode)].filter(Boolean).join(", ") || "—";
    lines.push(` Материал : ${paperLine}`);
    if (form.wobblerFootGlue) lines.push(" Приклейка ножки");
  } else if (form.productType === "Бейджи") {
    const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
    const paperLine = [paperText, formatColorWithReverse(form.colorMode, form.ownReverse)].filter(Boolean).join(", ") || "—";
    lines.push(` Материал : ${paperLine}`);
    if (form.badgeHoleType) {
      const holeText = formatHoleSelectionText(form.badgeHoleType, form.badgeHoleDiameter, form.badgeHoleCount);
      lines.push(` Отверстие : ${holeText}`);
    } else lines.push(" Отверстие : —");
  } else {
    const envelopePaperless = isEnvelope(form.productType) && form.paperType === "Без бумаги";
    if (form.kashurovka.enabled) lines.push(" Базовые материалы задаются в блоке кашировки");
    else if (templateFlags.showPaper && !envelopePaperless) {
      const paperText = formatPaperSelectionWithFinishForTZ(form.paperType, form.density, form.paperCustomName, form.densityFinish) || normalizeMaterial(form.density);
      const paperLine = [paperText, templateFlags.showColor ? formatColorWithReverse(form.colorMode, form.ownReverse && (form.productType === "Листовки" || form.productType === "Листовка")) : ""].filter(Boolean).join(", ") || "—";
      lines.push(` Материал : ${paperLine}`);
    } else if (templateFlags.showColor && !form.kashurovka.enabled) {
      lines.push(` Цветность : ${formatColorWithReverse(form.colorMode, form.ownReverse && (form.productType === "Листовки" || form.productType === "Листовка"))}`);
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

  if (form.bigkovka && !form.kashurovka.enabled) {
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
      lines.push(` Основа : ${form.kashurovka.baseType === "Другое..." ? `${form.kashurovka.baseCustomName || "другое"} (под заказ)` : form.kashurovka.baseType || "—"}`);
      lines.push(` Лайнер : ${formatMaterialWithFinish(form.kashurovka.linerType, form.kashurovka.linerFinish) || "—"}`);
      lines.push(` Цветность лайнера : ${form.kashurovka.linerColor || "—"}`);
      lines.push(` Ламинация лайнера : ${formatLamination(form.kashurovka.linerLamination)}`);
      if (form.kashurovka.linerSize) lines.push(` Размер лайнера : ${form.kashurovka.linerSize}`);
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
      if (form.springDiameter) lines.push(` Диаметр : ${getSpringDiameterText(form)}`);
      lines.push(` Расположение : ${form.springPosition}`);
      if (form.springHidden) lines.push(" Скрытая пружина : Да");
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

export function getTZNumber(): number {
  const stored = localStorage.getItem("tz_counter");
  const n = stored ? parseInt(stored) + 1 : 1;
  localStorage.setItem("tz_counter", String(n));
  return n;
}

export function getLaminationShort(value: LaminationBlock): string {
  return formatLaminationCompact(value);
}

export function getKashShortTZ(form: FormData): string {
  if (!form.kashurovka.enabled) return "";
  const value = form.kashurovka;
  if (value.connectionType === "Слим-каширование") {
    const paper1 = [normalizeMaterial(value.slimPaperTop), formatFinishForTZ(value.slimPaperTopFinish, value.slimPaperTopPaperType), value.slimPaperTopColor.split(/\s/)[0], getLaminationShort(value.slimPaperTopLamination)].filter(Boolean).join(" ");
    const paper2 = [normalizeMaterial(value.slimPaperBottom), formatFinishForTZ(value.slimPaperBottomFinish, value.slimPaperBottomPaperType), value.slimPaperBottomColor.split(/\s/)[0], getLaminationShort(value.slimPaperBottomLamination)].filter(Boolean).join(" ");
    return `слим-каширование: бум.1 ${paper1 || "—"}; бум.2 ${paper2 || "—"}`;
  }

  const parts = [
    "каширование",
    value.baseType ? `осн. ${value.baseType === "Другое..." ? `${value.baseCustomName || "другое"} (под заказ)` : value.baseType}` : "",
    value.linerType ? `лайнер ${[normalizeMaterial(value.linerType), formatFinishForTZ(value.linerFinish, value.linerPaperType), value.linerColor.split(/\s/)[0], getLaminationShort(value.linerLamination)].filter(Boolean).join(" ")}` : "",
    value.forsacEnabled ? `форзац ${[normalizeMaterial(value.forsacPaper), formatFinishForTZ(value.forsacFinish, value.forsacPaperType), value.forsacColor.split(/\s/)[0], getLaminationShort(value.forsacLamination)].filter(Boolean).join(" ")}` : "",
  ].filter(Boolean);

  return parts.join(", ");
}

export function getDesktopCalendarKashShortTZ(form: FormData): string {
  const value = form.kashurovka;
  if (value.connectionType === "Слим-каширование") {
    const paper1 = [normalizeMaterial(value.slimPaperTop), formatFinishForTZ(value.slimPaperTopFinish, value.slimPaperTopPaperType), value.slimPaperTopColor.split(/\s/)[0], getLaminationShort(value.slimPaperTopLamination)].filter(Boolean).join(" ");
    const paper2 = [normalizeMaterial(value.slimPaperBottom), formatFinishForTZ(value.slimPaperBottomFinish, value.slimPaperBottomPaperType), value.slimPaperBottomColor.split(/\s/)[0], getLaminationShort(value.slimPaperBottomLamination)].filter(Boolean).join(" ");
    return [
      "слим-каширование:",
      `бум.1 ${paper1 || "—"};`,
      `бум.2 ${paper2 || "—"}`,
    ].join("\n");
  }
  const base = value.baseType === "Другое..." ? `${value.baseCustomName || "другое"} (под заказ)` : value.baseType;
  const liner = [normalizeMaterial(value.linerType), formatFinishForTZ(value.linerFinish, value.linerPaperType), value.linerColor.split(/\s/)[0], getLaminationShort(value.linerLamination)].filter(Boolean).join(" ");
  const forsac = [normalizeMaterial(value.forsacPaper), formatFinishForTZ(value.forsacFinish, value.forsacPaperType), value.forsacColor.split(/\s/)[0], getLaminationShort(value.forsacLamination)].filter(Boolean).join(" ");
  return [
    `каширование на ${base || "—"}`,
    `лайнер ${liner || "—"}`,
    value.forsacEnabled ? `форзац ${forsac || "—"}` : "",
  ].filter(Boolean).join("\n");
}

export function formatOtherPaperEntryForTZ(entry: OtherPaperEntry): string {
  return [entry.size.trim(), formatPaperSelectionWithFinishForTZ(entry.paperType, entry.density, entry.paperCustomName, entry.finish), normalizeColorMode(entry.color), entry.lamination.enabled ? getLaminationShort(entry.lamination) : "", entry.note.trim()].filter(Boolean).join(", ");
}

export function formatDesktopCalendarPartShort(part: DesktopCalendarPart): string {
  const title = part.type === "Другое" ? (part.customName.trim() || "Другое") : part.type;
  const paper = formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish);
  const details = [part.size, paper, normalizeColorMode(part.colorMode), part.quantity ? `${part.quantity} листов` : "", part.lamination.enabled ? getLaminationShort(part.lamination) : "", part.note.trim()]
    .filter(Boolean)
    .join(", ");
  return `${title || "Часть"}: ${details || "—"}`;
}

export function formatDesktopCalendarPartTZ(part: DesktopCalendarPart, index: number): string[] {
  const title = part.type === "Другое" ? (part.customName.trim() || "Другое") : part.type;
  const lines = [` ${index + 1}. ${title || "Часть"}`, `  Размер : ${part.size || "—"}`];
  const paper = formatPaperSelectionWithFinishForTZ(part.paperType, part.density, part.paperCustomName, part.finish);
  lines.push(`  Материал : ${[paper, normalizeColorMode(part.colorMode)].filter(Boolean).join(", ") || "—"}`);
  if (part.quantity) lines.push(`  Количество листов : ${part.quantity}`);
  if (part.lamination.enabled) lines.push(`  Ламинация : ${formatLamination(part.lamination)}`);
  if (part.note.trim()) lines.push(`  Примечание : ${part.note.trim()}`);
  return lines;
}


export function formatBytes(bytes?: number) {
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

export function formatSpeed(bytesPerSecond?: number) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return null;
  return `${formatBytes(bytesPerSecond)}/с`;
}


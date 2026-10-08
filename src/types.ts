import type {
  BagPaperTypeOption,
  PaperLibraryKey,
  PaperProfileKey,
  PaperTypeOption,
  ProductLayoutKind,
  ProductTemplateConfig,
  ProductTemplateFieldConfig,
  ProductTemplateFieldKey,
  ProductTemplateFlags,
  ProductTemplateStore,
  SpringSpec,
} from "./constants";

// ─── Состояние менеджеров ────────────────────────────────────────────────────

export type ManagerMarkerState = {
  managerMarkers: Record<string, string>;
  managerMarkerCounter: number;
};

// ─── Словари ─────────────────────────────────────────────────────────────────

export interface Dicts {
  productTypes: string[]; paperSizes: string[]; envelopeSizes: string[];
  pocketCalendarSizes: string[];
  businessCardSizes: string[];
  densities: string[]; colors: string[]; postProcessing: string[];
  bindingTypes: string[]; laminationKinds: string[]; laminationThickness: string[];
  springSpecs: SpringSpec[];
  notebookCompositionPartTypes: string[];
  managers: string[];
  adManagers: string[];
  managerMarkers: Record<string, string>;
  managerMarkerCounter: number;
  productTemplates: ProductTemplateStore;
  paperProfiles: Record<PaperProfileKey, string[]>;
  paperLibrary: Record<PaperLibraryKey, string[]>;
}

// ─── Бумага и обработка ──────────────────────────────────────────────────────

export type PaperFinish = "Матовая" | "Глянцевая";

export interface LaminationBlock {
  enabled: boolean; side: string; thickness: string; kind: string; kindCustom?: string;
}

export interface KashurovkaBlock {
  enabled: boolean; baseType: string; baseCustomName: string; linerType: string; linerSize: string; connectionType: string; turnoverType: string;
  forsacEnabled: boolean; forsacPaper: string; forsacSize: string; forsacPrintMode: string;
  linerFinish: PaperFinish; linerColor: string; linerLamination: LaminationBlock; forsacFinish: PaperFinish; forsacColor: string; forsacLamination: LaminationBlock;
  slimPaperTop: string; slimPaperBottom: string; slimPaperTopLamination: LaminationBlock; slimPaperBottomLamination: LaminationBlock;
  slimPaperTopFinish: PaperFinish; slimPaperTopColor: string; slimPaperBottomFinish: PaperFinish; slimPaperBottomColor: string;
  linerPaperType: PaperTypeOption | ""; linerPaperCustomName: string; linerPaperDensity: string;
  forsacPaperType: PaperTypeOption | ""; forsacPaperCustomName: string; forsacPaperDensity: string;
  slimPaperTopPaperType: PaperTypeOption | ""; slimPaperTopPaperCustomName: string; slimPaperTopPaperDensity: string;
  slimPaperBottomPaperType: PaperTypeOption | ""; slimPaperBottomPaperCustomName: string; slimPaperBottomPaperDensity: string;
}

export type PaperSelectionValue = {
  type: PaperTypeOption | "";
  value: string;
  customName: string;
  finish: PaperFinish;
};

// ─── Формы ───────────────────────────────────────────────────────────────────

export interface FormData {
  orderNumber: string; clientName: string; managerName: string; deadline: string; deadlineTime: string; quantity: string;
  cellBooking: string;
  productType: string; productTypeCustom: string; paperSize: string; paperSizeCustom: string; envelopeSize: string; envelopeSizeCustom: string;
  businessCardSize: string; businessCardSizeCustom: string;
  paperType: PaperTypeOption | ""; paperCustomName: string; density: string; densityFinish: PaperFinish; colorProof: string; colorMode: string; pageCount: string; coverUseKash: boolean; coverPaperType: PaperTypeOption | ""; coverPaperCustomName: string; coverDensity: string; coverFinish: PaperFinish; coverColor: string; coverLamination: LaminationBlock;
  backingEnabled: boolean; backingPaperType: PaperTypeOption | ""; backingPaperCustomName: string; backingDensity: string; backingFinish: PaperFinish; backingColor: string; backingLamination: LaminationBlock;
  catalogFormat: string; catalogFormatCustom: string;
  brochureFormat: string; brochureFormatCustom: string;
  blockPaperType: PaperTypeOption | ""; blockPaperCustomName: string; blockDensity: string; blockFinish: PaperFinish; blockColor: string; blockOffsetPrinting: boolean; blockLamination: LaminationBlock; blockPages: string;
  adBlocks: string; calendarKind: string; wallMountType: string; wallMountDesc: string; wallMountColor: string; gridType: string; hasPlanka: boolean; plankaDesc: string; hasRigel: boolean;
  quarterPosterSize: string; quarterPosterPaperType: PaperTypeOption | ""; quarterPosterPaperCustomName: string; quarterPosterDensity: string; quarterPosterFinish: PaperFinish; quarterPosterColorMode: string; quarterPosterLamination: LaminationBlock; quarterAdBlocks: string; quarterAdFieldsSame: boolean; quarterAdParts: QuarterAdPart[]; quarterGridStandard: boolean; quarterGridName: string; quarterGridSize: string; quarterGridPaperType: PaperTypeOption | ""; quarterGridPaperCustomName: string; quarterGridDensity: string; quarterGridFinish: PaperFinish; quarterGridColorMode: string; quarterGridPrintMode: string; quarterBackingEnabled: boolean; quarterBackingSize: string; quarterBackingPaperType: PaperTypeOption | ""; quarterBackingPaperCustomName: string; quarterBackingDensity: string; quarterBackingFinish: PaperFinish; quarterBackingColorMode: string; quarterMountType: string; quarterMountColor: string; quarterSpringColor: string; quarterCursorColor: string; quarterCursorType: string;
  calendarBaseUseKash: boolean; calendarBaseMaterial: string; calendarBaseCustomName: string; calendarBaseSize: string; calendarBaseColorMode: string; calendarBaseFinish: PaperFinish; calendarBaseLamination: LaminationBlock; calendarBaseBigovkaLines: string; calendarGridMaterial: string; calendarGridPages: string; calendarGridFinish: PaperFinish; calendarGridColorMode: string; calendarOffsetColor: string; desktopCalendarCompositionEnabled: boolean; desktopCalendarParts: DesktopCalendarPart[];
  calendarHeaderPaperType: PaperTypeOption | ""; calendarHeaderPaperCustomName: string; calendarHeaderPaperDensity: string; calendarHeaderPaperFinish: PaperFinish; calendarHeaderSize: string; calendarHeaderColorMode: string; calendarHeaderLamination: LaminationBlock;
  postProcessing: string[]; foilColor: string; uvType: string; bigkovka: boolean; bigkovkaLines: string; drillingDiameter: string;
  falcovka: boolean;
  lamination: LaminationBlock; kashurovka: KashurovkaBlock;
  binding: boolean; bindingType: string; stapleCount: string; staplePosition: string; springColor: string; springColorCustom: string; springDiameter: string; springDiameterStrict: boolean; springPosition: string; springHidden: boolean;
  subcontractWorks: SubcontractWork[];
  notebookCompositionEnabled: boolean; notebookParts: NotebookPart[];
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

export interface AdFormData {
  orderNumber: string;
  clientName: string;
  managerName: string;
  deadline: string;
  deadlineTime: string;
  fileCount: string;
  fileLink: string;
  notes: string;
}

// ─── Бронирование ────────────────────────────────────────────────────────────

export interface ReservedAssignment {
  rowNumber: number;
  orderNumber: string;
  managerMarker: string;
  sheetName: string;
}

// ─── Подряды ─────────────────────────────────────────────────────────────────

export interface SubcontractWork {
  id: string;
  note: string;
  date: string;
  time: string;
}

// ─── Блокноты ────────────────────────────────────────────────────────────────

export interface NotebookPart {
  id: string;
  type: string;
  quantity: string;
  offsetPrinting: boolean;
  paperType: PaperTypeOption | "";
  paperCustomName: string;
  density: string;
  finish: PaperFinish;
  color: string;
  lamination: LaminationBlock;
  note: string;
}

// ─── Квартальные календари ───────────────────────────────────────────────────

export interface QuarterAdPart {
  id: string;
  size: string;
  paperType: PaperTypeOption | "";
  paperCustomName: string;
  density: string;
  finish: PaperFinish;
  lamination: LaminationBlock;
  colorMode: string;
}

// ─── Настольные календари ────────────────────────────────────────────────────

export interface DesktopCalendarPart {
  id: string;
  type: string;
  customName: string;
  size: string;
  quantity: string;
  paperType: PaperTypeOption | "";
  paperCustomName: string;
  density: string;
  finish: PaperFinish;
  colorMode: string;
  lamination: LaminationBlock;
  note: string;
}

// ─── Статистика ──────────────────────────────────────────────────────────────

export interface SuccessImageStats {
  byImage: Record<string, number>;
  byManager: Record<string, Record<string, number>>;
}

// ─── Клиенты и пресеты ───────────────────────────────────────────────────────

export interface ClientStore {
  byManager: Record<string, string[]>;
}

export interface PresetEntry {
  id: string;
  name: string;
  data: Partial<FormData>;
  createdAt: string;
  updatedAt: string;
}

export interface PresetStore {
  byManager: Record<string, PresetEntry[]>;
}

// ─── UI ──────────────────────────────────────────────────────────────────────

export type UiIconName =
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

// ─── Обновления ──────────────────────────────────────────────────────────────

export type UpdateStatus = "idle" | "checking" | "available" | "downloading" | "downloaded" | "error";

export type UpdateState = {
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
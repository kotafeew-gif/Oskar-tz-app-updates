import { Fragment, useEffect, useRef, useState } from "react";
import {
  APP_VERSION, AUTO_REVERSE_COLOR, BAG_COLOR_OPTIONS, BAG_HANDLE_TYPES,
  BAG_PAPER_TYPE_OPTIONS, CALENDAR_OFFSET_COLORS, DEFAULT_AD_MANAGERS,
  DEFAULT_BINDING_TYPES, DEFAULT_BUSINESS_CARD_SIZES, DEFAULT_COLORS,
  DEFAULT_DENSITIES, DEFAULT_ENVELOPE_SIZES, DEFAULT_LAMINATION_KINDS,
  DEFAULT_LAMINATION_THICKNESS, DEFAULT_MANAGERS,
  DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES, DEFAULT_PAPER_LIBRARY,
  DEFAULT_PAPER_PROFILES, DEFAULT_PAPER_SIZES, DEFAULT_POCKET_CALENDAR_SIZES,
  DEFAULT_POST_PROCESSING, DEFAULT_PRODUCT_TEMPLATE_FIELDS,
  DEFAULT_PRODUCT_TEMPLATE_FLAGS, DEFAULT_PRODUCT_TEMPLATE_KINDS,
  DEFAULT_PRODUCT_TEMPLATES, DEFAULT_PRODUCT_TYPES, DRILL_DIAMETERS,
  FORSAC_PAPER_TYPES, KASHUROVKA_BASE_TYPES, KASHUROVKA_LINER_TYPES,
  LS_KEYS, PAPER_PROFILE_LABELS, PAPER_TYPE_OPTIONS,
  PAPER_TYPE_TO_LIBRARY_KEY, PRODUCT_LAYOUT_META, PRODUCT_LAYOUT_OPTIONS,
  PRODUCT_TEMPLATE_FIELD_KEYS, RARE_SUCCESS_IMAGE_NAMES, SPRING_COLORS,
  SPRING_SPECS, STICKER_COLOR_MODES, STICKER_MATERIALS, SUCCESS_IMAGE_NAMES,
  SUCCESS_IMAGE_SRCS, SUCCESS_IMAGE_WEIGHTS, UPDATE_SUMMARY_POINTS, runtimeState,
  type BagPaperTypeOption, type PaperLibraryKey, type PaperProfileKey,
  type PaperTypeOption, type ProductLayoutKind, type ProductTemplateConfig,
  type ProductTemplateFieldConfig, type ProductTemplateFieldKey,
  type ProductTemplateFlags, type ProductTemplateStore, type SpringSpec,
} from "../constants";
import type {
  AdFormData,
  ClientStore,
  DesktopCalendarPart,
  Dicts,
  FormData,
  KashurovkaBlock,
  LaminationBlock,
  ManagerMarkerState,
  NotebookPart,
  PaperFinish,
  PaperSelectionValue,
  PresetEntry,
  PresetStore,
  QuarterAdPart,
  ReservedAssignment,
  SubcontractWork,
  SuccessImageStats,
  UiIconName,
  UpdateState,
  UpdateStatus,
} from "../types";
import {
  applyProductTemplateMigrations,
  buildPresetPayload,
  buildSpringSuggestion,
  createDefaultAdForm,
  createDefaultForm,
  createDefaultManagerMarkers,
  createDesktopCalendarPart,
    createEmptyClientStore,
    createEmptyPresetStore,
    createEmptySuccessImageStats,
    createInitialDicts,
    createNotebookPart,
    createProductTemplateConfig,
    createQuarterAdPart,
    createResetDicts,
    createSubcontractWork,
    defaultKashurovkaBlock,
    defaultLaminationBlock,
    DESKTOP_CALENDAR_PART_TYPES,
  ensureProductTypes,
  estimateThicknessMm,
  findSpringSpecForThickness,
  formatBagPaperSelection,
  formatColorWithReverse,
  formatDateForFilename,
  formatDateTimeText,
  formatFileCountText,
  formatFinishForTZ,
  formatHoleSelectionText,
  formatLamination,
  formatLaminationCompact,
  formatMaterialWithFinish,
  formatNotebookColorText,
  formatDesktopCalendarPartShort,
  formatDesktopCalendarPartTZ,
  formatNotebookPartForTZ,
  formatPaperSelection,
  formatPaperSelectionForTZ,
  formatPaperSelectionWithFinish,
  formatPaperSelectionWithFinishForTZ,
  formatPostProcessingFullText,
  formatPostProcessingShortText,
  formatProductNameForTZ,
  formatQuantityText,
  formatQuarterCalendarShortLines,
  formatShortColor,
  generateAdShortTZ,
  generateShortTZ,
  generateTZ,
  getActiveSubcontractWorks,
  getBagColor,
  getBagHandleText,
  getClientSuggestions,
  getCurrentDateTimeForFilename,
  getDesktopCalendarKashShortTZ,
  getKashShortTZ,
  getLaminationShort,
  getCurrentLocalTimeIso,
  getDisplaySize,
  getLaminationSideNotation,
  getPaperLibraryItems,
  getProductLayoutKind,
  getProductTemplate,
  getProductTemplateFieldConfig,
  getProductTemplateFieldLabel,
  getRandomSuccessImageSrc,
  getSpringColor,
  getSpringDiameterText,
  getSpringOutputParts,
  getSpringSpecNote,
  getTZNumber,
  getTodayLocalIso,
  interpolateThickness,
  isBag,
  isBrochure,
  isBusinessCard,
  isCalendar,
  isCatalog,
  isCubariki,
  isEnvelope,
  isMultiBlock,
  isNotebook,
  isSticker,
  isCoated115Paper,
  isDateTimeInPast,
  isDeadlineTimeInPast,
  isLayout,
  isPaperlessPaperType,
  isPlainObject,
  isPocketCalendar,
  isProductTemplateFieldRequired,
  isSamePaperSelection,
  isStandaloneShortPart,
  loadList,
  loadManagerMarkerState,
  loadPaperLibrary,
  loadPaperProfiles,
  loadProductTemplates,
  loadSpringSpecs,
  loadSuccessImageStats,
  mergePresetIntoForm,
  mergeUniqueStrings,
  normalizeClientName,
  normalizeColorMode,
  normalizeDictsPayload,
  normalizeManagerMarkerState,
  normalizeManagerName,
  normalizeMaterial,
  normalizePaperLibrary,
  normalizeProductTemplatesPayload,
  normalizeSpringSpecs,
  normalizeStringList,
  normalizeTemplateFields,
  normalizeTemplateFlags,
  normalizeTemplateName,
  paperFinishOptionsForSelection,
  PAPER_FINISHES,
  paperSelectionKey,
  parseManagerMarkerIndex,
  parseWeight,
  requiresPaperDensity,
  resolveProductName,
  saveList,
  saveManagerMarkerState,
  savePaperLibrary,
  savePaperProfiles,
  saveProductTemplates,
  saveSpringSpecs,
  stripParentheticalNote,
  syncProductTemplatesToTypes
} from "../utils";


import YesNo from "./YesNo";




import { fieldClass, selectFieldClass, actionFieldClass, inputClass, selectClass } from "./fieldClasses";


import UiIcon, { getSectionIcon, DICT_ICON_MAP } from "./UiIcon";
import Section from "./Section";
import Field from "./Field";

import DateTimeField from "./DateTimeField";
import UpdateNotice from "./UpdateNotice";
import UpdateSummaryModal from "./UpdateSummaryModal";

import LaminationBlockComponent from "./LaminationBlock";
import PaperFinishField from "./PaperFinishField";
import PaperSelectionField from "./PaperSelectionField";

import KashurovkaBlockComponent from "./KashurovkaBlock";
import ShortTZPanel from "./ShortTZPanel";
import AdShortTZPanel from "./AdShortTZPanel";

import DictEditor from "./DictEditor";
import SpringSpecsEditor from "./SpringSpecsEditor";
import ProductTemplateEditor from "./ProductTemplateEditor";
import Kitten from "./Kitten";

import { getRequiredFields, getRequiredAdFields, REQUIRED_FIELD_LABELS } from "../validation";

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
  useEffect(() => { saveSpringSpecs(dicts.springSpecs); runtimeState.springSpecs = dicts.springSpecs; }, [dicts.springSpecs]);
  useEffect(() => { saveList(LS_KEYS.notebookCompositionPartTypes, dicts.notebookCompositionPartTypes); }, [dicts.notebookCompositionPartTypes]);
  useEffect(() => { saveList(LS_KEYS.managers, dicts.managers); }, [dicts.managers]);
  useEffect(() => { saveList(LS_KEYS.adManagers, dicts.adManagers); }, [dicts.adManagers]);
  useEffect(() => { saveManagerMarkerState({ managerMarkers: dicts.managerMarkers, managerMarkerCounter: dicts.managerMarkerCounter }); }, [dicts.managerMarkers, dicts.managerMarkerCounter]);
  useEffect(() => { savePaperProfiles(dicts.paperProfiles); }, [dicts.paperProfiles]);
  useEffect(() => { savePaperLibrary(dicts.paperLibrary); }, [dicts.paperLibrary]);
  useEffect(() => { runtimeState.productTemplates = dicts.productTemplates; }, [dicts.productTemplates]);
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

  function updateSpringSpecs(next: SpringSpec[]) {
    setDicts((prev) => ({ ...prev, springSpecs: next }));
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
      const savedPreset = (Object.values(result.store.byManager || {}).flat() as PresetEntry[])
        .find((preset) => preset.name.toLowerCase() === presetName.toLowerCase());
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
  const [kittenEnabled, setKittenEnabled] = useState(false);
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
  const [sendSuccessImageSrc, setSendSuccessImageSrc] = useState(() => getRandomSuccessImageSrc());
  const [successImageStats, setSuccessImageStats] = useState<SuccessImageStats>(() => loadSuccessImageStats());
  const [previewText, setPreviewText] = useState("");
  const [updateState, setUpdateState] = useState<UpdateState | null>(null);
  const [cellBookingDraftCount, setCellBookingDraftCount] = useState("");
  const [presetNameDraft, setPresetNameDraft] = useState("");
  const [presetSearchDraft, setPresetSearchDraft] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const springDiameterManuallyEditedRef = useRef(false);
  const [presetSaveStatus, setPresetSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [reservedAssignment, setReservedAssignment] = useState<ReservedAssignment | null>(null);
  const [reserveState, setReserveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [reserveMsg, setReserveMsg] = useState<string | null>(null);

  async function recordSuccessImage(imageSrc: string, managerName: string) {
    const imageName = imageSrc.split("/").pop() || imageSrc;
    const manager = managerName.trim() || "Не указан";
    setSuccessImageStats((prev) => {
      const next: SuccessImageStats = {
        byImage: { ...prev.byImage, [imageName]: (prev.byImage[imageName] || 0) + 1 },
        byManager: Object.fromEntries(Object.entries(prev.byManager).map(([name, cards]) => [name, { ...cards }])),
      };
      next.byManager[manager] = { ...(next.byManager[manager] || {}), [imageName]: (next.byManager[manager]?.[imageName] || 0) + 1 };
      localStorage.setItem(LS_KEYS.successImageStats, JSON.stringify(next));
      return next;
    });
    try {
      const result = await (window as any).electronAPI?.recordCardStat?.({ managerName: manager, imageName });
      if (result?.success && result.stats) setSuccessImageStats(result.stats);
      else if (result && !result.success) setSendAutoSaveMsg((prev) => [prev, `Статистика не записалась: ${result.error || "ошибка Google Таблицы"}`].filter(Boolean).join("\n"));
    } catch (error) {
      setSendAutoSaveMsg((prev) => [prev, `Статистика не записалась: ${error instanceof Error ? error.message : "ошибка Google Таблицы"}`].filter(Boolean).join("\n"));
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await (window as any).electronAPI?.loadCardStats?.();
      if (!cancelled && result?.success && result.stats) setSuccessImageStats(result.stats);
    })();
    return () => { cancelled = true; };
  }, []);

  function closeSendSuccess() {
    setSendState("idle");
    setSendAutoSaveMsg("");
    setShowSend(false);
  }

  useEffect(() => {
    if (!showSend || sendState !== "done") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.isComposing) return;
      event.preventDefault();
      closeSendSuccess();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSend, sendState]);

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

  function updateNotebookPart(id: string, patch: Partial<NotebookPart>) {
    setForm((prev) => ({
      ...prev,
      notebookParts: prev.notebookParts.map((part) => (part.id === id ? { ...part, ...patch } : part)),
    }));
  }

  function addNotebookPart() {
    setForm((prev) => ({ ...prev, notebookParts: [...prev.notebookParts, createNotebookPart()] }));
  }

  function removeNotebookPart(id: string) {
    setForm((prev) => ({ ...prev, notebookParts: prev.notebookParts.filter((part) => part.id !== id) }));
  }

  function moveNotebookPart(id: string, direction: -1 | 1) {
    setForm((prev) => {
      const index = prev.notebookParts.findIndex((part) => part.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.notebookParts.length) return prev;
      const notebookParts = [...prev.notebookParts];
      [notebookParts[index], notebookParts[nextIndex]] = [notebookParts[nextIndex], notebookParts[index]];
      return { ...prev, notebookParts };
    });
  }

  function updateDesktopCalendarPart(id: string, patch: Partial<DesktopCalendarPart>) {
    setForm((prev) => ({
      ...prev,
      desktopCalendarParts: prev.desktopCalendarParts.map((part) => (part.id === id ? { ...part, ...patch } : part)),
    }));
  }

  function addDesktopCalendarPart() {
    setForm((prev) => ({ ...prev, desktopCalendarParts: [...prev.desktopCalendarParts, createDesktopCalendarPart("Другое")] }));
  }

  function removeDesktopCalendarPart(id: string) {
    setForm((prev) => ({ ...prev, desktopCalendarParts: prev.desktopCalendarParts.filter((part) => part.id !== id) }));
  }

  function moveDesktopCalendarPart(id: string, direction: -1 | 1) {
    setForm((prev) => {
      const index = prev.desktopCalendarParts.findIndex((part) => part.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.desktopCalendarParts.length) return prev;
      const desktopCalendarParts = [...prev.desktopCalendarParts];
      [desktopCalendarParts[index], desktopCalendarParts[nextIndex]] = [desktopCalendarParts[nextIndex], desktopCalendarParts[index]];
      return { ...prev, desktopCalendarParts };
    });
  }

  function updateQuarterAdPart(id: string, patch: Partial<QuarterAdPart>) {
    setForm((prev) => ({
      ...prev,
      quarterAdParts: prev.quarterAdParts.map((part) => (prev.quarterAdFieldsSame || part.id === id ? { ...part, ...patch } : part)),
    }));
  }

  function addQuarterAdPart() {
    setForm((prev) => ({ ...prev, quarterAdBlocks: String(prev.quarterAdParts.length + 1), quarterAdParts: [...prev.quarterAdParts, createQuarterAdPart()] }));
  }

  function removeQuarterAdPart(id: string) {
    setForm((prev) => ({ ...prev, quarterAdBlocks: String(Math.max(0, prev.quarterAdParts.length - 1)), quarterAdParts: prev.quarterAdParts.filter((part) => part.id !== id) }));
  }

  function setQuarterAdBlocks(value: string) {
    const count = Math.max(1, Number(value) || 1);
    setForm((prev) => {
      const parts = [...prev.quarterAdParts];
      while (parts.length < count) parts.push(createQuarterAdPart());
      return { ...prev, quarterAdBlocks: String(count), quarterAdParts: parts.slice(0, count) };
    });
  }

  function toggleQuarterAdFieldsSame() {
    setForm((prev) => {
      const nextSame = !prev.quarterAdFieldsSame;
      if (!nextSame || prev.quarterAdParts.length < 2) return { ...prev, quarterAdFieldsSame: nextSame };
      const template = prev.quarterAdParts[0];
      return { ...prev, quarterAdFieldsSame: true, quarterAdParts: prev.quarterAdParts.map((part) => ({ ...template, id: part.id })) };
    });
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
  const springDiameterIsCustomOrder = springSuggestion?.subcontract || false;
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
    { key: "springSpecs", title: "Пружины", icon: "➰", element: <SpringSpecsEditor items={dicts.springSpecs} onChange={updateSpringSpecs} /> },
    { key: "laminationKinds", title: "Виды ламинации", icon: "✨", element: <DictEditor title="Виды ламинации" icon="✨" items={dicts.laminationKinds} onChange={(v) => updateDict("laminationKinds", v)} /> },
    { key: "laminationThickness", title: "Толщина ламинации", icon: "📏", element: <DictEditor title="Толщина ламинации" icon="📏" items={dicts.laminationThickness} onChange={(v) => updateDict("laminationThickness", v)} /> },
    { key: "notebookCompositionPartTypes", title: "Составные части блокнота", icon: "🧩", element: <DictEditor title="Составные части блокнота" icon="🧩" items={dicts.notebookCompositionPartTypes} onChange={(v) => updateDict("notebookCompositionPartTypes", v)} /> },
    {
      key: "successImageStats",
      title: "Статистика карточек успеха",
      icon: "🏆",
      element: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Статистика карточек успеха</h3>
              <p className="mt-1 text-xs text-slate-500">Общая статистика из листа __CARD_STATS__ для всех менеджеров.</p>
            </div>
            <button type="button" onClick={() => { if (confirm("Сбросить статистику карточек?")) { const empty = createEmptySuccessImageStats(); localStorage.setItem(LS_KEYS.successImageStats, JSON.stringify(empty)); setSuccessImageStats(empty); } }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Сбросить</button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Всего выпадений</h4>
              <div className="space-y-1 text-sm">{[...SUCCESS_IMAGE_NAMES, ...RARE_SUCCESS_IMAGE_NAMES].map((name) => <div key={name} className="flex justify-between border-b border-slate-100 py-1"><span>{name}</span><span className="font-semibold">{successImageStats.byImage[name] || 0}</span></div>)}</div>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">По менеджерам</h4>
              {Object.keys(successImageStats.byManager).length === 0 ? <p className="text-sm text-slate-400">Пока нет данных.</p> : <div className="space-y-3">{Object.entries(successImageStats.byManager).map(([manager, cards]) => <div key={manager}><div className="mb-1 text-sm font-semibold text-slate-700">{manager}</div><div className="space-y-1 text-xs text-slate-600">{Object.entries(cards).map(([name, count]) => <div key={name} className="flex justify-between"><span>{name}</span><span>{count}</span></div>)}</div></div>)}</div>}
            </div>
          </div>
        </div>
      ),
    },
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
    const shouldAutoUpdate = !springDiameterManuallyEditedRef.current;
    if (suggestion && form.bindingType === "Пружина" && shouldAutoUpdate && form.springDiameter !== suggestion.diameter) {
      setForm((prev) => ({ ...prev, springDiameter: suggestion.diameter, springDiameterStrict: false }));
    }
  }, [form.productType, form.bindingType, form.pageCount, form.blockPages, form.density, form.densityFinish, form.blockDensity, form.blockFinish, form.blockOffsetPrinting, form.coverDensity, form.coverFinish, form.coverUseKash, form.kashurovka.linerType, form.kashurovka.linerFinish, form.kashurovka.baseType, form.kashurovka.baseCustomName, form.kashurovka.linerPaperDensity, form.kashurovka.forsacEnabled, form.kashurovka.forsacPaper, form.kashurovka.forsacPaperDensity, form.kashurovka.forsacFinish, form.calendarBaseUseKash, form.calendarGridMaterial, form.calendarGridPages, form.calendarGridFinish, form.desktopCalendarCompositionEnabled, form.desktopCalendarParts, form.notebookCompositionEnabled, form.notebookParts]);

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
    springDiameterManuallyEditedRef.current = false;
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
        const nextSuccessImage = getRandomSuccessImageSrc(sendSuccessImageSrc);
        setSendSuccessImageSrc(nextSuccessImage);
        recordSuccessImage(nextSuccessImage, isAdsTab ? adForm.managerName : form.managerName);
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
  const cubariki = isCubariki(pt);
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
                  <select data-field="productType" value={form.productType} className={selectFieldClass(showValidation && required.includes("productType"))} onChange={(e) => { const nextProductType = e.target.value; const notebookSelected = isNotebook(nextProductType); setForm((prev) => ({ ...createDefaultForm(), orderNumber: prev.orderNumber, clientName: prev.clientName, managerName: prev.managerName, deadline: prev.deadline, deadlineTime: prev.deadlineTime, quantity: prev.quantity, cellBooking: prev.cellBooking, subcontractWorks: prev.subcontractWorks, productType: nextProductType, binding: notebookSelected, bindingType: notebookSelected ? "Пружина" : "Скоба", bigkovka: notebookSelected ? false : prev.bigkovka, falcovka: notebookSelected ? false : prev.falcovka })); springDiameterManuallyEditedRef.current = false; setShowValidation(false); }}>
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
                ) : cubariki ? (
                  <Field label={templateSizeLabel} required>
                    <input data-field="paperSize" className={fieldClass(showValidation && required.includes("paperSize"))} placeholder="Например: 90×90 мм" value={form.paperSize} onChange={(e) => update("paperSize", e.target.value)} />
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
                        visible={!sticker && form.paperType === "Мелованная"}
                        options={paperFinishOptionsForSelection(form.paperType, form.density)}
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
                  {cubariki && <Field label="Количество листов в блоке" required><input data-field="blockPages" type="number" min={1} className={fieldClass(showValidation && required.includes("blockPages"))} value={form.blockPages} onChange={(e) => update("blockPages", e.target.value)} placeholder="Например: 100" /></Field>}
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
                      {["Круглое", "Овальное", "Евро", "Без отверстия"].map((item) => <option key={item}>{item}</option>)}
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
                  {notebook && (
                    <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-violet-800">Составной блокнот</h3>
                          <p className="mt-1 text-xs text-violet-700">Включите, если блокнот состоит из нескольких частей (подложка, листы, вкладыши и т.д.).</p>
                        </div>
                        <YesNo
                          value={form.notebookCompositionEnabled}
                          onChange={(value) => setForm((prev) => ({
                            ...prev,
                            notebookCompositionEnabled: value,
                            notebookParts: value && prev.notebookParts.length === 0 ? [createNotebookPart()] : prev.notebookParts,
                          }))}
                        />
                      </div>
                    </div>
                  )}
                  {(!notebook || !form.notebookCompositionEnabled) && (
                    <>
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
                          setForm((prev) => ({
                            ...prev,
                            coverUseKash: value,
                            kashurovka: value
                              ? { ...prev.kashurovka, enabled: true }
                              : { ...prev.kashurovka, enabled: false },
                          }));
                        }} />
                      </Field>
                      {form.coverUseKash && <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">Продолжите оформление в разделе кашировки.</div>}
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
                        <div className={form.coverUseKash ? "opacity-50 pointer-events-none" : ""}><PaperFinishField label="Поверхность обложки" visible={form.coverPaperType === "Мелованная"} value={form.coverFinish} options={paperFinishOptionsForSelection(form.coverPaperType, form.coverDensity)} onChange={(value) => update("coverFinish", value)} /></div>
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
                                <PaperFinishField label="Поверхность подложки" visible={form.backingPaperType === "Мелованная"} value={form.backingFinish} options={paperFinishOptionsForSelection(form.backingPaperType, form.backingDensity)} onChange={(value) => update("backingFinish", value)} />
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
                            disabled={form.blockOffsetPrinting}
                            invalidType={showValidation && !form.blockOffsetPrinting && required.includes("blockPaperType")}
                            invalidMaterial={showValidation && !form.blockOffsetPrinting && required.includes("blockDensity")}
                            invalidCustom={showValidation && !form.blockOffsetPrinting && required.includes("blockPaperCustomName")}
                          />
                        </div>
                        <div className={form.blockOffsetPrinting ? "pointer-events-none opacity-50" : ""}><PaperFinishField label="Поверхность блока" visible={form.blockPaperType === "Мелованная"} value={form.blockFinish} options={paperFinishOptionsForSelection(form.blockPaperType, form.blockDensity)} onChange={(value) => update("blockFinish", value)} /></div>
                        <Field label="Цветность блока" required={!form.blockOffsetPrinting}><select data-field="blockColor" value={form.blockColor} disabled={form.blockOffsetPrinting} className={`${selectFieldClass(showValidation && !form.blockOffsetPrinting && required.includes("blockColor"))} ${form.blockOffsetPrinting ? "opacity-50 cursor-not-allowed" : ""}`} onChange={(e) => update("blockColor", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}</select></Field>
                        <label className="md:col-span-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><input type="checkbox" checked={form.blockOffsetPrinting} onChange={(e) => { update("blockOffsetPrinting", e.target.checked); if (e.target.checked) update("blockColor", ""); }} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />Печать блока на офсете</label>
                      </div>
                      <div className={form.blockOffsetPrinting ? "pointer-events-none opacity-50" : ""}><LaminationBlockComponent label="Ламинация блока" value={form.blockLamination} onChange={(v: any) => update("blockLamination", v)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} /></div>
                    </div>
                  </div>
                    </>
                  )}

                  {notebook && (
                    <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 space-y-4">
                      {form.notebookCompositionEnabled && (
                        <div className="space-y-3 border-t border-violet-200 pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold text-violet-800">Части и порядок сборки</h4>
                              <p className="mt-1 text-xs text-violet-700">Карточки выводятся в ТЗ в том же порядке.</p>
                            </div>
                            <button
                              type="button"
                              onClick={addNotebookPart}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100"
                            >
                              <span className="text-base leading-none">＋</span> Добавить часть
                            </button>
                          </div>

                          {form.notebookParts.map((part, index) => {
                            const partNeedsQuantity = part.type === "Листы блока" || part.type === "Вкладыш";
                            const partUsesOffsetPrinting = part.type === "Листы блока" && part.offsetPrinting;
                            const invalidPart = showValidation && (!part.type || (partNeedsQuantity && (!part.quantity || Number(part.quantity) <= 0)) || (!partUsesOffsetPrinting && (!part.paperType || (part.paperType === "Дизайнерская" ? !part.paperCustomName.trim() : requiresPaperDensity(part.paperType) && !part.density.trim()))));
                            return (
                              <div key={part.id} className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                  <div className="text-xs font-semibold uppercase tracking-wide text-violet-500">Часть {index + 1}</div>
                                  <div className="flex items-center gap-2">
                                    <button type="button" aria-label="Переместить выше" disabled={index === 0} onClick={() => moveNotebookPart(part.id, -1)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">↑</button>
                                    <button type="button" aria-label="Переместить ниже" disabled={index === form.notebookParts.length - 1} onClick={() => moveNotebookPart(part.id, 1)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">↓</button>
                                    <button type="button" onClick={() => removeNotebookPart(part.id)} className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">Удалить</button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <Field label="Тип части" required>
                                    <select value={part.type} className={selectFieldClass(showValidation && !part.type)} onChange={(e) => updateNotebookPart(part.id, { type: e.target.value })}>
                                      <option value="">— выберите —</option>
                                      {dicts.notebookCompositionPartTypes.map((type) => <option key={type}>{type}</option>)}
                                    </select>
                                  </Field>
                                  {partNeedsQuantity && (
                                    <Field label="Количество, шт." required>
                                      <input type="number" min={1} className={fieldClass(showValidation && !part.quantity)} value={part.quantity} onChange={(e) => updateNotebookPart(part.id, { quantity: e.target.value })} />
                                    </Field>
                                  )}
                                  <div className="md:col-span-2">
                                    <PaperSelectionField
                                      label="Бумага / материал"
                                      typeValue={part.paperType}
                                      materialValue={part.density}
                                      customValue={part.paperCustomName}
                                      library={dicts.paperLibrary}
                                      productType={form.productType}
                                      onTypeChange={(value) => updateNotebookPart(part.id, { paperType: value, density: "", paperCustomName: "", offsetPrinting: false })}
                                      onMaterialChange={(value) => updateNotebookPart(part.id, { density: value })}
                                      onCustomChange={(value) => updateNotebookPart(part.id, { paperCustomName: value })}
                                      typeFieldName={`notebookPartPaperType-${part.id}`}
                                      materialFieldName={`notebookPartDensity-${part.id}`}
                                      customFieldName={`notebookPartCustom-${part.id}`}
                                      showValidation={showValidation}
                                      disabled={partUsesOffsetPrinting}
                                      invalidType={showValidation && !partUsesOffsetPrinting && !part.paperType}
                                      invalidMaterial={showValidation && !partUsesOffsetPrinting && part.paperType !== "Дизайнерская" && !!part.paperType && requiresPaperDensity(part.paperType) && !part.density.trim()}
                                      invalidCustom={showValidation && !partUsesOffsetPrinting && part.paperType === "Дизайнерская" && !part.paperCustomName.trim()}
                                    />
                                  </div>
                                  {part.type === "Листы блока" && (
                                    <label className="md:col-span-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                      <input
                                        type="checkbox"
                                        checked={part.offsetPrinting}
                                        onChange={(e) => updateNotebookPart(part.id, { offsetPrinting: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      Печатается на офсете
                                    </label>
                                  )}
                                  <PaperFinishField label="Поверхность" visible={part.paperType === "Мелованная"} value={part.finish} options={paperFinishOptionsForSelection(part.paperType, part.density)} onChange={(value) => updateNotebookPart(part.id, { finish: value })} />
                                  <Field label="Цветность">
                                    <select value={part.color} className={selectClass} onChange={(e) => updateNotebookPart(part.id, { color: e.target.value })}>
                                      <option>Без печати</option>
                                      {dicts.colors.map((color) => <option key={color}>{color}</option>)}
                                    </select>
                                  </Field>
                                  <div className="md:col-span-2">
                                    <LaminationBlockComponent label="Ламинация" value={part.lamination} onChange={(value: LaminationBlock) => updateNotebookPart(part.id, { lamination: value })} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Field label="Примечание к части">
                                      <input type="text" className={fieldClass(false)} placeholder="Например: печать на цифре" value={part.note} onChange={(e) => updateNotebookPart(part.id, { note: e.target.value })} />
                                    </Field>
                                  </div>
                                </div>
                                {invalidPart && <p className="mt-3 text-xs text-red-500">Заполните тип части, бумагу и количество только для листов или вкладышей. Для листов можно выбрать печать на офсете без указания бумаги.</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {calendar && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Вид календаря" required><select data-field="calendarKind" value={form.calendarKind} className={selectFieldClass(showValidation && required.includes("calendarKind"))} onChange={(e) => update("calendarKind", e.target.value)}><option>Квартальный</option><option>Настенный</option><option>Настольный</option><option>Карманный</option></select></Field>
                  </div>
                  {form.calendarKind === "Квартальный" && (
                    <div className="space-y-5 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Количество рекламных полей" required><input data-field="quarterAdParts" type="number" min={1} className={fieldClass(showValidation && required.includes("quarterAdParts"))} value={form.quarterAdBlocks} onChange={(e) => setQuarterAdBlocks(e.target.value)} /></Field>
                        <Field label="Размер постера" required><input data-field="quarterPosterSize" className={fieldClass(showValidation && required.includes("quarterPosterSize"))} placeholder="Например: 297×210 мм" value={form.quarterPosterSize} onChange={(e) => update("quarterPosterSize", e.target.value)} /></Field>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-white p-3 space-y-3">
                        <h4 className="text-sm font-semibold text-amber-800">Постер</h4>
                        <PaperSelectionField label="Бумага постера" typeValue={form.quarterPosterPaperType} materialValue={form.quarterPosterDensity} customValue={form.quarterPosterPaperCustomName} library={dicts.paperLibrary} productType={form.productType} onTypeChange={(value) => { update("quarterPosterPaperType", value); update("quarterPosterDensity", ""); update("quarterPosterPaperCustomName", ""); }} onMaterialChange={(value) => update("quarterPosterDensity", value)} onCustomChange={(value) => update("quarterPosterPaperCustomName", value)} typeFieldName="quarterPosterPaperType" materialFieldName="quarterPosterDensity" customFieldName="quarterPosterPaperCustomName" showValidation={showValidation} invalidType={showValidation && required.includes("quarterPosterPaperType")} invalidMaterial={showValidation && required.includes("quarterPosterDensity")} invalidCustom={showValidation && required.includes("quarterPosterPaperCustomName")} />
                        <Field label="Цветность постера"><select className={selectClass} value={form.quarterPosterColorMode} onChange={(e) => update("quarterPosterColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((color) => <option key={color}>{color}</option>)}</select></Field>
                        <PaperFinishField label="Поверхность постера" visible={form.quarterPosterPaperType === "Мелованная"} value={form.quarterPosterFinish} options={paperFinishOptionsForSelection(form.quarterPosterPaperType, form.quarterPosterDensity)} onChange={(value) => update("quarterPosterFinish", value)} />
                        <LaminationBlockComponent label="Ламинация постера" value={form.quarterPosterLamination} onChange={(value: LaminationBlock) => update("quarterPosterLamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-white p-3 space-y-3">
                        <div className="flex items-center justify-between gap-3"><h4 className="text-sm font-semibold text-amber-800">Рекламные поля</h4><div className="flex gap-2"><button type="button" onClick={toggleQuarterAdFieldsSame} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${form.quarterAdFieldsSame ? "border-amber-500 bg-amber-100 text-amber-900" : "border-amber-300 text-amber-800 hover:bg-amber-50"}`}>{form.quarterAdFieldsSame ? "Поля одинаковые: Да" : "Поля одинаковые"}</button><button type="button" onClick={addQuarterAdPart} className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-50">＋ Добавить поле</button></div></div>
                        {form.quarterAdParts.slice(0, form.quarterAdFieldsSame ? 1 : undefined).map((part, index) => (
                          <div key={part.id} className="rounded-lg border border-slate-200 p-3 space-y-3">
                            <div className="flex items-center justify-between"><h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Рекламное поле {index + 1}</h5>{form.quarterAdParts.length > 1 && <button type="button" onClick={() => removeQuarterAdPart(part.id)} className="text-xs text-red-500">Удалить</button>}</div>
                            <Field label="Размер" required><input data-field="quarterAdPartSize" className={fieldClass(showValidation && required.includes("quarterAdPartSize"))} placeholder="Например: 297×210 мм" value={part.size} onChange={(e) => updateQuarterAdPart(part.id, { size: e.target.value })} /></Field>
                            <PaperSelectionField label="Бумага" typeValue={part.paperType} materialValue={part.density} customValue={part.paperCustomName} library={dicts.paperLibrary} productType={form.productType} onTypeChange={(value) => updateQuarterAdPart(part.id, { paperType: value, density: "", paperCustomName: "" })} onMaterialChange={(value) => updateQuarterAdPart(part.id, { density: value })} onCustomChange={(value) => updateQuarterAdPart(part.id, { paperCustomName: value })} typeFieldName={`quarterAdPartPaperType-${part.id}`} materialFieldName={`quarterAdPartDensity-${part.id}`} customFieldName={`quarterAdPartCustom-${part.id}`} showValidation={showValidation} invalidType={false} invalidMaterial={false} invalidCustom={false} />
                            <PaperFinishField label="Поверхность" visible={part.paperType === "Мелованная"} value={part.finish} options={paperFinishOptionsForSelection(part.paperType, part.density)} onChange={(value) => updateQuarterAdPart(part.id, { finish: value })} />
                            <Field label="Цветность"><select className={selectClass} value={part.colorMode || ""} onChange={(e) => updateQuarterAdPart(part.id, { colorMode: e.target.value })}><option value="">— выберите —</option>{dicts.colors.map((color) => <option key={color}>{color}</option>)}</select></Field>
                            <LaminationBlockComponent label="Ламинация" value={part.lamination} onChange={(value: LaminationBlock) => updateQuarterAdPart(part.id, { lamination: value })} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-white p-3 space-y-3">
                        <h4 className="text-sm font-semibold text-amber-800">Календарная сетка</h4>
                        <Field label="Сетка стандартная"><YesNo value={form.quarterGridStandard} onChange={(value) => update("quarterGridStandard", value)} /></Field>
                        {form.quarterGridStandard ? <Field label="Какая стандартная сетка" required><input data-field="quarterGridName" className={fieldClass(showValidation && required.includes("quarterGridName"))} placeholder="Например: серая Донарита" value={form.quarterGridName} onChange={(e) => update("quarterGridName", e.target.value)} /></Field> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field label="Размер сетки" required><input data-field="quarterGridSize" className={fieldClass(showValidation && required.includes("quarterGridSize"))} value={form.quarterGridSize} onChange={(e) => update("quarterGridSize", e.target.value)} /></Field>
                          <PaperSelectionField label="Бумага сетки" typeValue={form.quarterGridPaperType} materialValue={form.quarterGridDensity} customValue={form.quarterGridPaperCustomName} library={dicts.paperLibrary} productType={form.productType} onTypeChange={(value) => { update("quarterGridPaperType", value); update("quarterGridDensity", ""); update("quarterGridPaperCustomName", ""); }} onMaterialChange={(value) => update("quarterGridDensity", value)} onCustomChange={(value) => update("quarterGridPaperCustomName", value)} typeFieldName="quarterGridPaperType" materialFieldName="quarterGridDensity" customFieldName="quarterGridPaperCustomName" showValidation={showValidation} invalidType={showValidation && required.includes("quarterGridPaperType")} invalidMaterial={showValidation && required.includes("quarterGridDensity")} invalidCustom={showValidation && required.includes("quarterGridPaperCustomName")} />
                          <PaperFinishField label="Поверхность сетки" visible={form.quarterGridPaperType === "Мелованная"} value={form.quarterGridFinish} options={paperFinishOptionsForSelection(form.quarterGridPaperType, form.quarterGridDensity)} onChange={(value) => update("quarterGridFinish", value)} />
                          <Field label="Цветность"><select className={selectClass} value={form.quarterGridColorMode} onChange={(e) => update("quarterGridColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((color) => <option key={color}>{color}</option>)}</select></Field>
                          <Field label="Где печать"><select className={selectClass} value={form.quarterGridPrintMode} onChange={(e) => update("quarterGridPrintMode", e.target.value)}><option>У себя</option><option>Офсет</option></select></Field>
                        </div>}
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-white p-3 space-y-3">
                        <Field label="Подложки под сетку"><YesNo value={form.quarterBackingEnabled} onChange={(value) => update("quarterBackingEnabled", value)} /></Field>
                        {form.quarterBackingEnabled && <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Field label="Размер подложки" required><input data-field="quarterBackingSize" className={fieldClass(showValidation && required.includes("quarterBackingSize"))} value={form.quarterBackingSize} onChange={(e) => update("quarterBackingSize", e.target.value)} /></Field><PaperSelectionField label="Бумага подложки" typeValue={form.quarterBackingPaperType} materialValue={form.quarterBackingDensity} customValue={form.quarterBackingPaperCustomName} library={dicts.paperLibrary} productType={form.productType} onTypeChange={(value) => { update("quarterBackingPaperType", value); update("quarterBackingDensity", ""); update("quarterBackingPaperCustomName", ""); }} onMaterialChange={(value) => update("quarterBackingDensity", value)} onCustomChange={(value) => update("quarterBackingPaperCustomName", value)} typeFieldName="quarterBackingPaperType" materialFieldName="quarterBackingDensity" customFieldName="quarterBackingPaperCustomName" showValidation={showValidation} invalidType={showValidation && required.includes("quarterBackingPaperType")} invalidMaterial={showValidation && required.includes("quarterBackingDensity")} invalidCustom={showValidation && required.includes("quarterBackingPaperCustomName")} /><PaperFinishField label="Поверхность подложки" visible={form.quarterBackingPaperType === "Мелованная"} value={form.quarterBackingFinish} onChange={(value) => update("quarterBackingFinish", value)} /><Field label="Цветность подложки"><select className={selectClass} value={form.quarterBackingColorMode} onChange={(e) => update("quarterBackingColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((color) => <option key={color}>{color}</option>)}</select></Field></div>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-amber-200 bg-white p-3">
                        <Field label="Крепление"><select className={selectClass} value={form.quarterMountType} onChange={(e) => update("quarterMountType", e.target.value)}><option>Планка</option><option>Люверс</option></select></Field>
                        <Field label="Цвет крепления"><input className={inputClass} value={form.quarterMountColor} onChange={(e) => update("quarterMountColor", e.target.value)} /></Field>
                        <Field label="Цвет пружины"><input className={inputClass} value={form.quarterSpringColor} onChange={(e) => update("quarterSpringColor", e.target.value)} /></Field>
                        <Field label="Цвет курсора"><input className={inputClass} value={form.quarterCursorColor} onChange={(e) => update("quarterCursorColor", e.target.value)} /></Field>
                        <Field label="Тип курсора"><div className="flex flex-wrap gap-2">{["С резинкой", "Без резинки", "Магнитный"].map((type) => <button key={type} type="button" onClick={() => update("quarterCursorType", type)} className={`rounded-lg border px-3 py-1.5 text-sm ${form.quarterCursorType === type ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{type}</button>)}</div></Field>
                      </div>
                    </div>
                  )}
                  {form.calendarKind === "Настенный" && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-blue-700">Подложка</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Field label="Размер основания"><input className={inputClass} value={form.calendarBaseSize || ""} onChange={(e) => update("calendarBaseSize", e.target.value)} placeholder="Например: 300×210 мм" /></Field>
                          <Field label="Материал основания" required><select data-field="calendarBaseMaterial" value={form.calendarBaseMaterial} className={selectFieldClass(showValidation && required.includes("calendarBaseMaterial"))} onChange={(e) => { update("calendarBaseMaterial", e.target.value); if (e.target.value !== "Другое...") update("calendarBaseCustomName", ""); }}><option value="">— выберите —</option>{dicts.paperProfiles.calendarBase.map((item) => <option key={item}>{item}</option>)}</select>{form.calendarBaseMaterial === "Другое..." && <><input data-field="calendarBaseCustomName" className={`${inputClass} mt-2`} value={form.calendarBaseCustomName || ""} onChange={(e) => update("calendarBaseCustomName", e.target.value)} placeholder="Укажите материал" /><p className="mt-1 text-xs font-semibold text-amber-700">Материал под заказ.</p></>}</Field>
                          <PaperFinishField label="Поверхность основания" visible={false} value={form.calendarBaseFinish} onChange={(value) => update("calendarBaseFinish", value)} />
                          <Field label="Цветность основания"><select className={selectClass} value={form.calendarBaseColorMode} onChange={(e) => update("calendarBaseColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация основания" value={form.calendarBaseLamination} onChange={(value) => update("calendarBaseLamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} /></div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-blue-700">Перекидные листы</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Field label="Размер перекидных листов"><input className={inputClass} value={form.calendarHeaderSize || ""} onChange={(e) => update("calendarHeaderSize", e.target.value)} placeholder="Например: 300×210 мм" /></Field>
                      <Field label="Бумага перекидных листов" required>
                        <select data-field="calendarHeaderPaperDensity" value={form.calendarHeaderPaperDensity} className={selectFieldClass(showValidation && required.includes("calendarHeaderPaperDensity"))} onChange={(e) => { update("calendarHeaderPaperType", "Мелованная"); update("calendarHeaderPaperDensity", e.target.value); update("calendarHeaderPaperCustomName", ""); }}>
                          <option value="">— выберите —</option>
                          {dicts.paperProfiles.notebookCover.map((item) => <option key={item}>{item}</option>)}
                        </select>
                      </Field>
                      <PaperFinishField label="Поверхность перекидных листов" visible={form.calendarHeaderPaperType === "Мелованная"} value={form.calendarHeaderPaperFinish} options={paperFinishOptionsForSelection(form.calendarHeaderPaperType, form.calendarHeaderPaperDensity)} onChange={(value) => update("calendarHeaderPaperFinish", value)} />
                      <Field label="Цветность перекидных листов"><select data-field="calendarHeaderColorMode" className={selectClass} value={form.calendarHeaderColorMode} onChange={(e) => update("calendarHeaderColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((item) => <option key={item}>{item}</option>)}</select></Field>
                      <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация перекидных листов" value={form.calendarHeaderLamination} onChange={(value) => update("calendarHeaderLamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} /></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field label="Тип подвеса"><select value={form.wallMountType} className={selectClass} onChange={(e) => update("wallMountType", e.target.value)}><option>Ригель</option><option>Планка</option></select></Field>
                      <Field label="Описание ригеля / планки" required><input data-field="wallMountDesc" className={fieldClass(showValidation && required.includes("wallMountDesc"))} value={form.wallMountDesc} onChange={(e) => update("wallMountDesc", e.target.value)} /></Field>
                      </div>
                    </div>
                  )}
                  {form.calendarKind === "Настольный" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Основание с кашированием">
                        <YesNo value={form.calendarBaseUseKash} onChange={(value) => {
                          update("calendarBaseUseKash", value);
                          if (value && !form.kashurovka.enabled) update("kashurovka", { ...form.kashurovka, enabled: true });
                          if (!value && form.kashurovka.enabled) update("kashurovka", { ...form.kashurovka, enabled: false });
                        }} />
                      </Field>
                      <Field label="Материал основания" required><select data-field="calendarBaseMaterial" value={form.calendarBaseMaterial} disabled={form.calendarBaseUseKash} className={`${selectFieldClass(showValidation && required.includes("calendarBaseMaterial"))} ${form.calendarBaseUseKash ? "opacity-50 cursor-not-allowed" : ""}`} onChange={(e) => { update("calendarBaseMaterial", e.target.value); if (e.target.value !== "Другое...") update("calendarBaseCustomName", ""); }}><option value="">— выберите —</option>{dicts.paperProfiles.calendarBase.map((d) => <option key={d}>{d}</option>)}</select>{form.calendarBaseMaterial === "Другое..." && <><input data-field="calendarBaseCustomName" className={`${inputClass} mt-2`} placeholder="Укажите материал основания" value={form.calendarBaseCustomName || ""} onChange={(e) => update("calendarBaseCustomName", e.target.value)} /><p className="mt-1 text-xs font-semibold text-amber-700">Материал под заказ.</p></>}</Field>
                      <Field label="Размер основания" required><input data-field="calendarBaseSize" className={fieldClass(showValidation && required.includes("calendarBaseSize"))} value={form.calendarBaseSize} onChange={(e) => update("calendarBaseSize", e.target.value)} placeholder="Например: 148×185 мм" /></Field>
                      <div className={form.calendarBaseUseKash ? "opacity-50 pointer-events-none" : ""}><PaperFinishField visible={false} value={form.calendarBaseFinish} onChange={(value) => update("calendarBaseFinish", value)} /></div>
                      <div className={`md:col-span-2 ${form.calendarBaseUseKash ? "opacity-50 pointer-events-none" : ""}`}>
                        <LaminationBlockComponent label="Ламинация основания" value={form.calendarBaseLamination} onChange={(value) => update("calendarBaseLamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                      </div>
                      <Field label="Количество биговок основания"><input type="number" min={0} max={20} className={inputClass} value={form.calendarBaseBigovkaLines} onChange={(e) => { update("calendarBaseBigovkaLines", e.target.value); if (e.target.value && e.target.value !== "0" && form.bigkovka) update("bigkovka", false); }} placeholder="0" /></Field>
                      {form.calendarBaseUseKash && <p className="md:col-span-2 text-xs text-slate-500">Основание настольного календаря задаётся через блок кашировки.</p>}
                      <div className="md:col-span-2 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-violet-800">Составной календарь</h3>
                            <p className="mt-1 text-xs text-violet-700">Добавьте обложку, календарный блок, лист с праздниками и другие части.</p>
                          </div>
                          <YesNo value={form.desktopCalendarCompositionEnabled} onChange={(value) => setForm((prev) => ({
                            ...prev,
                            desktopCalendarCompositionEnabled: value,
                            desktopCalendarParts: value && prev.desktopCalendarParts.length === 0 ? [createDesktopCalendarPart("Обложка"), createDesktopCalendarPart("Календарный блок")] : prev.desktopCalendarParts,
                          }))} />
                        </div>
                      </div>
                      {form.desktopCalendarCompositionEnabled && (
                        <div className="md:col-span-2 space-y-3 rounded-xl border border-violet-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-sm font-semibold text-violet-800">Части календаря</h4>
                            <button type="button" onClick={addDesktopCalendarPart} className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50">＋ Добавить часть</button>
                          </div>
                          {form.desktopCalendarParts.map((part, index) => (
                            <div key={part.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Часть {index + 1}</div>
                                <div className="flex gap-1">
                                  <button type="button" aria-label="Переместить часть выше" disabled={index === 0} onClick={() => moveDesktopCalendarPart(part.id, -1)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40">↑</button>
                                  <button type="button" aria-label="Переместить часть ниже" disabled={index === form.desktopCalendarParts.length - 1} onClick={() => moveDesktopCalendarPart(part.id, 1)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40">↓</button>
                                  <button type="button" onClick={() => removeDesktopCalendarPart(part.id)} className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-600">Удалить</button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <Field label="Вид части" required><select data-field="desktopCalendarPartType" value={part.type} className={selectFieldClass(showValidation && required.includes("desktopCalendarPartType"))} onChange={(e) => updateDesktopCalendarPart(part.id, { type: e.target.value, customName: e.target.value === "Другое" ? part.customName : "", quantity: e.target.value === "Календарный блок" && !part.quantity ? "" : part.quantity })}>{DESKTOP_CALENDAR_PART_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
                                {part.type === "Другое" && <Field label="Название части" required><input data-field="desktopCalendarPartCustomName" className={fieldClass(showValidation && required.includes("desktopCalendarPartCustomName"))} value={part.customName} onChange={(e) => updateDesktopCalendarPart(part.id, { customName: e.target.value })} placeholder="Например: рекламная вставка" /></Field>}
                                <Field label="Размер" required><input data-field="desktopCalendarPartSize" className={fieldClass(showValidation && required.includes("desktopCalendarPartSize"))} placeholder="Например: 148×185 мм" value={part.size} onChange={(e) => updateDesktopCalendarPart(part.id, { size: e.target.value })} /></Field>
                                <PaperSelectionField label="Бумага" typeValue={part.paperType} materialValue={part.density} customValue={part.paperCustomName} library={dicts.paperLibrary} productType={form.productType} onTypeChange={(value) => updateDesktopCalendarPart(part.id, { paperType: value, density: "", paperCustomName: "" })} onMaterialChange={(value) => updateDesktopCalendarPart(part.id, { density: value })} onCustomChange={(value) => updateDesktopCalendarPart(part.id, { paperCustomName: value })} typeFieldName={`desktopCalendarPartPaperType-${part.id}`} materialFieldName={`desktopCalendarPartDensity-${part.id}`} customFieldName={`desktopCalendarPartCustom-${part.id}`} showValidation={showValidation} invalidType={showValidation && required.includes("desktopCalendarPartPaperType")} invalidMaterial={showValidation && required.includes("desktopCalendarPartDensity")} invalidCustom={showValidation && required.includes("desktopCalendarPartCustom")} />
                                <PaperFinishField label="Поверхность" visible={part.paperType === "Мелованная"} value={part.finish} options={paperFinishOptionsForSelection(part.paperType, part.density)} onChange={(value) => updateDesktopCalendarPart(part.id, { finish: value })} />
                                <Field label="Цветность" required><select data-field="desktopCalendarPartColor" value={part.colorMode} className={selectFieldClass(showValidation && required.includes("desktopCalendarPartColor"))} onChange={(e) => updateDesktopCalendarPart(part.id, { colorMode: e.target.value })}><option value="">— выберите —</option>{dicts.colors.map((color) => <option key={color}>{color}</option>)}</select></Field>
                                <Field label="Количество листов" required={part.type === "Календарный блок"}><input data-field="desktopCalendarPartQuantity" type="number" min={1} className={fieldClass(showValidation && required.includes("desktopCalendarPartQuantity"))} value={part.quantity} onChange={(e) => updateDesktopCalendarPart(part.id, { quantity: e.target.value })} placeholder={part.type === "Календарный блок" ? "Например: 11" : "Необязательно"} /></Field>
                                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация" value={part.lamination} onChange={(value: LaminationBlock) => updateDesktopCalendarPart(part.id, { lamination: value })} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} /></div>
                                <Field label="Примечание / обработка"><input className={inputClass} placeholder="Например: раскрой на ахе" value={part.note} onChange={(e) => updateDesktopCalendarPart(part.id, { note: e.target.value })} /></Field>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {!form.desktopCalendarCompositionEnabled && <>
                      <Field label="Тип блока/сетки"><select value={form.gridType} className={selectClass} onChange={(e) => update("gridType", e.target.value)}><option>Цифра</option><option>Офсет</option></select></Field>
                      <Field label="Количество листов блока/сетки"><input type="number" min={1} className={inputClass} value={form.calendarGridPages || ""} onChange={(e) => update("calendarGridPages", e.target.value)} placeholder="Необязательно" /></Field>
                      {form.gridType === "Цифра" ? (
                        <>
                          <Field label="Бумага блока/сетки"><select value={form.calendarGridMaterial} className={selectClass} onChange={(e) => update("calendarGridMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.calendarGridDigital.map((d) => <option key={d}>{d}</option>)}</select></Field>
                          <PaperFinishField visible={false} value={form.calendarGridFinish} onChange={(value) => update("calendarGridFinish", value)} />
                          <Field label="Цветность блока/сетки"><select value={form.calendarGridColorMode} className={selectClass} onChange={(e) => update("calendarGridColorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((d) => <option key={d}>{d}</option>)}</select></Field>
                        </>
                      ) : (
                        <>
                          <Field label="Бумага блока/сетки"><select value={form.calendarGridMaterial} className={selectClass} onChange={(e) => update("calendarGridMaterial", e.target.value)}><option value="">— выберите —</option>{dicts.paperProfiles.calendarGridOffset.map((d) => <option key={d}>{d}</option>)}</select></Field>
                          <PaperFinishField visible={false} value={form.calendarGridFinish} onChange={(value) => update("calendarGridFinish", value)} />
                          <Field label="Цвет офсета блока/сетки"><select value={form.calendarOffsetColor} className={selectClass} onChange={(e) => update("calendarOffsetColor", e.target.value)}>{CALENDAR_OFFSET_COLORS.map((d) => <option key={d}>{d}</option>)}</select></Field>
                        </>
                      )}
                      </>}
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
                      <PaperFinishField visible={form.paperType === "Мелованная"} value={form.densityFinish} onChange={(value) => update("densityFinish", value)} />
                      <Field label={templateColorLabel} required><select data-field="colorMode" value={form.colorMode} className={selectFieldClass(showValidation && required.includes("colorMode"))} onChange={(e) => update("colorMode", e.target.value)}><option value="">— выберите —</option>{dicts.colors.map((c) => <option key={c}>{c}</option>)}</select></Field>
                      <div className="md:col-span-2">
                        <LaminationBlockComponent label="Ламинация" value={form.lamination} onChange={(value) => update("lamination", value)} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />
                      </div>
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
                          <select value={form.bagPaperType} className={selectFieldClass(showValidation && required.includes("bagPaperType"))} onChange={(e) => update("bagPaperType", e.target.value as any)}>
                            <option value="">— выберите —</option>
                            {BAG_PAPER_TYPE_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </Field>
                        <Field label="Плотность бумаги" required>
                          <select data-field="density" value={form.density} className={selectFieldClass(showValidation && required.includes("density"))} onChange={(e) => update("density", e.target.value)}>
                            <option value="">— выберите —</option>{dicts.paperProfiles.bag.map((d) => <option key={d}>{d}</option>)}
                          </select>
                        </Field>
                        <PaperFinishField visible={form.paperType === "Мелованная"} value={form.densityFinish} options={PAPER_FINISHES} onChange={(value) => update("densityFinish", value)} />
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

            <Section title="📐 Биговка / Фальцовка">
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start ${deskCalendarBigovkaActive || form.kashurovka.enabled || notebook ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-4 flex-wrap">
                  <YesNo value={form.bigkovka} onChange={(v) => update("bigkovka", v)} disabled={deskCalendarBigovkaActive || form.kashurovka.enabled || notebook} />
                  {form.bigkovka && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-600">Количество линий:</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        disabled={deskCalendarBigovkaActive || form.kashurovka.enabled || notebook}
                        className={`${inputClass} w-20 ${deskCalendarBigovkaActive || form.kashurovka.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        value={form.bigkovkaLines}
                        onChange={(e) => update("bigkovkaLines", e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  )}
                  {deskCalendarBigovkaActive && <p className="text-xs text-slate-500">Биговка уже указана в настройках основания настольного календаря.</p>}
                  {form.kashurovka.enabled && <p className="text-xs text-slate-500">При кашировке биговка не применяется.</p>}
                  {notebook && <p className="text-xs text-slate-500">Для блокнота биговка и фальцовка не применяются.</p>}
                </div>
                <div className="flex items-center gap-2 md:justify-start md:pl-2">
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Фальцовка</span>
                  <YesNo value={form.falcovka} onChange={(v) => update("falcovka", v)} disabled={deskCalendarBigovkaActive || form.kashurovka.enabled || notebook} />
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
                            <select value={form.springDiameter} className={selectClass} onChange={(e) => { springDiameterManuallyEditedRef.current = true; update("springDiameter", e.target.value); update("springDiameterStrict", Boolean(e.target.value)); }}><option value="">— выберите —</option>{dicts.springSpecs.map((spec) => <option key={`${spec.diameter}-${spec.pitch}`} value={spec.diameter}>{[spec.diameter, getSpringSpecNote(spec)].filter(Boolean).join(", ")}</option>)}</select>
                            {springSuggestion && <p className="text-xs text-slate-500 mt-1">Диаметр подобран автоматически.</p>}
                            {springDiameterIsCustomOrder && <p className="text-xs font-semibold text-amber-700 mt-1">Пружина изготавливается на подрядном оборудовании.</p>}
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
                                                    } else if (dictPassword === "mur") {
                                                                                                          setKittenEnabled(true);
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
                                                                            } else if (dictPassword === "mur") {
                                                                              setKittenEnabled(true);
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
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4" onClick={() => { if(sendState === "idle" || sendState === "done" || sendState === "error") { setSendAutoSaveMsg(""); setShowSend(false); } }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 flex min-h-full items-center justify-center">
            <div className="w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
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
                      src={sendSuccessImageSrc}
                      alt="Случайная картинка успеха"
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                </div>
                <p className="text-sm text-emerald-700 font-semibold text-center">Данные успешно отправлены!</p>
                {sendAutoSaveMsg && <p className="text-xs text-slate-500 text-center leading-5 px-2 max-w-md">{sendAutoSaveMsg}</p>}
                <button autoFocus onClick={closeSendSuccess} className="px-6 py-2 w-full max-w-sm rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">Отлично</button>
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
    {kittenEnabled && <Kitten />}
        </div>
      );
}

export default LegacyApp;

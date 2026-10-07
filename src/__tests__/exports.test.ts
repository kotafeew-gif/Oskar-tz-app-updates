import { describe, it, expect } from "vitest";

describe("full export verification", () => {
  it("utils — 134 exports", async () => {
    const m = await import("../utils");
    expect(m.DESKTOP_CALENDAR_PART_TYPES).toBeDefined();
    expect(m.PAPER_FINISHES).toBeDefined();
    expect(m.applyProductTemplateMigrations).toBeDefined();
    expect(m.buildPresetPayload).toBeDefined();
    expect(m.buildSpringSuggestion).toBeDefined();
    expect(m.createDefaultAdForm).toBeDefined();
    expect(m.createDefaultForm).toBeDefined();
    expect(m.createDefaultManagerMarkers).toBeDefined();
    expect(m.createDesktopCalendarPart).toBeDefined();
    expect(m.createEmptyClientStore).toBeDefined();
    expect(m.createEmptyPresetStore).toBeDefined();
    expect(m.createEmptySuccessImageStats).toBeDefined();
    expect(m.createInitialDicts).toBeDefined();
    expect(m.createNotebookPart).toBeDefined();
    expect(m.createProductTemplateConfig).toBeDefined();
    expect(m.createQuarterAdPart).toBeDefined();
    expect(m.createResetDicts).toBeDefined();
    expect(m.createSubcontractWork).toBeDefined();
    expect(m.defaultAdForm).toBeDefined();
    expect(m.defaultForm).toBeDefined();
    expect(m.defaultKashurovkaBlock).toBeDefined();
    expect(m.defaultLaminationBlock).toBeDefined();
    expect(m.ensureProductTypes).toBeDefined();
    expect(m.estimateThicknessMm).toBeDefined();
    expect(m.findSpringSpecForThickness).toBeDefined();
    expect(m.formatBagPaperSelection).toBeDefined();
    expect(m.formatBytes).toBeDefined();
    expect(m.formatColorWithReverse).toBeDefined();
    expect(m.formatDateForFilename).toBeDefined();
    expect(m.formatDateTimeText).toBeDefined();
    expect(m.formatDesktopCalendarPartShort).toBeDefined();
    expect(m.formatDesktopCalendarPartTZ).toBeDefined();
    expect(m.formatFileCountText).toBeDefined();
    expect(m.formatFinishForTZ).toBeDefined();
    expect(m.formatHoleSelectionText).toBeDefined();
    expect(m.formatLamination).toBeDefined();
    expect(m.formatLaminationCompact).toBeDefined();
    expect(m.formatMaterialWithFinish).toBeDefined();
    expect(m.formatNotebookColorText).toBeDefined();
    expect(m.formatNotebookPartForTZ).toBeDefined();
    expect(m.formatPaperSelection).toBeDefined();
    expect(m.formatPaperSelectionForTZ).toBeDefined();
    expect(m.formatPaperSelectionWithFinish).toBeDefined();
    expect(m.formatPaperSelectionWithFinishForTZ).toBeDefined();
    expect(m.formatPostProcessingFullText).toBeDefined();
    expect(m.formatPostProcessingShortText).toBeDefined();
    expect(m.formatProductNameForTZ).toBeDefined();
    expect(m.formatQuantityText).toBeDefined();
    expect(m.formatQuarterCalendarShortLines).toBeDefined();
    expect(m.formatShortColor).toBeDefined();
    expect(m.formatSpeed).toBeDefined();
    expect(m.generateAdShortTZ).toBeDefined();
    expect(m.generateShortTZ).toBeDefined();
    expect(m.generateTZ).toBeDefined();
    expect(m.getActiveSubcontractWorks).toBeDefined();
    expect(m.getBagColor).toBeDefined();
    expect(m.getBagHandleText).toBeDefined();
    expect(m.getClientSuggestions).toBeDefined();
    expect(m.getCurrentDateTimeForFilename).toBeDefined();
    expect(m.getCurrentLocalTimeIso).toBeDefined();
    expect(m.getDesktopCalendarKashShortTZ).toBeDefined();
    expect(m.getDisplaySize).toBeDefined();
    expect(m.getKashShortTZ).toBeDefined();
    expect(m.getLaminationShort).toBeDefined();
    expect(m.getLaminationSideNotation).toBeDefined();
    expect(m.getPaperLibraryItems).toBeDefined();
    expect(m.getProductLayoutKind).toBeDefined();
    expect(m.getProductTemplate).toBeDefined();
    expect(m.getProductTemplateFieldConfig).toBeDefined();
    expect(m.getProductTemplateFieldLabel).toBeDefined();
    expect(m.getRandomSuccessImageSrc).toBeDefined();
    expect(m.getSpringColor).toBeDefined();
    expect(m.getSpringDiameterText).toBeDefined();
    expect(m.getSpringOutputParts).toBeDefined();
    expect(m.getSpringSpecNote).toBeDefined();
    expect(m.getTZNumber).toBeDefined();
    expect(m.getTodayLocalIso).toBeDefined();
    expect(m.interpolateThickness).toBeDefined();
    expect(m.isBag).toBeDefined();
    expect(m.isBrochure).toBeDefined();
    expect(m.isBusinessCard).toBeDefined();
    expect(m.isCalendar).toBeDefined();
    expect(m.isCatalog).toBeDefined();
    expect(m.isCoated115Paper).toBeDefined();
    expect(m.isCubariki).toBeDefined();
    expect(m.isDateTimeInPast).toBeDefined();
    expect(m.isDeadlineTimeInPast).toBeDefined();
    expect(m.isEnvelope).toBeDefined();
    expect(m.isLayout).toBeDefined();
    expect(m.isMultiBlock).toBeDefined();
    expect(m.isNotebook).toBeDefined();
    expect(m.isPaperlessPaperType).toBeDefined();
    expect(m.isPlainObject).toBeDefined();
    expect(m.isPocketCalendar).toBeDefined();
    expect(m.isProductTemplateFieldRequired).toBeDefined();
    expect(m.isSamePaperSelection).toBeDefined();
    expect(m.isStandaloneShortPart).toBeDefined();
    expect(m.isSticker).toBeDefined();
    expect(m.loadList).toBeDefined();
    expect(m.loadManagerMarkerState).toBeDefined();
    expect(m.loadPaperLibrary).toBeDefined();
    expect(m.loadPaperProfiles).toBeDefined();
    expect(m.loadProductTemplates).toBeDefined();
    expect(m.loadSpringSpecs).toBeDefined();
    expect(m.loadSuccessImageStats).toBeDefined();
    expect(m.mergePresetIntoForm).toBeDefined();
    expect(m.mergeUniqueStrings).toBeDefined();
    expect(m.normalizeClientName).toBeDefined();
    expect(m.normalizeColorMode).toBeDefined();
    expect(m.normalizeDictsPayload).toBeDefined();
    expect(m.normalizeManagerMarkerState).toBeDefined();
    expect(m.normalizeManagerName).toBeDefined();
    expect(m.normalizeMaterial).toBeDefined();
    expect(m.normalizePaperLibrary).toBeDefined();
    expect(m.normalizeProductTemplatesPayload).toBeDefined();
    expect(m.normalizeSpringSpecs).toBeDefined();
    expect(m.normalizeStringList).toBeDefined();
    expect(m.normalizeTemplateFields).toBeDefined();
    expect(m.normalizeTemplateFlags).toBeDefined();
    expect(m.normalizeTemplateName).toBeDefined();
    expect(m.paperFinishOptionsForSelection).toBeDefined();
    expect(m.paperSelectionKey).toBeDefined();
    expect(m.parseManagerMarkerIndex).toBeDefined();
    expect(m.parseWeight).toBeDefined();
    expect(m.requiresPaperDensity).toBeDefined();
    expect(m.resolveProductName).toBeDefined();
    expect(m.saveList).toBeDefined();
    expect(m.saveManagerMarkerState).toBeDefined();
    expect(m.savePaperLibrary).toBeDefined();
    expect(m.savePaperProfiles).toBeDefined();
    expect(m.saveProductTemplates).toBeDefined();
    expect(m.saveSpringSpecs).toBeDefined();
    expect(m.stripParentheticalNote).toBeDefined();
    expect(m.syncProductTemplatesToTypes).toBeDefined();
  });

  it("constants — 58 exports", async () => {
    const m = await import("../constants");
    expect(m.APP_VERSION).toBeDefined();
    expect(m.AUTO_REVERSE_COLOR).toBeDefined();
    expect(m.BAG_COLOR_OPTIONS).toBeDefined();
    expect(m.BAG_HANDLE_TYPES).toBeDefined();
    expect(m.BAG_PAPER_TYPE_OPTIONS).toBeDefined();
    expect(m.CALENDAR_OFFSET_COLORS).toBeDefined();
    expect(m.DEFAULT_AD_MANAGERS).toBeDefined();
    expect(m.DEFAULT_BINDING_TYPES).toBeDefined();
    expect(m.DEFAULT_BUSINESS_CARD_SIZES).toBeDefined();
    expect(m.DEFAULT_COLORS).toBeDefined();
    expect(m.DEFAULT_DENSITIES).toBeDefined();
    expect(m.DEFAULT_ENVELOPE_SIZES).toBeDefined();
    expect(m.DEFAULT_LAMINATION_KINDS).toBeDefined();
    expect(m.DEFAULT_LAMINATION_THICKNESS).toBeDefined();
    expect(m.DEFAULT_MANAGERS).toBeDefined();
    expect(m.DEFAULT_NOTEBOOK_COMPOSITION_PART_TYPES).toBeDefined();
    expect(m.DEFAULT_PAPER_LIBRARY).toBeDefined();
    expect(m.DEFAULT_PAPER_PROFILES).toBeDefined();
    expect(m.DEFAULT_PAPER_SIZES).toBeDefined();
    expect(m.DEFAULT_POCKET_CALENDAR_SIZES).toBeDefined();
    expect(m.DEFAULT_POST_PROCESSING).toBeDefined();
    expect(m.DEFAULT_PRODUCT_TEMPLATES).toBeDefined();
    expect(m.DEFAULT_PRODUCT_TEMPLATE_FIELDS).toBeDefined();
    expect(m.DEFAULT_PRODUCT_TEMPLATE_FLAGS).toBeDefined();
    expect(m.DEFAULT_PRODUCT_TEMPLATE_KINDS).toBeDefined();
    expect(m.DEFAULT_PRODUCT_TYPES).toBeDefined();
    expect(m.DRILL_DIAMETERS).toBeDefined();
    expect(m.FORSAC_PAPER_TYPES).toBeDefined();
    expect(m.KASHUROVKA_BASE_TYPES).toBeDefined();
    expect(m.KASHUROVKA_LINER_TYPES).toBeDefined();
    expect(m.LS_KEYS).toBeDefined();
    expect(m.PAPER_PROFILE_LABELS).toBeDefined();
    expect(m.PAPER_TYPE_OPTIONS).toBeDefined();
    expect(m.PAPER_TYPE_TO_LIBRARY_KEY).toBeDefined();
    expect(m.PRODUCT_LAYOUT_META).toBeDefined();
    expect(m.PRODUCT_LAYOUT_OPTIONS).toBeDefined();
    expect(m.PRODUCT_TEMPLATE_FIELD_KEYS).toBeDefined();
    expect(m.RARE_SUCCESS_IMAGE_NAMES).toBeDefined();
    expect(m.SPRING_COLORS).toBeDefined();
    expect(m.SPRING_SPECS).toBeDefined();
    expect(m.STICKER_COLOR_MODES).toBeDefined();
    expect(m.STICKER_MATERIALS).toBeDefined();
    expect(m.SUCCESS_IMAGE_NAMES).toBeDefined();
    expect(m.SUCCESS_IMAGE_SRCS).toBeDefined();
    expect(m.SUCCESS_IMAGE_WEIGHTS).toBeDefined();
    expect(m.UPDATE_SUMMARY_POINTS).toBeDefined();
    expect(m.runtimeState).toBeDefined();
  });

  it("validation — 3 exports", async () => {
    const m = await import("../validation");
    expect(m.REQUIRED_FIELD_LABELS).toBeDefined();
    expect(m.getRequiredAdFields).toBeDefined();
    expect(m.getRequiredFields).toBeDefined();
  });

  it("component: AdShortTZPanel", async () => {
    await import("../components/AdShortTZPanel");
  });
  it("component: DateTimeField", async () => {
    await import("../components/DateTimeField");
  });
  it("component: DictEditor", async () => {
    await import("../components/DictEditor");
  });
  it("component: Field", async () => {
    await import("../components/Field");
  });
  it("component: KashurovkaBlock", async () => {
    await import("../components/KashurovkaBlock");
  });
  it("component: LaminationBlock", async () => {
    await import("../components/LaminationBlock");
  });
  it("component: PaperFinishField", async () => {
    await import("../components/PaperFinishField");
  });
  it("component: PaperSelectionField", async () => {
    await import("../components/PaperSelectionField");
  });
  it("component: ProductTemplateEditor", async () => {
    await import("../components/ProductTemplateEditor");
  });
  it("component: Section", async () => {
    await import("../components/Section");
  });
  it("component: ShortTZPanel", async () => {
    await import("../components/ShortTZPanel");
  });
  it("component: SpringSpecsEditor", async () => {
    await import("../components/SpringSpecsEditor");
  });
  it("component: UiIcon", async () => {
    await import("../components/UiIcon");
  });
  it("component: UpdateNotice", async () => {
    await import("../components/UpdateNotice");
  });
  it("component: UpdateSummaryModal", async () => {
    await import("../components/UpdateSummaryModal");
  });
  it("component: YesNo", async () => {
    await import("../components/YesNo");
  });
  it("component: fieldClasses", async () => {
    await import("../components/fieldClasses");
  });
});

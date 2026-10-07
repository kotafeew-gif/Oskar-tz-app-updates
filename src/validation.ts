import type { FormData, AdFormData } from "./types";
import {
  resolveProductName, isPocketCalendar, getProductTemplate,
  isProductTemplateFieldRequired, getTodayLocalIso, isDeadlineTimeInPast,
  isDateTimeInPast, normalizeColorMode, formatPaperSelectionWithFinishForTZ,
  isMultiBlock, isCalendar, isNotebook, isEnvelope, isBag, isSticker,
  isPaperlessPaperType, requiresPaperDensity, isBusinessCard,
  isCatalog, isBrochure, isCubariki
} from "./utils";

export function getRequiredFields(form: FormData): string[] {
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
      if (!form.binding || !form.bindingType) errors.push("bindingType");
    } else if (isBrochure(form.productType)) {
    if (templateSizeRequired) {
      if (!form.brochureFormat) errors.push("brochureFormat");
      if (form.brochureFormat === "Нестандартный" && !form.brochureFormatCustom.trim()) errors.push("brochureFormatCustom");
    }
  } else if (isCubariki(form.productType)) {
    if (templateSizeRequired && !form.paperSize.trim()) errors.push("paperSize");
    if (templatePaperRequired && !form.kashurovka.enabled) {
      if (!form.paperType) errors.push("paperType");
      else if (form.paperType === "Дизайнерская" ? !form.paperCustomName.trim() : requiresPaperDensity(form.paperType) && !form.density.trim()) {
        errors.push(form.paperType === "Дизайнерская" ? "paperCustomName" : "density");
      }
    }
    if (templateColorRequired && !form.colorMode && !isPaperlessPaperType(form.paperType)) errors.push("colorMode");
    if (!form.blockPages || Number(form.blockPages) <= 0) errors.push("blockPages");
  } else if (!isMultiBlock(form.productType) && !isCalendar(form.productType) && !isBag(form.productType) && !isSticker(form.productType)) {
    if (templateSizeRequired) {
      if (!form.paperSize) errors.push("paperSize");
      if (form.paperSize === "Нестандартный" && !form.paperSizeCustom.trim()) errors.push("paperSizeCustom");
    }
  }
  if (isMultiBlock(form.productType) || isNotebook(form.productType)) {
    if (isNotebook(form.productType) && form.notebookCompositionEnabled) {
      if (form.notebookParts.length === 0) errors.push("notebookParts");
      form.notebookParts.forEach((part) => {
        if (!part.type) errors.push("notebookPartType");
        const partNeedsQuantity = part.type === "Листы блока" || part.type === "Вкладыш";
        if (partNeedsQuantity && (!part.quantity || Number(part.quantity) <= 0)) errors.push("notebookPartQuantity");
        const partUsesOffsetPrinting = part.type === "Листы блока" && part.offsetPrinting;
        if (!partUsesOffsetPrinting) {
          if (!part.paperType) errors.push("notebookPartPaperType");
          else if (part.paperType === "Дизайнерская" ? !part.paperCustomName.trim() : requiresPaperDensity(part.paperType) && !part.density.trim()) {
            errors.push(part.paperType === "Дизайнерская" ? "notebookPartCustom" : "notebookPartDensity");
          }
        }
      });
    } else {
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
      if (!form.blockOffsetPrinting) {
        if (!form.blockPaperType) errors.push("blockPaperType");
        else if (form.blockPaperType === "Дизайнерская" ? !form.blockPaperCustomName.trim() : requiresPaperDensity(form.blockPaperType) && !form.blockDensity.trim()) {
          errors.push(form.blockPaperType === "Дизайнерская" ? "blockPaperCustomName" : "blockDensity");
        }
        if (!form.blockColor && !isPaperlessPaperType(form.blockPaperType)) errors.push("blockColor");
      }
    }
  } else if (isCalendar(form.productType)) {
    if (!form.calendarKind) errors.push("calendarKind");
    if (form.calendarKind === "Квартальный") {
      if (!form.quarterPosterSize.trim()) errors.push("quarterPosterSize");
      if (!form.quarterPosterPaperType) errors.push("quarterPosterPaperType");
      else if (form.quarterPosterPaperType === "Дизайнерская" ? !form.quarterPosterPaperCustomName.trim() : requiresPaperDensity(form.quarterPosterPaperType) && !form.quarterPosterDensity.trim()) errors.push(form.quarterPosterPaperType === "Дизайнерская" ? "quarterPosterPaperCustomName" : "quarterPosterDensity");
      if (!form.quarterAdBlocks || Number(form.quarterAdBlocks) <= 0 || form.quarterAdParts.length === 0) errors.push("quarterAdParts");
      form.quarterAdParts.forEach((part) => {
        if (!part.size.trim()) errors.push("quarterAdPartSize");
        if (!part.paperType) errors.push("quarterAdPartPaperType");
        else if (part.paperType === "Дизайнерская" ? !part.paperCustomName.trim() : requiresPaperDensity(part.paperType) && !part.density.trim()) errors.push(part.paperType === "Дизайнерская" ? "quarterAdPartCustom" : "quarterAdPartDensity");
      });
      if (form.quarterGridStandard) {
        if (!form.quarterGridName.trim()) errors.push("quarterGridName");
      } else {
        if (!form.quarterGridSize.trim()) errors.push("quarterGridSize");
        if (!form.quarterGridPaperType) errors.push("quarterGridPaperType");
        else if (form.quarterGridPaperType === "Дизайнерская" ? !form.quarterGridPaperCustomName.trim() : requiresPaperDensity(form.quarterGridPaperType) && !form.quarterGridDensity.trim()) errors.push(form.quarterGridPaperType === "Дизайнерская" ? "quarterGridPaperCustomName" : "quarterGridDensity");
        if (!form.quarterGridColorMode) errors.push("quarterGridColorMode");
        if (!form.quarterGridPrintMode) errors.push("quarterGridPrintMode");
      }
      if (form.quarterBackingEnabled) {
        if (!form.quarterBackingSize.trim()) errors.push("quarterBackingSize");
        if (!form.quarterBackingPaperType) errors.push("quarterBackingPaperType");
        else if (form.quarterBackingPaperType === "Дизайнерская" ? !form.quarterBackingPaperCustomName.trim() : requiresPaperDensity(form.quarterBackingPaperType) && !form.quarterBackingDensity.trim()) errors.push(form.quarterBackingPaperType === "Дизайнерская" ? "quarterBackingPaperCustomName" : "quarterBackingDensity");
      }
    }
    if (form.calendarKind === "Настенный") {
      if (!form.calendarBaseMaterial) errors.push("calendarBaseMaterial");
      if (form.calendarBaseMaterial === "Другое..." && !(form.calendarBaseCustomName || "").trim()) errors.push("calendarBaseCustomName");
      if (!form.calendarHeaderPaperType) errors.push("calendarHeaderPaperType");
      else if (form.calendarHeaderPaperType === "Дизайнерская" ? !form.calendarHeaderPaperCustomName.trim() : requiresPaperDensity(form.calendarHeaderPaperType) && !form.calendarHeaderPaperDensity.trim()) {
        errors.push(form.calendarHeaderPaperType === "Дизайнерская" ? "calendarHeaderPaperCustomName" : "calendarHeaderPaperDensity");
      }
    }
    if (form.calendarKind === "Настенный" && !form.wallMountDesc.trim()) errors.push("wallMountDesc");
    if (form.calendarKind === "Настольный" && !form.calendarBaseUseKash) {
      if (!form.calendarBaseMaterial) errors.push("calendarBaseMaterial");
      if (form.calendarBaseMaterial === "Другое..." && !(form.calendarBaseCustomName || "").trim()) errors.push("calendarBaseCustomName");
    }
    if (form.calendarKind === "Настольный") {
      if (!form.calendarBaseSize.trim()) errors.push("calendarBaseSize");
      if (form.desktopCalendarCompositionEnabled) {
        if (form.desktopCalendarParts.length === 0) errors.push("desktopCalendarParts");
        form.desktopCalendarParts.forEach((part) => {
          if (!part.type) errors.push("desktopCalendarPartType");
          if (part.type === "Другое" && !part.customName.trim()) errors.push("desktopCalendarPartCustomName");
          if (!part.size.trim()) errors.push("desktopCalendarPartSize");
          if (!part.paperType) errors.push("desktopCalendarPartPaperType");
          else if (part.paperType === "Дизайнерская" ? !part.paperCustomName.trim() : requiresPaperDensity(part.paperType) && !part.density.trim()) {
            errors.push(part.paperType === "Дизайнерская" ? "desktopCalendarPartCustom" : "desktopCalendarPartDensity");
          }
          if (!part.colorMode && !isPaperlessPaperType(part.paperType)) errors.push("desktopCalendarPartColor");
          if (part.type === "Календарный блок" && (!part.quantity || Number(part.quantity) <= 0)) errors.push("desktopCalendarPartQuantity");
        });
      }
    }
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
      if (form.kashurovka.baseType === "Другое..." && !(form.kashurovka.baseCustomName || "").trim()) errors.push("kashBaseCustomName");
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

export function getRequiredAdFields(form: AdFormData): string[] {
  const errors: string[] = [];
  if (!form.managerName.trim()) errors.push("adManagerName");
  if (!form.deadline) errors.push("adDeadline");
  if (isDeadlineTimeInPast(form.deadline, form.deadlineTime)) errors.push("adDeadlineTime");
  if (!form.fileLink.trim()) errors.push("adFileLink");
  return Array.from(new Set(errors));
}

export const REQUIRED_FIELD_LABELS: Record<string, string> = {
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
  quarterPosterSize: "Размер постера",
  quarterPosterPaperType: "Тип бумаги постера",
  quarterPosterDensity: "Плотность бумаги постера",
  quarterPosterPaperCustomName: "Название дизайнерской бумаги постера",
  quarterAdParts: "Рекламные поля",
  quarterAdPartSize: "Размер рекламного поля",
  quarterGridName: "Название стандартной сетки",
  quarterGridSize: "Размер индивидуальной сетки",
  quarterGridPaperType: "Тип бумаги сетки",
  quarterGridDensity: "Плотность бумаги сетки",
  quarterGridColorMode: "Цветность сетки",
  quarterGridPrintMode: "Печать сетки",
  quarterBackingSize: "Размер подложки под сетку",
  quarterBackingPaperType: "Тип бумаги подложки под сетку",
  quarterBackingDensity: "Плотность бумаги подложки под сетку",
  wallMountDesc: "Описание ригеля / планки",
  calendarBaseMaterial: "Материал основания",
  calendarBaseCustomName: "Материал основания (под заказ)",
  calendarBaseSize: "Размер основания",
  desktopCalendarPartCustomName: "Название части календаря",
  desktopCalendarParts: "Части настольного календаря",
  desktopCalendarPartType: "Вид части календаря",
  desktopCalendarPartSize: "Размер части календаря",
  desktopCalendarPartPaperType: "Тип бумаги части календаря",
  desktopCalendarPartDensity: "Плотность бумаги части календаря",
  desktopCalendarPartCustom: "Название дизайнерской бумаги части календаря",
  desktopCalendarPartColor: "Цветность части календаря",
  desktopCalendarPartQuantity: "Количество листов части календаря",
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
  kashBaseCustomName: "Материал основы кашировки",
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


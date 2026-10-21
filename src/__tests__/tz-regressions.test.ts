import { describe, it, expect } from "vitest";
import { generateShortTZ, generateTZ, createDefaultForm, createNotebookPart } from "../utils";
import type { FormData } from "../types";

function makeForm(overrides: Partial<FormData> = {}): FormData {
  return { ...createDefaultForm(), ...overrides };
}

describe("проверка правок 2.7.6", () => {
  it("блокнот: количество листов пишется листами, не страницами", () => {
    const form = makeForm({
      productType: "Блокноты",
      quantity: "50",
      paperSize: "A5 (148×210 мм)",
      coverPaperType: "Мелованная",
      coverDensity: "300 г/м²",
      coverColor: "4+0 (полноцвет, одна сторона)",
      blockPaperType: "Офсетная",
      blockDensity: "80 г/м² (офсетная)",
      blockColor: "1+0 (чёрно-белая, одна сторона)",
      blockPages: "48",
    });
    const short = generateShortTZ(form);
    const full = generateTZ(form, 1);
    expect(short).toContain("48 листов в блоке");
    expect(short).not.toContain("48 страниц");
    expect(full).toContain("Блок : 48 листов");
    expect(full).not.toContain("Блок : 48 страниц");
  });

  it("настольный календарь: размер перекидных листов попадает в ТЗ", () => {
    const form = makeForm({
      productType: "Календари",
      calendarKind: "Настольный",
      quantity: "100",
      paperSize: "A5 (148×210 мм)",
      calendarBaseMaterial: "Картон",
      calendarBaseSize: "210×426 мм",
      calendarBaseBigovkaLines: "3",
      gridType: "Цифра",
      calendarGridMaterial: "170 г/м²",
      calendarGridSize: "210×148 мм",
      calendarGridPages: "13",
      calendarGridColorMode: "4+4 (полноцвет, две стороны)",
    });
    const short = generateShortTZ(form);
    const full = generateTZ(form, 1);
    expect(short).toContain("210×148 мм");
    expect(full).toContain("Размер перекидных листов : 210×148 мм");
  });

  it("квартальный календарь: стандартная сетка из списка", () => {
    const form = makeForm({
      productType: "Календари",
      calendarKind: "Квартальный",
      quantity: "10",
      paperSize: "A4 (210×297 мм)",
      quarterPosterSize: "297×210 мм",
      quarterGridStandard: true,
      quarterGridName: "Стандартная голубая",
    });
    const short = generateShortTZ(form);
    expect(short).toContain("сетка стандартная: Стандартная голубая");
  });

  it("составной блокнот: часть с офсета не тащит цветность и ламинацию в ТЗ", () => {
    const offsetPart = createNotebookPart();
    offsetPart.type = "Листы блока";
    offsetPart.quantity = "25";
    offsetPart.offsetPrinting = true;
    offsetPart.color = "4+4 (полноцвет, две стороны)";
    offsetPart.lamination = { enabled: true, kind: "Матовая", thickness: "30 мк" } as never;
    offsetPart.note = "офсет, 80 г/м²";

    const normalPart = createNotebookPart();
    normalPart.type = "Вкладыш";
    normalPart.quantity = "5";
    normalPart.paperType = "Офсетная";
    normalPart.density = "80 г/м² (офисная)";
    normalPart.color = "1+0 (чёрно-белая, одна сторона)";

    const form = makeForm({
      productType: "Блокноты",
      quantity: "50",
      paperSize: "A5 (148×210 мм)",
      notebookCompositionEnabled: true,
      notebookParts: [offsetPart, normalPart],
    });

    const short = generateShortTZ(form);
    const full = generateTZ(form, 1);
    // краткое ТЗ: у части с офсета нет цвета/ламинации
    expect(short).toContain("Листы блока — 25 шт. — печать на офсете, офсет, 80 г/м²");
    expect(short).not.toContain("без печати, 4+4");
    expect(short).not.toContain("матовая");
    // полное ТЗ: печать на офсете вместо бумаги/цветности/ламинации
    expect(full).toContain("Печать на офсете (бумага не указана)");
    expect(full).not.toContain("Цветность : 4+4");
    expect(full).not.toContain("Ламинация :");
    // обычная часть без офсета — параметры на месте
    expect(short).toContain("Вкладыш — 5 шт. — Офсетная 80 г/м², 1+0");
  });
});
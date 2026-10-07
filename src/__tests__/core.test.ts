import { describe, it, expect } from "vitest";
import { generateShortTZ, createDefaultForm } from "../utils";
import { getRequiredFields } from "../validation";
import type { FormData } from "../types";

function makeForm(overrides: Partial<FormData> = {}): FormData {
  return { ...createDefaultForm(), ...overrides };
}

describe("generateShortTZ", () => {
  it("returns empty string for empty form", () => {
    expect(generateShortTZ(createDefaultForm())).toBe("");
  });

  it("generates TZ for a business card order", () => {
    const form = makeForm({
      productType: "Визитки",
      businessCardSize: "90×50 мм",
      paperType: "Мелованная",
      density: "300 г/м²",
      colorMode: "4+4 (полноцвет, две стороны)",
    });
    const result = generateShortTZ(form);
    expect(result).toContain("визитки");
    expect(result).toContain("300 г/м²");
    expect(result).toContain("4+4");
  });

  it("generates TZ for notebook with binding", () => {
    const form = makeForm({
      productType: "Блокноты",
      quantity: "50",
      paperSize: "A5 (148×210 мм)",
      coverPaperType: "Мелованная",
      coverDensity: "300 г/м²",
      coverColor: "4+0 (полноцвет, одна сторона)",
      blockPaperType: "Офсетная",
      blockDensity: "80 г/м² (офисная)",
      blockColor: "1+0 (чёрно-белая, одна сторона)",
      blockPages: "48",
      binding: true,
      bindingType: "Пружина",
    });
    const result = generateShortTZ(form);
    expect(result).toContain("блокноты");
    expect(result).toContain("A5");
    expect(result).toContain("пружина");
  });

  it("generates TZ for envelope", () => {
    const form = makeForm({
      productType: "Конверты",
      envelopeSize: "C5 (162×229 мм)",
      paperType: "Офсетная",
      density: "115 г/м²",
      colorMode: "1+0 (чёрно-белая, одна сторона)",
    });
    const result = generateShortTZ(form);
    expect(result).toContain("конверты");
    expect(result).toContain("C5");
    expect(result).toContain("115 г/м²");
  });
});

describe("getRequiredFields", () => {
  it("returns errors for empty form", () => {
    const errors = getRequiredFields(createDefaultForm());
    expect(errors).toContain("clientName");
    expect(errors).toContain("managerName");
    expect(errors).toContain("productType");
    expect(errors).toContain("quantity");
  });

  it("returns no errors for a complete standard form", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadline = tomorrow.toISOString().slice(0, 10);
    const form = makeForm({
      clientName: "Тест",
      managerName: "Алёна",
      productType: "Листовки",
      quantity: "100",
      paperSize: "A4 (210×297 мм)",
      paperType: "Мелованная",
      density: "150 г/м²",
      colorMode: "4+4 (полноцвет, две стороны)",
      deadline,
    });
    const errors = getRequiredFields(form);
    expect(errors).toHaveLength(0);
  });
});

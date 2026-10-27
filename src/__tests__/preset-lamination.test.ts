import { describe, it, expect } from "vitest";
import {
  createDefaultForm,
  createOtherPaperEntry,
  buildPresetPayload,
  mergePresetIntoForm,
  getPresetLaminationFixes,
} from "../utils";
import { getRequiredFields } from "../validation";

function makeForm(lamination: { enabled: boolean; side: string; thickness?: string; kind?: string; kindCustom?: string }) {
  const form = createDefaultForm();
  form.productType = "Другое...";
  form.productTypeCustom = "Открытка на заказ";
  form.clientName = "ООО Тест";
  form.managerName = "Оля";
  form.deadline = "2030-01-01";
  form.quantity = "100";
  form.otherPaperEntries = [
    {
      ...createOtherPaperEntry(),
      size: "210x297 мм",
      paperType: "Мелованная",
      density: "150",
      lamination: { enabled: lamination.enabled, side: lamination.side, thickness: lamination.thickness ?? "", kind: lamination.kind ?? "", kindCustom: lamination.kindCustom ?? "" },
    },
  ];
  return form;
}

const laminationErrors = (form: ReturnType<typeof createDefaultForm>) =>
  getRequiredFields(form).filter((f) => f.includes("lamination"));

describe("preset с ламинацией без сторонности (регрессия 2.7.3)", () => {
  it("прямая форма с неполной ламинацией блокируется валидацией (ожидаемо)", () => {
    const form = makeForm({ enabled: true, side: "", thickness: "32 мк", kind: "Матовая" });
    expect(laminationErrors(form)).toContain(`otherPaperEntry-${form.otherPaperEntries[0].id}-laminationSide`);
  });

  it("применение пресета с неполной ламинацией отключает её, а не блокирует заявку", () => {
    const payload = buildPresetPayload(makeForm({ enabled: true, side: "", thickness: "32 мк", kind: "Матовая" }));
    // пустой side вычищается из пресета, enabled остаётся true
    expect(payload.otherPaperEntries?.[0].lamination).toEqual({ enabled: true, thickness: "32 мк", kind: "Матовая" });

    const applied = mergePresetIntoForm(createDefaultForm(), payload);
    // ламинация без параметров при применении пресета выключается — заявка уходит без «призрачной» блокировки
    expect(applied.otherPaperEntries[0].lamination.enabled).toBe(false);
    expect(laminationErrors(applied)).toHaveLength(0);
  });

  it("основная ламинация формы (не «Другое») нормализуется так же", () => {
    const form = createDefaultForm();
    form.productType = "Листовки";
    form.lamination = { enabled: true, side: "", thickness: "", kind: "" };
    const payload = buildPresetPayload(form);
    const applied = mergePresetIntoForm(createDefaultForm(), payload);
    expect(applied.lamination.enabled).toBe(false);
  });

  it("полная ламинация в пресете сохраняется и проходит валидацию", () => {
    const payload = buildPresetPayload(makeForm({ enabled: true, side: "Двухсторонняя", thickness: "32 мк", kind: "Матовая" }));
    const applied = mergePresetIntoForm(createDefaultForm(), payload);
    expect(applied.otherPaperEntries[0].lamination.enabled).toBe(true);
    expect(applied.otherPaperEntries[0].lamination.side).toBe("Двухсторонняя");
    expect(laminationErrors(applied)).toHaveLength(0);
  });

  it("getPresetLaminationFixes перечисляет авто-отключаемые ламинации для уведомления", () => {
    const partial = buildPresetPayload(makeForm({ enabled: true, side: "", thickness: "32 мк", kind: "Матовая" }));
    expect(getPresetLaminationFixes(partial)).toEqual(["ламинация бумаги 1"]);

    const complete = buildPresetPayload(makeForm({ enabled: true, side: "Двухсторонняя", thickness: "32 мк", kind: "Матовая" }));
    expect(getPresetLaminationFixes(complete)).toEqual([]);

    expect(getPresetLaminationFixes({})).toEqual([]);
  });
});
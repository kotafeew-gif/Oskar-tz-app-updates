import { describe, it, expect } from "vitest";

// Smoke test: every module must import without throwing
describe("module imports", () => {
  it("constants", async () => {
    const m = await import("../constants");
    expect(m.APP_VERSION).toBeTruthy();
    expect(m.DEFAULT_PRODUCT_TYPES).toBeInstanceOf(Array);
    expect(m.runtimeState).toBeDefined();
  });

  it("types", async () => {
    await import("../types");
  });

  it("utils", async () => {
    const m = await import("../utils");
    expect(m.generateShortTZ).toBeInstanceOf(Function);
    expect(m.createDefaultForm).toBeInstanceOf(Function);
  });

  it("validation", async () => {
    const m = await import("../validation");
    expect(m.getRequiredFields).toBeInstanceOf(Function);
    expect(m.REQUIRED_FIELD_LABELS).toBeDefined();
  });

  it("components", async () => {
    await import("../components/YesNo");
    await import("../components/fieldClasses");
    await import("../components/UiIcon");
    await import("../components/Section");
    await import("../components/Field");
    await import("../components/DateTimeField");
    await import("../components/UpdateNotice");
    await import("../components/UpdateSummaryModal");
    await import("../components/LaminationBlock");
    await import("../components/PaperFinishField");
    await import("../components/PaperSelectionField");
    await import("../components/KashurovkaBlock");
    await import("../components/ShortTZPanel");
    await import("../components/AdShortTZPanel");
    await import("../components/DictEditor");
    await import("../components/SpringSpecsEditor");
    await import("../components/ProductTemplateEditor");
  });
});
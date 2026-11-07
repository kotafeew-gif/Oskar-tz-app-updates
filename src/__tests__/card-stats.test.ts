import { describe, it, expect } from "vitest";
import { aggregateCardStats, buildCardStatRow } from "../../electron-app/cardStats.mjs";

const HEADER = ["Дата", "Менеджер", "Карточка / ИТОГО", "Количество"];

describe("статистика карточек: запись строки", () => {
  it("ОБЫЧНАЯ карточка пишется с менеджером, а не сводкой «ИТОГО»", () => {
    const row = buildCardStatRow({ managerName: "Анна", imageName: "9.jpg", date: "2026-11-07T10:00:00.000Z" });
    expect(row[0]).toBe("2026-11-07T10:00:00.000Z");
    expect(row[1]).toBe("Анна");
    expect(row[2]).toBe("9.jpg");
    // раньше здесь была сводка ['ИТОГО', '9.jpg', N] — без менеджера
    expect(row[0].toUpperCase()).not.toBe("ИТОГО");
  });

  it("завершающая карточка тоже пишется с менеджером", () => {
    const row = buildCardStatRow({ managerName: "Игорь", imageName: "22.jpg", date: "x" });
    expect(row[1]).toBe("Игорь");
    expect(row[2]).toBe("22.jpg");
  });

  it("пустой менеджер заменяется на «Не указан», карточка сохраняется", () => {
    const row = buildCardStatRow({ managerName: "   ", imageName: "16.jpg", date: "x" });
    expect(row).toEqual(["x", "Не указан", "16.jpg"]);
  });

  it("записанная строка читается обратно в byManager своего менеджера", () => {
    const rows = [
      HEADER,
      buildCardStatRow({ managerName: "Анна", imageName: "9.jpg", date: "2026-11-07T10:00:00.000Z" }),
      buildCardStatRow({ managerName: "Игорь", imageName: "9.jpg", date: "2026-11-07T10:01:00.000Z" }),
    ];
    const stats = aggregateCardStats(rows);
    expect(stats.byManager["Анна"]).toEqual({ "9.jpg": 1 });
    expect(stats.byManager["Игорь"]).toEqual({ "9.jpg": 1 });
    expect(stats.byImage["9.jpg"]).toBe(2);
  });
});

describe("статистика карточек: привязка к менеджеру", () => {
  it("построчная запись обычной карточки попадает в byManager", () => {
    const stats = aggregateCardStats([
      HEADER,
      ["2026-11-07T10:00:00.000Z", "Анна", "9.jpg"],
      ["2026-11-07T10:05:00.000Z", "Анна", "16.jpg"],
      ["2026-11-07T10:06:00.000Z", "Игорь", "22.jpg"],
    ]);

    expect(stats.byManager["Анна"]).toEqual({ "9.jpg": 1, "16.jpg": 1 });
    expect(stats.byManager["Игорь"]).toEqual({ "22.jpg": 1 });
    expect(stats.byImage).toEqual({ "9.jpg": 1, "16.jpg": 1, "22.jpg": 1 });
  });

  it("повторное выпадение увеличивает счётчик менеджера", () => {
    const stats = aggregateCardStats([
      HEADER,
      ["2026-11-07T10:00:00.000Z", "Анна", "9.jpg"],
      ["2026-11-07T10:01:00.000Z", "Анна", "9.jpg"],
      ["2026-11-07T10:02:00.000Z", "Анна", "9.jpg"],
    ]);
    expect(stats.byManager["Анна"]["9.jpg"]).toBe(3);
    expect(stats.byImage["9.jpg"]).toBe(3);
  });

  it("старые сводки «ИТОГО» считаются в byImage, но не выдумывают менеджера", () => {
    const stats = aggregateCardStats([
      HEADER,
      ["ИТОГО", "9.jpg", "17"],
      ["ИТОГО", "1.png", "133"],
      ["2026-11-07T10:00:00.000Z", "Анна", "9.jpg"],
    ]);
    expect(stats.byImage["9.jpg"]).toBe(18);
    expect(stats.byImage["1.png"]).toBe(133);
    // у сводки нет менеджера — в byManager её быть не должно ни под каким именем
    expect(Object.keys(stats.byManager)).toEqual(["Анна"]);
    expect(stats.byManager["ИТОГО"]).toBeUndefined();
    expect(stats.byManager["Не указан"]).toBeUndefined();
  });

  it("редкие карточки тоже привязаны к менеджеру", () => {
    const stats = aggregateCardStats([
      HEADER,
      ["2026-11-05T10:43:28.816Z", "Лиза", "Exclusive.png"],
      ["2026-11-07T10:00:00.000Z", "Анна", "Exclusive.png"],
    ]);
    expect(stats.byManager["Лиза"]).toEqual({ "Exclusive.png": 1 });
    expect(stats.byManager["Анна"]).toEqual({ "Exclusive.png": 1 });
  });

  it("пустой лист и шапка без данных не падают", () => {
    expect(aggregateCardStats([])).toEqual({ byImage: {}, byManager: {} });
    expect(aggregateCardStats([HEADER])).toEqual({ byImage: {}, byManager: {} });
  });

  it("пустое имя менеджера попадает в «Не указан»", () => {
    const stats = aggregateCardStats([
      HEADER,
      ["2026-11-07T10:00:00.000Z", "", "9.jpg"],
    ]);
    expect(stats.byManager["Не указан"]).toEqual({ "9.jpg": 1 });
  });
});

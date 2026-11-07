import { describe, it, expect } from "vitest";
import {
  buildSuccessAlbum,
  buildSuccessAlbumSections,
  successAlbumProgress,
  listAlbumManagers,
} from "../utils";
import { ALL_SUCCESS_IMAGE_NAMES, CARD_ALBUM_TIERS } from "../constants";
import type { SuccessImageStats } from "../types";

const stats = (byManager: Record<string, Record<string, number>>): SuccessImageStats => ({
  byImage: {},
  byManager,
});

describe("альбом карточек: разделы", () => {
  it("шесть разделов в нужном порядке, без потери карточек", () => {
    const sections = buildSuccessAlbumSections(stats({}), "Анна");
    expect(sections.map((section) => section.id)).toEqual(CARD_ALBUM_TIERS.map((tier) => tier.id));
    const total = sections.reduce((sum, section) => sum + section.slots.length, 0);
    expect(total).toBe(ALL_SUCCESS_IMAGE_NAMES.length);
  });

  it("карточка попадает в свой раздел: зелёная — в «Необычные», синяя — в «Редкие»", () => {
    const sections = buildSuccessAlbumSections(stats({ Анна: { "28g.jpg": 1, "38b.jpg": 2, "9.jpg": 1 } }), "Анна");
    const byId = Object.fromEntries(sections.map((section) => [section.id, section]));

    expect(byId.common.slots.some((slot) => slot.name === "9.jpg")).toBe(true);
    expect(byId.uncommon.slots.filter((slot) => slot.unlocked).map((slot) => slot.name)).toEqual(["28g.jpg"]);
    expect(byId.rare.slots.filter((slot) => slot.unlocked).map((slot) => slot.name)).toEqual(["38b.jpg"]);
    expect(byId.exclusive.slots.every((slot) => !slot.unlocked)).toBe(true);
  });

  it("закрытые слоты в разделах тоже без имён и ссылок", () => {
    const sections = buildSuccessAlbumSections(stats({ Анна: { "9.jpg": 1 } }), "Анна");
    const locked = sections.flatMap((section) => section.slots).filter((slot) => !slot.unlocked);
    expect(locked.length).toBe(ALL_SUCCESS_IMAGE_NAMES.length - 1);
    locked.forEach((slot) => {
      expect(slot.name).toBe("");
      expect(slot.src).toBe("");
    });
  });
});

describe("альбом карточек: слоты менеджера", () => {
  it("открывает только те карточки, что выпали этому менеджеру", () => {
    const data = stats({
      Анна: { "9.jpg": 3, "Cat.png": 1 },
      Игорь: { "16.jpg": 2 },
    });
    const slots = buildSuccessAlbum(data, "Анна");

    expect(slots).toHaveLength(ALL_SUCCESS_IMAGE_NAMES.length);
    const unlocked = slots.filter((slot) => slot.unlocked);
    expect(unlocked.map((slot) => slot.name).sort()).toEqual(["9.jpg", "Cat.png"].sort());
    expect(unlocked.find((slot) => slot.name === "9.jpg")?.count).toBe(3);
  });

  it("закрытый слот не несёт ни имени файла, ни ссылки", () => {
    const data = stats({ Анна: { "9.jpg": 1 } });
    const slots = buildSuccessAlbum(data, "Анна");
    const locked = slots.filter((slot) => !slot.unlocked);

    expect(locked.length).toBe(ALL_SUCCESS_IMAGE_NAMES.length - 1);
    locked.forEach((slot) => {
      expect(slot.name).toBe("");
      expect(slot.src).toBe("");
      expect(slot.count).toBe(0);
    });
  });

  it("карточки другого менеджера не раскрываются", () => {
    const data = stats({ Игорь: { "16.jpg": 5, "22.jpg": 1 } });
    const slots = buildSuccessAlbum(data, "Анна");
    expect(slots.every((slot) => !slot.unlocked)).toBe(true);
    expect(slots.every((slot) => slot.src === "")).toBe(true);
  });

  it("пустое имя менеджера — всё закрыто, без падения", () => {
    const data = stats({ Анна: { "9.jpg": 1 } });
    const slots = buildSuccessAlbum(data, "   ");
    expect(slots.every((slot) => !slot.unlocked)).toBe(true);
  });

  it("ссылка открытого слота ведёт на файл карточки", () => {
    const data = stats({ Анна: { "9.jpg": 1 } });
    const slot = buildSuccessAlbum(data, "Анна").find((item) => item.unlocked);
    expect(slot?.src.endsWith("9.jpg")).toBe(true);
  });
});

describe("альбом карточек: прогресс", () => {
  it("считает открытые и процент", () => {
    const slots = buildSuccessAlbum(stats({ Анна: { "9.jpg": 1, "10.jpg": 2 } }), "Анна");
    const progress = successAlbumProgress(slots);
    expect(progress.unlocked).toBe(2);
    expect(progress.total).toBe(ALL_SUCCESS_IMAGE_NAMES.length);
    expect(progress.percent).toBe(Math.round((2 / ALL_SUCCESS_IMAGE_NAMES.length) * 100));
  });

  it("пустой альбом — 0 процентов, без деления на ноль", () => {
    expect(successAlbumProgress([])).toEqual({ unlocked: 0, total: 0, percent: 0 });
  });
});

describe("альбом карточек: список менеджеров", () => {
  it("объединяет справочник и статистику без дублей, по алфавиту", () => {
    const data = stats({ Яна: { "9.jpg": 1 }, Анна: { "10.jpg": 1 } });
    expect(listAlbumManagers(data, ["Игорь", "Анна", "  "])).toEqual(["Анна", "Игорь", "Яна"]);
  });

  it("без данных возвращает только справочник", () => {
    expect(listAlbumManagers(stats({}), ["Анна"])).toEqual(["Анна"]);
  });
});

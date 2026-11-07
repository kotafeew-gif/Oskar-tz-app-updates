import { describe, it, expect } from "vitest";
import {
  ALL_SUCCESS_IMAGE_NAMES,
  CARD_ALBUM_TIERS,
  CARD_TIER_BY_NAME,
  COMMON_SUCCESS_IMAGE_NAMES,
  EXCLUSIVE_SUCCESS_IMAGE_NAMES,
  FINISH_SUCCESS_IMAGE_NAMES,
  FINISH_SUCCESS_IMAGE_WEIGHT,
  LEGENDARY_SUCCESS_IMAGE_NAMES,
  MYTHIC_SUCCESS_IMAGE_NAMES,
  RARE_SUCCESS_IMAGE_NAMES,
  UNCOMMON_SUCCESS_IMAGE_NAMES,
  SUCCESS_IMAGE_SRCS,
  SUCCESS_IMAGE_WEIGHTS,
} from "../constants";
import { getRandomSuccessImageSrc } from "../utils";

const nameOf = (src: string) => src.split("/").pop() || "";

describe("карточки успеха: состав групп", () => {
  it("все карточки подключены к пулу", () => {
    const pool = SUCCESS_IMAGE_SRCS.map(nameOf);
    ALL_SUCCESS_IMAGE_NAMES.forEach((name) => expect(pool).toContain(name));
    expect(pool).toHaveLength(ALL_SUCCESS_IMAGE_NAMES.length);
  });

  it("обычные: Cat + 1–8 + новые 23–27", () => {
    expect(COMMON_SUCCESS_IMAGE_NAMES).toEqual([
      "Cat.png", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png",
      "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg",
    ]);
  });

  it("завершающие: 9–22", () => {
    expect(FINISH_SUCCESS_IMAGE_NAMES).toEqual(Array.from({ length: 14 }, (_, i) => `${i + 9}.jpg`));
  });

  it("необычные (зелёные): 10 карточек 28g–37g", () => {
    expect(UNCOMMON_SUCCESS_IMAGE_NAMES).toEqual(Array.from({ length: 10 }, (_, i) => `${i + 28}g.jpg`));
  });

  it("редкие (синие): 5 карточек 38b–42b", () => {
    expect(RARE_SUCCESS_IMAGE_NAMES).toEqual(Array.from({ length: 5 }, (_, i) => `${i + 38}b.jpg`));
  });

  it("эксклюзивная, легендарная и мифическая — по одной", () => {
    expect(EXCLUSIVE_SUCCESS_IMAGE_NAMES).toEqual(["Exclusive.png"]);
    expect(LEGENDARY_SUCCESS_IMAGE_NAMES).toEqual(["Legendary.png"]);
    expect(MYTHIC_SUCCESS_IMAGE_NAMES).toEqual(["Mific.png"]);
  });

  it("в пуле нет дублей, каждая карточка ровно в одном разделе альбома", () => {
    expect(new Set(ALL_SUCCESS_IMAGE_NAMES).size).toBe(ALL_SUCCESS_IMAGE_NAMES.length);
    const counted = CARD_ALBUM_TIERS.reduce((sum, tier) => sum + tier.names.length, 0);
    expect(counted).toBe(ALL_SUCCESS_IMAGE_NAMES.length);
    ALL_SUCCESS_IMAGE_NAMES.forEach((name) => expect(CARD_TIER_BY_NAME[name]).toBeDefined());
  });
});

describe("карточки успеха: веса", () => {
  it("обычные — вес 1, завершающие — вес 3", () => {
    COMMON_SUCCESS_IMAGE_NAMES.forEach((name) => expect(SUCCESS_IMAGE_WEIGHTS[name]).toBe(1));
    expect(FINISH_SUCCESS_IMAGE_WEIGHT).toBeGreaterThan(1);
    FINISH_SUCCESS_IMAGE_NAMES.forEach((name) => expect(SUCCESS_IMAGE_WEIGHTS[name]).toBe(FINISH_SUCCESS_IMAGE_WEIGHT));
  });

  it("зелёные и синие реже белых ПО ГРУППЕ, но заметно выше эксклюзивных", () => {
    const total = Object.values(SUCCESS_IMAGE_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    const groupShare = (names: string[]) => names.reduce((sum, n) => sum + SUCCESS_IMAGE_WEIGHTS[n], 0) / total;

    const white = groupShare([...COMMON_SUCCESS_IMAGE_NAMES, ...FINISH_SUCCESS_IMAGE_NAMES]);
    const uncommon = groupShare(UNCOMMON_SUCCESS_IMAGE_NAMES);
    const rare = groupShare(RARE_SUCCESS_IMAGE_NAMES);
    const exclusive = groupShare(EXCLUSIVE_SUCCESS_IMAGE_NAMES);

    expect(uncommon).toBeLessThan(white);
    expect(rare).toBeLessThan(uncommon);
    expect(rare).toBeGreaterThan(exclusive);
    // «не задирать планку»: группы должны быть достижимыми
    expect(uncommon).toBeGreaterThan(0.1);
    expect(rare).toBeGreaterThan(0.02);
  });

  it("подобрано под реальный объём: зелёная ~раз в день, синяя ~раз в неделю", () => {
    const total = Object.values(SUCCESS_IMAGE_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    const greenShare = UNCOMMON_SUCCESS_IMAGE_NAMES.reduce((s, n) => s + SUCCESS_IMAGE_WEIGHTS[n], 0) / total;
    const blueShare = RARE_SUCCESS_IMAGE_NAMES.reduce((s, n) => s + SUCCESS_IMAGE_WEIGHTS[n], 0) / total;

    // фактический объём: 2160 заявок за 90 дней, медиана 5 заявок в рабочий день
    const ordersPerDay = 5;
    const greenPerDay = ordersPerDay * greenShare;
    const bluePerWeek = ordersPerDay * 5 * blueShare;

    expect(greenPerDay).toBeGreaterThanOrEqual(0.75); // почти каждый день
    expect(greenPerDay).toBeLessThanOrEqual(1.6);      // но не по несколько за день
    expect(bluePerWeek).toBeGreaterThanOrEqual(0.7);   // примерно раз в неделю
    expect(bluePerWeek).toBeLessThanOrEqual(1.8);
  });

  it("редкие одиночные сохранили прежний шанс", () => {
    expect(SUCCESS_IMAGE_WEIGHTS["Exclusive.png"]).toBe(0.1);
    expect(SUCCESS_IMAGE_WEIGHTS["Legendary.png"]).toBe(0.02);
    expect(SUCCESS_IMAGE_WEIGHTS["Mific.png"]).toBe(0.0005);
  });

  it("все карточки имеют положительный вес", () => {
    ALL_SUCCESS_IMAGE_NAMES.forEach((name) => {
      expect(SUCCESS_IMAGE_WEIGHTS[name]).toBeGreaterThan(0);
    });
  });
});

describe("карточки успеха: разделы альбома", () => {
  it("разделы идут в заданном порядке и подписаны по-русски", () => {
    expect(CARD_ALBUM_TIERS.map((tier) => tier.id)).toEqual([
      "common", "uncommon", "rare", "exclusive", "legendary", "mythic",
    ]);
    expect(CARD_ALBUM_TIERS.map((tier) => tier.label)).toEqual([
      "Обычные", "Необычные", "Редкие", "Эксклюзивные", "Легендарные", "Мифическая",
    ]);
  });

  it("в разделе «Обычные» лежат и завершающие заказ (9–22)", () => {
    const common = CARD_ALBUM_TIERS.find((tier) => tier.id === "common");
    FINISH_SUCCESS_IMAGE_NAMES.forEach((name) => expect(common?.names).toContain(name));
    COMMON_SUCCESS_IMAGE_NAMES.forEach((name) => expect(common?.names).toContain(name));
  });
});

describe("карточки успеха: выпадение", () => {
  it("зелёные и синие реально выпадают и реже белых по группе", () => {
    const counts: Record<string, number> = {};
    let prev = "";
    for (let i = 0; i < 200000; i += 1) {
      const name = nameOf(getRandomSuccessImageSrc(prev));
      counts[name] = (counts[name] || 0) + 1;
      prev = name;
    }
    UNCOMMON_SUCCESS_IMAGE_NAMES.forEach((name) => expect(counts[name] || 0).toBeGreaterThan(0));
    RARE_SUCCESS_IMAGE_NAMES.forEach((name) => expect(counts[name] || 0).toBeGreaterThan(0));

    const group = (names: string[]) => names.reduce((sum, name) => sum + (counts[name] || 0), 0);
    const white = group([...COMMON_SUCCESS_IMAGE_NAMES, ...FINISH_SUCCESS_IMAGE_NAMES]);
    const uncommon = group(UNCOMMON_SUCCESS_IMAGE_NAMES);
    const rare = group(RARE_SUCCESS_IMAGE_NAMES);
    expect(uncommon).toBeLessThan(white);
    expect(rare).toBeLessThan(uncommon);
    expect(rare).toBeGreaterThan(0);
  });

  it("одна и та же картинка не выпадает два раза подряд", () => {
    let prev = getRandomSuccessImageSrc();
    for (let i = 0; i < 300; i += 1) {
      const next = getRandomSuccessImageSrc(prev);
      expect(next).not.toBe(prev);
      prev = next;
    }
  });
});

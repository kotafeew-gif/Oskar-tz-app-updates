import { describe, it, expect } from "vitest";
import { successTierRates } from "../utils";
import {
  CARD_ALBUM_TIERS,
  SUCCESS_IMAGE_WEIGHTS,
} from "../constants";

describe("шансы выпадения по разделам", () => {
  it("сумма долей всех разделов равна 100%", () => {
    const rates = successTierRates();
    const sum = rates.reduce((acc, rate) => acc + rate.groupShare, 0);
    expect(sum).toBeCloseTo(1, 6);
  });

  it("доля раздела = сумма весов его карточек", () => {
    const total = Object.values(SUCCESS_IMAGE_WEIGHTS).reduce((s, w) => s + w, 0);
    const rates = successTierRates();
    CARD_ALBUM_TIERS.forEach((tier) => {
      const rate = rates.find((r) => r.id === tier.id)!;
      const expected = tier.names.reduce((s, n) => s + SUCCESS_IMAGE_WEIGHTS[n], 0) / total;
      expect(rate.groupShare).toBeCloseTo(expected, 9);
    });
  });

  it("«1 из N заявок» согласуется с долей раздела", () => {
    successTierRates().forEach((rate) => {
      if (!Number.isFinite(rate.sendsPerDrop)) return;
      expect(rate.sendsPerDrop * rate.groupShare).toBeCloseTo(1, 6);
    });
  });

  it("порядок шансов: белые > необычные > редкие > эксклюзивные > легендарные > мифическая", () => {
    const rates = successTierRates();
    const share = (id: string) => rates.find((r) => r.id === id)!.groupShare;
    expect(share("common")).toBeGreaterThan(share("uncommon"));
    expect(share("uncommon")).toBeGreaterThan(share("rare"));
    expect(share("rare")).toBeGreaterThan(share("exclusive"));
    expect(share("exclusive")).toBeGreaterThan(share("legendary"));
    expect(share("legendary")).toBeGreaterThan(share("mythic"));
  });

  it("пустой набор весов не роняет расчёт", () => {
    expect(successTierRates([])).toEqual([]);
  });
});

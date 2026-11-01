import { describe, it, expect } from "vitest";
import {
  SUCCESS_IMAGE_NAMES,
  FINISH_SUCCESS_IMAGE_NAMES,
  RARE_SUCCESS_IMAGE_NAMES,
  FINISH_SUCCESS_IMAGE_WEIGHT,
  SUCCESS_IMAGE_SRCS,
  SUCCESS_IMAGE_WEIGHTS,
} from "../constants";
import { getRandomSuccessImageSrc } from "../utils";

const nameOf = (src: string) => src.split("/").pop() || "";

describe("картинки успеха: завершающие заказ", () => {
  it("9–15.jpg подключены к общему пулу картинок", () => {
    expect(FINISH_SUCCESS_IMAGE_NAMES).toEqual([
      "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
    ]);
    const pool = SUCCESS_IMAGE_SRCS.map(nameOf);
    FINISH_SUCCESS_IMAGE_NAMES.forEach((name) => expect(pool).toContain(name));
    // обычные и редкие не потерялись
    SUCCESS_IMAGE_NAMES.forEach((name) => expect(pool).toContain(name));
    RARE_SUCCESS_IMAGE_NAMES.forEach((name) => expect(pool).toContain(name));
  });

  it("вес завершающих выше обычных, но реже редких", () => {
    expect(FINISH_SUCCESS_IMAGE_WEIGHT).toBeGreaterThan(1);
    FINISH_SUCCESS_IMAGE_NAMES.forEach((name) => {
      expect(SUCCESS_IMAGE_WEIGHTS[name]).toBe(FINISH_SUCCESS_IMAGE_WEIGHT);
      // каждый обычный имеет вес 1
      expect(SUCCESS_IMAGE_WEIGHTS[name]).toBeGreaterThan(SUCCESS_IMAGE_WEIGHTS["1.png"]);
    });
    expect(SUCCESS_IMAGE_WEIGHTS["Exclusive.png"]).toBeLessThan(SUCCESS_IMAGE_WEIGHTS["1.png"]);
  });

  it("завершающие картинки реально выпадают чаще обычных", () => {
    const finish = new Set(FINISH_SUCCESS_IMAGE_NAMES);
    const common = new Set(SUCCESS_IMAGE_NAMES);
    let finishHits = 0;
    let commonHits = 0;
    let prev = "";
    // детерминированный псевдослучайный прогон не нужен: выборка большая
    for (let i = 0; i < 20000; i += 1) {
      const src = getRandomSuccessImageSrc(prev);
      prev = src;
      const name = nameOf(src);
      if (finish.has(name)) finishHits += 1;
      else if (common.has(name)) commonHits += 1;
    }
    expect(finishHits).toBeGreaterThan(commonHits);
    // доля группы ≈ 7*3 / (9*1 + 7*3 + 0.12) ≈ 0.7
    expect(finishHits / (finishHits + commonHits)).toBeGreaterThan(0.6);
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

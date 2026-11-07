import { useEffect, useMemo, useState } from "react";
import type { SuccessImageStats } from "../types";
import {
  buildSuccessAlbumSections,
  listAlbumManagers,
  successAlbumProgress,
} from "../utils";
import UiIcon from "./UiIcon";

type SuccessAlbumProps = {
  stats: SuccessImageStats;
  /** Менеджеры из справочника — для выбора «кто я». */
  managers: string[];
  /** Кто открыл альбом: имя из формы ТЗ. */
  initialManager: string;
  onClose: () => void;
};

const SECTION_ACCENT: Record<string, string> = {
  common: "text-slate-700 border-slate-200 bg-slate-50",
  uncommon: "text-emerald-700 border-emerald-200 bg-emerald-50",
  rare: "text-blue-700 border-blue-200 bg-blue-50",
  exclusive: "text-amber-700 border-amber-200 bg-amber-50",
  legendary: "text-orange-700 border-orange-200 bg-orange-50",
  mythic: "text-fuchsia-700 border-fuchsia-200 bg-fuchsia-50",
};

/**
 * Альбом карточек успеха: менеджер видит, какие карточки ему уже выпадали,
 * а какие — ещё нет. Нераскрытые карточки показываются закрытыми слотами:
 * без картинки и без имени файла (см. `buildSuccessAlbumSections`).
 */
export default function SuccessAlbum({ stats, managers, initialManager, onClose }: SuccessAlbumProps) {
  const options = useMemo(() => listAlbumManagers(stats, managers), [stats, managers]);
  const [manager, setManager] = useState(() => initialManager.trim() || options[0] || "");

  useEffect(() => {
    if (manager && options.includes(manager)) return;
    setManager(options[0] || "");
  }, [options, manager]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const sections = useMemo(() => buildSuccessAlbumSections(stats, manager), [stats, manager]);
  const progress = useMemo(
    () => successAlbumProgress(sections.flatMap((section) => section.slots)),
    [sections],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <UiIcon name="sparkles" className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-800">Альбом карточек</h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="album-manager">Менеджер</label>
            <select
              id="album-manager"
              data-field="albumManager"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={manager}
              onChange={(event) => setManager(event.target.value)}
            >
              {options.length === 0 && <option value="">— нет менеджеров —</option>}
              {options.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
            >
              <UiIcon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 px-5 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">
              Открыто {progress.unlocked} из {progress.total}
            </span>
            <span className="text-slate-500">{progress.percent}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Закрытые карточки не показываются, пока не выпадут именно вам.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {sections.map((section, sectionIndex) => {
            const sectionProgress = successAlbumProgress(section.slots);
            return (
              <div
                key={section.id}
                data-album-section={section.id}
                className={sectionIndex === 0 ? "" : "mt-5 border-t border-slate-200 pt-4"}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${SECTION_ACCENT[section.id] || SECTION_ACCENT.common}`}>
                      {section.label}
                    </span>
                    <span className="text-xs text-slate-400">{section.slots.length} шт.</span>
                  </div>
                  <span className={`text-xs font-medium ${sectionProgress.unlocked ? "text-emerald-600" : "text-slate-400"}`}>
                    {sectionProgress.unlocked} / {sectionProgress.total}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {section.slots.map((slot, index) => (
                    slot.unlocked ? (
                      <div key={slot.name} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <img
                          src={slot.src}
                          alt={`${section.label}, карточка ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        {slot.count > 1 && (
                          <span className="absolute right-1.5 top-1.5 rounded-full bg-black/65 px-2 py-0.5 text-xs font-semibold text-white">
                            ×{slot.count}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div
                        key={`${section.id}-locked-${index}`}
                        data-album-locked="true"
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"
                      >
                        <UiIcon name="lock" className="h-5 w-5" />
                        <span className="text-xl font-bold">?</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            );
          })}
          {progress.unlocked === 0 && (
            <p className="mt-4 text-center text-sm text-slate-500">
              Пока ни одна карточка не выпала — отправьте заявку, и альбом начнёт заполняться.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

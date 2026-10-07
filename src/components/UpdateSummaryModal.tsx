import { useState } from "react";
import UpdateNotice from "./UpdateNotice";
import UiIcon from "./UiIcon";
import { UPDATE_SUMMARY_POINTS, APP_VERSION } from "../constants";

export default function UpdateSummaryModal({
  version,
  onClose,
}: {
  version: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <UiIcon name="check" className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold">Обновление прошло успешно</div>
              <div className="mt-1 text-sm text-white/80">
                Версия {version}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-600">
            Вот что нового в этой сборке:
          </p>
          <ul className="space-y-2">
            {UPDATE_SUMMARY_POINTS.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="mt-0.5 text-emerald-500">•</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Компоненты-Блоки ────────────────────────────────────────────────────────


import { formatBytes, formatSpeed } from "../utils";
import type { UpdateState } from "../types";
import UiIcon from "./UiIcon";

export default function UpdateNotice({
  state,
  onDownload,
  onInstall,
  onClose,
}: {
  state: UpdateState | null;
  onDownload: () => void | Promise<void>;
  onInstall: () => void | Promise<void>;
  onClose: () => void;
}) {
  if (!state || state.status === "idle") return null;

  const percent = Math.max(0, Math.min(100, state.percent ?? 0));
  const fileInfo = state.total ? `${formatBytes(state.transferred)} / ${formatBytes(state.total)}` : null;
  const speed = formatSpeed(state.bytesPerSecond);
  const title =
    state.status === "checking"
      ? "Проверяем обновления"
      : state.status === "available"
        ? "Доступна новая версия"
        : state.status === "downloading"
          ? "Скачиваем обновление"
          : state.status === "downloaded"
            ? "Обновление готово"
            : "Ошибка обновления";

  return (
    <div className="fixed right-4 bottom-4 z-[60] w-[min(92vw,420px)]">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-4 py-3 text-white">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              {state.status === "checking" && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {state.status === "available" && <UiIcon name="download" className="h-4 w-4 text-white" />}
              {state.status === "downloading" && <UiIcon name="clock" className="h-4 w-4 text-white" />}
              {state.status === "downloaded" && <UiIcon name="check" className="h-4 w-4 text-white" />}
              {state.status === "error" && <UiIcon name="warning" className="h-4 w-4 text-white" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-0.5 text-xs text-white/70">
                {state.version ? `Версия ${state.version}` : "Пожалуйста, подождите"}
                {state.releaseName ? ` • ${state.releaseName}` : ""}
              </div>
            </div>
            {(state.status === "available" || state.status === "error") && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Закрыть окно обновления"
              >
                <UiIcon name="close" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4">
          {state.status === "checking" && (
            <div className="space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
              <p className="text-sm text-slate-600">Смотрим GitHub Releases и проверяем, есть ли версия новее.</p>
            </div>
          )}

          {state.status === "available" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Найдена новая версия. Можно скачать её сейчас, а установка завершится после перезапуска.
              </p>
              {state.notes && <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 whitespace-pre-wrap">{state.notes}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDownload}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Скачать обновление
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Позже
                </button>
              </div>
            </div>
          )}

          {state.status === "downloading" && (
            <div className="space-y-3">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span>{percent.toFixed(0)}%</span>
                <span>{fileInfo}</span>
              </div>
              <div className="text-xs text-slate-500">
                {speed ? `Скорость ${speed}` : "Скачиваем..."}
              </div>
            </div>
          )}

          {state.status === "downloaded" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Обновление загружено. Нажмите кнопку ниже, чтобы приложение перезапустилось и установило новую версию.
              </p>
              <button
                type="button"
                onClick={onInstall}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Перезапустить и установить
              </button>
            </div>
          )}

          {state.status === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Не удалось проверить или скачать обновление.
              </p>
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                {state.error || "Неизвестная ошибка"}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


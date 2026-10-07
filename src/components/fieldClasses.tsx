export const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
export const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer";

export function fieldClass(invalid: boolean) {
  return `${inputClass} ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

export function selectFieldClass(invalid: boolean) {
  return `${selectClass} ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

export function actionFieldClass(invalid: boolean) {
  return `${inputClass} flex items-center justify-between gap-3 text-left shadow-sm hover:bg-slate-50 ${invalid ? "border-red-500 bg-red-50 ring-2 ring-red-200 shadow-sm shadow-red-100" : ""}`;
}

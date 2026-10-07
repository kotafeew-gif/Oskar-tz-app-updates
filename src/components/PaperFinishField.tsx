import { selectClass } from "./fieldClasses";
import Field from "./Field";
import type { PaperFinish } from "../types";

const PAPER_FINISHES: PaperFinish[] = ["Матовая", "Глянцевая"];

export default function PaperFinishField({
  label = "Поверхность",
  value,
  onChange,
  options = PAPER_FINISHES,
  visible = true,
}: {
  label?: string;
  value: PaperFinish;
  onChange: (value: PaperFinish) => void;
  options?: PaperFinish[];
  visible?: boolean;
}) {
  if (!visible) return null;
  return (
    <Field label={label}>
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`px-3 py-1 text-xs rounded-md transition-all ${value === item ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {item === "Матовая" ? "Мат" : "Глянец"}
          </button>
        ))}
      </div>
    </Field>
  );
}


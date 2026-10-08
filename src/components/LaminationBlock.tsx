import YesNo from "./YesNo";
import { selectClass } from "./fieldClasses";
import type { LaminationBlock } from "../types";

interface LaminationProps {
  label?: string;
  value: LaminationBlock;
  onChange: (value: LaminationBlock) => void;
  laminationKinds: string[];
  laminationThickness: string[];
}

export default function LaminationBlockComponent({ label, value, onChange, laminationKinds, laminationThickness }: LaminationProps) {
  const upd = (key: string, val: string | boolean) => onChange({ ...value, [key]: val });
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-2 border-l-2 border-blue-100 mt-2">
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Сторонность</label><select value={value.side} className={selectClass} onChange={(e) => upd("side", e.target.value)}><option value="">— выберите —</option><option>Односторонняя</option><option>Двухсторонняя</option></select></div>
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Толщина</label><select value={value.thickness} className={selectClass} onChange={(e) => upd("thickness", e.target.value)}><option value="">— выберите —</option>{laminationThickness.map((t: string) => <option key={t}>{t}</option>)}</select></div>
          <div className="flex flex-col gap-1"><label className="text-[10px] text-slate-400 uppercase">Вид</label>
            <select
              value={value.kind}
              className={selectClass}
              onChange={(e) => {
                const nextKind = e.target.value;
                onChange({
                  ...value,
                  kind: nextKind,
                  kindCustom: nextKind === "Нестандартный" ? (value.kindCustom || "") : "",
                });
              }}
            >
              <option value="">— выберите —</option>
              {laminationKinds.map((k: string) => <option key={k}>{k}</option>)}
            </select></div>
        </div>
      )}
    </div>
  );
}


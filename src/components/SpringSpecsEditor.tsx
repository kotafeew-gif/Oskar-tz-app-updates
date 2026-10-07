import type { SpringSpec } from "../constants";
import { selectClass, inputClass } from "./fieldClasses";

export default function SpringSpecsEditor({ items, onChange }: { items: SpringSpec[]; onChange: (items: SpringSpec[]) => void }) {
  function update(index: number, patch: Partial<SpringSpec>) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function add() {
    onChange([...items, { diameter: "", pitch: "2:1", capacityMm: 0, subcontract: false }]);
  }

  function remove(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Пружины</h3>
          <p className="mt-1 text-xs text-slate-500">Редактируются диаметр, шаг, допустимая высота блока и доступность подряда.</p>
        </div>
        <button type="button" onClick={add} className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50">＋ Добавить</button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.diameter}-${item.pitch}-${index}`} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 md:grid-cols-[1.2fr_0.8fr_1fr_1.2fr_auto_auto] md:items-center">
            <input className={inputClass} value={item.diameter} onChange={(e) => update(index, { diameter: e.target.value })} placeholder="Диаметр, мм" />
            <select className={selectClass} value={item.pitch} onChange={(e) => update(index, { pitch: e.target.value as SpringSpec["pitch"] })}><option>2:1</option><option>3:1</option></select>
            <input type="number" min={0} step="0.1" className={inputClass} value={item.capacityMm || ""} onChange={(e) => update(index, { capacityMm: Number(e.target.value) || 0 })} placeholder="Высота блока, мм" />
            <input className={inputClass} value={item.note || ""} onChange={(e) => update(index, { note: e.target.value })} placeholder="Примечание для меню" />
            <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={item.subcontract} onChange={(e) => update(index, { subcontract: e.target.checked })} /> Подряд</label>
            <button type="button" onClick={() => remove(index)} className="rounded-lg border border-red-200 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}


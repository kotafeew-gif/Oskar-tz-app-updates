import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import UiIcon, { DICT_ICON_MAP } from "./UiIcon";
import { actionFieldClass, fieldClass, selectClass } from "./fieldClasses";
import type { Dicts } from "../types";

export default function DictEditor({
  title,
  icon,
  items,
  locked = [],
  onChange,
  renderSuffix,
}: {
  title: string;
  icon: string;
  items: string[];
  locked?: string[];
  onChange: (items: string[]) => void;
  renderSuffix?: (item: string) => React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  function add() { const v = input.trim(); if (!v || items.includes(v)) return; onChange([...items, v]); setInput(""); }
  function remove(idx: number) { if (locked.includes(items[idx])) return; onChange(items.filter((_, i) => i !== idx)); }
  function moveUp(idx: number) { if (idx === 0) return; const arr = [...items]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; onChange(arr); }
  function moveDown(idx: number) { if (idx === items.length - 1) return; const arr = [...items]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; onChange(arr); }
  function startEdit(idx: number) { setEditIdx(idx); setEditVal(items[idx]); }
  function commitEdit() { if (editIdx === null) return; const v = editVal.trim(); if (v && !items.some((it, i) => it === v && i !== editIdx)) { const arr = [...items]; arr[editIdx] = v; onChange(arr); } setEditIdx(null); setEditVal(""); }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-2">
        <UiIcon name={DICT_ICON_MAP[icon] || "file"} className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="ml-auto text-xs text-slate-400">{items.length} {"\u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432"}</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            return (
              <div key={`${item}-${idx}`} className="flex items-center gap-1.5 group">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="w-5 h-4 flex items-center justify-center text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors text-xs leading-none">▲</button>
                  <button onClick={() => moveDown(idx)} disabled={idx === items.length - 1} className="w-5 h-4 flex items-center justify-center text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors text-xs leading-none">▼</button>
                </div>
                {editIdx === idx ? (
                  <input autoFocus className="flex-1 rounded-lg border border-blue-400 bg-blue-50 px-2 py-1 text-sm focus:outline-none" value={editVal} onChange={(e) => setEditVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditIdx(null); }} />
                ) : (
                  <span className="flex-1 text-sm text-slate-700 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 truncate flex items-center gap-2 min-w-0">
                    <span className="truncate">{item}</span>
                    {renderSuffix && renderSuffix(item)}
                    {locked.includes(item) && <span className="ml-auto text-xs text-slate-400 italic">{"\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043e"}</span>}
                  </span>
                )}
                {editIdx === idx ? (
                  <div className="flex gap-1">
                    <button onClick={commitEdit} className="px-2 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">OK</button>
                    <button onClick={() => setEditIdx(null)} className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-xs hover:bg-slate-300 transition-colors">{"\u041e\u0442\u043c\u0435\u043d\u0430"}</button>
                  </div>
                ) : (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(idx)} className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 text-xs hover:bg-amber-100 transition-colors" title={"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c"}>{"\u0420\u0435\u0434."}</button>
                    {!locked.includes(item) && <button onClick={() => remove(idx)} className="px-2 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs hover:bg-red-100 transition-colors" title={"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}>{"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"}</button>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <input className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" placeholder={"\u041d\u043e\u0432\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435..."} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
          <button onClick={add} disabled={!input.trim() || items.includes(input.trim())} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400">{"+ \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c"}</button>
        </div>
      </div>
    </div>
  );
}


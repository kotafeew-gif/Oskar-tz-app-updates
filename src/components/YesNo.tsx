function YesNo({ value, onChange, disabled = false }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex gap-1">
      <button type="button" disabled={disabled} onClick={() => onChange(true)} className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>Да</button>
      <button type="button" disabled={disabled} onClick={() => onChange(false)} className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${!value ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>Нет</button>
    </div>
  );
}

export default YesNo;
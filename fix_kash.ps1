$p='D:\AI\prog\printing  test\src\App.tsx'
$c=[IO.File]::ReadAllText($p,[Text.Encoding]::UTF8)
$pattern='function KashurovkaBlockComponent\([\s\S]*?\nfunction ShortTZPanel'
$replacement=@'
function KashurovkaBlockComponent({ value, onChange, paperProfiles, laminationKinds, laminationThickness }: any) {
  const upd = (key: string, val: any) => onChange({ ...value, [key]: val });
  const isSlim = value.connectionType === "Слим-каширование";
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Кашировка</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-violet-200 mt-3">
          <Field label="Тип соединения">
            <div className="flex gap-2">
              {["Каширование", "Слим-каширование"].map((ct) => (
                <button key={ct} type="button" onClick={() => upd("connectionType", ct)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.connectionType === ct ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{ct}</button>
              ))}
            </div>
          </Field>

          {!isSlim && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Основа"><select value={value.baseType} className={selectClass} onChange={(e) => upd("baseType", e.target.value)}><option value="">— выберите —</option>{KASHUROVKA_BASE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <Field label="Лайнер"><select value={value.linerType} className={selectClass} onChange={(e) => upd("linerType", e.target.value)}><option value="">— выберите —</option>{(paperProfiles?.kashLiner || KASHUROVKA_LINER_TYPES).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.linerFinish} onChange={(v) => upd("linerFinish", v)} />
                <Field label="Тип заворота"><div className="flex gap-2">{["С заворотом", "Без заворота"].map((tt) => <button key={tt} type="button" onClick={() => upd("turnoverType", tt)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.turnoverType === tt ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{tt}</button>)}</div></Field>
                <div className="md:col-span-2"><Field label="Размер лайнера (мм)"><input className={inputClass} placeholder="Например: 210×297 мм" value={value.linerSize} onChange={(e) => upd("linerSize", e.target.value)} /></Field></div>
              </div>

              <div className="pt-2 border-t border-violet-100">
                <div className="flex items-center gap-3 mb-3"><span className="text-xs font-medium text-slate-600 uppercase">Форзац</span><YesNo value={value.forsacEnabled} onChange={(v) => upd("forsacEnabled", v)} /></div>
                {value.forsacEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l-2 border-violet-100">
                    <Field label="Бумага форзаца"><select value={value.forsacPaper} className={selectClass} onChange={(e) => upd("forsacPaper", e.target.value)}><option value="">— выберите —</option>{(paperProfiles?.kashForsac || FORSAC_PAPER_TYPES).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                    <PaperFinishField value={value.forsacFinish} onChange={(v) => upd("forsacFinish", v)} />
                    <Field label="Печать на форзаце"><select value={value.forsacPrintMode} className={selectClass} onChange={(e) => upd("forsacPrintMode", e.target.value)}><option>Белые</option><option>С печатью</option></select></Field>
                    <Field label="Размер форзаца (мм)"><input className={inputClass} placeholder="Например: 200×290 мм" value={value.forsacSize} onChange={(e) => upd("forsacSize", e.target.value)} /></Field>
                  </div>
                )}
              </div>
            </>
          )}

          {isSlim && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Бумага 1"><select value={value.slimPaperTop} className={selectClass} onChange={(e) => upd("slimPaperTop", e.target.value)}><option value="">— выберите —</option>{(paperProfiles?.slip || []).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.slimPaperTopFinish} onChange={(v) => upd("slimPaperTopFinish", v)} />
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 1" value={value.slimPaperTopLamination} onChange={(v: LaminationBlock) => upd("slimPaperTopLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Бумага 2"><select value={value.slimPaperBottom} className={selectClass} onChange={(e) => upd("slimPaperBottom", e.target.value)}><option value="">— выберите —</option>{(paperProfiles?.slip || []).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.slimPaperBottomFinish} onChange={(v) => upd("slimPaperBottomFinish", v)} />
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 2" value={value.slimPaperBottomLamination} onChange={(v: LaminationBlock) => upd("slimPaperBottomLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ShortTZPanel
'@
$c=[regex]::Replace($c,$pattern,$replacement)
[IO.File]::WriteAllText($p,$c,[Text.UTF8Encoding]::new($false))

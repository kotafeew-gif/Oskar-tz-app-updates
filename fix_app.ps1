$path = 'D:\AI\prog\printing  test\src\App.tsx'
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$pattern = 'function KashurovkaBlockComponent\(\{ value, onChange, paperProfiles \}: any\) \{[\s\S]*?\r?\n\r?\nfunction ShortTZPanel'
$replacement = @'
function KashurovkaBlockComponent({ value, onChange, paperProfiles, laminationKinds, laminationThickness }: any) {
  const upd = (key: string, val: any) => onChange({ ...value, [key]: val });
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">РљР°С€РёСЂРѕРІРєР°</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-violet-200 mt-3">
          <Field label="РўРёРї СЃРѕРµРґРёРЅРµРЅРёСЏ">
            <div className="flex gap-2">
              {["РљР°С€РёСЂРѕРІР°РЅРёРµ", "РЎР»РёРј-РєР°С€РёСЂРѕРІР°РЅРёРµ"].map((ct) => (
                <button key={ct} type="button" onClick={() => upd("connectionType", ct)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.connectionType === ct ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{ct}</button>
              ))}
            </div>
          </Field>
          {value.connectionType === "РљР°С€РёСЂРѕРІР°РЅРёРµ" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="РћСЃРЅРѕРІР°"><select value={value.baseType} className={selectClass} onChange={(e) => upd("baseType", e.target.value)}><option value="">вЂ” РІС‹Р±РµСЂРёС‚Рµ вЂ”</option>{KASHUROVKA_BASE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <Field label="Р›Р°Р№РЅРµСЂ"><select value={value.linerType} className={selectClass} onChange={(e) => upd("linerType", e.target.value)}><option value="">вЂ” РІС‹Р±РµСЂРёС‚Рµ вЂ”</option>{(paperProfiles?.kashLiner || KASHUROVKA_LINER_TYPES).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.linerFinish} onChange={(v) => upd("linerFinish", v)} />
                <Field label="РўРёРї Р·Р°РІРѕСЂРѕС‚Р°"><div className="flex gap-2">{["РЎ Р·Р°РІРѕСЂРѕС‚РѕРј", "Р‘РµР· Р·Р°РІРѕСЂРѕС‚Р°"].map((tt) => <button key={tt} type="button" onClick={() => upd("turnoverType", tt)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.turnoverType === tt ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{tt}</button>)}</div></Field>
                <div className="md:col-span-2"><Field label="Р Р°Р·РјРµСЂ Р»Р°Р№РЅРµСЂР° (РјРј)"><input className={inputClass} placeholder="РќР°РїСЂРёРјРµСЂ: 210Г—297 РјРј" value={value.linerSize} onChange={(e) => upd("linerSize", e.target.value)} /></Field></div>
              </div>
              <div className="pt-2 border-t border-violet-100">
                <div className="flex items-center gap-3 mb-3"><span className="text-xs font-medium text-slate-600 uppercase">Р¤РѕСЂР·Р°С†</span><YesNo value={value.forsacEnabled} onChange={(v) => upd("forsacEnabled", v)} /></div>
                {value.forsacEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l-2 border-violet-100">
                    <Field label="Р‘СѓРјР°РіР° С„РѕСЂР·Р°С†Р°"><select value={value.forsacPaper} className={selectClass} onChange={(e) => upd("forsacPaper", e.target.value)}><option value="">вЂ” РІС‹Р±РµСЂРёС‚Рµ вЂ”</option>{(paperProfiles?.kashForsac || FORSAC_PAPER_TYPES).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                    <PaperFinishField value={value.forsacFinish} onChange={(v) => upd("forsacFinish", v)} />
                    <Field label="РџРµС‡Р°С‚СЊ РЅР° С„РѕСЂР·Р°С†Рµ"><select value={value.forsacPrintMode} className={selectClass} onChange={(e) => upd("forsacPrintMode", e.target.value)}><option>Р‘РµР»С‹Рµ</option><option>РЎ РїРµС‡Р°С‚СЊСЋ</option></select></Field>
                    <Field label="Р Р°Р·РјРµСЂ С„РѕСЂР·Р°С†Р° (РјРј)"><input className={inputClass} placeholder="РќР°РїСЂРёРјРµСЂ: 200Г—290 РјРј" value={value.forsacSize} onChange={(e) => upd("forsacSize", e.target.value)} /></Field>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Р‘СѓРјР°РіР° 1"><select value={value.slimPaperTop} className={selectClass} onChange={(e) => upd("slimPaperTop", e.target.value)}><option value="">вЂ” РІС‹Р±РµСЂРёС‚Рµ вЂ”</option>{(paperProfiles?.slip || []).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.slimPaperTopFinish} onChange={(v) => upd("slimPaperTopFinish", v)} />
                <div className="md:col-span-2"><LaminationBlockComponent label="Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 1" value={value.slimPaperTopLamination} onChange={(v: LaminationBlock) => upd("slimPaperTopLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Р‘СѓРјР°РіР° 2"><select value={value.slimPaperBottom} className={selectClass} onChange={(e) => upd("slimPaperBottom", e.target.value)}><option value="">вЂ” РІС‹Р±РµСЂРёС‚Рµ вЂ”</option>{(paperProfiles?.slip || []).map((t: string) => <option key={t}>{t}</option>)}</select></Field>
                <PaperFinishField value={value.slimPaperBottomFinish} onChange={(v) => upd("slimPaperBottomFinish", v)} />
                <div className="md:col-span-2"><LaminationBlockComponent label="Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 2" value={value.slimPaperBottomLamination} onChange={(v: LaminationBlock) => upd("slimPaperBottomLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
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
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)

$content = $content.Replace('    if (form.adBlocks) parts.push(`${form.adBlocks} СЂРµРєР». Р±Р»РѕРєР°`);', '    if (form.calendarKind === "РќР°СЃС‚РµРЅРЅС‹Р№" && form.adBlocks) parts.push(`${form.adBlocks} СЂРµРєР». Р±Р»РѕРєР°`);')
$content = $content.Replace('<Field label="Р—Р°РєР°Р·С‡РёРє">', '<Field label="Р—Р°РєР°Р·С‡РёРє" required>')
$content = $content.Replace('<input type="text" className={inputClass} placeholder="РћРћРћ В«РќР°Р·РІР°РЅРёРµВ» РёР»Рё Р¤РРћ" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} />', '<input data-field="clientName" type="text" className={fieldClass(showValidation && required.includes("clientName"))} placeholder="РћРћРћ В«РќР°Р·РІР°РЅРёРµВ» РёР»Рё Р¤РРћ" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} />')
$content = $content.Replace('<Field label="РњРµРЅРµРґР¶РµСЂ">', '<Field label="РњРµРЅРµРґР¶РµСЂ" required>')
$content = $content.Replace('<select className={selectClass} value={form.managerName} onChange={(e) => update("managerName", e.target.value)}>', '<select data-field="managerName" className={selectFieldClass(showValidation && required.includes("managerName"))} value={form.managerName} onChange={(e) => update("managerName", e.target.value)}>')
$content = $content.Replace(' onFocus={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}', '')
$content = $content.Replace('<KashurovkaBlockComponent value={form.kashurovka} onChange={(v: any) => update("kashurovka", v)} paperProfiles={dicts.paperProfiles} />', '<KashurovkaBlockComponent value={form.kashurovka} onChange={(v: any) => update("kashurovka", v)} paperProfiles={dicts.paperProfiles} laminationKinds={dicts.laminationKinds} laminationThickness={dicts.laminationThickness} />')
$content = $content.Replace("  if (form.kashurovka.enabled) {`r`n    if (!form.kashurovka.baseType) errors.push(\"kashBaseType\");`r`n    if (!form.kashurovka.linerType) errors.push(\"kashLinerType\");`r`n  }", "  if (form.kashurovka.enabled) {`r`n    if (form.kashurovka.connectionType === \"РЎР»РёРј-РєР°С€РёСЂРѕРІР°РЅРёРµ\") {`r`n      if (!form.kashurovka.slimPaperTop) errors.push(\"kashSlimPaperTop\");`r`n      if (!form.kashurovka.slimPaperBottom) errors.push(\"kashSlimPaperBottom\");`r`n    } else {`r`n      if (!form.kashurovka.baseType) errors.push(\"kashBaseType\");`r`n      if (!form.kashurovka.linerType) errors.push(\"kashLinerType\");`r`n    }`r`n  }")
$content = $content.Replace('  kashLinerType: "Р›Р°Р№РЅРµСЂ",', "  kashLinerType: `"Р›Р°Р№РЅРµСЂ`",`r`n  kashSlimPaperTop: `"Р‘СѓРјР°РіР° 1 РІ СЃР»РёРј-РєР°С€РёСЂРѕРІРєРµ`",`r`n  kashSlimPaperBottom: `"Р‘СѓРјР°РіР° 2 РІ СЃР»РёРј-РєР°С€РёСЂРѕРІРєРµ`",")
$content = $content.Replace('      lines.push(` Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 1 : ${form.kashurovka.slimPaperTopLamination ? "Р”Р°" : "РќРµС‚"}`);', '      lines.push(` Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 1 : ${formatLamination(form.kashurovka.slimPaperTopLamination)}`);')
$content = $content.Replace('      lines.push(` Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 2 : ${form.kashurovka.slimPaperBottomLamination ? "Р”Р°" : "РќРµС‚"}`);', '      lines.push(` Р›Р°РјРёРЅР°С†РёСЏ Р±СѓРјР°РіРё 2 : ${formatLamination(form.kashurovka.slimPaperBottomLamination)}`);')

[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))

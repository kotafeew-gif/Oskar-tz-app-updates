import LaminationBlockComponent from "./LaminationBlock";
import PaperFinishField from "./PaperFinishField";
import PaperSelectionField from "./PaperSelectionField";
import YesNo from "./YesNo";
import { selectClass, inputClass } from "./fieldClasses";
import Field from "./Field";
import UiIcon from "./UiIcon";
import { formatPaperSelection, paperFinishOptionsForSelection } from "../utils";
import type { KashurovkaBlock, LaminationBlock, PaperFinish } from "../types";
import { PAPER_TYPE_OPTIONS, KASHUROVKA_BASE_TYPES, KASHUROVKA_LINER_TYPES, FORSAC_PAPER_TYPES, DEFAULT_COLORS, DEFAULT_LAMINATION_KINDS, DEFAULT_LAMINATION_THICKNESS } from "../constants";
import type { PaperTypeOption } from "../constants";

export default function KashurovkaBlockComponent({ value, onChange, paperProfiles, paperLibrary, laminationKinds, laminationThickness, colors, showValidation = false, requiredFields = [] }: any) {
  const upd = (key: string, val: any) => onChange({ ...value, [key]: val });
  const isSlim = value.connectionType === "Слим-каширование";
  const isRequired = (field: string) => showValidation && requiredFields.includes(field);
  const syncPaper = (keys: {
    typeKey: string;
    customKey: string;
    densityKey: string;
    legacyKey: string;
  }, type: PaperTypeOption | "", density: string, customName: string) => {
    onChange({
      ...value,
      [keys.typeKey]: type,
      [keys.densityKey]: density,
      [keys.customKey]: customName,
      [keys.legacyKey]: formatPaperSelection(type, density, customName),
    });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Кашировка</span>
        <YesNo value={value.enabled} onChange={(v) => upd("enabled", v)} />
      </div>
      {value.enabled && (
        <div className="space-y-4 pl-2 border-l-2 border-violet-200 mt-3">
          <Field label="Тип кашировки">
            <div className="flex gap-2">
              {["Каширование", "Слим-каширование"].map((ct) => (
                <button key={ct} type="button" onClick={() => upd("connectionType", ct)} className={`flex-1 py-1.5 rounded-lg text-sm border transition-colors ${value.connectionType === ct ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{ct}</button>
              ))}
            </div>
          </Field>

          {!isSlim && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Основа"><select value={value.baseType} className={selectClass} onChange={(e) => upd("baseType", e.target.value)}><option value="">— выберите —</option>{KASHUROVKA_BASE_TYPES.map((t) => <option key={t}>{t}</option>)}<option>Другое...</option></select>{value.baseType === "Другое..." && <><input data-field="kashBaseCustomName" className={`${inputClass} mt-2`} placeholder="Укажите материал основы" value={value.baseCustomName || ""} onChange={(e) => upd("baseCustomName", e.target.value)} /><p className="mt-1 text-xs font-semibold text-amber-700">Материал под заказ.</p></>}</Field>
                <PaperSelectionField
                  label="Лайнер"
                  typeValue={value.linerPaperType}
                  materialValue={value.linerPaperDensity}
                  customValue={value.linerPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    value.linerPaperType,
                    nextDensity,
                    value.linerPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "linerPaperType",
                      customKey: "linerPaperCustomName",
                      densityKey: "linerPaperDensity",
                      legacyKey: "linerType",
                    },
                    value.linerPaperType,
                    value.linerPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="linerPaperType"
                  materialFieldName="linerPaperDensity"
                  customFieldName="linerPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashLinerPaperType")}
                  invalidMaterial={isRequired("kashLinerPaperDensity")}
                  invalidCustom={isRequired("kashLinerPaperCustomName")}
                />
                <PaperFinishField value={value.linerFinish} visible={value.linerPaperType === "Мелованная"} options={paperFinishOptionsForSelection(value.linerPaperType, value.linerPaperDensity)} onChange={(v) => upd("linerFinish", v)} />
                <Field label="Цветность лайнера"><select value={value.linerColor} className={selectClass} onChange={(e) => upd("linerColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <div className="md:col-span-2"><Field label="Размер лайнера (мм)"><input className={inputClass} placeholder="Например: 210×297 мм" value={value.linerSize} onChange={(e) => upd("linerSize", e.target.value)} /></Field></div>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация лайнера" value={value.linerLamination} onChange={(v: LaminationBlock) => upd("linerLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>

              <div className="pt-2 border-t border-violet-100">
                <div className="flex items-center gap-3 mb-3"><span className="text-xs font-medium text-slate-600 uppercase">Форзац</span><YesNo value={value.forsacEnabled} onChange={(v) => upd("forsacEnabled", v)} /></div>
                {value.forsacEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l-2 border-violet-100">
                    <PaperSelectionField
                      label="Бумага форзаца"
                      typeValue={value.forsacPaperType}
                      materialValue={value.forsacPaperDensity}
                      customValue={value.forsacPaperCustomName}
                      library={paperLibrary}
                      onTypeChange={(nextType) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        nextType,
                        "",
                        "",
                      )}
                      onMaterialChange={(nextDensity) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        value.forsacPaperType,
                        nextDensity,
                        value.forsacPaperCustomName,
                      )}
                      onCustomChange={(nextCustom) => syncPaper(
                        {
                          typeKey: "forsacPaperType",
                          customKey: "forsacPaperCustomName",
                          densityKey: "forsacPaperDensity",
                          legacyKey: "forsacPaper",
                        },
                        value.forsacPaperType,
                        value.forsacPaperDensity,
                        nextCustom,
                      )}
                      typeFieldName="forsacPaperType"
                      materialFieldName="forsacPaperDensity"
                      customFieldName="forsacPaperCustomName"
                      showValidation={showValidation}
                      invalidType={isRequired("kashForsacPaperType")}
                      invalidMaterial={isRequired("kashForsacPaperDensity")}
                      invalidCustom={isRequired("kashForsacPaperCustomName")}
                    />
                    <PaperFinishField value={value.forsacFinish} visible={value.forsacPaperType === "Мелованная"} options={paperFinishOptionsForSelection(value.forsacPaperType, value.forsacPaperDensity)} onChange={(v) => upd("forsacFinish", v)} />
                    <Field label="Цветность форзаца"><select value={value.forsacColor} className={selectClass} onChange={(e) => upd("forsacColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                    <Field label="Печать на форзаце"><select value={value.forsacPrintMode} className={selectClass} onChange={(e) => upd("forsacPrintMode", e.target.value)}><option>Белые</option><option>С печатью</option></select></Field>
                    <Field label="Размер форзаца (мм)"><input className={inputClass} placeholder="Например: 200×290 мм" value={value.forsacSize} onChange={(e) => upd("forsacSize", e.target.value)} /></Field>
                    <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация форзаца" value={value.forsacLamination} onChange={(v: LaminationBlock) => upd("forsacLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
                  </div>
                )}
              </div>
            </>
          )}

          {isSlim && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PaperSelectionField
                  label="Бумага 1"
                  typeValue={value.slimPaperTopPaperType}
                  materialValue={value.slimPaperTopPaperDensity}
                  customValue={value.slimPaperTopPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    value.slimPaperTopPaperType,
                    nextDensity,
                    value.slimPaperTopPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "slimPaperTopPaperType",
                      customKey: "slimPaperTopPaperCustomName",
                      densityKey: "slimPaperTopPaperDensity",
                      legacyKey: "slimPaperTop",
                    },
                    value.slimPaperTopPaperType,
                    value.slimPaperTopPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="slimPaperTopPaperType"
                  materialFieldName="slimPaperTopPaperDensity"
                  customFieldName="slimPaperTopPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashSlimPaperTopPaperType")}
                  invalidMaterial={isRequired("kashSlimPaperTopPaperDensity")}
                  invalidCustom={isRequired("kashSlimPaperTopPaperCustomName")}
                />
                <PaperFinishField value={value.slimPaperTopFinish} visible={value.slimPaperTopPaperType === "Мелованная"} options={paperFinishOptionsForSelection(value.slimPaperTopPaperType, value.slimPaperTopPaperDensity)} onChange={(v) => upd("slimPaperTopFinish", v)} />
                <Field label="Цветность бумаги 1"><select value={value.slimPaperTopColor} className={selectClass} onChange={(e) => upd("slimPaperTopColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 1" value={value.slimPaperTopLamination} onChange={(v: LaminationBlock) => upd("slimPaperTopLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PaperSelectionField
                  label="Бумага 2"
                  typeValue={value.slimPaperBottomPaperType}
                  materialValue={value.slimPaperBottomPaperDensity}
                  customValue={value.slimPaperBottomPaperCustomName}
                  library={paperLibrary}
                  onTypeChange={(nextType) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    nextType,
                    "",
                    "",
                  )}
                  onMaterialChange={(nextDensity) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    value.slimPaperBottomPaperType,
                    nextDensity,
                    value.slimPaperBottomPaperCustomName,
                  )}
                  onCustomChange={(nextCustom) => syncPaper(
                    {
                      typeKey: "slimPaperBottomPaperType",
                      customKey: "slimPaperBottomPaperCustomName",
                      densityKey: "slimPaperBottomPaperDensity",
                      legacyKey: "slimPaperBottom",
                    },
                    value.slimPaperBottomPaperType,
                    value.slimPaperBottomPaperDensity,
                    nextCustom,
                  )}
                  typeFieldName="slimPaperBottomPaperType"
                  materialFieldName="slimPaperBottomPaperDensity"
                  customFieldName="slimPaperBottomPaperCustomName"
                  showValidation={showValidation}
                  invalidType={isRequired("kashSlimPaperBottomPaperType")}
                  invalidMaterial={isRequired("kashSlimPaperBottomPaperDensity")}
                  invalidCustom={isRequired("kashSlimPaperBottomPaperCustomName")}
                />
                <PaperFinishField value={value.slimPaperBottomFinish} visible={value.slimPaperBottomPaperType === "Мелованная"} options={paperFinishOptionsForSelection(value.slimPaperBottomPaperType, value.slimPaperBottomPaperDensity)} onChange={(v) => upd("slimPaperBottomFinish", v)} />
                <Field label="Цветность бумаги 2"><select value={value.slimPaperBottomColor} className={selectClass} onChange={(e) => upd("slimPaperBottomColor", e.target.value)}><option value="">— выберите —</option>{colors.map((c: string) => <option key={c}>{c}</option>)}</select></Field>
                <div className="md:col-span-2"><LaminationBlockComponent label="Ламинация бумаги 2" value={value.slimPaperBottomLamination} onChange={(v: LaminationBlock) => upd("slimPaperBottomLamination", v)} laminationKinds={laminationKinds} laminationThickness={laminationThickness} /></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



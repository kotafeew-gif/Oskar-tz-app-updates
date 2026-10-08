import { useEffect } from "react";
import { PAPER_TYPE_OPTIONS, DEFAULT_PAPER_LIBRARY } from "../constants";
import type { PaperFinish, PaperSelectionValue } from "../types";
import type { PaperTypeOption } from "../constants";
import { selectClass, fieldClass, selectFieldClass } from "./fieldClasses";
import { getPaperLibraryItems } from "../utils";

export default function PaperSelectionField({
  label,
  typeValue,
  materialValue,
  customValue,
  library,
  onTypeChange,
  onMaterialChange,
  onCustomChange,
  typeFieldName,
  materialFieldName,
  customFieldName,
  showValidation,
  invalidType,
  invalidMaterial,
  invalidCustom,
  typeOptionLabels,
  productType,
  disabled = false,
}: {
  label: string;
  typeValue: PaperTypeOption | "";
  materialValue: string;
  customValue: string;
  library: typeof DEFAULT_PAPER_LIBRARY;
  onTypeChange: (value: PaperTypeOption | "") => void;
  onMaterialChange: (value: string) => void;
  onCustomChange: (value: string) => void;
  typeFieldName: string;
  materialFieldName: string;
  customFieldName: string;
  showValidation: boolean;
  invalidType: boolean;
  invalidMaterial: boolean;
  invalidCustom: boolean;
  typeOptionLabels?: Partial<Record<PaperTypeOption, string>>;
  productType?: string;
  disabled?: boolean;
}) {
  const isDesigner = typeValue === "Дизайнерская";
  const isCardboard = typeValue === "Картон";
  const isPaperless = typeValue === "Без бумаги" || typeValue === "Давальческая";
  const isEnvelopePaper = productType === "Конверты";
  const items = typeValue ? getPaperLibraryItems(library, typeValue) : [];
  const effectiveMaterialValue = isCardboard && !materialValue && items[0] ? items[0] : materialValue;

  useEffect(() => {
    if (!isCardboard || disabled || !items.length || materialValue) return;
    onMaterialChange(items[0]);
  }, [disabled, isCardboard, items, materialValue, onMaterialChange]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
        {label}<span className="text-red-400 ml-0.5">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select
          data-field={typeFieldName}
          value={typeValue}
          disabled={disabled}
          className={selectFieldClass(showValidation && invalidType)}
          onChange={(e) => onTypeChange(e.target.value as PaperTypeOption | "")}
        >
          <option value="">— тип бумаги —</option>
          {PAPER_TYPE_OPTIONS.map((item) => <option key={item} value={item}>{typeOptionLabels?.[item] || (isEnvelopePaper && item === "Без бумаги" ? "Готовые конверты" : item)}</option>)}
        </select>
        {isDesigner ? (
          <div>
            <input
              data-field={customFieldName}
              list={`designer-paper-suggestions-${customFieldName}`}
              value={customValue}
              disabled={disabled}
              className={fieldClass(showValidation && invalidCustom)}
              placeholder="Название дизайнерской бумаги"
              onChange={(e) => onCustomChange(e.target.value)}
            />
            <datalist id={`designer-paper-suggestions-${customFieldName}`}>
              {library.designer.map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>
        ) : isPaperless ? (
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Материал и плотность не требуются
          </div>
        ) : (
          <select
            data-field={materialFieldName}
            value={effectiveMaterialValue}
            disabled={disabled || !typeValue}
            className={selectFieldClass(showValidation && invalidMaterial)}
            onChange={(e) => onMaterialChange(e.target.value)}
          >
            <option value="">— плотность —</option>
            {items.map((item) => <option key={item}>{item}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}


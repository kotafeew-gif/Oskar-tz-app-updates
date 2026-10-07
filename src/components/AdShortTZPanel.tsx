import { Fragment, useEffect, useRef, useState } from "react";
import { generateAdShortTZ } from "../utils";
import type { AdFormData } from "../types";
import UiIcon from "./UiIcon";

export default function AdShortTZPanel({ form }: { form: AdFormData }) {
  const [copied, setCopied] = useState(false);
  const shortText = generateAdShortTZ(form);
  const [flash, setFlash] = useState(false);
  const prevShort = useRef(shortText);
  const shortLines = shortText ? shortText.split("\n") : [];

  useEffect(() => {
    if (prevShort.current !== shortText && shortText) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevShort.current = shortText;
      return () => clearTimeout(t);
    }
    prevShort.current = shortText;
  }, [shortText]);

  function handleCopy() {
    if (!shortText) return;
    navigator.clipboard.writeText(shortText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${shortText ? "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50" : "border-slate-200 bg-white"}`}>
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-orange-100">
        <UiIcon name="flash" className="h-5 w-5 text-orange-500" />
        <h2 className="text-sm font-semibold text-slate-700">Короткое ТЗ</h2>
        <span className="text-xs text-slate-400 ml-1">— автоматически формируется из данных формы</span>
        {shortText && (
          <button onClick={handleCopy} className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${copied ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-700 border-orange-300 hover:bg-orange-50"}`}>
            {copied ? <><UiIcon name="check" className="h-4 w-4" />Скопировано!</> : <><UiIcon name="clipboard" className="h-4 w-4" />Копировать</>}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        {shortText ? (
          <>
            <div className={`font-mono text-sm leading-relaxed text-slate-800 select-all rounded-lg px-3 py-2 bg-white border border-orange-100 transition-all duration-300 whitespace-pre-wrap ${flash ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
              {shortLines.map((line, lineIndex) => (
                <div key={lineIndex} className={`${lineIndex > 0 ? "mt-1" : ""} text-slate-700`}>
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shortLines.map((line, i) => (
                <span key={`ad-${i}`} className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{line}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic px-3 py-2">Заполните поля формы — короткая реклама появится здесь автоматически…</p>
        )}
      </div>
    </div>
  );
}


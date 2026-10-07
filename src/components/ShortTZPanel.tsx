import { Fragment, useEffect, useRef, useState } from "react";
import { generateShortTZ } from "../utils";
import type { FormData } from "../types";
import UiIcon from "./UiIcon";

const SHORT_TZ_ANNOTATION_SPLIT_RE = /(раскрой(?:\s+[^,;\n]*)?|уф[-\s]?лак(?:\s+[^,;\n]*)?)/gi;
const SHORT_TZ_ANNOTATION_MATCH_RE = /^(раскрой|уф[-\s]?лак)/i;

function renderShortTZText(text: string, keyPrefix: string) {
  return text.split(SHORT_TZ_ANNOTATION_SPLIT_RE).map((segment, index) => (
    segment ? SHORT_TZ_ANNOTATION_MATCH_RE.test(segment)
      ? <strong key={`${keyPrefix}-${index}`} className={`font-bold ${/^уф[-\s]?лак/i.test(segment) ? "text-orange-600" : "text-slate-900"}`}>{segment}</strong>
      : <span key={`${keyPrefix}-${index}`}>{segment}</span>
      : null
  ));
}

export default function ShortTZPanel({ form }: { form: FormData }) {
  const [copied, setCopied] = useState(false);
  const shortText = generateShortTZ(form);
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
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${shortText ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50" : "border-slate-200 bg-white"}`}>
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-emerald-100">
        <UiIcon name="flash" className="h-5 w-5 text-emerald-500" />
        <h2 className="text-sm font-semibold text-slate-700">Краткое ТЗ</h2>
        <span className="text-xs text-slate-400 ml-1">— автоматически формируется из данных формы</span>
        {shortText && (
          <button onClick={handleCopy} className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${copied ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"}`}>
            {copied ? <><UiIcon name="check" className="h-4 w-4" />Скопировано!</> : <><UiIcon name="clipboard" className="h-4 w-4" />Копировать</>}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        {shortText ? (
          <>
            <div className={`font-mono text-sm leading-relaxed text-slate-800 select-all rounded-lg px-3 py-2 bg-white border border-emerald-100 transition-all duration-300 whitespace-pre-wrap ${flash ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}>
              {shortLines.map((line, lineIndex) => (
                line === "" ? (
                  <div key={lineIndex} className="h-3" />
                ) : (
                  <div key={lineIndex} className={`${lineIndex > 0 ? "mt-1" : ""} text-slate-700`}>
                    {lineIndex === 0
                      ? line.split(" / ").map((segment, i, arr) => (
                      <span key={i}>
                        <span className="text-slate-800">{renderShortTZText(segment, `short-${lineIndex}-${i}`)}</span>
                        {i < arr.length - 1 && <span className="text-emerald-400 font-bold mx-1">/</span>}
                      </span>
                      ))
                      : renderShortTZText(line, `short-${lineIndex}`)}
                  </div>
                )
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shortLines[0]?.split(" / ").map((seg, i) => (
                <span key={`main-${i}`} className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{seg}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 italic px-3 py-2">Заполните поля формы — краткое ТЗ появится здесь автоматически…</p>
        )}
      </div>
    </div>
  );
}


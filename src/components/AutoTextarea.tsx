import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type AutoTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Минимальная высота в строках (по умолчанию 6). */
  minRows?: number;
  /** После этой высоты появляется внутренняя прокрутка (по умолчанию 18). */
  maxRows?: number;
  dataField?: string;
};

/**
 * Textarea, который сам подрастает под текст: от minRows до maxRows строк,
 * дальше — внутренняя прокрутка. Высота считается по scrollHeight, поэтому
 * учитывает и переносы строк, и смену ширины окна.
 */
export default function AutoTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  minRows = 6,
  maxRows = 18,
  dataField,
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const styles = window.getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight) || 20;
    const paddingY = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const borderY = (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0);
    const extra = paddingY + borderY;
    const min = lineHeight * minRows + extra;
    const max = lineHeight * maxRows + extra;
    el.style.height = "auto";
    const needed = el.scrollHeight;
    el.style.height = `${Math.min(Math.max(needed, min), max)}px`;
    el.style.overflowY = needed > max ? "auto" : "hidden";
  }, [minRows, maxRows]);

  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return (
    <textarea
      ref={ref}
      data-field={dataField}
      rows={minRows}
      className={`${className} resize-none`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

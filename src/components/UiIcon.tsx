import type { UiIconName } from "../types";

export default function UiIcon({ name, className = "h-4 w-4" }: { name: UiIconName; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === "folder" && <>
        <path {...common} d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5V17A2 2 0 0 1 19 19H5a2 2 0 0 1-2-2V7.5Z" />
      </>}
      {name === "printer" && <>
        <rect {...common} x="6" y="4" width="12" height="6" rx="1.5" />
        <path {...common} d="M6 10H5a2 2 0 0 0-2 2v4h4" />
        <path {...common} d="M18 10h1a2 2 0 0 1 2 2v4h-4" />
        <rect {...common} x="7" y="13" width="10" height="7" rx="1.5" />
      </>}
      {name === "file" && <>
        <path {...common} d="M7 3.75h6l4 4V20.25A1.75 1.75 0 0 1 15.25 22h-8.5A1.75 1.75 0 0 1 5 20.25V5.5A1.75 1.75 0 0 1 6.75 3.75Z" />
        <path {...common} d="M13 3.75V7a1 1 0 0 0 1 1h3" />
      </>}
      {name === "calendar" && <>
        <rect {...common} x="4" y="5.5" width="16" height="14.5" rx="2" />
        <path {...common} d="M4 9h16" />
        <path {...common} d="M8 3.5v4M16 3.5v4" />
      </>}
      {name === "badge" && <>
        <rect {...common} x="4" y="4" width="16" height="16" rx="3" />
        <path {...common} d="M8 10h8M8 14h5" />
      </>}
      {name === "palette" && <>
        <path {...common} d="M12 4a8 8 0 1 0 0 16h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h1a3 3 0 0 0 0-6Z" />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <circle cx="7.5" cy="13" r="1" fill="currentColor" />
        <circle cx="10.8" cy="16" r="1" fill="currentColor" />
      </>}
      {name === "scissors" && <>
        <circle {...common} cx="7" cy="7" r="2" />
        <circle {...common} cx="7" cy="17" r="2" />
        <path {...common} d="M8.4 8.4 20 4M8.4 15.6 20 20M8.2 7.8 15 12" />
      </>}
      {name === "book" && <>
        <path {...common} d="M6 4.5h8a3 3 0 0 1 3 3V20H9a3 3 0 0 0-3 3V4.5Z" />
        <path {...common} d="M6 4.5h8a3 3 0 0 1 3 3V20" />
        <path {...common} d="M9 8h5M9 12h5" />
      </>}
      {name === "sparkles" && <>
        <path {...common} d="M12 3.5 13.8 8l4.7 1.8-4.7 1.8L12 16l-1.8-4.4-4.7-1.8L10.2 8 12 3.5Z" />
        <path {...common} d="M18 12.5 18.7 14.3 20.5 15l-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
      </>}
      {name === "ruler" && <>
        <rect {...common} x="4.5" y="7" width="15" height="10" rx="2" transform="rotate(-15 12 12)" />
        <path {...common} d="M8 9.5v2M10.5 8.8v2M13 8v2M15.5 7.3v2" />
      </>}
      {name === "clipboard" && <>
        <rect {...common} x="7" y="5" width="10" height="16" rx="2" />
        <path {...common} d="M9 5.5V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5v1" />
        <path {...common} d="M9 10h6M9 13h6M9 16h4" />
      </>}
      {name === "settings" && <>
        <circle {...common} cx="12" cy="12" r="3.5" />
        <path {...common} d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M16.4 7.6l1.4-1.4M6.2 17.8l1.4-1.4" />
      </>}
      {name === "save" && <>
        <path {...common} d="M5 4.5h11l3 3V19.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-15Z" />
        <path {...common} d="M8 4.5V10h8V4.5" />
        <path {...common} d="M8 15h8" />
      </>}
      {name === "copy" && <>
        <rect {...common} x="9" y="3.5" width="10" height="12" rx="2" />
        <rect {...common} x="5" y="8.5" width="10" height="12" rx="2" />
      </>}
      {name === "warning" && <>
        <path {...common} d="M12 4 21 19H3L12 4Z" />
        <path {...common} d="M12 9v4M12 16.5h.01" />
      </>}
      {name === "download" && <>
        <path {...common} d="M12 4.5v9" />
        <path {...common} d="M8.5 10.5 12 14l3.5-3.5" />
        <path {...common} d="M5 18.5h14" />
      </>}
      {name === "check" && <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="m8.5 12.5 2.5 2.5 4.5-5" />
      </>}
      {name === "close" && <>
        <path {...common} d="M7 7l10 10M17 7 7 17" />
      </>}
      {name === "clock" && <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="M12 8v4l3 2" />
      </>}
      {name === "eye" && <>
        <path {...common} d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
        <circle {...common} cx="12" cy="12" r="2.5" />
      </>}
      {name === "flash" && <>
        <path {...common} d="M13 2.5 5 13h5l-1 8.5 9-11h-5l1-8Z" />
      </>}
      {name === "lock" && <>
        <rect {...common} x="6.5" y="10" width="11" height="9" rx="2" />
        <path {...common} d="M8.5 10V8.5a3.5 3.5 0 0 1 7 0V10" />
      </>}
      {name === "note" && <>
        <path {...common} d="M6 4.5h9l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5.5A1 1 0 0 1 6 4.5Z" />
        <path {...common} d="M10 4.5V8h3.5" />
        <path {...common} d="M8 12h8M8 15h8" />
      </>}
      {name === "package" && <>
        <path {...common} d="M4.5 8 12 4l7.5 4-7.5 4-7.5-4Z" />
        <path {...common} d="M4.5 8V16l7.5 4 7.5-4V8" />
        <path {...common} d="M12 12v8" />
      </>}
      {name === "gear" && <>
        <circle {...common} cx="12" cy="12" r="3.2" />
        <path {...common} d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M16.8 7.2l1.6-1.6M5.6 18.4l1.6-1.6" />
      </>}
    </svg>
  );
}

const EMOJI_FONT = {
  fontFamily: '"Segoe UI Symbol","Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif',
};

export const SECTION_ICON_PREFIXES: Array<[string, UiIconName]> = [
  ["🖨", "printer"],
  ["🗂", "folder"],
  ["✂️", "scissors"],
  ["📐", "ruler"],
  ["📚", "book"],
  ["📝", "note"],
  ["📣", "flash"],
];

export const DICT_ICON_MAP: Record<string, UiIconName> = {
  "👤": "folder",
  "🖨": "printer",
  "📄": "file",
  "📅": "calendar",
  "🪪": "badge",
  "🟫": "package",
  "✏️": "clipboard",
  "✉️": "package",
  "🎨": "palette",
  "✂️": "scissors",
  "📚": "book",
  "✨": "sparkles",
  "📏": "ruler",
};

export function getSectionIcon(title: string): { icon: UiIconName | null; text: string } {
  for (const [prefix, icon] of SECTION_ICON_PREFIXES) {
    if (title.startsWith(prefix)) {
      return { icon, text: title.slice(prefix.length).trimStart() };
    }
  }
  return { icon: null, text: title };
}


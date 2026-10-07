import UiIcon, { getSectionIcon } from "./UiIcon";

export default function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  const parsed = getSectionIcon(title);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`px-4 py-2.5 bg-gradient-to-r ${accent || "from-slate-50 to-white"} border-b border-slate-100`}>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {parsed.icon && <UiIcon name={parsed.icon} className="h-4 w-4 text-slate-500" />}
          <span>{parsed.text}</span>
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}


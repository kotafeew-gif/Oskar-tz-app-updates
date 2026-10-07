import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import DictEditor from "./DictEditor";
import SpringSpecsEditor from "./SpringSpecsEditor";
import { selectClass, fieldClass, actionFieldClass } from "./fieldClasses";
import UiIcon from "./UiIcon";
import type { Dicts, ProductLayoutKind, ProductTemplateConfig, ProductTemplateFieldKey } from "../types";
import { PRODUCT_LAYOUT_OPTIONS, PRODUCT_LAYOUT_META, PRODUCT_TEMPLATE_FIELD_KEYS, DEFAULT_PRODUCT_TEMPLATE_FIELDS } from "../constants";
import { normalizeTemplateName } from "../utils";

export default function ProductTemplateEditor({
  productTypes,
  templates,
  onProductTypesChange,
  onChange,
}: {
  productTypes: string[];
  templates: ProductTemplateStore;
  onProductTypesChange: (next: string[]) => void;
  onChange: (next: ProductTemplateStore) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [renameDraft, setRenameDraft] = useState("");

  const rows = productTypes
    .map((name) => normalizeTemplateName(name))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "ru", { sensitivity: "base", numeric: true }));

  useEffect(() => {
    if (!rows.length) {
      setSelectedName("");
      return;
    }
    if (!selectedName || !rows.includes(selectedName)) {
      setSelectedName(rows[0]);
    }
  }, [rows, selectedName]);

  useEffect(() => {
    if (!showModal) setNewTypeName("");
  }, [showModal]);

  const activeName = selectedName || rows[0] || "";
  const activeTemplate = activeName
    ? templates[activeName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[activeName] || "standard")
    : null;

  useEffect(() => {
    setRenameDraft(activeName);
  }, [activeName]);

  const updateTemplate = (name: string, patch: Partial<ProductTemplateConfig>) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    const current = templates[cleanName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || "standard");
    const mergedFields = patch.fields ? { ...current.fields, ...(patch.fields || {}) } : current.fields;
    const nextTemplate = createProductTemplateConfig(patch.kind || current.kind, {
      ...current,
      ...patch,
      flags: { ...current.flags, ...(patch.flags || {}) },
      fields: mergedFields,
    });
    onChange({ ...templates, [cleanName]: nextTemplate });
  };

  const resetTemplate = (name: string) => {
    const cleanName = normalizeTemplateName(name);
    if (!cleanName) return;
    onChange({
      ...templates,
      [cleanName]: createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[cleanName] || "standard"),
    });
  };

  const addProductType = () => {
    const cleanName = normalizeTemplateName(newTypeName);
    if (!cleanName) return;
    if (rows.includes(cleanName)) {
      setSelectedName(cleanName);
      setShowModal(true);
      return;
    }
    onProductTypesChange([...productTypes, cleanName]);
    setSelectedName(cleanName);
    setNewTypeName("");
  };

  const renameProductType = () => {
    const oldName = normalizeTemplateName(activeName);
    const newName = normalizeTemplateName(renameDraft);
    if (!oldName || !newName || oldName === newName) return;
    if (rows.includes(newName)) return;
    const nextTypes = productTypes.map((name) => (normalizeTemplateName(name) === oldName ? newName : name));
    const nextTemplates = { ...templates };
    nextTemplates[newName] = nextTemplates[oldName] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[newName] || "standard");
    delete nextTemplates[oldName];
    onProductTypesChange(nextTypes);
    onChange(nextTemplates);
    setSelectedName(newName);
    setRenameDraft(newName);
  };

  const activeFlags = activeTemplate?.flags || DEFAULT_PRODUCT_TEMPLATE_FLAGS.standard;
  const activeFields = activeTemplate?.fields || createProductTemplateConfig(activeTemplate?.kind || "standard").fields;
  const enabledFields = [
    activeFlags.showSize ? activeFields.size.label || "Размер" : null,
    activeFlags.showPaper ? activeFields.paper.label || "Бумага" : null,
    activeFlags.showColor ? activeFields.color.label || "Цветность" : null,
    activeFlags.showLamination ? activeFields.lamination.label || "Ламинация" : null,
    activeFlags.showPostProcessing ? activeFields.postProcessing.label || "Обработка" : null,
  ].filter(Boolean) as string[];
  const layoutMeta = activeTemplate ? PRODUCT_LAYOUT_META[activeTemplate.kind] : PRODUCT_LAYOUT_META.standard;
  const fieldRows: Array<{ key: ProductTemplateFieldKey; title: string; desc: string }> = [
    { key: "size", title: "Размер / формат", desc: "Формат, размер или страницы, которые нужны этому изделию." },
    { key: "paper", title: "Бумага / материал", desc: "Тип бумаги, материал или плотность, если они используются." },
    { key: "color", title: "Цветность", desc: "Красочность и оборот, если это нужно показывать менеджеру." },
    { key: "lamination", title: "Ламинация", desc: "Параметры ламинации для этого типа продукции." },
    { key: "postProcessing", title: "Обработка", desc: "Биговка, фальцовка, перфорация и другие операции." },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 bg-gradient-to-r from-slate-50 to-white px-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
            <UiIcon name="settings" className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-800">Шаблоны продукции</div>
            <div className="mt-1 text-sm leading-6 text-slate-600">
              Отдельное окно для настройки, какие поля показывать у каждого вида изделий. Здесь удобнее править шаблоны, не перегружая справочники.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">{rows.length} шаблонов</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Сохраняется локально на ПК</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">Можно вернуть к стандарту</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Открыть конструктор
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
          <div
            className="relative z-10 flex h-[min(90vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <UiIcon name="settings" className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold">Конструктор шаблонов продукции</div>
                    <div className="mt-1 text-sm text-white/70">
                      Настраиваем внешний вид изделий, чтобы менеджеру показывались только нужные поля.
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Закрыть
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_1fr]">
              <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-slate-50/80 lg:border-b-0 lg:border-r">
                <div className="border-b border-slate-200 px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800">Список изделий</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Выберите изделие слева. Справа меняются только настройки выбранного шаблона.
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      {rows.length}
                    </span>
                  </div>
                  <div className="mt-3.5 flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                      placeholder="Новый тип изделия"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addProductType();
                      }}
                    />
                    <button
                      type="button"
                      onClick={addProductType}
                      disabled={!newTypeName.trim()}
                    className="shrink-0 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    + Добавить
                  </button>
                </div>
                  <div className="mt-2 text-[11px] leading-5 text-slate-500">
                    Новый тип сразу появится в списке и получит шаблон по умолчанию.
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                  {rows.map((name) => {
                    const template = templates[name] || createProductTemplateConfig(DEFAULT_PRODUCT_TEMPLATE_KINDS[name] || "standard");
                    const kindInfo = PRODUCT_LAYOUT_META[template.kind];
                    const isActive = name === activeName;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedName(name)}
                        className={`mb-2 w-full rounded-2xl border px-3.5 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-800">{name}</div>
                            <div className="mt-0.5 text-xs leading-5 text-slate-500">{kindInfo.title}</div>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {template.kind === "standard" ? "base" : "custom"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {!rows.length && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                      Сначала добавьте типы изделий в справочнике, потом здесь можно будет настроить их шаблоны.
                    </div>
                  )}
                </div>
              </aside>

              <section className="min-h-0 overflow-y-auto p-4 sm:p-5">
                {!activeTemplate ? (
                  <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <div className="max-w-md">
                      <div className="text-base font-semibold text-slate-800">Нет доступных шаблонов</div>
                      <div className="mt-2 text-sm leading-6 text-slate-500">
                        Добавьте хотя бы один тип изделия, и справа появятся настройки для его шаблона.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">{activeName}</h3>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              {layoutMeta.title}
                            </span>
                          </div>
                          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{layoutMeta.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => resetTemplate(activeName)}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          Сбросить
                        </button>
                      </div>
                      <div className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Включено:</span>{" "}
                        {enabledFields.length ? enabledFields.join(", ") : "ничего не выводится"}
                      </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_0.95fr]">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Название типа</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Здесь можно переименовать тип изделия прямо в справочнике.
                        </div>
                        <div className="mt-3 flex gap-2">
                          <input
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={renameProductType}
                            disabled={!renameDraft.trim() || renameDraft.trim() === activeName}
                            className="rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
                          >
                            Переименовать
                          </button>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Тип конструкции</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Определяет базовую логику шаблона и набор стандартных правил.
                        </div>
                        <select
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
                          value={activeTemplate.kind}
                          onChange={(e) => updateTemplate(activeName, { kind: e.target.value as ProductLayoutKind })}
                        >
                          {PRODUCT_LAYOUT_OPTIONS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-slate-900">Поля и обязательность</div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          Тут задаётся не только видимость поля, но и является ли оно обязательным для отправки.
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {fieldRows.map((item) => {
                          const visibleKey = ({
                            size: "showSize",
                            paper: "showPaper",
                            color: "showColor",
                            lamination: "showLamination",
                            postProcessing: "showPostProcessing",
                          } as const)[item.key];
                          const fieldConfig = activeFields[item.key] || DEFAULT_PRODUCT_TEMPLATE_FIELDS[item.key];
                          const isVisible = activeTemplate.flags[visibleKey];
                          return (
                            <div key={item.key} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 xl:grid-cols-[1.25fr_1fr_auto_auto] xl:items-center">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                                <div className="mt-0.5 text-xs leading-5 text-slate-500">{item.desc}</div>
                              </div>
                              <input
                                className="min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                                value={fieldConfig.label}
                                onChange={(e) =>
                                  updateTemplate(activeName, {
                                    fields: {
                                      [item.key]: { ...fieldConfig, label: e.target.value },
                                    } as Partial<Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>>,
                                  })
                                }
                              />
                              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  checked={isVisible}
                                  onChange={(e) =>
                                    updateTemplate(activeName, {
                                      flags: { [visibleKey]: e.target.checked } as Partial<ProductTemplateFlags>,
                                    })
                                  }
                                />
                                <span>Показывать</span>
                              </label>
                              <label className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${isVisible ? "border-slate-200 bg-white text-slate-700" : "border-slate-200 bg-slate-100 text-slate-400"}`}>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  checked={fieldConfig.required}
                                  disabled={!isVisible}
                                  onChange={(e) =>
                                    updateTemplate(activeName, {
                                      fields: {
                                        [item.key]: { ...fieldConfig, required: e.target.checked },
                                      } as Partial<Record<ProductTemplateFieldKey, ProductTemplateFieldConfig>>,
                                    })
                                  }
                                />
                                <span>Обязательное</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm font-semibold text-slate-900">Подсказка</div>
                        <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                          <p>Это окно заменяет старый блок в справочниках и позволяет не перегружать список настроек.</p>
                          <p>Если поле скрыто, оно автоматически перестаёт быть обязательным.</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Кратко сейчас</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {enabledFields.length ? (
                            enabledFields.map((item) => (
                              <span key={item} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500">Поля скрыты</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


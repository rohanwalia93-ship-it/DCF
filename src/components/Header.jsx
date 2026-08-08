import { useEffect, useRef, useState } from "react";

function DataMenu({ onExportJson, onImportClick, onResetToSample }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [
    { label: "Export workspace (JSON)", action: onExportJson },
    { label: "Import workspace…", action: onImportClick },
    { label: "Reset to sample data", action: onResetToSample, danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
        style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Data
        <svg width="10" height="10" viewBox="0 0 24 24" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg py-1.5 z-40"
          style={{ borderColor: "rgba(11,31,51,0.1)" }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.action();
              }}
              className="w-full text-left text-sm px-3.5 py-2 hover:bg-black/5"
              style={{ color: item.danger ? "var(--color-decline)" : "var(--color-ink-800)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({
  view,
  onViewChange,
  onOpenMethodology,
  onExportJson,
  onImportClick,
  onResetToSample,
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{ backgroundColor: "rgba(11,31,51,0.97)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 sm:h-16 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <svg width="24" height="24" viewBox="0 0 32 32" className="shrink-0 sm:w-[26px] sm:h-[26px]" aria-hidden="true">
            <path d="M16 4 L27 10 V22 L16 28 L5 22 V10 Z" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
            <circle cx="16" cy="16" r="4.5" fill="var(--color-accent)" />
          </svg>
          <div className="min-w-0">
            <h1 className="font-display font-semibold text-[13px] leading-tight sm:text-base text-white">
              <span className="sm:hidden">Partnership Assessment</span>
              <span className="hidden sm:inline">Strategic Partnership Assessment</span>
            </h1>
            <p className="hidden sm:block text-[11px] leading-tight truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
              Preliminary screening instrument · illustrative sample data
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <nav
            className="flex items-center rounded-full p-1 text-[11px] sm:text-sm font-medium"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            aria-label="View selector"
          >
            {[
              { full: "Deep Assessment", short: "Deep" },
              { full: "Comparison", short: "Compare" },
            ].map((v) => (
              <button
                key={v.full}
                type="button"
                onClick={() => onViewChange(v.full)}
                className="px-2.5 sm:px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: view === v.full ? "var(--color-accent)" : "transparent",
                  color: view === v.full ? "white" : "rgba(255,255,255,0.75)",
                }}
                aria-current={view === v.full ? "page" : undefined}
              >
                <span className="sm:hidden">{v.short}</span>
                <span className="hidden sm:inline">{v.full}</span>
              </button>
            ))}
          </nav>
          <div className="hidden sm:block">
            <DataMenu onExportJson={onExportJson} onImportClick={onImportClick} onResetToSample={onResetToSample} />
          </div>
          <button
            type="button"
            onClick={onOpenMethodology}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
          >
            How this works
          </button>
          <button
            type="button"
            onClick={onOpenMethodology}
            className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
            aria-label="How this works"
          >
            ?
          </button>
        </div>
      </div>
      <div className="sm:hidden flex justify-end px-3 pb-2 -mt-1">
        <DataMenu onExportJson={onExportJson} onImportClick={onImportClick} onResetToSample={onResetToSample} />
      </div>
    </header>
  );
}

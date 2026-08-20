
export function IntraMarkLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-red-500/70 bg-black/80 shadow-[0_0_24px_rgba(255,31,61,0.35)]">
        <img
          src="/logo.svg"
          alt="Logo IntraMark"
          width={48}
          height={48}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-[0.35em] text-white/90">INTRAMARK</p>
        <p className="text-[11px] uppercase tracking-[0.35em] text-red-400/90">
          Technology
        </p>
      </div>
    </div>
  );
}

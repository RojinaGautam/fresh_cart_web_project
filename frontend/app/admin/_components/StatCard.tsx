import { IconType } from "react-icons";

export default function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "emerald",
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: IconType;
  tone?: "emerald" | "blue" | "indigo" | "slate";
}) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-700 ring-emerald-100",
    blue: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    indigo: "bg-slate-100 text-slate-700 ring-slate-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
        >
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">
        {helper}
      </p>
    </article>
  );
}

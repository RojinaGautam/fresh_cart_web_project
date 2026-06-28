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
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
        >
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{helper}</p>
    </article>
  );
}

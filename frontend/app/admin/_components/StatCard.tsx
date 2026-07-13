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
    emerald: "bg-[#dfeadb] text-[#08743a] ring-[#d8e2d4]",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    indigo: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
  };

  return (
    <article className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#15251b]">{value}</p>
        </div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
        >
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 text-xs font-medium leading-5 text-slate-500">
        {helper}
      </p>
    </article>
  );
}

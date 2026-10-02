import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  growth: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

export default function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  color,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="
        group
        block
        bg-white dark:bg-slate-900
        rounded-3xl
        p-6 sm:p-7
        shadow-sm
        hover:shadow-xl
        border
        border-slate-200 dark:border-slate-800
        transition-all
        duration-300
        hover:-translate-y-1
        cursor-pointer
      " style={{ padding: "20px" }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-slate-900 dark:text-white">
            {value}
          </h2>

          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
            {growth} this month
          </p>
        </div>

        <div
          className={`
          w-16
          h-16
          rounded-2xl
          bg-gradient-to-r
          ${color}
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          group-hover:scale-105
          transition-transform
          duration-300
          `}
        >
          <Icon size={30} />
        </div>
      </div>
    </Link>
  );
}
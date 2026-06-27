import type { Classification } from "@/lib/types";
import { classColor, classLabel } from "@/lib/format";

export function ClassBadge({
  classification,
  size = "md",
}: {
  classification: Classification;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-xs";
  return (
    <span
      className={`grid ${dim} shrink-0 place-items-center rounded font-bold text-white`}
      style={{ background: classColor(classification) }}
      title={`Classificação: ${classLabel(classification)}`}
    >
      {classLabel(classification)}
    </span>
  );
}

import { libelleType } from "../lib/types";

export function TypeBadge({ type }: { type: string }) {
  return <span className={`type type-${type}`}>{libelleType(type)}</span>;
}

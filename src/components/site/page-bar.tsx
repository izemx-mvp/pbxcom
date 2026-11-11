import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./blocks";
import { GridBackground } from "./circuit";

/** Compact ink band under the header for pages without a full hero (product, cart, checkout). */
export function PageBar({ crumbs, children }: { crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <div className="surface-dark relative isolate overflow-hidden">
      <GridBackground className="-z-10 opacity-60" />
      <div className="container-wide pb-6 pt-[calc(var(--header-h)+20px)]">
        <Breadcrumbs items={crumbs} />
        {children}
      </div>
    </div>
  );
}

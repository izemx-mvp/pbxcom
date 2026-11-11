import { forwardRef, type MouseEventHandler, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

type AppLinkProps = {
  /** Any internal path, may include ?query and #hash — used for data-driven links. */
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
  tabIndex?: number;
  activeProps?: { className?: string; "data-active"?: string };
  activeOptions?: { exact?: boolean };
};

export function splitHref(href: string) {
  const [beforeHash, hash] = href.split("#");
  const [path, query] = (beforeHash ?? "").split("?");
  const search: Record<string, string> = {};
  if (query) new URLSearchParams(query).forEach((v, k) => (search[k] = v));
  return { path: path || "/", hash, search: query ? search : undefined };
}

/** Typed-route escape hatch for links whose target comes from data (search, chatbot, breadcrumbs). */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink({ href, ...props }, ref) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        ref={ref}
        href={href}
        className={props.className}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {props.children}
      </a>
    );
  }
  const { path, hash, search } = splitHref(href);
  return (
    <Link
      ref={ref}
      to={path as never}
      {...(hash ? { hash } : {})}
      {...(search ? { search: search as never } : {})}
      {...props}
    />
  );
});

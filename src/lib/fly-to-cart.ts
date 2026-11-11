/** Animates a small green node from the clicked element to the header cart icon. */
export function flyToCart(source: HTMLElement | null) {
  if (typeof window === "undefined" || !source) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]")).find((el) => el.offsetParent !== null);
  if (!target) return;

  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const dot = document.createElement("div");
  const size = 18;
  Object.assign(dot.style, {
    position: "fixed",
    left: `${s.left + s.width / 2 - size / 2}px`,
    top: `${s.top + s.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "999px",
    background: "var(--green)",
    boxShadow: "0 0 0 4px oklch(0.775 0.215 133 / 0.25), 0 0 24px oklch(0.775 0.215 133 / 0.8)",
    zIndex: "9999",
    pointerEvents: "none",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(dot);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  const anim = dot.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(1.1)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.35)`, opacity: 0.6 },
    ],
    { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  anim.onfinish = () => {
    dot.remove();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 300, easing: "ease-out" });
  };
}

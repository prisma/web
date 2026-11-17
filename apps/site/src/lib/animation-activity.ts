// Keep decorative animation work out of hidden tabs and offscreen sections.
// The callback owns its frame/listener cleanup; no React render is needed.
export function observeAnimationActivity(
  element: Element,
  onChange: (active: boolean) => void,
  mediaQuery = "(prefers-reduced-motion: no-preference)",
) {
  const media = window.matchMedia(mediaQuery);
  let inView = false;
  let active = false;

  const update = () => {
    const next = inView && media.matches && !document.hidden;
    if (next === active) return;
    active = next;
    onChange(active);
  };

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  media.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
    if (active) onChange(false);
  };
}

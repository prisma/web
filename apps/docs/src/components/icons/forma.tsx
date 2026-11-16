// Forma Thin icons (Icons8, platform forma-thin), ported from the site. Only the
// glyphs the docs use are kept; add more from the same set as needed.
// Fill-based 24x24 glyphs; color via currentColor, size via className (size-*).
// Do not mix with other icon libraries — see /brand style guide.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    fill: "currentColor",
    ...props,
  };
}

export function ArrowRightBold(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M 13.986328 3.9882812 A 1.250125 1.250125 0 0 0 13.115234 6.1347656 L 17.730469 10.75 L 3.25 10.75 A 1.250125 1.250125 0 1 0 3.25 13.25 L 17.730469 13.25 L 13.115234 17.865234 A 1.2512481 1.2512481 0 1 0 14.884766 19.634766 L 21.634766 12.884766 A 1.250125 1.250125 0 0 0 21.634766 11.115234 L 14.884766 4.3652344 A 1.250125 1.250125 0 0 0 13.986328 3.9882812 z" />
    </svg>
  );
}

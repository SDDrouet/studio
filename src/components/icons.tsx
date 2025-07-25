import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 15a6 6 0 0 0-6-6H4.5a1.5 1.5 0 0 0 0 3H6" />
      <path d="M12 9a6 6 0 0 1 6 6h1.5a1.5 1.5 0 0 1 0 3H18" />
      <path d="M18 15a6 6 0 0 0-6-6" />
      <path d="M6 9a6 6 0 0 1 6 6" />
      <path d="M12 21a6 6 0 0 0-6-6" />
      <path d="M12 21a6 6 0 0 1 6-6" />
    </svg>
  ),
};

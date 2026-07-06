import React from "react";

interface AndroidIconProps {
  className?: string;
}

/**
 * Android robot logo as an inline SVG so it can be sized/colored like a
 * lucide icon (e.g. `className="w-4 h-4"`). Uses `currentColor` so it inherits
 * the surrounding text color. lucide-react ships no Android icon.
 */
export const AndroidIcon: React.FC<AndroidIconProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.523 15.341a.998.998 0 0 1-.999-.998.998.998 0 1 1 .999.998m-11.046 0a.998.998 0 0 1-.999-.998.998.998 0 1 1 .999.998m11.405-6.02 1.997-3.46a.416.416 0 0 0-.152-.567.416.416 0 0 0-.568.152l-2.022 3.503A12.353 12.353 0 0 0 12 7.605c-1.834 0-3.57.421-5.137 1.176L4.841 5.446a.416.416 0 0 0-.568-.152.416.416 0 0 0-.152.567l1.997 3.46C2.678 11.164.29 14.618 0 18.71h24c-.29-4.092-2.678-7.546-6.118-9.389" />
    </svg>
  );
};

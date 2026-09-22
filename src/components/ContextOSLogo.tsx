import React from 'react';

interface ContextOSLogoProps {
  className?: string;
  height?: number;
}

export const ContextOSLogo: React.FC<ContextOSLogoProps> = ({
  className = 'h-7 w-auto',
  height = 28,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* ContextOS Vector Icon */}
      <svg
        viewBox="0 0 90 90"
        height={height}
        width={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="ContextOS Icon"
      >
        {/* Row 1 */}
        <rect x="5" y="10" width="80" height="7.5" rx="2" fill="currentColor" />
        {/* Row 2 */}
        <rect x="5" y="24" width="80" height="7.5" rx="2" fill="currentColor" />
        {/* Row 3 with Coral Orange Accent Block */}
        <rect x="5" y="38" width="22" height="7.5" rx="2" fill="currentColor" />
        <rect x="33" y="36.5" width="26" height="10.5" rx="3.5" fill="#FF7A59" />
        <rect x="65" y="38" width="20" height="7.5" rx="2" fill="currentColor" />
        {/* Row 4 */}
        <rect x="5" y="52" width="80" height="7.5" rx="2" fill="currentColor" />
        {/* Row 5 */}
        <rect x="5" y="66" width="80" height="7.5" rx="2" fill="currentColor" />
        {/* Row 6 */}
        <rect x="5" y="80" width="80" height="7.5" rx="2" fill="currentColor" />
      </svg>

      {/* ContextOS Wordmark */}
      <div className="flex items-baseline tracking-tight font-sans font-bold leading-none">
        <span className="text-xl tracking-tight text-zinc-900 dark:text-white">
          Context
        </span>
        <span className="text-xl tracking-tight text-[#FF7A59] ml-0.5">
          OS
        </span>
      </div>
    </div>
  );
};

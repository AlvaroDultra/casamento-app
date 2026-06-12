/** Divisor decorativo dourado com losango central — ar de papelaria de casamento. */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-primary/50" />
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden>
        <path
          d="M12 2 L15 12 L12 22 L9 12 Z M2 12 L12 9 L22 12 L12 15 Z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
      <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-primary/50" />
    </div>
  );
}

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function InitialSiteLoader({ isFadingOut = false }) {
  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white select-none transition-opacity duration-500 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Simatrix Academy"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Lottie Animation */}
        <div className="h-44 w-44 sm:h-56 sm:w-56 md:h-64 md:w-64">
          <DotLottieReact
            src="/loading.lottie"
            loop
            autoplay
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

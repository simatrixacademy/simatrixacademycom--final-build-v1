import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function PageLoader({ compact = false }) {
  return (
    <div
      className={`${
        compact
          ? "relative min-h-[16rem] w-full"
          : "fixed inset-0 z-[9999] min-h-screen w-screen"
      } flex flex-col items-center justify-center bg-white px-6 select-none`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative h-40 w-40 sm:h-52 sm:w-52">
        <DotLottieReact
          src="/loading.lottie"
          loop
          autoplay
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

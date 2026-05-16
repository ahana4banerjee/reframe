"use client";

import { useEffect, useState } from "react";
import { ExportStatus } from "@/lib/types";
import LottiePlayer from "./LottiePlayer";

interface Props {
  status: ExportStatus;
  progress: number;
}

export default function ExportOverlay({ status, progress }: Props) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  const visible = status === "loading-engine" || status === "exporting";
  if (!visible) return null;

  const isLoading = status === "loading-engine";

  useEffect(() => {
    let mounted = true;

    import("@/lib/lottie/spinner.json").then((data) => {
      if (mounted) {
        setAnimationData(data.default);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center space-y-6 max-w-xs px-6 animate-fade-in">

        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          {animationData ? (
            <LottiePlayer animationData={animationData} loop autoplay />
          ) : (
            <div className="w-20 h-20 animate-pulse rounded-full bg-film-100" />
          )}
        </div>

        <div>
          <h2 className="font-heading font-bold text-xl tracking-tight text-[var(--text)]">
            {isLoading ? "Loading engine" : "Exporting"}
          </h2>

          <p className="text-sm text-[var(--muted)] mt-1">
            {isLoading
              ? "Setting up the video engine. This only happens once."
              : "Processing your video locally."}
          </p>

          <p className="text-xs font-heading font-semibold text-film-600 mt-2 uppercase tracking-wide">
            Do not close or refresh this tab
          </p>
        </div>

        {status === "exporting" && (
          <div className="w-full space-y-2">
            <div className="h-1 w-full bg-film-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-film-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs font-heading font-semibold text-[var(--muted)]">
              {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
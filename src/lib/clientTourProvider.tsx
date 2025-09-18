"use client";

import { useEffect, ReactNode } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { steps } from "@/app/constant/steps";

interface ClientTourProviderProps {
  children: ReactNode;
}

function TourController({ children }: { children: ReactNode }) {
  const { setIsOpen } = useTour();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      // Delay a bit so targets are mounted
      const timeout = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("hasSeenTour", "true");
      }, 500); // adjust delay as needed

      return () => clearTimeout(timeout);
    }
  }, [setIsOpen]);

  return <>{children}</>;
}

export default function ClientTourProvider({
  children,
}: ClientTourProviderProps) {
  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({
          ...base,
          maxWidth: "700px",
          padding: "20px",
          borderRadius: "12px",
          position: "fixed",
          top: "55%", // a bit below the vertical center (50% = exact center)
          left: "50%", // center horizontally
          transform: "translate(-50%, -50%)", // re-center based on width/height
        }),
      }}
    >
      <TourController>{children}</TourController>
    </TourProvider>
  );
}

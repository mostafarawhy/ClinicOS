import { Stethoscope } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Stethoscope className="h-8 w-8 text-primary-foreground" />

          <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/30" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-sm font-medium text-foreground">Signing in</p>
          <p className="text-xs text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}

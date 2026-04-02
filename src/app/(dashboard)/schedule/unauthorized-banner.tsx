"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

export function UnauthorizedBanner() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasParam = params.get("unauthorized") === "true";

    if (!hasParam) return;

    setVisible(true);

    const urlTimer = setTimeout(() => {
      router.replace(window.location.pathname, { scroll: false });
    }, 3500);

    return () => {
      clearTimeout(urlTimer);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div className="mb-5 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
      <ShieldX className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-sm text-destructive font-medium">
        You don&apos;t have permission to the page you are trying to access.
      </p>
    </div>
  );
}

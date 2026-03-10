"use client";

import dynamic from "next/dynamic";

export const Assistant = dynamic(() => import("./Assistant").then((m) => m.Assistant), {
  ssr: false,
});

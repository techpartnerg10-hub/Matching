"use client";

import { useEffect } from "react";
import { initDb } from "@/lib/storage";

export function DemoInit() {
  useEffect(() => {
    initDb();
  }, []);

  return null;
}



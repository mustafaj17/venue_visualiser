"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateItemModal from "./create-item-modal";

export default function DashboardActionsClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="default"
        rounded="full"
        className="text-sm font-medium min-w-[120px]"
      >
        Bulk Upload
      </Button>

      <Button
        variant="cta"
        size="default"
        rounded="full"
        className="text-sm font-medium min-w-[120px]"
        onClick={() => setOpen(true)}
      >
        + Add Item
      </Button>

      <CreateItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

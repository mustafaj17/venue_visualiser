"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateItemModal from "./create-item-modal";

export default function DashboardActionsClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex items-center gap-3'>
      <Button variant='outline' size='sm' className='rounded-full'>
        Bulk Upload
      </Button>

      <Button
        className='rounded-full bg-black text-white px-4 py-2'
        onClick={() => setOpen(true)}
      >
        + Add Item
      </Button>

      <CreateItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

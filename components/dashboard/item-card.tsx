"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemApi } from "@/lib/frontend/api";
import dynamic from "next/dynamic";

export interface ItemCardProps {
  id: number;
  title: string;
  subtitle?: string;
}

const EditItemModal = dynamic(() => import("./edit-item-modal"), {
  ssr: false,
});

export default function ItemCard({ id, title, subtitle }: ItemCardProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => deleteItemApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
    },
  });

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  const handleDelete = () => {
    // Simple confirm to prevent accidental deletes
    if (confirm("Delete this item?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        rounded="full"
        className="absolute top-2 right-2"
        aria-label="Delete item"
        title="Delete item"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "…" : "×"}
      </Button>
      <div className="h-40 w-full bg-gray-50 flex items-center justify-center text-gray-400">
        <span className="text-xl">🖼️</span> {/* {thumbnail} */}
      </div>

      <div className="p-6">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              rounded="full"
              onClick={openEdit}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
      <EditItemModal
        open={isEditOpen}
        onClose={closeEdit}
        id={id}
        initialName={title}
        initialDescription={subtitle}
      />
    </div>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemApi, type UpdateItemInput } from "@/lib/frontend/api";
import { toast } from "sonner";

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  initialName: string;
  initialDescription?: string;
}

export default function EditItemModal({
  open,
  onClose,
  id,
  initialName,
  initialDescription,
}: EditItemModalProps) {
  const [name, setName] = React.useState(initialName ?? "");
  const [description, setDescription] = React.useState(
    initialDescription ?? ""
  );
  const [showErrors, setShowErrors] = React.useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (open) {
      setName(initialName ?? "");
      setDescription(initialDescription ?? "");
      setShowErrors(false);
    }
  }, [open, initialName, initialDescription]);

  const updateMutation = useMutation({
    mutationFn: async (updates: UpdateItemInput) => updateItemApi(id, updates),
    onSuccess: () => {
      toast.success("Item updated");
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
      onClose();
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("[MODAL] update item error", err);
      const anyErr = err as any;
      const status = anyErr?.response?.status as number | undefined;
      const serverMessage: string | undefined = anyErr?.response?.data?.error;
      if (status === 400) {
        toast.error(serverMessage ?? "Invalid input");
        return;
      }
      if (status === 404) {
        toast.error("Item not found");
        return;
      }
      toast.error("Failed to update item");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameValue = name.trim();
    const descriptionValue = description.trim();
    if (!nameValue || !descriptionValue) {
      setShowErrors(true);
      toast.error("Name and description are required");
      return;
    }
    updateMutation.mutate({ name: nameValue, description: descriptionValue });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium">Edit item</h2>
        <p className="text-sm text-gray-500 mt-1">Update item details.</p>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-900"
              >
                Name
              </label>
            </div>
            <Input
              id="name"
              name="name"
              placeholder="Enter name"
              required
              aria-required="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={showErrors && !name.trim()}
              aria-describedby="name-error"
              error={showErrors && !name.trim()}
            />
            {showErrors && !name.trim() ? (
              <p id="name-error" className="text-xs text-red-600">
                Please enter a name
              </p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-900"
              >
                Description
              </label>
            </div>
            <Input
              id="description"
              name="description"
              placeholder="Enter description"
              required
              aria-required="true"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={showErrors && !description.trim()}
              aria-describedby="description-error"
              error={showErrors && !description.trim()}
            />
            {showErrors && !description.trim() ? (
              <p id="description-error" className="text-xs text-red-600">
                Please enter a description
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              rounded="full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              rounded="full"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

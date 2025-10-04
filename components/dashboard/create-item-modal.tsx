"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItemApi } from "@/lib/frontend/api";
import { toast } from "sonner";

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateItemModal({
  open,
  onClose,
}: CreateItemModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [showErrors, setShowErrors] = React.useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createItemApi,
    onSuccess: () => {
      // eslint-disable-next-line no-console
      console.log("[MODAL] create item success");
      toast.success("Item created");
      setName("");
      setDescription("");
      setShowErrors(false);
      // Refresh the items list on dashboard
      queryClient.invalidateQueries({ queryKey: ["items", "me"] });
      onClose();
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("[MODAL] create item error", err);
      const anyErr = err as any;
      const status = anyErr?.response?.status as number | undefined;
      const serverMessage: string | undefined = anyErr?.response?.data?.error;
      if (status === 409) {
        toast.warning("Item already exists");
        return;
      }
      if (status === 400) {
        toast.error(serverMessage ?? "Invalid input");
        return;
      }
      toast.error("Failed to create item");
    },
  });

  /**
   * Handle form submission:
   * - Prevent default browser submit
   * - Read input values
   * - Validate required fields (name, description)
   * - If valid, call API mutation to create item
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameValue = String(formData.get("name") || "").trim();
    const descriptionValue = String(formData.get("description") || "").trim();
    if (!nameValue || !descriptionValue) {
      setShowErrors(true);
      toast.error("Name and description are required");
      return;
    }
    createMutation.mutate({ name: nameValue, description: descriptionValue });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium">Create item</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please fill in the required fields.
        </p>

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

          <div className="grid gap-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-900">Image</span>
              <span className="text-xs text-gray-500">Optional</span>
            </div>
            <div className="h-32 w-full bg-gray-100 flex items-center justify-center text-gray-400 rounded-md border border-dashed">
              <span>Image upload placeholder</span>
            </div>
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

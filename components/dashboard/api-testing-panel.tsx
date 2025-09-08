"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  createItemApi,
  getItems,
  type CreateItemInput,
} from "@/lib/frontend/api";

export default function ApiTestingPanel() {
  const [itemId, setItemId] = useState("");
  const { refetch, isFetching } = useQuery({
    queryKey: ["items", itemId],
    queryFn: () => getItems(itemId || undefined),
    enabled: false,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  async function handleGetAllItemsClick() {
    // eslint-disable-next-line no-console
    console.log("[GET ITEMS] fetching", { id: itemId || undefined });
    const result = await refetch();
    if (result.error) {
      // eslint-disable-next-line no-console
      console.error("[GET ITEMS] error", result.error);
    } else {
      // eslint-disable-next-line no-console
      console.log("[GET ITEMS] success", result.data);
    }
  }

  // TODO: MOVE USER ID TO SERVER
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isInvalidSubmitLocked, setIsInvalidSubmitLocked] = useState(false);

  function handleInvalidAttempt() {
    const message =
      "Please fill in Name, Description, and User ID before submitting.";
    setFormError(message);
    if (!isInvalidSubmitLocked) {
      toast.error(message);
      setIsInvalidSubmitLocked(true);
      window.setTimeout(() => setIsInvalidSubmitLocked(false), 3000);
    }
  }

  const createMutation = useMutation({
    mutationFn: (input: CreateItemInput) => createItemApi(input),
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log("[CREATE ITEM] success", data);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error("[CREATE ITEM] error", err);
      const anyErr = err as any;
      const status = anyErr?.response?.status as number | undefined;
      const serverMessage: string | undefined = anyErr?.response?.data?.error;

      if (
        status === 409 ||
        serverMessage?.toLowerCase?.().includes("already exists")
      ) {
        toast.warning("Item already exists", {
          description: "Duplicate entries are not allowed.",
        });
        return;
      }

      if (status === 400) {
        toast.error(
          serverMessage ??
            "Invalid input. Please check the fields and try again."
        );
        return;
      }

      toast.error("Failed to create item", {
        description:
          serverMessage ??
          (anyErr?.message as string | undefined) ??
          "Unexpected error occurred.",
      });
    },
  });

  function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isValid = Boolean(
      name.trim().length && description.trim().length && userId.trim().length
    );
    if (!isValid) {
      handleInvalidAttempt();
      return;
    }
    setFormError(null);
    createMutation.mutate({ name, description, userId });
  }

  return (
    <section className='mt-8 w-full rounded-lg border border-gray-200 p-4'>
      <h2 className='text-lg font-medium'>API testing</h2>
      <p className='mt-1 text-sm text-gray-500'>
        Quickly try API actions with controlled inputs.
      </p>

      <div className='mt-4 grid gap-3'>
        <div className='mt-2 flex items-center gap-2'>
          <div className='w-40'>
            <Input
              type='text'
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder='Enter id'
            />
          </div>
          <Button
            type='button'
            onClick={handleGetAllItemsClick}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Get by ID"}
          </Button>
        </div>

        <form
          className='mt-6 grid max-w-md gap-3'
          onSubmit={handleCreateSubmit}
          noValidate
        >
          <h3 className='text-md font-medium'>Create item</h3>
          <Input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const isValid = Boolean(
                  name.trim().length &&
                    description.trim().length &&
                    userId.trim().length
                );
                if (!isValid) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInvalidAttempt();
                } else {
                  setFormError(null);
                }
              }
            }}
            placeholder='Name'
          />
          <Input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const isValid = Boolean(
                  name.trim().length &&
                    description.trim().length &&
                    userId.trim().length
                );
                if (!isValid) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInvalidAttempt();
                } else {
                  setFormError(null);
                }
              }
            }}
            placeholder='Description'
          />
          <Input
            type='text'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const isValid = Boolean(
                  name.trim().length &&
                    description.trim().length &&
                    userId.trim().length
                );
                if (!isValid) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInvalidAttempt();
                } else {
                  setFormError(null);
                }
              }
            }}
            placeholder='User ID'
          />
          <Button
            type='submit'
            disabled={
              createMutation.isPending ||
              (!Boolean(
                name.trim().length &&
                  description.trim().length &&
                  userId.trim().length
              ) &&
                isInvalidSubmitLocked)
            }
          >
            {createMutation.isPending ? "Creating..." : "Create item"}
          </Button>

          {/* Keep formError state to prevent off-form error flashes, but rely on toast for display */}
        </form>

        {/* Response preview removed; using console logs for simplicity */}
      </div>
    </section>
  );
}

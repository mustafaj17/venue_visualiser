"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  createItemApi,
  getItems,
  type CreateItemInput,
} from "@/lib/frontend/api";

export default function ApiTestingPanel() {
  const [itemId, setItemId] = useState("");

  const { data, error, isPending, isError, isSuccess, refetch, isFetching } =
    useQuery({
      queryKey: ["items", itemId],
      queryFn: () => getItems(itemId || undefined),
      enabled: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  function handleGetAllItemsClick() {
    void refetch();
  }

  // TODO: MOVE USER ID TO SERVER
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");

  const createMutation = useMutation({
    mutationFn: (input: CreateItemInput) => createItemApi(input),
  });

  function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createMutation.mutate({ name, description, userId });
  }

  let responsePreview = "\n// Response will appear here\n";
  if (isError) {
    const message = error instanceof Error ? error.message : String(error);
    responsePreview = JSON.stringify({ ok: false, error: message }, null, 2);
  } else if (isSuccess) {
    responsePreview = JSON.stringify({ ok: true, data }, null, 2);
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
            placeholder='Name'
          />
          <Input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
          />
          <Input
            type='text'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder='User ID'
          />
          <Button type='submit' disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create item"}
          </Button>

          {createMutation.isError ? (
            <p className='text-sm text-red-600'>
              {(createMutation.error as Error)?.message ??
                "Failed to create item"}
            </p>
          ) : null}
        </form>

        <div className='mt-4'>
          <label
            className='text-sm font-medium text-gray-700'
            htmlFor='response-preview'
          >
            Response preview
          </label>
          <pre
            id='response-preview'
            className='mt-2 h-60 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-800'
          >
            {responsePreview}
          </pre>
        </div>
      </div>
    </section>
  );
}

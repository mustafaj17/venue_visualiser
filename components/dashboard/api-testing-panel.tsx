"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/lib/api";

export default function ApiTestingPanel() {
  const { data, error, isPending, isError, isSuccess, refetch, isFetching } =
    useQuery({
      queryKey: ["items"],
      queryFn: getItems,
      enabled: false,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  function handleGetAllItemsClick() {
    void refetch();
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
          <Button
            type='button'
            onClick={handleGetAllItemsClick}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Get all items"}
          </Button>
        </div>

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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ApiTestingPanel() {
  const [endpoint, setEndpoint] = useState("/api/items");
  const [responsePreview, setResponsePreview] = useState(
    "\n// Response will appear here\n"
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleGetAllItemsClick() {
    setIsLoading(true);
    try {
      const res = await fetch(endpoint, { method: "GET" });
      const contentType = res.headers.get("content-type") || "";
      let body: unknown | string;
      if (contentType.includes("application/json")) {
        body = await res.json();
      } else {
        body = await res.text();
      }
      const output = {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: {
          "content-type": contentType,
        },
        body,
      } as const;
      setResponsePreview(
        typeof body === "string"
          ? `${JSON.stringify(
              { ...output, body: undefined },
              null,
              2
            )}\n\n${body}`
          : JSON.stringify(output, null, 2)
      );
    } catch (error) {
      setResponsePreview(
        JSON.stringify(
          {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className='mt-8 w-full rounded-lg border border-gray-200 p-4'>
      <h2 className='text-lg font-medium'>API testing</h2>
      <p className='mt-1 text-sm text-gray-500'>
        Quickly try API actions with controlled inputs.
      </p>

      <div className='mt-4 grid gap-3'>
        <label
          className='text-sm font-medium text-gray-700'
          htmlFor='endpoint-input'
        >
          Endpoint
        </label>
        <input
          id='endpoint-input'
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black'
          placeholder='/api/items'
        />

        <div className='mt-2 flex items-center gap-2'>
          <Button
            type='button'
            onClick={handleGetAllItemsClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get all items"}
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

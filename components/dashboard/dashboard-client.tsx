"use client";

import React from "react";
import DashboardActionsClient from "./dashboard-actions-client";
import ItemCard from "./item-card";
import { useQuery } from "@tanstack/react-query";
import { fetchMyItems, type ItemDto } from "@/lib/frontend/api";

export default function DashboardClient() {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery<ItemDto[]>({
    queryKey: ["items", "me"],
    queryFn: fetchMyItems,
    staleTime: 30_000,
  });

  return (
    <div className="mt-8 w-full">
      {isLoading ? (
        <p className="text-base text-gray-500 mt-4">Loading items…</p>
      ) : isError ? (
        <p className="text-base text-red-600 mt-4">Failed to load items</p>
      ) : items && items.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.name}
              subtitle={item.description}
            />
          ))}
        </div>
      ) : (
        <p className="text-base text-gray-500 mt-4">
          No items yet. Create your first item.
        </p>
      )}
    </div>
  );
}

export function DashboardHeaderActions() {
  return (
    <div>
      <DashboardActionsClient />
    </div>
  );
}

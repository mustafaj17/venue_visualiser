"use client";

import React from "react";
import DashboardActionsClient from "./dashboard-actions-client";
import ItemCard from "./item-card";

export default function DashboardClient() {
  return (
    <div className='mt-8 w-full'>
      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        <ItemCard title='Executive Office Chair' subtitle='' />
        <ItemCard title='Conference Table' subtitle='' />
        <ItemCard title='Crystal Centerpiece' subtitle='' />
        <ItemCard title='Dining Chair Set' subtitle='' />

        <ItemCard title='Round Coffee Table' subtitle='' />
        <ItemCard title='Floral Arrangement' subtitle='' />
      </div>
    </div>
  );
}

export function DashboardHeaderActions() {
  return (
    <div className='pt-1'>
      <DashboardActionsClient />
    </div>
  );
}

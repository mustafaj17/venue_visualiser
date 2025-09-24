"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface ItemCardProps {
  title: string;
  subtitle?: string;
}

export default function ItemCard({ title, subtitle }: ItemCardProps) {
  return (
    <div className='relative rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden'>
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2 rounded-full'
        aria-label='Delete item'
        title='Delete item'
      >
        ×
      </Button>
      <div className='h-40 w-full bg-gray-50 flex items-center justify-center text-gray-400'>
        <span className='text-xl'>🖼️</span>
      </div>

      <div className='p-6'>
        <h3 className='text-sm font-semibold'>{title}</h3>
        {subtitle ? (
          <p className='text-xs text-gray-500 mt-2'>{subtitle}</p>
        ) : null}

        <div className='mt-4 flex items-center justify-end'>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='rounded-full'>
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

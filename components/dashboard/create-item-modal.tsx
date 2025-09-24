"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateItemModal({
  open,
  onClose,
}: CreateItemModalProps) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6'>
        <h2 className='text-lg font-medium'>Create item</h2>
        <p className='text-sm text-gray-500 mt-1'>
          Visual-only modal — inputs are placeholders.
        </p>

        <form className='mt-4 grid gap-3'>
          <Input placeholder='Name' />
          <Input placeholder='Short description' />
          <Input placeholder='Long description' />
          <div className='h-32 w-full bg-gray-100 flex items-center justify-center text-gray-400'>
            <span>Image upload placeholder</span>
          </div>

          <div className='flex items-center justify-end gap-2 mt-4'>
            <Button
              variant='ghost'
              type='button'
              onClick={onClose}
              className='rounded-full'
            >
              Cancel
            </Button>
            <Button type='button' className='rounded-full'>
              Create (placeholder)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

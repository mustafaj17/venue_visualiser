import axios from "axios";

export async function getItems(id?: string): Promise<any> {
  const response = await axios.get("/api/items", {
    params: id ? { id } : undefined,
  });
  return response.data;
}

export type CreateItemInput = {
  name: string;
  description: string;
};

export async function createItemApi(input: CreateItemInput): Promise<any> {
  const response = await axios.post("/api/items", input);
  return response.data;
}

export type ItemDto = {
  id: number;
  name: string;
  description: string;
  userId: string;
};

export async function fetchMyItems(): Promise<ItemDto[]> {
  const { data } = await axios.get("/api/items");
  if (data?.ok && Array.isArray(data.items)) {
    return data.items as ItemDto[];
  }
  return [];
}

export async function deleteItemApi(id: number): Promise<void> {
  await axios.delete("/api/items", { params: { id } });
}

export type UpdateItemInput = {
  name?: string;
  description?: string;
};

export async function updateItemApi(
  id: number,
  updates: UpdateItemInput
): Promise<ItemDto> {
  const { data } = await axios.patch("/api/items", updates, {
    params: { id },
  });
  return data.item as ItemDto;
}

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
  userId: string;
};

export async function createItemApi(input: CreateItemInput): Promise<any> {
  const response = await axios.post("/api/items", input);
  return response.data;
}

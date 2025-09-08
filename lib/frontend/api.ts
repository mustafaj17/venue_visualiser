import axios from "axios";

export async function getItems(id?: string): Promise<any> {
  const response = await axios.get("/api/items", {
    params: id ? { id } : undefined,
  });
  return response.data;
}

import axios from "axios";

export async function getItems(): Promise<any> {
  const response = await axios.get("/api/items");
  return response.data;
}

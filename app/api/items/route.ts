export async function GET() {
  return Response.json({ items: [{ id: 1, name: "Hello, world!" }] });
}

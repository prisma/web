import { mcpDiscoveryResponse } from "@/lib/mcp-discovery";

export const revalidate = false;

export function GET() {
  return mcpDiscoveryResponse();
}

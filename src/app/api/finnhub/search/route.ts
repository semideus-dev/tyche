import { NextResponse } from "next/server";
import { FINNHUB_API_KEY } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  if (!FINNHUB_API_KEY) {
    return NextResponse.json({ error: "API key not found" }, { status: 500 });
  }

  const url = new URL("https://finnhub.io/api/v1/search");
  url.searchParams.append("q", query);
  url.searchParams.append("token", FINNHUB_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

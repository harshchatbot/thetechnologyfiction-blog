import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.redirect(new URL("/admin/posts", request.url));
  }

  return NextResponse.redirect(new URL(`/blog/${slug}`, request.url));
}

import { NextRequest, NextResponse } from "next/server";

const CV_FILE_NAME = "Dery-Ferdika-CV.pdf";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const sourceUrl = new URL("/cv.pdf", origin);

  const sourceResponse = await fetch(sourceUrl, { cache: "no-store" });
  if (!sourceResponse.ok) {
    return NextResponse.json({ error: "CV file is unavailable" }, { status: 404 });
  }

  const fileBuffer = await sourceResponse.arrayBuffer();

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${CV_FILE_NAME}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

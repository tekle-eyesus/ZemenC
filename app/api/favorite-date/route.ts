import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  if (!payload || typeof payload === "string" || !("userId" in payload) || !payload.userId) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
  const favorite = await prisma.favoriteDate.create({
    data: {
      userId: payload.userId,
      ethiopianDay: data.ethiopianDay,
      ethiopianMonth: data.ethiopianMonth,
      ethiopianYear: data.ethiopianYear,
      gregorianDay: data.gregorianDay,
      gregorianMonth: data.gregorianMonth,
      gregorianYear: data.gregorianYear,
      note: data.note,
    },
  });
  return NextResponse.json(favorite);
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  if (!payload || typeof payload === "string" || !("userId" in payload) || !payload.userId) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
  // Only allow editing notes for user's own favorite date
  const updated = await prisma.favoriteDate.updateMany({
    where: {
      id: data.id,
      userId: payload.userId,
    },
    data: {
      note: data.note,
    },
  });
  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  if (!payload || typeof payload === "string" || !("userId" in payload) || !payload.userId) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
  // Only allow deleting user's own favorite date
  const deleted = await prisma.favoriteDate.deleteMany({
    where: {
      id: data.id,
      userId: payload.userId,
    },
  });
  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }
  const payload = verifyToken(token);
  if (!payload || typeof payload === "string" || !("userId" in payload) || !payload.userId) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
  // Fetch all favorite dates for the logged-in user
  const favorites = await prisma.favoriteDate.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites);
}
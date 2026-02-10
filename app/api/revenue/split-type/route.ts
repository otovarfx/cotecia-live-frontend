// /app/api/revenue/split-type/route.ts
// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — VALIDACIÓN
// ---------------------------------------------

function validateSplits(splits: any[]) {
  if (!Array.isArray(splits)) return "splits debe ser un array";

  for (const s of splits) {
    if (!s.userId) return "Falta userId";
    if (!s.role) return "Falta role";
    if (!s.type) return "Falta type";
    if (typeof s.percent !== "number") return "percent debe ser número";
    if (s.percent < 0 || s.percent > 100) return "percent debe estar entre 0 y 100";
  }

  return null;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — POST: GUARDAR SPLIT POR TIPO
// ---------------------------------------------

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { splits } = body;

    const error = validateSplits(splits);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // borrar splits anteriores del host
    await db.revenueSplitByType.deleteMany({
      where: { hostId: user.id },
    });

    // guardar nuevos
    for (const s of splits) {
      await db.revenueSplitByType.create({
        data: {
          hostId: user.id,
          userId: s.userId,
          role: s.role,
          percent: s.percent,
          type: s.type,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error guardando split por tipo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — GET: OBTENER SPLIT POR TIPO
// ---------------------------------------------

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const splits = await db.revenueSplitByType.findMany({
      where: { hostId: user.id },
      include: {
        user: true, // útil para mostrar nombre/foto en UI
      },
    });

    return NextResponse.json({ splits });
  } catch (error) {
    console.error("Error obteniendo split por tipo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// FINAL DEL BLOQUE 4
// FINAL DEL ARCHIVO

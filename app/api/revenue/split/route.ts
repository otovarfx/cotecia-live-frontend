// /app/api/revenue/split/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ---------------------------------------------
// BLOQUE 1 — IMPORTS
// ---------------------------------------------

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// FINAL DEL BLOQUE 1



// ---------------------------------------------
// BLOQUE 2 — VALIDACIONES INSTITUCIONALES
// ---------------------------------------------

function validateSplits(splits: any[]) {
  if (!Array.isArray(splits)) {
    return "Formato inválido: splits debe ser un array";
  }

  for (const s of splits) {
    if (!s.userId) return "Falta userId en un split";
    if (!s.role) return "Falta role en un split";
    if (typeof s.percent !== "number") return "percent debe ser número";
    if (s.percent < 0 || s.percent > 100) return "percent debe estar entre 0 y 100";
  }

  const total = splits.reduce((acc, s) => acc + s.percent, 0);
  if (total > 100) return "La suma de porcentajes no puede superar 100%";

  return null;
}

// FINAL DEL BLOQUE 2



// ---------------------------------------------
// BLOQUE 3 — POST: GUARDAR SPLIT REVENUE PRO
// ---------------------------------------------

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // IMPORT DINÁMICO — evita romper el build
    const { db } = await import("@/lib/db");

    const body = await req.json();
    const { splits } = body;

    const error = validateSplits(splits);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Borrar splits anteriores del host
    await db.revenueSplit.deleteMany({
      where: { hostId: user.id },
    });

    // Guardar nuevos splits
    for (const s of splits) {
      await db.revenueSplit.create({
        data: {
          hostId: user.id,
          userId: s.userId,
          role: s.role,
          percent: s.percent,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error guardando Split Revenue PRO:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// FINAL DEL BLOQUE 3



// ---------------------------------------------
// BLOQUE 4 — GET: OBTENER SPLIT REVENUE PRO
// ---------------------------------------------

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // IMPORT DINÁMICO — evita romper el build
    const { db } = await import("@/lib/db");

    const splits = await db.revenueSplit.findMany({
      where: { hostId: user.id },
      include: {
        user: true, // útil para UI: nombre, foto, email
      },
    });

    return NextResponse.json({ splits });
  } catch (error) {
    console.error("Error obteniendo Split Revenue PRO:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// FINAL DEL BLOQUE 4
// FINAL DEL ARCHIVO

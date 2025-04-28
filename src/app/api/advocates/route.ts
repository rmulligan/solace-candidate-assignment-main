import { NextRequest } from "next/server";
import db from "../../../db";
import type { Advocate } from '@/types';
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { sql } from "drizzle-orm";
import { buildSearchCondition, filterAdvocatesMock } from "./searchHelpers";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() || "";
  const specialties = searchParams.getAll("specialty");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    if (process.env.DATABASE_URL) {
      let query = db.select().from(advocates);
      if (search) {
        query = query.where(buildSearchCondition(search));
      }
      if (specialties.length > 0) {
        specialties.forEach((spec) => {
          query = query.where(sql`${advocates.specialties} @> ${JSON.stringify([spec])}::jsonb`);
        });
      }

      // Count total matching rows
      let totalQuery = db.select({ count: sql`count(*)` }).from(advocates);
      if (search) {
        totalQuery = totalQuery.where(buildSearchCondition(search));
      }
      if (specialties.length > 0) {
        specialties.forEach((spec) => {
          totalQuery = totalQuery.where(sql`${advocates.specialties} @> ${JSON.stringify([spec])}::jsonb`);
        });
      }
      const totalResult = await totalQuery.execute();
      const total = Number(totalResult[0].count);

      const data = await query.limit(limit).offset(offset).execute();
      return Response.json({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else {
      // Mock data filtering & pagination
      // advocateData may lack 'id', cast to Advocate[] for consistency
      let filtered: Advocate[] = search
        ? filterAdvocatesMock(advocateData as Advocate[], search)
        : (advocateData as Advocate[]);
      if (specialties.length > 0) {
        filtered = filtered.filter((adv) =>
          specialties.some((spec) => adv.specialties.includes(spec))
        );
      }
      const total = filtered.length;
      const data = filtered.slice(offset, offset + limit);
      return Response.json({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}

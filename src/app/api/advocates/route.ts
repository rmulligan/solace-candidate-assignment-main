import { NextRequest } from "next/server";
// import db dynamically inside handler to avoid build-time initialization
// import db from "../../../db";
// Disable prerendering to avoid build-time DB initialization
export const dynamic = 'force-dynamic';
import type { Advocate } from '@/types';
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { sql } from "drizzle-orm";
import {
  buildSearchCondition,
  filterAdvocatesMock,
  applySpecialtyFilter,
  filterSpecialtiesMock,
} from "./searchHelpers";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() || "";
  const specialties = searchParams.getAll("specialty");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    if (process.env.DATABASE_URL) {
      // Dynamically import db to avoid import-time errors
      const { default: db } = await import("../../../db");
      // Build advocate query with optional search and specialty filters
      const baseQuery = db.select().from(advocates);
      const searchedQuery = search
        ? baseQuery.where(buildSearchCondition(search))
        : baseQuery;
      const filteredQuery =
        specialties.length > 0
          ? applySpecialtyFilter(searchedQuery, specialties)
          : searchedQuery;

      // Count total matching rows for pagination
      const baseTotalQuery = db.select({ count: sql`count(*)` }).from(advocates);
      const searchedTotal = search
        ? baseTotalQuery.where(buildSearchCondition(search))
        : baseTotalQuery;
      const filteredTotal =
        specialties.length > 0
          ? applySpecialtyFilter(searchedTotal, specialties)
          : searchedTotal;
      const totalResult = await filteredTotal.execute();
      const total = Number(totalResult[0].count);

      // Fetch paginated data
      const data = await filteredQuery
        .limit(limit)
        .offset(offset)
        .execute();
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
        filtered = filterSpecialtiesMock(filtered, specialties);
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

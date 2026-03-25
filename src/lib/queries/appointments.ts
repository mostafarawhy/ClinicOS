import { db } from "@/lib/db";
import type { Dentist } from "@prisma/client";

export async function getDentistsForForm(): Promise<
  Pick<Dentist, "id" | "name">[]
> {
  return db.dentist.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

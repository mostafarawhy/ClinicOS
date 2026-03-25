import { getAllPatients } from "@/lib/queries/patients";
import { PatientsClient } from "./patients-client";

export default async function PatientsPage() {
  const patients = await getAllPatients();

  return <PatientsClient patients={patients} />;
}

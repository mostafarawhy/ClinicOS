export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  treatment: string;
  time: string;
  date: string;
  dentist: string;
  status: "scheduled" | "completed" | "cancelled";
}

export const appointments: Appointment[] = [
  { id: "a1", patientName: "Youssef Fawzy",  phone: "0101234567", treatment: "Cleaning",     time: "09:00", date: "2025-03-19", dentist: "Dr. Ali",   status: "completed" },
  { id: "a2", patientName: "Nour El-Din",    phone: "0155443322", treatment: "Root Canal",   time: "10:30", date: "2025-03-19", dentist: "Dr. Ali",   status: "completed" },
  { id: "a3", patientName: "Hana Samir",     phone: "0128899001", treatment: "Consultation", time: "12:00", date: "2025-03-19", dentist: "Dr. Ali",   status: "scheduled" },
  { id: "a4", patientName: "Karim Adel",     phone: "0141122334", treatment: "Crown",        time: "14:00", date: "2025-03-19", dentist: "Dr. Ali",   status: "scheduled" },
  { id: "b1", patientName: "Sara Mahmoud",   phone: "0109876543", treatment: "Filling",      time: "09:30", date: "2025-03-19", dentist: "Dr. Rania", status: "completed" },
  { id: "b2", patientName: "Layla Mostafa",  phone: "0113344556", treatment: "Whitening",    time: "11:00", date: "2025-03-19", dentist: "Dr. Rania", status: "scheduled" },
  { id: "b3", patientName: "Omar Khalil",    phone: "0106677889", treatment: "Cleaning",     time: "13:30", date: "2025-03-19", dentist: "Dr. Rania", status: "cancelled" },
  { id: "b4", patientName: "Ahmed Hassan",   phone: "0121122334", treatment: "Extraction",   time: "15:00", date: "2025-03-19", dentist: "Dr. Rania", status: "scheduled" },
];

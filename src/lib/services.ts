export interface NailService {
  name: string;
  price: number;
  category: "Nail Service" | "Add Ons" | "Design" | "Nail Removal";
  unit?: string; // e.g. "/jari" — for display only
}

export const NAIL_SERVICES: NailService[] = [
  // Nail Service
  { name: "Manicure", price: 40000, category: "Nail Service" },
  { name: "Manicure + Overlay + Plain Gel (bisa mix 2 warna)", price: 80000, category: "Nail Service" },
  { name: "Manicure + Extensions + Plain Gel", price: 130000, category: "Nail Service" },
  { name: "Pedicure + basic gel + Basic Overlay", price: 90000, category: "Nail Service" },
  { name: "Pedicure + Basic Gel + Overlay", price: 100000, category: "Nail Service" },


  // Add Ons
  { name: "Soft Tip Ext", price: 50000, category: "Add Ons" },
  { name: "One Color Cat Eye", price: 50000, category: "Add Ons" },
  { name: "French Nail", price: 6000, category: "Add Ons", unit: "/jari" },
  { name: "Thick 3D", price: 8000, category: "Add Ons", unit: "/jari" },
  { name: "Chrome", price: 6000, category: "Add Ons", unit: "/jari" },

  // Design
  { name: "Easy / Simple Design", price: 15000, category: "Design" },
  { name: "Complex Design", price: 30000, category: "Design" },

  // Nail Removal
  { name: "Remove Gel", price: 30000, category: "Nail Removal" },
  { name: "Remove Extensions", price: 50000, category: "Nail Removal" },
];

export const SERVICE_CATEGORIES: NailService["category"][] = [
  "Nail Service",
  "Add Ons",
  "Design",
  "Nail Removal",
];

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

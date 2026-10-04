export interface NailService {
  name: string;
  price: number;
  maxPrice?: number;
  category: "Nail Service" | "Add Ons" | "Design" | "Nail Removal";
  unit?: string; // e.g. "/jari" — for display only
}

export const NAIL_SERVICES: NailService[] = [
  // Nail Service
  { name: "Manicure", price: 50000, category: "Nail Service" },
  { name: "Manicure + Basic Gel + Overlay (bisa mix 2 warna)", price: 95000, category: "Nail Service" },
  { name: "Manicure + Extensions + Basic Gel", price: 140000, category: "Nail Service" },
  { name: "Nail Gel Kaki", price: 100000, category: "Nail Service" },
  { name: "Pedicure + basic gel + Basic Overlay", price: 90000, category: "Nail Service" },
  { name: "Pedicure + Basic Gel + Overlay", price: 100000, category: "Nail Service" },


  // Add Ons
  { name: "Soft Tip Ext", price: 55000, category: "Add Ons" },
  { name: "One Color Cat Eye", price: 60000, category: "Add Ons" },
  { name: "French Nail", price: 6000, category: "Add Ons", unit: "/jari" },
  { name: "Acc", price: 5000, maxPrice: 20000, category: "Add Ons" },
  { name: "Ombre", price: 10000, maxPrice: 30000, category: "Add Ons" },
  { name: "Polkadot", price: 5000, maxPrice: 10000, category: "Add Ons" },
  { name: "Thick 3D", price: 8000, maxPrice: 30000, category: "Add Ons", unit: "/jari" },
  { name: "Chrome", price: 6000, maxPrice: 15000, category: "Add Ons", unit: "/jari" },

  // Design
  { name: "Easy / Simple Design", price: 5000, maxPrice: 15000, category: "Design" },
  { name: "Complex Design", price: 16000, maxPrice: 30000, category: "Design" },

  // Nail Removal
  { name: "Remove Gel", price: 40000, category: "Nail Removal" },
  { name: "Remove Extensions", price: 50000, category: "Nail Removal" },
  { name: "Remove from Others", price: 70000, maxPrice: 80000, category: "Nail Removal" },
];

export const SERVICE_CATEGORIES: NailService["category"][] = [
  "Nail Service",
  "Add Ons",
  "Design",
  "Nail Removal",
];

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const formatPriceRange = (service: NailService) =>
  service.maxPrice
    ? `${formatIDR(service.price)}–${formatIDR(service.maxPrice)}${service.unit ?? ""}`
    : `${formatIDR(service.price)}${service.unit ?? ""}`;

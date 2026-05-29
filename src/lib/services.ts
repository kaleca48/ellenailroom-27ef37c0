export interface NailService {
  name: string;
  price: number;
}

export const NAIL_SERVICES: NailService[] = [
  { name: "Manicure Basic", price: 75000 },
  { name: "Pedicure Basic", price: 85000 },
  { name: "Gel Polish", price: 120000 },
  { name: "Acrylic Extension", price: 250000 },
  { name: "Nail Art Simple", price: 50000 },
  { name: "Nail Art Premium", price: 150000 },
  { name: "Soak Off", price: 40000 },
  { name: "French Manicure", price: 100000 },
  { name: "Refill Gel", price: 90000 },
  { name: "Foot Spa", price: 110000 },
];

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

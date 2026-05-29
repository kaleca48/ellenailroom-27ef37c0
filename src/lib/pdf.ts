import jsPDF from "jspdf";
import { formatIDR } from "./services";

export interface InvoicePDFData {
  invoice_number: string;
  customer_name: string;
  customer_phone?: string | null;
  invoice_date: string;
  items: { service_name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string | null;
}

export function generateInvoicePDF(data: InvoicePDFData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pink: [number, number, number] = [217, 154, 168];
  const dark: [number, number, number] = [60, 40, 45];
  const muted: [number, number, number] = [140, 120, 125];

  // Header band
  doc.setFillColor(...pink);
  doc.rect(0, 0, pageW, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("elle.nailroom", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Press on | Gel | Extensions | Remove", 15, 27);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageW - 15, 22, { align: "right" });

  // Meta
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let y = 50;
  doc.setTextColor(...muted);
  doc.text("No. Invoice", 15, y);
  doc.text("Tanggal", pageW - 15, y, { align: "right" });
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.text(data.invoice_number, 15, y + 6);
  doc.text(new Date(data.invoice_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }), pageW - 15, y + 6, { align: "right" });

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text("Ditagihkan kepada", 15, y);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(data.customer_name, 15, y + 6);
  if (data.customer_phone) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(data.customer_phone, 15, y + 12);
  }

  // Items table
  y += 24;
  doc.setFillColor(250, 240, 243);
  doc.rect(15, y, pageW - 30, 9, "F");
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("LAYANAN", 18, y + 6);
  doc.text("QTY", pageW - 70, y + 6, { align: "right" });
  doc.text("HARGA", pageW - 45, y + 6, { align: "right" });
  doc.text("TOTAL", pageW - 18, y + 6, { align: "right" });

  y += 13;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  data.items.forEach((it) => {
    doc.setTextColor(...dark);
    doc.text(it.service_name, 18, y);
    doc.text(String(it.quantity), pageW - 70, y, { align: "right" });
    doc.text(formatIDR(it.price), pageW - 45, y, { align: "right" });
    doc.text(formatIDR(it.price * it.quantity), pageW - 18, y, { align: "right" });
    y += 7;
    doc.setDrawColor(240, 230, 233);
    doc.line(15, y - 3, pageW - 15, y - 3);
  });

  // Totals
  y += 6;
  const labelX = pageW - 60;
  const valX = pageW - 18;
  doc.setTextColor(...muted);
  doc.text("Subtotal", labelX, y, { align: "right" });
  doc.setTextColor(...dark);
  doc.text(formatIDR(data.subtotal), valX, y, { align: "right" });

  if (data.discount > 0) {
    y += 6;
    doc.setTextColor(...muted);
    doc.text("Diskon", labelX, y, { align: "right" });
    doc.setTextColor(...dark);
    doc.text(`- ${formatIDR(data.discount)}`, valX, y, { align: "right" });
  }
  if (data.tax > 0) {
    y += 6;
    doc.setTextColor(...muted);
    doc.text("Pajak", labelX, y, { align: "right" });
    doc.setTextColor(...dark);
    doc.text(formatIDR(data.tax), valX, y, { align: "right" });
  }

  y += 10;
  doc.setFillColor(...pink);
  doc.rect(labelX - 30, y - 6, pageW - 15 - (labelX - 30), 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", labelX, y + 1, { align: "right" });
  doc.text(formatIDR(data.total), valX, y + 1, { align: "right" });

  if (data.notes) {
    y += 22;
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Catatan:", 15, y);
    doc.setTextColor(...dark);
    doc.text(doc.splitTextToSize(data.notes, pageW - 30), 15, y + 5);
  }

  // Footer
  doc.setTextColor(...muted);
  doc.setFontSize(9);
  doc.text("Terima kasih atas kepercayaan Anda 💕", pageW / 2, 285, { align: "center" });

  doc.save(`${data.invoice_number}.pdf`);
}

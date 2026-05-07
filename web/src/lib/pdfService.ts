import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF with autotable types
declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generateInvoice = (order: any) => {
  const doc = new jsPDF();
  
  // 1. Red Header Block
  doc.setFillColor(204, 0, 0); // #CC0000
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Seth M. Tufail Foundry (Pvt.) Ltd.", 105, 13, { align: "center" });
  
  doc.setFontSize(9);
  doc.text("Samundri Road, Faisalabad | Tel: (041) 8714167", 105, 20, { align: "center" });
  doc.text("Govt. Registration No: 37397 | Pakistan's No.1 Machinery", 105, 27, { align: "center" });
  
  // 2. Invoice Meta Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("OFFICIAL INVOICE", 105, 45, { align: "center" });
  
  doc.setFontSize(9);
  doc.text(`Order ID: ${order.orderId}`, 20, 55);
  doc.text(`Date: ${new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}`, 140, 55);
  doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 20, 62);
  doc.text(`Payment: ${order.paymentStatus.toUpperCase()}`, 140, 62);
  
  // 3. Customer Info Box
  doc.setFillColor(245, 245, 245);
  doc.rect(15, 68, 180, 28, "F");
  doc.setFontSize(9);
  doc.text(`Customer: ${order.customerName}`, 20, 76);
  doc.text(`Phone: ${order.customerPhone}`, 20, 83);
  doc.text(`City: ${order.customerCity}`, 20, 90);
  doc.text(`Email: ${order.customerEmail}`, 110, 76);
  doc.text(`Address: ${order.deliveryAddress || "N/A"}`, 110, 83);
  
  // 4. Products Table
  doc.autoTable({
    startY: 102,
    head: [["#", "Product Name", "Reg No", "Qty", "Unit Price", "Total"]],
    body: order.items.map((item: any, i: number) => [
      i + 1,
      item.name,
      item.regNo || "37397",
      item.quantity || 1,
      `Rs. ${Number(item.price).toLocaleString()}`,
      `Rs. ${(item.price * (item.quantity || 1)).toLocaleString()}`
    ]),
    headStyles: { fillColor: [204, 0, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [255, 245, 245] },
    foot: [
      ["", "", "", "", "Grand Total:", `Rs. ${Number(order.totalAmount).toLocaleString()} PKR`]
    ],
    footStyles: { fontStyle: "bold", fillColor: [212, 175, 55] } // Gold #D4AF37
  });
  
  // 5. Payment Footer Note
  const y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Payment via Bank Transfer — Screenshot submitted and verified.", 20, y);
  doc.text("Thank you for choosing Seth M. Tufail Foundry. This is a computer-generated invoice.", 20, y + 6);
  
  // 6. Bottom Red Strip
  doc.setFillColor(204, 0, 0);
  doc.rect(0, 282, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Pakistan Ka No.1 Toka — Reg: 37397 | www.sethtufail.com", 105, 291, { align: "center" });
  
  doc.save(`Invoice-${order.orderId}.pdf`);
};

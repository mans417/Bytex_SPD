import jsPDF from 'jspdf';


export const printBill = async (billData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200]
  });

  const pageWidth = 80;
  let yPosition = 10;

  pdf?.setFontSize(16);
  pdf?.setFont('helvetica', 'bold');
  pdf?.text('SmartBill Lite', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  pdf?.setFontSize(8);
  pdf?.setFont('helvetica', 'normal');
  pdf?.text('Tax Invoice', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  pdf?.setDrawColor(0);
  pdf?.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 5;

  pdf?.setFontSize(9);
  pdf?.text(`Bill ID: #${billData?.id}`, 5, yPosition);
  yPosition += 5;
  pdf?.text(`Date: ${new Date(billData?.timestamp)?.toLocaleDateString('en-IN')}`, 5, yPosition);
  yPosition += 5;
  pdf?.text(`Time: ${new Date(billData?.timestamp)?.toLocaleTimeString('en-IN')}`, 5, yPosition);
  yPosition += 8;

  pdf?.setFont('helvetica', 'bold');
  pdf?.text('Customer Details:', 5, yPosition);
  yPosition += 5;
  pdf?.setFont('helvetica', 'normal');
  pdf?.text(`Name: ${billData?.customerName}`, 5, yPosition);
  yPosition += 5;
  if (billData?.customerPhone) {
    pdf?.text(`Phone: ${billData?.customerPhone}`, 5, yPosition);
    yPosition += 5;
  }
  yPosition += 3;

  pdf?.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 5;

  pdf?.setFont('helvetica', 'bold');
  pdf?.text('Items:', 5, yPosition);
  yPosition += 5;

  pdf?.setFont('helvetica', 'normal');
  billData?.items?.forEach((item, index) => {
    pdf?.text(`${index + 1}. ${item?.name}`, 5, yPosition);
    yPosition += 4;
    pdf?.text(`   ${item?.quantity} x ₹${item?.price?.toFixed(2)} = ₹${item?.total?.toFixed(2)}`, 5, yPosition);
    yPosition += 5;
  });

  yPosition += 2;
  pdf?.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 5;

  pdf?.text(`Subtotal:`, 5, yPosition);
  pdf?.text(`₹${billData?.subtotal?.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 5;

  pdf?.text(`Tax (8%):`, 5, yPosition);
  pdf?.text(`₹${billData?.tax?.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 5;

  pdf?.line(5, yPosition, pageWidth - 5, yPosition);
  yPosition += 5;

  pdf?.setFont('helvetica', 'bold');
  pdf?.setFontSize(11);
  pdf?.text(`Total:`, 5, yPosition);
  pdf?.text(`₹${billData?.totalAmount?.toFixed(2)}`, pageWidth - 5, yPosition, { align: 'right' });
  yPosition += 8;

  pdf?.setFontSize(8);
  pdf?.setFont('helvetica', 'normal');
  pdf?.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 4;
  pdf?.text(`Staff: ${billData?.createdBy}`, pageWidth / 2, yPosition, { align: 'center' });

  pdf?.save(`Bill_${billData?.id}.pdf`);
};

export const printBillHTML = (billId) => {
  const printContent = document.getElementById(`bill-${billId}`);
  if (!printContent) return;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow?.document?.write('<html><head><title>Print Bill</title>');
  printWindow?.document?.write('<style>');
  printWindow?.document?.write('body { font-family: Arial, sans-serif; padding: 20px; }');
  printWindow?.document?.write('table { width: 100%; border-collapse: collapse; }');
  printWindow?.document?.write('th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }');
  printWindow?.document?.write('</style></head><body>');
  printWindow?.document?.write(printContent?.innerHTML);
  printWindow?.document?.write('</body></html>');
  printWindow?.document?.close();
  printWindow?.print();
};
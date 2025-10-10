import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { format } from "date-fns"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params
    
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        category: true,
        car: true,
        payments: {
          where: { paymentStatus: "COMPLETED" },
          orderBy: { paymentDate: "desc" },
          take: 1
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const payment = booking.payments[0]

    // Generate HTML receipt (could be converted to PDF using a library like puppeteer or pdfkit)
    const html = generateReceiptHTML(booking, payment)

    // For now, return HTML that browser can print as PDF
    // In production, you could use a library like @react-pdf/renderer or puppeteer
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="TMT-Receipt-${booking.bookingNumber}.html"`
      }
    })
  } catch (error) {
    console.error("Error generating receipt:", error)
    return NextResponse.json(
      { error: "Failed to generate receipt" },
      { status: 500 }
    )
  }
}

function generateReceiptHTML(booking: any, payment: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${booking.bookingNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      background: #000;
      color: #FFD700;
      margin-bottom: 40px;
    }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { color: #fff; }
    .booking-number {
      text-align: center;
      background: #FFF9E6;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    .booking-number .label { 
      color: #666; 
      font-size: 14px; 
      margin-bottom: 5px;
    }
    .booking-number .value { 
      color: #000; 
      font-size: 24px; 
      font-weight: bold;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .section h2 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #000;
      border-bottom: 2px solid #FFD700;
      padding-bottom: 10px;
    }
    .row {
      display: flex;
      margin-bottom: 10px;
    }
    .col {
      flex: 1;
    }
    .label {
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .value {
      color: #000;
      font-size: 16px;
      font-weight: 500;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 18px;
      font-weight: bold;
      border-top: 2px solid #e0e0e0;
      margin-top: 10px;
    }
    .total-value {
      color: #16a34a;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TMT's Coconut Cruisers</h1>
    <p>Booking Receipt</p>
  </div>

  <div class="booking-number">
    <div class="label">Booking Number</div>
    <div class="value">${booking.bookingNumber}</div>
  </div>

  <div class="section">
    <h2>Customer Information</h2>
    <div class="row">
      <div class="col">
        <div class="label">Name</div>
        <div class="value">${booking.customer.firstName} ${booking.customer.lastName}</div>
      </div>
      <div class="col">
        <div class="label">Email</div>
        <div class="value">${booking.customer.email}</div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="label">Phone</div>
        <div class="value">${booking.customer.phone}</div>
      </div>
      ${booking.customer.homePhone ? `
      <div class="col">
        <div class="label">Home Phone</div>
        <div class="value">${booking.customer.homePhone}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <h2>Vehicle Details</h2>
    <div class="label">Category</div>
    <div class="value" style="font-size: 18px; margin-bottom: 10px;">${booking.category.name}</div>
    ${booking.category.description ? `
    <div class="label">Description</div>
    <div class="value" style="margin-bottom: 10px;">${booking.category.description}</div>
    ` : ''}
    ${booking.car ? `
    <div class="label">Assigned Vehicle</div>
    <div class="value">${booking.car.name}${booking.car.licensePlate ? ` (${booking.car.licensePlate})` : ''}</div>
    ` : ''}
  </div>

  <div class="section">
    <h2>Rental Period</h2>
    <div class="row">
      <div class="col">
        <div class="label">Pickup Date</div>
        <div class="value">${format(new Date(booking.pickupDate), "EEE, MMM d, yyyy")}</div>
        <div class="label" style="font-size: 12px; margin-top: 5px;">${booking.pickupLocation}</div>
      </div>
      <div class="col">
        <div class="label">Return Date</div>
        <div class="value">${format(new Date(booking.returnDate), "EEE, MMM d, yyyy")}</div>
        <div class="label" style="font-size: 12px; margin-top: 5px;">${booking.returnLocation}</div>
      </div>
    </div>
    <div style="margin-top: 15px;">
      <div class="label">Duration</div>
      <div class="value">${booking.numberOfDays} ${booking.numberOfDays === 1 ? 'Day' : 'Days'}</div>
    </div>
  </div>

  <div class="section">
    <h2>Payment Summary</h2>
    <div class="summary-row">
      <span>Daily Rate × ${booking.numberOfDays}</span>
      <span>${formatCurrency(Number(booking.subtotal))}</span>
    </div>
    <div class="summary-row">
      <span>Tax (10%)</span>
      <span>${formatCurrency(Number(booking.taxAmount))}</span>
    </div>
    ${Number(booking.pickupFee) > 0 ? `
    <div class="summary-row">
      <span>Pickup Fee</span>
      <span>${formatCurrency(Number(booking.pickupFee))}</span>
    </div>
    ` : ''}
    <div class="summary-total">
      <span>Total Paid</span>
      <span class="total-value">${formatCurrency(Number(booking.totalAmount))}</span>
    </div>
    <div class="summary-row" style="font-size: 12px; color: #666; margin-top: 10px;">
      <span>Security Deposit (Refundable)</span>
      <span>${formatCurrency(Number(booking.depositAmount))}</span>
    </div>
    ${payment ? `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
      <div class="summary-row">
        <span>Payment Method</span>
        <span>${payment.paymentMethod}</span>
      </div>
      <div class="summary-row">
        <span>Transaction ID</span>
        <span>${payment.transactionId}</span>
      </div>
      <div class="summary-row">
        <span>Payment Date</span>
        <span>${format(new Date(payment.paymentDate), "MMM d, yyyy 'at' h:mm a")}</span>
      </div>
    </div>
    ` : ''}
  </div>

  ${booking.additionalDriver ? `
  <div class="section">
    <h2>Additional Information</h2>
    <div class="label">Additional Driver</div>
    <div class="value">${booking.additionalDriver}</div>
  </div>
  ` : ''}

  ${booking.specialRequests ? `
  <div class="section">
    <div class="label">Special Requests</div>
    <div class="value">${booking.specialRequests}</div>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>TMT's Coconut Cruisers</strong></p>
    <p>Deadman's Cay, Long Island, Bahamas</p>
    <p>Phone: +1 (242) 472-0016 | Email: info@tmtsbahamas.com</p>
    <p style="margin-top: 10px;">Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
  </div>

  <script>
    // Auto-print on load (optional)
    // window.onload = function() { window.print(); }
  </script>
</body>
</html>
  `
}
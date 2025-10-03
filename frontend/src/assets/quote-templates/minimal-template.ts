import { CompanyInfo, Config } from "@/models/template.model";
import { ICustomerInfo, IOrderDetails } from "../../models/quotation.model";

export function getMinimalTemplate(
  companyInfo: CompanyInfo,
  customerInfo: ICustomerInfo,
  orderDetails: IOrderDetails,
  config: Config
) {
  const items = orderDetails.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const taxRate = orderDetails.taxRate || 0.18;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate CGST/SGST
  const cgst = tax / 2;
  const sgst = tax / 2;
  const gstPercentage = (taxRate * 100).toFixed(0);

  // Format billing address
  const formatBillingAddress = () => {
    if (!customerInfo.billingAddress) return "";
    const addr = customerInfo.billingAddress;
    return `${addr.line || ""}, ${addr.city || ""}, ${addr.state || ""} - ${
      addr.pincode || ""
    }`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 12mm;
        }
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        body { 
          font-family: 'Helvetica Neue', 'Arial', sans-serif; 
          line-height: 1.4; 
          color: #2c3e50;
          background: #fff;
          font-size: 9pt;
          max-width: 210mm;
          margin: 0 auto;
          padding: 10mm;
        }
        
        /* Minimal Header with Accent */
        .header {
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          margin-bottom: 12px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }
        .company-section {
          flex: 1;
        }
        .company-name {
          font-size: 18pt;
          font-weight: 300;
          margin-bottom: 4px;
          color: #2c3e50;
          letter-spacing: 1px;
        }
        .company-details {
          font-size: 8pt;
          line-height: 1.5;
          color: #7f8c8d;
          font-weight: 300;
        }
        .quote-section {
          text-align: right;
          background: #ecf0f1;
          padding: 10px 15px;
          border-radius: 3px;
          min-width: 140px;
        }
        .doc-title {
          font-size: 11pt;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #3498db;
          margin-bottom: 6px;
        }
        .quote-meta {
          font-size: 8pt;
          line-height: 1.6;
          color: #34495e;
        }
        .quote-meta strong {
          color: #2c3e50;
          font-weight: 500;
        }

        /* Info Cards with Subtle Backgrounds */
        .info-grid {
          display: flex;
          gap: 15px;
          margin-bottom: 12px;
        }
        .info-card {
          flex: 1;
          background: #f8f9fa;
          padding: 10px;
          border-left: 3px solid #3498db;
          border-radius: 2px;
        }
        .card-title {
          font-size: 7.5pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #3498db;
          margin-bottom: 6px;
        }
        .card-content {
          font-size: 8pt;
          line-height: 1.5;
          color: #34495e;
        }
        .card-content strong {
          color: #2c3e50;
          font-weight: 500;
        }

        /* Clean Table Design */
        .table-container {
          margin: 10px 0;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8pt;
        }
        thead {
          background: linear-gradient(to bottom, #ecf0f1, #e0e0e0);
        }
        th {
          padding: 6px 5px;
          text-align: left;
          font-weight: 500;
          font-size: 7.5pt;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: #34495e;
          border-bottom: 2px solid #3498db;
        }
        td {
          padding: 5px 5px;
          border-bottom: 1px solid #ecf0f1;
          vertical-align: middle;
          color: #34495e;
        }
        tbody tr:hover {
          background: #f8f9fa;
        }
        tbody tr:last-child td {
          border-bottom: none;
        }
        .item-name {
          font-weight: 500;
          color: #2c3e50;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Bottom Grid with Subtle Design */
        .bottom-grid {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }
        .left-column {
          flex: 1;
        }
        .info-box {
          background: #f8f9fa;
          padding: 8px 10px;
          margin-bottom: 10px;
          border-left: 2px solid #95a5a6;
          border-radius: 2px;
        }
        .box-title {
          font-size: 7.5pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        .box-text {
          font-size: 7pt;
          line-height: 1.5;
          color: #34495e;
        }
        
        /* Modern Totals Design */
        .totals-column {
          width: 200px;
          flex-shrink: 0;
        }
        .totals-wrapper {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }
        .totals-header {
          background: linear-gradient(to right, #3498db, #2980b9);
          color: #fff;
          padding: 6px 10px;
          font-size: 8pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .totals-body {
          padding: 8px 10px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 8pt;
          color: #34495e;
          border-bottom: 1px solid #ecf0f1;
        }
        .total-line:last-child {
          border-bottom: none;
        }
        .total-line.grand {
          margin-top: 6px;
          padding-top: 8px;
          border-top: 2px solid #3498db;
          font-size: 9pt;
          font-weight: 600;
          color: #2c3e50;
        }
        .total-value {
          font-weight: 500;
        }
        .grand .total-value {
          color: #3498db;
        }

        /* Minimal Footer */
        .footer {
          margin-top: 12px;
          padding: 10px 0;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .footer-note {
          font-size: 7pt;
          color: #95a5a6;
          font-style: italic;
        }
        .signature-area {
          text-align: right;
        }
        .sig-space {
          height: 25px;
          border-bottom: 1px solid #bdc3c7;
          width: 150px;
          margin-bottom: 3px;
        }
        .sig-text {
          font-size: 7pt;
          color: #7f8c8d;
          font-weight: 400;
        }
        .sig-company {
          font-size: 7.5pt;
          color: #2c3e50;
          font-weight: 500;
          margin-bottom: 2px;
        }

        @media print {
          body { padding: 8mm; }
          @page { margin: 10mm; }
          tbody tr:hover { background: none; }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div class="header-row">
          <div class="company-section">
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-details">
              ${companyInfo.address}<br>
              ${companyInfo.phone} • ${companyInfo.email}<br>
              ${companyInfo.website ? `${companyInfo.website} • ` : ""}GSTIN: ${
    companyInfo.gstin
  }
            </div>
          </div>
          <div class="quote-section">
            <div class="doc-title">Quotation</div>
            <div class="quote-meta">
              <strong>#${orderDetails.quoteNumber}</strong><br>
              Date: ${formatDate(new Date().toISOString())}<br>
              Valid: ${formatDate(orderDetails.validUntil)}
            </div>
          </div>
        </div>
      </div>

      <!-- Customer & Billing Info -->
      <div class="info-grid">
        <div class="info-card">
          <div class="card-title">Customer Information</div>
          <div class="card-content">
            <strong>${customerInfo.company || customerInfo.name}</strong><br>
            ${customerInfo.name}<br>
            ${customerInfo.email ? `${customerInfo.email}<br>` : ""}
            ${customerInfo.phone ? customerInfo.phone : ""}
          </div>
        </div>
        <div class="info-card">
          <div class="card-title">Billing Address</div>
          <div class="card-content">
            ${formatBillingAddress() || "N/A"}<br><br>
            <strong>GST:</strong> ${gstPercentage}%
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">No.</th>
              <th style="width: 36%;">Description</th>
              <th style="width: 10%;">HSN</th>
              <th style="width: 8%;">Qty</th>
              <th style="width: 8%;">Unit</th>
              <th style="width: 12%;">Rate (₹)</th>
              <th style="width: 12%;">Amount (₹)</th>
              <th style="width: 10%;">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
            <tr>
              <td class="text-center">${index + 1}</td>
              <td><span class="item-name">${item.description}</span></td>
              <td class="text-center">${item.hsnCode || "—"}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-center">Nos</td>
              <td class="text-right">${formatCurrency(item.price)}</td>
              <td class="text-right">${formatCurrency(
                item.quantity * item.price
              )}</td>
              <td class="text-right">${formatCurrency(
                item.quantity * item.price
              )}</td>
            </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-grid">
        <div class="left-column">
          <!-- Terms -->
          <div class="info-box">
            <div class="box-title">Terms & Conditions</div>
            <div class="box-text">
              ${
                config.termsAndConditions &&
                config.termsAndConditions.length > 0
                  ? config.termsAndConditions
                      .map((line: string, idx: number) => `${idx + 1}. ${line}`)
                      .join("<br>")
                  : `1. Prices valid for 30 days from date of quotation<br>2. Payment terms as per agreement<br>3. Delivery schedule as agreed<br>4. Disputes subject to local jurisdiction`
              }
            </div>
          </div>

          <!-- Bank Details -->
          ${
            config.bankDetails
              ? `
          <div class="info-box">
            <div class="box-title">Bank Details</div>
            <div class="box-text">
              <strong>Bank:</strong> ${config.bankDetails.bankName || "N/A"}<br>
              <strong>Account Name:</strong> ${
                config.bankDetails.accountName || "N/A"
              }<br>
              <strong>Account No:</strong> ${
                config.bankDetails.accountNumber || "N/A"
              }<br>
              <strong>IFSC Code:</strong> ${config.bankDetails.ifsc || "N/A"}
            </div>
          </div>
          `
              : ""
          }
        </div>

        <!-- Totals -->
        <div class="totals-column">
          <div class="totals-wrapper">
            <div class="totals-header">Amount Summary</div>
            <div class="totals-body">
              <div class="total-line">
                <span>Subtotal</span>
                <span class="total-value">₹${formatCurrency(subtotal)}</span>
              </div>
              <div class="total-line">
                <span>CGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="total-value">₹${formatCurrency(cgst)}</span>
              </div>
              <div class="total-line">
                <span>SGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="total-value">₹${formatCurrency(sgst)}</span>
              </div>
              <div class="total-line grand">
                <span>Total Amount</span>
                <span class="total-value">₹${formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-note">
          Thank you for your business opportunity
        </div>
        <div class="signature-area">
          <div class="sig-space"></div>
          <div class="sig-company">For ${companyInfo.name}</div>
          <div class="sig-text">Authorized Signatory</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

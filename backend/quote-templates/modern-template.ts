import {
  CompanyInfo,
  Config,
  CustomerInfo,
  OrderDetails,
} from "./classic-template";

export function getModernTemplate(
  companyInfo: CompanyInfo,
  customerInfo: CustomerInfo,
  orderDetails: OrderDetails,
  config: Config
) {
  const items = orderDetails.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * (orderDetails.taxRate || 0.18);
  const total = subtotal + tax;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.5; 
          color: #000;
          background: #fff;
          font-size: 11px;
          max-width: 8.27in;
          margin: 0 auto;
        }
        
        /* Modern Header */
        .header-wrapper {
          background: ${config.brandColor || "#2d3748"};
          color: white;
          position: relative;
          margin-bottom: 25px;
          border-radius: 8px;
        }
        .header-content {
          padding: 25px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .company-section {
          flex: 1;
        }
        .company-name {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 8px;
          font-family: ${config.headerFont || "Segoe UI"};
        }
        .company-details {
          font-size: 11px;
          opacity: 0.95;
          line-height: 1.4;
        }
        .company-logo {
          max-height: 50px;
          max-width: 120px;
          border-radius: 6px;
        }
        .quote-badge {
          background: rgba(255,255,255,0.1);
          padding: 18px 22px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          min-width: 140px;
        }
        .quote-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .quote-number {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .quote-date {
          font-size: 10px;
          opacity: 0.9;
        }

        /* Content Area */
        .content {
          padding: 0 5px;
        }
        
        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        .info-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          border-left: 4px solid ${config.brandColor || "#2d3748"};
        }
        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: #000;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-content {
          font-size: 11px;
          line-height: 1.5;
          color: #333;
        }
        .card-content strong {
          color: #000;
          font-weight: 600;
        }

        /* Modern Table */
        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin: 20px 0;
          border: 1px solid #e9ecef;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        .items-table th {
          background: ${config.brandColor || "#2d3748"};
          color: white;
          padding: 12px 10px;
          text-align: left;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .items-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #f1f3f4;
          vertical-align: top;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .items-table tbody tr:hover {
          background: #f8f9fa;
        }
        .item-desc {
          font-weight: 600;
          color: #000;
          margin-bottom: 3px;
          font-size: 10px;
        }
        .item-details {
          color: #666;
          font-size: 9px;
          font-style: italic;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Modern Totals */
        .totals-wrapper {
          display: flex;
          justify-content: flex-end;
          margin: 20px 0;
        }
        .totals-card {
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid #e9ecef;
          min-width: 300px;
        }
        .totals-header {
          background: ${config.brandColor || "#2d3748"};
          color: white;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .totals-body {
          padding: 16px 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;
          font-size: 11px;
          color: #333;
        }
        .total-row.grand-total {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          border-top: 2px solid ${config.brandColor || "#2d3748"};
          padding-top: 12px;
          margin-top: 12px;
        }

        /* Bottom Sections */
        .bottom-sections {
          display: flex;
          gap: 20px;
          margin: 25px 0;
        }
        .bottom-card {
          flex: 1;
          background: #f8f9fa;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          border-top: 3px solid ${config.brandColor || "#2d3748"};
        }
        .bottom-title {
          font-size: 11px;
          font-weight: 700;
          color: #000;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .bottom-content {
          color: #333;
          line-height: 1.5;
          font-size: 10px;
        }
        .bottom-content strong {
          color: #000;
        }

        /* Signature */
        .signature-section {
          text-align: right;
          margin: 20px 0;
          padding: 18px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        .signature-img {
          max-height: 40px;
          margin: 10px 0;
        }
        .signature-text {
          font-size: 10px;
          color: #666;
          margin-bottom: 8px;
        }
        .signature-line {
          border-top: 1px solid #ccc;
          padding-top: 6px;
          display: inline-block;
          min-width: 140px;
          font-weight: 600;
          color: #000;
          font-size: 10px;
        }

        /* Footer */
        .footer {
          background: ${config.brandColor || "#2d3748"};
          color: white;
          text-align: center;
          padding: 18px;
          margin-top: 25px;
          border-radius: 8px;
          font-size: 10px;
        }

        /* Print Optimizations */
        @media print {
          body { 
            background: white !important; 
            font-size: 10px;
          }
          .header-content { padding: 20px 25px; }
          .info-grid { gap: 15px; margin-bottom: 20px; }
          .info-card, .totals-card, .bottom-card { padding: 15px; }
          .signature-section { padding: 15px; }
          .footer { padding: 15px; margin-top: 20px; }
          .table-container { margin: 15px 0; }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .bottom-sections {
            flex-direction: column;
          }
        }
      </style>
    </head>
    <body>
      <!-- Modern Header -->
      <div class="header-wrapper">
        <div class="header-content">
          <div class="company-section">
            <div class="company-name">${
              companyInfo.name || "Professional Enterprise"
            }</div>
            <div class="company-details">
              ${companyInfo.address || "Business Address"}<br>
              ${companyInfo.phone || "+91 XXXXX XXXXX"} • ${
    companyInfo.email || "contact@company.com"
  }<br>
              ${companyInfo.gstin ? `GSTIN: ${companyInfo.gstin}` : ""}
              ${companyInfo.website ? ` • ${companyInfo.website}` : ""}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div class="quote-badge">
              <div class="quote-title">Quotation</div>
              <div class="quote-number">${
                orderDetails.quoteNumber || "QT-001"
              }</div>
              <div class="quote-date">${
                orderDetails.date || new Date().toLocaleDateString("en-GB")
              }</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <div class="card-title">Client Information</div>
            <div class="card-content">
              <strong>${customerInfo.name || "Customer Name"}</strong><br>
              ${customerInfo.company ? `${customerInfo.company}<br>` : ""}
              ${customerInfo.address || "Customer Address"}<br>
              Phone: ${customerInfo.phone || "Customer Phone"}<br>
              Email: ${customerInfo.email || "customer@email.com"}
            </div>
          </div>
          <div class="info-card">
            <div class="card-title">Quote Summary</div>
            <div class="card-content">
              <strong>Quote Number:</strong> ${
                orderDetails.quoteNumber || "QT-001"
              }<br>
              <strong>Valid Until:</strong> ${
                orderDetails.validUntil ||
                new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-GB")
              }<br>
              <strong>Payment Terms:</strong> ${
                orderDetails.paymentTerms || "Net 30 days"
              }<br>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="table-container">
          <table class="items-table">
            <thead>
              <tr>
                <th width="5%">No.</th>
                <th width="45%">Item Description</th>
                <th width="10%">HSN/SAC</th>
                <th width="10%">Quantity</th>
                <th width="15%">Unit Price</th>
                <th width="15%">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>
                  <div class="item-desc">${
                    item.description || "Product/Service Description"
                  }</div>
                  ${
                    item.details
                      ? `<div class="item-details">${item.details}</div>`
                      : ""
                  }
                </td>
                <td class="text-center">${item.hsn || "N/A"}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">₹${(item.price || 0).toLocaleString(
                  "en-IN"
                )}</td>
                <td class="text-right"><strong>₹${(
                  (item.quantity || 1) * (item.price || 0)
                ).toLocaleString("en-IN")}</strong></td>
              </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-wrapper">
          <div class="totals-card">
            <div class="totals-header">Amount Summary</div>
            <div class="totals-body">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div class="total-row">
                <span>Tax (${((orderDetails.taxRate || 0.18) * 100).toFixed(
                  0
                )}%):</span>
                <span>₹${tax.toLocaleString("en-IN")}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>₹${total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Sections -->
        <div class="bottom-sections">
          ${
            config.bankDetails
              ? `
          <div class="bottom-card">
            <div class="bottom-title">Banking Information</div>
            <div class="bottom-content">
              <strong>Bank:</strong> ${
                config.bankDetails.bankName || "Bank Name"
              }<br>
              <strong>Account Number:</strong> ${
                config.bankDetails.accountNumber || "Account Number"
              }<br>
              <strong>IFSC Code:</strong> ${
                config.bankDetails.ifsc || "IFSC Code"
              }<br>
            </div>
          </div>
          `
              : ""
          }
          <div class="bottom-card">
            <div class="bottom-title">Terms & Conditions</div>
            <div class="bottom-content">
              ${
                config.termsAndConditions ||
                "Payment is due within 30 days of invoice date. Prices are valid for 30 days from quote date. All work will be performed in accordance with our standard terms of service."
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        Thank you for considering our proposal. We look forward to doing business with you.<br>
        ${companyInfo.email || "contact@company.com"} • ${
    companyInfo.phone || "+91 XXXXX XXXXX"
  }
      </div>
    </body>
    </html>
    `;
}

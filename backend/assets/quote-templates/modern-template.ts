import {
  CompanyInfo,
  Config,
  ICustomerInfo,
  IOrderDetails,
} from "../../models/quotation.model";

export function getModernTemplate(
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
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate CGST/SGST
  const cgst = tax / 2;
  const sgst = tax / 2;
  const gstPercentage = (taxRate * 100).toFixed(0);

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
          font-family: 'Arial', sans-serif; 
          line-height: 1.4; 
          color: #000;
          background: #fff;
          font-size: 9px;
          max-width: 8.27in;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Professional Header */
        .header-wrapper {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-left: 4px solid #000;
          margin-bottom: 15px;
          border-radius: 2px;
        }
        .header-content {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .company-section {
          flex: 1;
        }
        .company-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .company-details {
          font-size: 8px;
          color: #333;
          line-height: 1.3;
        }
        .company-logo {
          max-height: 40px;
          max-width: 100px;
        }
        .quote-badge {
          text-align: center;
          padding: 10px 15px;
          border: 1px solid #dee2e6;
          background: #fff;
          min-width: 120px;
          border-radius: 2px;
        }
        .quote-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
          color: #000;
        }
        .quote-number {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
          color: #000;
        }
        .quote-date {
          font-size: 8px;
          color: #666;
        }

        /* Content Area */
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        /* Info Grid */
        .info-grid {
          display: flex;
          gap: 12px;
          margin-bottom: 15px;
        }
        .info-card {
          flex: 1;
          background: #f8f9fa;
          padding: 12px;
          border: 1px solid #dee2e6;
          border-left: 3px solid #000;
        }
        .card-title {
          font-size: 8px;
          font-weight: bold;
          color: #000;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .card-content {
          font-size: 8px;
          line-height: 1.4;
          color: #333;
        }
        .card-content strong {
          color: #000;
          font-weight: 600;
        }

        /* Professional Table */
        .table-container {
          background: #fff;
          border: 1px solid #000;
          margin: 10px 0;
          flex: 1;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8px;
        }
        .items-table th {
          background: #f1f3f4;
          color: #000;
          padding: 8px 6px;
          text-align: left;
          font-weight: bold;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.2px;
          border: 1px solid #000;
        }
        .items-table td {
          padding: 6px 6px;
          border: 1px solid #ccc;
          vertical-align: top;
        }
        .items-table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        .item-desc {
          font-weight: 600;
          color: #000;
          margin-bottom: 1px;
          font-size: 8px;
        }
        .item-details {
          color: #555;
          font-size: 7px;
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Bottom Section */
        .bottom-wrapper {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        /* Professional Totals */
        .totals-wrapper {
          width: 220px;
          flex-shrink: 0;
        }
        .totals-card {
          background: #f8f9fa;
          border: 1px solid #000;
          border-radius: 2px;
        }
        .totals-header {
          background: #e9ecef;
          color: #000;
          padding: 6px 12px;
          font-weight: bold;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 1px solid #000;
        }
        .totals-body {
          padding: 8px 12px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 4px 0;
          font-size: 8px;
          color: #333;
        }
        .total-row.grand-total {
          font-size: 10px;
          font-weight: bold;
          color: #000;
          border-top: 1px solid #000;
          padding-top: 6px;
          margin-top: 6px;
          background: #f1f3f4;
          padding: 6px 0;
        }

        /* Left Info Sections */
        .left-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .info-section {
          background: #f8f9fa;
          padding: 10px;
          border: 1px solid #dee2e6;
          border-left: 3px solid #000;
        }
        .section-title {
          font-size: 7px;
          font-weight: bold;
          color: #000;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .section-content {
          color: #333;
          line-height: 1.4;
          font-size: 7px;
        }
        .section-content strong {
          color: #000;
        }

        /* Signature */
        .signature-section {
          text-align: right;
          margin: 12px 0 8px 0;
          padding: 10px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
        }
        .signature-img {
          max-height: 25px;
          margin: 8px 0;
        }
        .signature-text {
          font-size: 7px;
          color: #555;
          margin-bottom: 4px;
        }
        .signature-line {
          border-top: 1px solid #999;
          padding-top: 4px;
          display: inline-block;
          min-width: 100px;
          font-weight: 600;
          color: #000;
          font-size: 7px;
        }

        /* Footer */
        .footer {
          background: #f1f3f4;
          color: #333;
          text-align: center;
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #dee2e6;
          font-size: 7px;
        }

        /* Print Optimizations */
        @media print {
          body { 
            font-size: 8px;
            height: 100vh;
          }
          .header-content { padding: 12px 16px; }
          .info-grid { gap: 10px; margin-bottom: 12px; }
          .info-card { padding: 10px; }
          .totals-body { padding: 6px 10px; }
          .info-section { padding: 8px; }
          .signature-section { padding: 8px; }
          .footer { padding: 6px; }
          .table-container { margin: 8px 0; }
          .items-table th, .items-table td { padding: 4px 5px; }
        }
      </style>
    </head>
    <body>
      <!-- Professional Headekr -->
      <div class="header-wrapper">
        <div class="header-content">
          <div class="company-section">
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-details">
              ${companyInfo.address}<br>
              Phone: ${companyInfo.phone} | Email: ${companyInfo.email}<br>
              ${
                companyInfo.website ? `Website: ${companyInfo.website} | ` : ""
              }GSTIN: ${companyInfo.gstin}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 15px;">
            <div class="quote-badge">
              <div class="quote-title">Quotation</div>
              <div class="quote-number">${orderDetails.quoteNumber}</div>
              <div class="quote-date">${formatDate(
                Date.now().toLocaleString()
              )}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- Info Grid -->
        <div class="info-grid">
          <div class="info-card">
            <div class="card-title">Customer Information</div>
            <div class="card-content">
              <strong>${customerInfo.company}</strong><br>
              ${customerInfo.name}<br>
              Phone: ${customerInfo.phone}<br>
              Email: ${customerInfo.email}
            </div>
          </div>
          <div class="info-card">
            <div class="card-title">Quote Details</div>
            <div class="card-content">
              <strong>Valid Until:</strong> ${formatDate(
                orderDetails.validUntil
              )}<br>
              <strong>GST Rate:</strong> ${gstPercentage}%
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="table-container">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 4%;">Sr.</th>
                <th style="width: 42%;">Description of Goods/Services</th>
                <th style="width: 8%;">HSN</th>
                <th style="width: 6%;">Qty</th>
                <th style="width: 5%;">Unit</th>
                <th style="width: 13%;">Rate (₹)</th>
                <th style="width: 13%;">Amount (₹)</th>
                <th style="width: 5%;">GST</th>
                <th style="width: 4%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>
                  <div class="item-desc">${item.description}</div>
                
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-center">Nos</td>
                <td class="text-right">${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(
                  item.quantity * item.price
                )}</td>
                <td class="text-center">${gstPercentage}%</td>
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
        <div class="bottom-wrapper">
          <div class="left-info">
            <div class="info-section">
              <div class="section-title">Terms & Conditions</div>
              <div class="section-content">
                ${
                  config.termsAndConditions
                    ? config.termsAndConditions.split("\n").join("<br>")
                    : "1. Prices are valid for 30 days from quote date.<br>2. Payment terms as mentioned above.<br>3. Delivery as per agreed schedule.<br>4. All disputes subject to local jurisdiction."
                }
              </div>
            </div>
            
            ${
              config.bankDetails
                ? `
            <div class="info-section">
              <div class="section-title">Bank Details</div>
              <div class="section-content">
                ${
                  typeof config.bankDetails === "string"
                    ? config.bankDetails.split("\n").join("<br>")
                    : `<strong>${config.bankDetails.bankName}</strong><br>
                   A/c No: ${config.bankDetails.accountNumber}<br>
                   IFSC: ${config.bankDetails.ifsc}<br>
                  `
                }
              </div>
            </div>
            `
                : ""
            }
          </div>

          <!-- Totals -->
          <div class="totals-wrapper">
            <div class="totals-card">
              <div class="totals-header">Amount Summary</div>
              <div class="totals-body">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>₹${formatCurrency(subtotal)}</span>
                </div>
                <div class="total-row">
                  <span>CGST @ ${(taxRate * 50).toFixed(1)}%:</span>
                  <span>₹${formatCurrency(cgst)}</span>
                </div>
                <div class="total-row">
                  <span>SGST @ ${(taxRate * 50).toFixed(1)}%:</span>
                  <span>₹${formatCurrency(sgst)}</span>
                </div>
                <div class="total-row grand-total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>₹${formatCurrency(total)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Signature -->
        <div class="signature-section">
          <div class="signature-text">Authorized Representative</div>
          <div class="signature-line">
            <strong>For ${companyInfo.name}</strong><br>
            Authorized Signatory
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        Thank you for your inquiry. We look forward to your business. | ${
          companyInfo.email
        } | ${companyInfo.phone}
      </div>
    </body>
    </html>
    `;
}

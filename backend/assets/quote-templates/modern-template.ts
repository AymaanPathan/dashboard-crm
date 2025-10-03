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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.5; 
          color: #1f1f1f;
          background: #fff;
          font-size: 9pt;
          max-width: 210mm;
          margin: 0 auto;
          padding: 10mm;
          -webkit-font-smoothing: antialiased;
        }
        
        /* Modern Header with Clean Lines */
        .header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e3e3e3;
        }
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }
        .company-block {
          flex: 1;
        }
        .company-name {
          font-size: 20pt;
          font-weight: 600;
          margin-bottom: 6px;
          color: #000;
          letter-spacing: -0.5px;
        }
        .company-text {
          font-size: 8pt;
          line-height: 1.6;
          color: #6b6b6b;
          font-weight: 400;
        }
        .quote-block {
          text-align: right;
          background: #fafafa;
          padding: 12px 16px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
          min-width: 160px;
        }
        .doc-label {
          font-size: 9pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #000;
          margin-bottom: 8px;
        }
        .quote-num {
          font-size: 12pt;
          font-weight: 600;
          color: #1f1f1f;
          margin-bottom: 4px;
        }
        .date-text {
          font-size: 8pt;
          color: #6b6b6b;
          line-height: 1.5;
        }

        /* Modern Card Layout */
        .card-grid {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
        }
        .card {
          flex: 1;
          background: #fafafa;
          padding: 12px 14px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
          min-height: 85px;
        }
        .card-label {
          font-size: 7.5pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #000;
          margin-bottom: 8px;
        }
        .card-text {
          font-size: 8pt;
          line-height: 1.6;
          color: #3a3a3a;
          font-weight: 400;
        }
        .card-text strong {
          color: #000;
          font-weight: 500;
        }

        /* Clean Modern Table */
        .table-wrap {
          margin: 12px 0;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8pt;
        }
        thead {
          background: #fafafa;
        }
        th {
          padding: 8px 6px;
          text-align: left;
          font-weight: 500;
          font-size: 7.5pt;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #000;
          border-bottom: 1px solid #e3e3e3;
        }
        td {
          padding: 7px 6px;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
          color: #3a3a3a;
        }
        tbody tr:last-child td {
          border-bottom: none;
        }
        tbody tr:hover {
          background: #fafafa;
        }
        .item-title {
          font-weight: 500;
          color: #1f1f1f;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Modern Bottom Layout */
        .bottom-flex {
          display: flex;
          gap: 14px;
          margin-top: 12px;
        }
        .left-content {
          flex: 1;
        }
        .content-box {
          background: #fafafa;
          padding: 10px 12px;
          margin-bottom: 10px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
        }
        .content-label {
          font-size: 7.5pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #000;
          margin-bottom: 6px;
        }
        .content-text {
          font-size: 7pt;
          line-height: 1.6;
          color: #3a3a3a;
        }
        
        /* Modern Totals Card */
        .totals-card {
          width: 210px;
          flex-shrink: 0;
        }
        .totals-wrap {
          background: #fff;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          overflow: hidden;
        }
        .totals-head {
          background: #1f1f1f;
          color: #fff;
          padding: 8px 12px;
          font-size: 8pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .totals-content {
          padding: 10px 12px;
        }
        .total-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 8pt;
          color: #3a3a3a;
          border-bottom: 1px solid #f0f0f0;
        }
        .total-item:last-child {
          border-bottom: none;
        }
        .total-item.final {
          margin-top: 8px;
          padding-top: 10px;
          border-top: 2px solid #e3e3e3;
          font-size: 9.5pt;
          font-weight: 600;
          color: #000;
        }
        .amount {
          font-weight: 500;
        }
        .final .amount {
          font-weight: 600;
        }

        /* Modern Signature */
        .signature-area {
          margin-top: 14px;
          padding: 10px 12px;
          text-align: right;
          background: #fafafa;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
        }
        .sig-space {
          height: 28px;
          border-bottom: 1px solid #c0c0c0;
          width: 160px;
          display: inline-block;
          margin-bottom: 4px;
        }
        .sig-label {
          font-size: 7pt;
          color: #6b6b6b;
          margin-bottom: 2px;
        }
        .sig-company {
          font-size: 8pt;
          font-weight: 500;
          color: #1f1f1f;
        }

        /* Clean Footer */
        .footer-bar {
          margin-top: 12px;
          padding: 8px 0;
          text-align: center;
          border-top: 1px solid #e3e3e3;
          font-size: 7pt;
          color: #6b6b6b;
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
        <div class="header-flex">
          <div class="company-block">
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-text">
              ${companyInfo.address}<br>
              ${companyInfo.phone} · ${companyInfo.email}<br>
              ${companyInfo.website ? `${companyInfo.website} · ` : ""}GSTIN: ${
    companyInfo.gstin
  }
            </div>
          </div>
          <div class="quote-block">
            <div class="doc-label">Quotation</div>
            <div class="quote-num">#${orderDetails.quoteNumber}</div>
            <div class="date-text">
              Date: ${formatDate(new Date().toISOString())}<br>
              Valid: ${formatDate(orderDetails.validUntil)}
            </div>
          </div>
        </div>
      </div>

      <!-- Customer & Billing Cards -->
      <div class="card-grid">
        <div class="card">
          <div class="card-label">Customer Information</div>
          <div class="card-text">
            <strong>${customerInfo.company || customerInfo.name}</strong><br>
            ${customerInfo.name}<br>
            ${customerInfo.email ? `${customerInfo.email}<br>` : ""}
            ${customerInfo.phone ? customerInfo.phone : ""}
          </div>
        </div>
        <div class="card">
          <div class="card-label">Billing Address</div>
          <div class="card-text">
            ${formatBillingAddress() || "N/A"}<br><br>
            <strong>GST Rate:</strong> ${gstPercentage}%
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">No.</th>
              <th style="width: 35%;">Description</th>
              <th style="width: 10%;">HSN</th>
              <th style="width: 8%;">Qty</th>
              <th style="width: 8%;">Unit</th>
              <th style="width: 12%;">Rate (₹)</th>
              <th style="width: 12%;">Amount (₹)</th>
              <th style="width: 11%;">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
            <tr>
              <td class="text-center">${index + 1}</td>
              <td><span class="item-title">${item.description}</span></td>
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
      <div class="bottom-flex">
        <div class="left-content">
          <!-- Terms -->
          <div class="content-box">
            <div class="content-label">Terms & Conditions</div>
            <div class="content-text">
              ${
                config.termsAndConditions &&
                config.termsAndConditions.length > 0
                  ? config.termsAndConditions
                      .map((line, idx) => `${idx + 1}. ${line}`)
                      .join("<br>")
                  : `1. Prices valid for 30 days from quotation date<br>2. Payment terms as per agreement<br>3. Delivery schedule as agreed upon<br>4. All disputes subject to local jurisdiction`
              }
            </div>
          </div>

          <!-- Bank Details -->
          ${
            config.bankDetails
              ? `
          <div class="content-box">
            <div class="content-label">Bank Details</div>
            <div class="content-text">
              <strong>Bank Name:</strong> ${
                config.bankDetails.bankName || "N/A"
              }<br>
              <strong>Account Name:</strong> ${
                config.bankDetails.accountName || "N/A"
              }<br>
              <strong>Account Number:</strong> ${
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
        <div class="totals-card">
          <div class="totals-wrap">
            <div class="totals-head">Amount Summary</div>
            <div class="totals-content">
              <div class="total-item">
                <span>Subtotal</span>
                <span class="amount">₹${formatCurrency(subtotal)}</span>
              </div>
              <div class="total-item">
                <span>CGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="amount">₹${formatCurrency(cgst)}</span>
              </div>
              <div class="total-item">
                <span>SGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="amount">₹${formatCurrency(sgst)}</span>
              </div>
              <div class="total-item final">
                <span>Total Amount</span>
                <span class="amount">₹${formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div class="signature-area">
        <div class="sig-space"></div>
        <div class="sig-label">For ${companyInfo.name}</div>
        <div class="sig-company">Authorized Signatory</div>
      </div>

      <!-- Footer -->
      <div class="footer-bar">
        Thank you for your business · ${companyInfo.email} · ${
    companyInfo.phone
  }
      </div>
    </body>
    </html>
  `;
}

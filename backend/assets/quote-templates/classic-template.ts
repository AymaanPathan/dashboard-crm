import {
  CompanyInfo,
  Config,
  ICustomerInfo,
  IOrderDetails,
} from "../../models/quotation.model";

export function getClassicTemplate(
  companyInfo: CompanyInfo,
  customerInfo: ICustomerInfo,
  orderDetails: IOrderDetails,
  config: Config,
  isOrder: boolean = false
) {
  const items = orderDetails.items || [];
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
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

  // Document type labels
  const docType = isOrder ? "Purchase Order" : "Quotation";
  const docNumberLabel = isOrder ? "Order No." : "Quote No.";
  const docDateLabel = isOrder ? "Order Date" : "Date";
  const validityLabel = isOrder ? "Delivery By" : "Valid Until";

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
          font-family: 'Georgia', 'Times New Roman', serif; 
          line-height: 1.5; 
          color: #1a1a1a;
          background: #fff;
          font-size: 9.5pt;
          max-width: 210mm;
          margin: 0 auto;
          padding: 10mm;
        }
        
        /* Refined Header */
        .header {
          border-top: 4px solid #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
          padding: 12px 0;
          margin-bottom: 16px;
        }
        .header-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }
        .company-section {
          flex: 1;
        }
        .company-name {
          font-size: 22pt;
          font-weight: 600;
          margin-bottom: 4px;
          color: #000;
          letter-spacing: 0.5px;
        }
        .company-info {
          font-size: 8.5pt;
          line-height: 1.6;
          color: #444;
        }
        .quote-section {
          text-align: right;
          border-left: 3px solid #1a1a1a;
          padding-left: 16px;
          min-width: 160px;
        }
        .doc-type {
          font-size: 14pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 6px;
          color: #1a1a1a;
        }
        .doc-type.order {
          color: #006400;
        }
        .quote-details {
          font-size: 8.5pt;
          line-height: 1.6;
          color: #444;
        }
        .quote-number {
          font-size: 11pt;
          font-weight: 600;
          color: #000;
          margin-bottom: 2px;
        }
        .order-badge {
          display: inline-block;
          background: #006400;
          color: #fff;
          padding: 3px 8px;
          font-size: 7pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
          border-radius: 2px;
        }

        /* Elegant Info Panels */
        .info-panels {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .panel {
          flex: 1;
          border: 1px solid #d0d0d0;
          padding: 12px;
          background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
        }
        .panel-title {
          font-size: 8.5pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #1a1a1a;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 2px solid #1a1a1a;
        }
        .panel-body {
          font-size: 8.5pt;
          line-height: 1.6;
          color: #333;
        }
        .panel-body strong {
          color: #000;
          font-weight: 600;
        }

        /* Refined Table */
        .table-container {
          margin: 14px 0;
          border: 1px solid #1a1a1a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8.5pt;
        }
        thead {
          background: linear-gradient(to bottom, #f0f0f0 0%, #e5e5e5 100%);
        }
        th {
          padding: 8px 6px;
          text-align: left;
          font-weight: 600;
          font-size: 8pt;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #1a1a1a;
          border: 1px solid #c0c0c0;
        }
        td {
          padding: 7px 6px;
          border: 1px solid #d8d8d8;
          vertical-align: middle;
          color: #333;
        }
        tbody tr:nth-child(even) {
          background: #fafafa;
        }
        .item-name {
          font-weight: 500;
          color: #1a1a1a;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Sophisticated Bottom */
        .bottom-grid {
          display: flex;
          gap: 16px;
          margin-top: 14px;
        }
        .info-column {
          flex: 1;
        }
        .info-block {
          border: 1px solid #d0d0d0;
          padding: 10px 12px;
          margin-bottom: 12px;
          background: #fafafa;
        }
        .block-heading {
          font-size: 8pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #1a1a1a;
          margin-bottom: 6px;
          padding-bottom: 3px;
          border-bottom: 1px solid #1a1a1a;
        }
        .block-content {
          font-size: 7.5pt;
          line-height: 1.6;
          color: #333;
        }
        
        /* Premium Totals */
        .totals-column {
          width: 220px;
          flex-shrink: 0;
        }
        .totals-container {
          border: 2px solid #1a1a1a;
          background: #fff;
        }
        .totals-header {
          background: #1a1a1a;
          color: #fff;
          padding: 8px 12px;
          text-align: center;
          font-size: 9pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .totals-header.order {
          background: #006400;
        }
        .totals-body {
          padding: 10px 12px;
          background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
        }
        .sum-line {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 8.5pt;
          color: #333;
          border-bottom: 1px solid #e8e8e8;
        }
        .sum-line:last-child {
          border-bottom: none;
        }
        .sum-line.grand {
          margin-top: 8px;
          padding-top: 10px;
          border-top: 2px solid #1a1a1a;
          font-size: 10pt;
          font-weight: 600;
          color: #000;
        }
        .sum-value {
          font-weight: 600;
        }

        /* Elegant Signature */
        .signature-block {
          margin-top: 16px;
          padding: 12px;
          border: 1px solid #d0d0d0;
          text-align: right;
          background: linear-gradient(to bottom, #fafafa 0%, #ffffff 100%);
        }
        .sig-text {
          font-size: 8pt;
          color: #666;
          font-style: italic;
          margin-bottom: 25px;
        }
        .sig-line {
          display: inline-block;
          min-width: 170px;
          border-bottom: 1.5px solid #1a1a1a;
          margin-bottom: 3px;
        }
        .sig-name {
          font-size: 9pt;
          font-weight: 600;
          color: #1a1a1a;
        }
        .sig-role {
          font-size: 8pt;
          color: #666;
          font-style: italic;
        }

        /* Refined Footer */
        .footer {
          margin-top: 14px;
          padding: 8px;
          border-top: 1px solid #d0d0d0;
          text-align: center;
          font-size: 7.5pt;
          color: #666;
          font-style: italic;
        }

        @media print {
          body { padding: 8mm; }
          @page { margin: 10mm; }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div class="header-grid">
          <div class="company-section">
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-info">
              ${companyInfo.address}<br>
              Tel: ${companyInfo.phone} | Email: ${companyInfo.email}<br>
              ${companyInfo.website ? `${companyInfo.website} | ` : ""}GSTIN: ${
    companyInfo.gstin
  }
            </div>
          </div>
          <div class="quote-section">
            <div class="doc-type ${isOrder ? "order" : ""}">${docType}</div>
            ${isOrder ? '<div class="order-badge">Confirmed Order</div>' : ""}
            <div class="quote-number">#${orderDetails.quoteNumber}</div>
            <div class="quote-details">
              ${docDateLabel}: ${formatDate(new Date().toISOString())}<br>
              ${validityLabel}: ${formatDate(orderDetails.validUntil)}
            </div>
          </div>
        </div>
      </div>

      <!-- Info Panels -->
      <div class="info-panels">
        <div class="panel">
          <div class="panel-title">Customer Details</div>
          <div class="panel-body">
            <strong>${customerInfo.company || customerInfo.name}</strong><br>
            Attention: ${customerInfo.name}<br>
            ${customerInfo.email ? `Email: ${customerInfo.email}<br>` : ""}
            ${customerInfo.phone ? `Phone: ${customerInfo.phone}` : ""}
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">${
            isOrder ? "Delivery Address" : "Billing Address"
          }</div>
          <div class="panel-body">
            ${formatBillingAddress() || "As per customer records"}<br><br>
            <strong>GST Rate:</strong> ${gstPercentage}%
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No.</th>
              <th style="width: 34%;">Description</th>
              <th style="width: 10%;">HSN Code</th>
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
                (item: any, index: number) => `
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
        <div class="info-column">
          <!-- Terms -->
          <div class="info-block">
            <div class="block-heading">${
              isOrder ? "Order Terms & Conditions" : "Terms & Conditions"
            }</div>
            <div class="block-content">
              ${
                config.termsAndConditions &&
                config.termsAndConditions.length > 0
                  ? config.termsAndConditions
                      .map((line, idx) => `${idx + 1}. ${line}`)
                      .join("<br>")
                  : isOrder
                  ? `1. Order confirmed and payment terms as agreed<br>2. Delivery as per schedule mentioned above<br>3. Goods once sold will not be taken back<br>4. Subject to local jurisdiction`
                  : `1. Quotation valid for 30 days from date of issue<br>2. Payment terms as per mutual agreement<br>3. Delivery schedule as agreed upon<br>4. Subject to local jurisdiction`
              }
            </div>
          </div>

          <!-- Bank Details -->
          ${
            config.bankDetails
              ? `
          <div class="info-block">
            <div class="block-heading">Bank Account Details</div>
            <div class="block-content">
              <strong>Bank Name:</strong> ${
                config.bankDetails.bankName || "N/A"
              }<br>
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
          <div class="totals-container">
            <div class="totals-header ${
              isOrder ? "order" : ""
            }">Amount Summary</div>
            <div class="totals-body">
              <div class="sum-line">
                <span>Subtotal</span>
                <span class="sum-value">₹ ${formatCurrency(subtotal)}</span>
              </div>
              <div class="sum-line">
                <span>CGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="sum-value">₹ ${formatCurrency(cgst)}</span>
              </div>
              <div class="sum-line">
                <span>SGST @ ${(taxRate * 50).toFixed(1)}%</span>
                <span class="sum-value">₹ ${formatCurrency(sgst)}</span>
              </div>
              <div class="sum-line grand">
                <span>Grand Total</span>
                <span class="sum-value">₹ ${formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div class="signature-block">
        <div class="sig-text">For and on behalf of</div>
        <div class="sig-line"></div>
        <div class="sig-name">${companyInfo.name}</div>
        <div class="sig-role">Authorized Signatory</div>
      </div>

      <!-- Footer -->
      <div class="footer">
        ${
          isOrder
            ? `This is a confirmed purchase order. Please process as per terms mentioned above<br>For inquiries: ${companyInfo.email} | ${companyInfo.phone}`
            : `This quotation is valid subject to the terms and conditions mentioned above<br>For inquiries: ${companyInfo.email} | ${companyInfo.phone}`
        }
      </div>
    </body>
    </html>
  `;
}

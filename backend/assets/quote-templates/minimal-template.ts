import {
  CompanyInfo,
  Config,
  CustomerInfo,
  OrderDetails,
} from "./classic-template";

export function getMinimalTemplate(
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
  const taxRate = orderDetails.taxRate || 0.18;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
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
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        @page {
          size: A4;
          margin: 12mm 15mm 12mm 15mm;
        }
        body { 
          font-family: 'Arial', sans-serif; 
          font-size: 9px;
          line-height: 1.3; 
          color: #000; 
          background: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Header Section */
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          border-bottom: 1px solid #000; 
          padding-bottom: 8px; 
          margin-bottom: 12px;
        }
        .company-section {
          flex: 1;
          padding-right: 15px;
        }
        .company-logo { 
          max-height: 35px; 
          max-width: 120px;
          margin-bottom: 4px; 
        }
        .company-name { 
          font-size: 14px; 
          font-weight: bold; 
          color: #000; 
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .company-details { 
          font-size: 8px; 
          color: #333; 
          line-height: 1.2;
        }
        .quote-section {
          text-align: right;
          flex-shrink: 0;
          min-width: 140px;
        }
        .quote-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #000; 
          margin-bottom: 4px;
          letter-spacing: 1px;
        }
        .quote-details {
          font-size: 8px;
          color: #333;
          line-height: 1.3;
        }
        .quote-number {
          font-weight: bold;
          color: #000;
          font-size: 9px;
        }
        
        /* Main Content */
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        /* Customer and Quote Info Row */
        .info-row {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
        }
        .customer-section, .quote-info-section { 
          flex: 1;
          border: 1px solid #ccc;
          padding: 8px;
          background: #fafafa;
        }
        .section-title { 
          font-size: 8px; 
          font-weight: bold; 
          color: #000; 
          text-transform: uppercase; 
          letter-spacing: 0.3px;
          margin-bottom: 4px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 2px;
        }
        .customer-info, .quote-info { 
          font-size: 8px;
          line-height: 1.3;
          color: #333;
        }
        .customer-name, .info-label {
          font-weight: bold;
          color: #000;
        }
        
        /* Items Table */
        .items-section {
          flex: 1;
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 8px;
          border: 1px solid #000;
          flex: 1;
        }
        .items-table th { 
          background: #f0f0f0; 
          padding: 5px 4px; 
          text-align: left; 
          font-weight: bold; 
          border: 1px solid #000; 
          color: #000; 
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .items-table td { 
          padding: 4px 4px; 
          border: 1px solid #ccc; 
          vertical-align: top;
        }
        .items-table tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        .item-description { 
          font-weight: 600; 
          margin-bottom: 1px;
          font-size: 8px;
          color: #000;
        }
        .item-details { 
          font-size: 7px; 
          color: #555; 
          line-height: 1.2;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        /* Bottom Section */
        .bottom-section {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }
        
        /* Terms and Payment Info */
        .left-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .terms-box, .payment-box {
          border: 1px solid #ccc;
          padding: 6px;
          background: #fafafa;
        }
        .box-title {
          font-size: 7px;
          font-weight: bold;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.2px;
          margin-bottom: 3px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 1px;
        }
        .box-content {
          font-size: 7px;
          color: #333;
          line-height: 1.3;
        }
        
        /* Totals Section */
        .totals-section {
          width: 200px;
          flex-shrink: 0;
        }
        .totals-table { 
          width: 100%;
          font-size: 8px;
          border: 1px solid #000;
          border-collapse: collapse;
        }
        .totals-table th {
          background: #f0f0f0;
          padding: 4px 6px;
          font-weight: bold;
          color: #000;
          border: 1px solid #000;
          text-align: center;
          font-size: 8px;
          text-transform: uppercase;
        }
        .totals-table td {
          padding: 3px 6px;
          border: 1px solid #ccc;
        }
        .total-label {
          font-weight: 500;
          color: #000;
        }
        .total-amount {
          text-align: right;
          font-weight: 600;
        }
        .grand-total-row {
          background: #f0f0f0;
          font-weight: bold;
          color: #000;
        }
        
        /* Footer */
        .footer-section {
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7px;
          color: #333;
        }
        .footer-left {
          flex: 1;
        }
        .signature-section {
          text-align: center;
          width: 120px;
        }
        .signature-img { 
          max-height: 25px; 
          margin: 2px 0; 
        }
        .signature-text {
          font-size: 7px;
          color: #333;
          border-top: 1px solid #999;
          padding-top: 2px;
          margin-top: 20px;
        }
        .signature-placeholder {
          height: 25px;
          border-bottom: 1px solid #999;
          margin: 2px 0 4px 0;
        }
        
        @media print { 
          body { 
            font-size: 8px;
          }
          .items-table th, .items-table td {
            padding: 3px 3px;
          }
          .customer-section, .quote-info-section {
            padding: 6px;
          }
          .terms-box, .payment-box {
            padding: 5px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
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
        <div class="quote-section">
          <div class="quote-title">QUOTATION</div>
          <div class="quote-details">
            <div class="quote-number">No: ${orderDetails.quoteNumber}</div>
            <div>Date: ${formatDate(orderDetails.date)}</div>
            <div>Valid Until: ${formatDate(orderDetails.validUntil)}</div>
          </div>
        </div>
      </div>

      <div class="content">
        <!-- Customer and Quote Info Row -->
        <div class="info-row">
          <div class="customer-section">
            <div class="section-title">Bill To</div>
            <div class="customer-info">
              <div class="customer-name">${customerInfo.company}</div>
              <div>${customerInfo.name}</div>
              <div>${customerInfo.address}</div>
              <div>Phone: ${customerInfo.phone} | Email: ${
    customerInfo.email
  }</div>
              ${
                customerInfo.gstin
                  ? `<div>GSTIN: ${customerInfo.gstin}</div>`
                  : ""
              }
            </div>
          </div>
          <div class="quote-info-section">
            <div class="section-title">Quote Details</div>
            <div class="quote-info">
              <div><span class="info-label">GST:</span> ${gstPercentage}% (as applicable)</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 5%;">Sr.</th>
                <th style="width: 45%;">Description of Goods/Services</th>
                <th style="width: 8%;">HSN</th>
                <th style="width: 6%;">Qty</th>
                <th style="width: 5%;">Unit</th>
                <th style="width: 13%;">Rate (₹)</th>
                <th style="width: 13%;">Amount (₹)</th>
                <th style="width: 5%;">GST</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>
                  <div class="item-description">${item.description}</div>
                  ${
                    item.details
                      ? `<div class="item-details">${item.details}</div>`
                      : ""
                  }
                </td>
                <td class="text-center">${item.hsn}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-center">Nos</td>
                <td class="text-right">${item.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}</td>
                <td class="text-right">${(
                  item.quantity * item.price
                ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td class="text-center">${gstPercentage}%</td>
              </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Bottom Section -->
        <div class="bottom-section">
          <div class="left-info">
            <div class="terms-box">
              <div class="box-title">Terms & Conditions</div>
              <div class="box-content">
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
            <div class="payment-box">
              <div class="box-title">Bank Details</div>
              <div class="box-content">
                ${
                  typeof config.bankDetails === "string"
                    ? config.bankDetails.split("\n").join("<br>")
                    : `<strong>${
                        config.bankDetails.bankName || "Bank Name"
                      }</strong><br>
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
          <div class="totals-section">
            <table class="totals-table">
              <thead>
                <tr>
                  <th colspan="2">Amount Summary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="total-label">Subtotal</td>
                  <td class="total-amount">${subtotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</td>
                </tr>
                <tr>
                  <td class="total-label">CGST @ ${(taxRate * 50).toFixed(
                    1
                  )}%</td>
                  <td class="total-amount">${cgst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</td>
                </tr>
                <tr>
                  <td class="total-label">SGST @ ${(taxRate * 50).toFixed(
                    1
                  )}%</td>
                  <td class="total-amount">${sgst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</td>
                </tr>
                <tr class="grand-total-row">
                  <td class="total-label"><strong>Total Amount</strong></td>
                  <td class="total-amount"><strong>₹${total.toLocaleString(
                    "en-IN",
                    { minimumFractionDigits: 2 }
                  )}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <div class="footer-left">
            Thank you for your inquiry. We look forward to your business.
          </div>
          <div class="signature-section">
            <div class="signature-text">
              <strong>For ${companyInfo.name}</strong><br>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

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
  const tax = subtotal * (orderDetails.taxRate || 0.18);
  const total = subtotal + tax;

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
          margin: 15mm;
        }
        body { 
          font-family: 'Arial', sans-serif; 
          font-size: 10px;
          line-height: 1.2; 
          color: #333; 
          background: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          border-bottom: 1.5px solid ${config.brandColor || "#000"}; 
          padding-bottom: 8px; 
          margin-bottom: 10px;
        }
        .company-section {
          flex: 1;
        }
        .company-logo { 
          max-height: 35px; 
          margin-bottom: 5px; 
        }
        .company-name { 
          font-size: 16px; 
          font-weight: bold; 
          color: ${config.brandColor || "#000"}; 
          margin-bottom: 3px;
        }
        .company-details { 
          font-size: 8px; 
          color: #666; 
          line-height: 1.1;
        }
        .quote-section {
          text-align: right;
          flex-shrink: 0;
        }
        .quote-title { 
          font-size: 18px; 
          font-weight: bold; 
          color: ${config.brandColor || "#000"}; 
          margin-bottom: 3px;
        }
        .quote-details {
          font-size: 8px;
          color: #666;
          line-height: 1.2;
        }
        .quote-number {
          font-weight: bold;
          color: #000;
          font-size: 10px;
        }
        
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .customer-section { 
          margin-bottom: 8px;
        }
        .section-title { 
          font-size: 9px; 
          font-weight: bold; 
          color: ${config.brandColor || "#000"}; 
          text-transform: uppercase; 
          letter-spacing: 0.3px;
          margin-bottom: 3px;
        }
        .customer-info { 
          background: #f8f8f8; 
          padding: 6px 8px; 
          border-left: 2px solid ${config.brandColor || "#000"}; 
          font-size: 8px;
          line-height: 1.2;
        }
        .customer-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 8px;
          font-size: 8px;
          flex: 1;
        }
        .items-table th { 
          background: #f0f0f0; 
          padding: 4px 3px; 
          text-align: left; 
          font-weight: bold; 
          border-bottom: 1.5px solid ${config.brandColor || "#000"}; 
          color: ${config.brandColor || "#000"}; 
          font-size: 7px;
          text-transform: uppercase;
        }
        .items-table td { 
          padding: 3px 3px; 
          border-bottom: 0.5px solid #ddd; 
          vertical-align: top;
        }
        .item-description { 
          font-weight: 600; 
          margin-bottom: 1px;
          font-size: 8px;
        }
        .item-details { 
          font-size: 7px; 
          color: #666; 
          line-height: 1.1;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        
        .bottom-section {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }
        
        .terms-section {
          flex: 1;
        }
        .terms-content {
          font-size: 7px;
          color: #666;
          line-height: 1.3;
          max-height: 80px;
          overflow: hidden;
        }
        
        .totals-section {
          width: 180px;
          flex-shrink: 0;
        }
        .totals-table { 
          width: 100%;
          font-size: 8px;
        }
        .totals-table td {
          padding: 2px 5px;
          border-bottom: 0.5px solid #eee;
        }
        .total-final {
          font-weight: bold;
          font-size: 10px;
          border-bottom: 1.5px solid ${config.brandColor || "#000"} !important;
          background: #f8f8f8;
        }
        
        .footer-section {
          margin-top: 6px;
          padding-top: 4px;
          border-top: 0.5px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 7px;
          color: #999;
        }
        
        .signature-section {
          text-align: center;
        }
        .signature-img { 
          max-height: 20px; 
          margin: 3px 0; 
        }
        .signature-text {
          font-size: 7px;
          color: #666;
        }
        
        @media print { 
          body { 
            margin: 0;
            padding: 0;
            height: 100vh;
          }
          .header {
            break-inside: avoid;
          }
          .items-table {
            break-inside: auto;
          }
          .items-table tr {
            break-inside: avoid;
          }
          .bottom-section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-section">
          <div class="company-name">${companyInfo.name || "Company Name"}</div>
          <div class="company-details">
            ${companyInfo.address || "Company Address"}<br>
            ${companyInfo.phone || "Phone"} • ${companyInfo.email || "Email"}
            ${companyInfo.gstin ? `<br>GSTIN: ${companyInfo.gstin}` : ""}
          </div>
        </div>
        <div class="quote-section">
          <div class="quote-title">QUOTATION</div>
          <div class="quote-details">
            <div class="quote-number">#${
              orderDetails.quoteNumber || "QT001"
            }</div>
            <div>Date: ${
              orderDetails.date || new Date().toLocaleDateString()
            }</div>
            <div>Valid Until: ${
              orderDetails.validUntil ||
              new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()
            }</div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="customer-section">
          <div class="section-title">Bill To</div>
          <div class="customer-info">
            <div class="customer-name">${
              customerInfo.name || "Customer Name"
            }</div>
            ${customerInfo.company ? `<div>${customerInfo.company}</div>` : ""}
            <div>${customerInfo.address || "Customer Address"}</div>
            <div>${customerInfo.phone || "Phone"} • ${
    customerInfo.email || "Email"
  }</div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 40%;">Description</th>
              <th style="width: 10%;">HSN</th>
              <th style="width: 8%;" class="text-center">Qty</th>
              <th style="width: 18%;" class="text-right">Rate</th>
              <th style="width: 24%;" class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .slice(0, 12) // Now supports up to 12 items
              .map(
                (item) => `
              <tr>
                <td>
                  <div class="item-description">${
                    item.description || "Item"
                  }</div>
                  ${
                    item.details
                      ? `<div class="item-details">${item.details}</div>`
                      : ""
                  }
                </td>
                <td class="text-center">${item.hsn || "-"}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">₹${(item.price || 0).toLocaleString(
                  "en-IN"
                )}</td>
                <td class="text-right">₹${(
                  (item.quantity || 1) * (item.price || 0)
                ).toLocaleString("en-IN")}</td>
              </tr>
            `
              )
              .join("")}
            ${
              items.length > 12
                ? `<tr><td colspan="5" style="text-align: center; font-style: italic; color: #666; font-size: 7px;">... and ${
                    items.length - 12
                  } more items</td></tr>`
                : ""
            }
          </tbody>
        </table>

        <div class="bottom-section">
          <div class="terms-section">
            ${
              config.termsAndConditions
                ? `
              <div class="section-title">Terms & Conditions</div>
              <div class="terms-content">${config.termsAndConditions}</div>
            `
                : ""
            }
            ${
              config.bankDetails?.accountNumber
                ? `
              <div class="section-title" style="margin-top: 10px;">Payment Details</div>
              <div class="terms-content">
                <strong>${
                  config.bankDetails.accountName || companyInfo.name
                }</strong><br>
                Account: ${config.bankDetails.accountNumber}<br>
                IFSC: ${config.bankDetails.ifsc}<br>
                Bank: ${config.bankDetails.bankName}
              </div>
            `
                : ""
            }
          </div>
          
          <div class="totals-section">
            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">₹${subtotal.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>Tax (${((orderDetails.taxRate || 0.18) * 100).toFixed(
                  0
                )}%):</td>
                <td class="text-right">₹${tax.toLocaleString("en-IN")}</td>
              </tr>
              <tr class="total-final">
                <td><strong>Total:</strong></td>
                <td class="text-right"><strong>₹${total.toLocaleString(
                  "en-IN"
                )}</strong></td>
              </tr>
            </table>
          </div>
        </div>

        <div class="footer-section">
          <div>
            ${companyInfo.website || "www.company.com"}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

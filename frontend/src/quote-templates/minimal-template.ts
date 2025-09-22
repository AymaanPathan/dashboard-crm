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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.8; 
          color: #333; 
          background: #fff; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px; 
        }
        .header { 
          border-bottom: 2px solid ${config.brandColor || "#000"}; 
          padding-bottom: 30px; 
          margin-bottom: 40px; 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end; 
        }
        .company-name { 
          font-size: 36px; 
          font-weight: 300; 
          color: ${config.brandColor || "#000"}; 
          font-family: ${config.headerFont || "Helvetica Neue"};
          letter-spacing: -1px; 
        }
        .company-logo { 
          max-height: 50px; 
          margin-bottom: 10px; 
        }
        .quote-info { 
          text-align: right; 
          font-size: 14px; 
          color: #666; 
        }
        .quote-title { 
          font-size: 20px; 
          font-weight: 400; 
          margin-bottom: 10px; 
          color: ${config.brandColor || "#000"}; 
        }
        .section { 
          margin: 40px 0; 
        }
        .section-title { 
          font-size: 16px; 
          font-weight: 500; 
          color: ${config.brandColor || "#000"}; 
          margin-bottom: 15px; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
        }
        .customer-info { 
          background: #fafafa; 
          padding: 20px; 
          border-left: 3px solid ${config.brandColor || "#000"}; 
        }
        .company-details { 
          font-size: 14px; 
          color: #666; 
          margin-top: 10px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 40px 0; 
          font-size: 14px; 
        }
        th { 
          background: #f8f8f8; 
          padding: 15px 10px; 
          text-align: left; 
          font-weight: 500; 
          border-bottom: 2px solid ${config.brandColor || "#000"}; 
          color: ${config.brandColor || "#000"}; 
          text-transform: uppercase; 
          font-size: 12px; 
          letter-spacing: 0.5px; 
        }
        td { 
          padding: 15px 10px; 
          border-bottom: 1px solid #eee; 
        }
        .item-description { 
          font-weight: 500; 
        }
        .item-details { 
          font-size: 12px; 
          color: #888; 
          margin-top: 5px; 
        }
        .totals { 
          margin-top: 40px; 
          text-align: right; 
        }
        .total-line { 
          display: flex; 
          justify-content: space-between; 
          padding: 8px 0; 
          border-bottom: 1px solid #eee; 
        }
        .total-line:last-child { 
          border-bottom: 2px solid ${config.brandColor || "#000"}; 
          font-weight: 600; 
          font-size: 18px; 
          padding: 15px 0; 
          margin-top: 10px; 
        }
        .notes { 
          margin-top: 50px; 
          font-size: 13px; 
          color: #666; 
          line-height: 1.6; 
        }
        .signature { 
          margin-top: 60px; 
          text-align: right; 
        }
        .signature-img { 
          max-height: 60px; 
          margin: 15px 0; 
        }
        .footer { 
          margin-top: 60px; 
          text-align: center; 
          font-size: 12px; 
          color: #999; 
          border-top: 1px solid #eee; 
          padding-top: 30px; 
        }
        @media print { 
          body { padding: 0; } 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          ${
            companyInfo.logo
              ? `<img src="${companyInfo.logo}" alt="Logo" class="company-logo">`
              : ""
          }
          <div class="company-name">${companyInfo.name || "Company"}</div>
          <div class="company-details">
            ${companyInfo.address || "Address"}<br>
            ${companyInfo.phone || "Phone"} · ${companyInfo.email || "Email"}
          </div>
        </div>
        <div class="quote-info">
          <div class="quote-title">Quotation</div>
          <div><strong>#${orderDetails.quoteNumber || "QT001"}</strong></div>
          <div>${orderDetails.date || new Date().toLocaleDateString()}</div>
          <div>Valid: ${
            orderDetails.validUntil ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">To</div>
        <div class="customer-info">
          <div><strong>${customerInfo.name || "Customer Name"}</strong></div>
          ${customerInfo.company ? `<div>${customerInfo.company}</div>` : ""}
          <div>${customerInfo.address || "Customer Address"}</div>
          <div>${customerInfo.phone || "Phone"} · ${
    customerInfo.email || "Email"
  }</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th>HSN</th>
            <th>Qty</th>
            <th>Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td>
                <div class="item-description">${
                  item.description || "Item"
                }</div>
                <div class="item-details">${
                  item.details || "Item specifications"
                }</div>
              </td>
              <td>${item.hsn || "HSN"}</td>
              <td>${item.quantity || 1}</td>
              <td>₹${(item.price || 0).toLocaleString("en-IN")}</td>
              <td style="text-align: right;">₹${(
                (item.quantity || 1) * (item.price || 0)
              ).toLocaleString("en-IN")}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-line">
          <span>Subtotal</span>
          <span>₹${subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div class="total-line">
          <span>Tax (${((orderDetails.taxRate || 0.18) * 100).toFixed(
            0
          )}%)</span>
          <span>₹${tax.toLocaleString("en-IN")}</span>
        </div>
        <div class="total-line">
          <span>Total</span>
          <span>₹${total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      ${
        config.termsAndConditions
          ? `
        <div class="notes">
          <div class="section-title">Terms</div>
          ${config.termsAndConditions}
        </div>
      `
          : ""
      }

      ${
        config.signature
          ? `
        <div class="signature">
          <div>Authorized by</div>
          <img src="${config.signature}" alt="Signature" class="signature-img">
          <div><strong>${companyInfo.name || "Company"}</strong></div>
        </div>
      `
          : ""
      }

      <div class="footer">
        ${companyInfo.website || "www.company.com"}
      </div>
    </body>
    </html>
    `;
}

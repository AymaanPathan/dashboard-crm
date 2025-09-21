import { CompanyInfo, Config, CustomerInfo, OrderDetails } from "./classic-template";

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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #2d3748;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container { 
          max-width: 800px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, ${
            config.brandColor || "#4299e1"
          } 0%, ${config.accentColor || "#3182ce"} 100%); 
          color: white; 
          padding: 40px; 
          position: relative; 
          overflow: hidden; 
        }
        .header::before { 
          content: ''; 
          position: absolute; 
          top: -50%; 
          right: -50%; 
          width: 200%; 
          height: 200%; 
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); 
          opacity: 0.1; 
        }
        .header-content { 
          position: relative; 
          z-index: 1; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .company-info h1 { 
          font-size: 32px; 
          font-weight: 700; 
          margin-bottom: 10px; 
          font-family: ${config.headerFont || "Segoe UI"};
        }
        .company-logo { 
          max-height: 60px; 
          margin-bottom: 15px; 
          border-radius: 10px; 
        }
        .quote-badge { 
          background: rgba(255,255,255,0.2); 
          padding: 15px 25px; 
          border-radius: 50px; 
          text-align: center; 
          backdrop-filter: blur(10px); 
        }
        .quote-number { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 5px; 
        }
        .content { 
          padding: 40px; 
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 30px; 
          margin-bottom: 40px; 
        }
        .info-card { 
          background: #f7fafc; 
          padding: 25px; 
          border-radius: 15px; 
          border-left: 5px solid ${config.brandColor || "#4299e1"}; 
        }
        .info-title { 
          font-size: 18px; 
          font-weight: 600; 
          color: ${config.brandColor || "#4299e1"}; 
          margin-bottom: 15px; 
          display: flex; 
          align-items: center; 
        }
        .info-title::before { 
          content: '●'; 
          margin-right: 10px; 
          font-size: 20px; 
        }
        table { 
          width: 100%; 
          border-radius: 15px; 
          overflow: hidden; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
          margin: 30px 0; 
        }
        th { 
          background: linear-gradient(135deg, ${
            config.brandColor || "#4299e1"
          } 0%, ${config.accentColor || "#3182ce"} 100%); 
          color: white; 
          padding: 20px 15px; 
          text-align: left; 
          font-weight: 600; 
          font-size: 14px; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }
        td { 
          padding: 20px 15px; 
          border-bottom: 1px solid #e2e8f0; 
        }
        tr:nth-child(even) { 
          background: rgba(66, 153, 225, 0.03); 
        }
        tr:hover { 
          background: rgba(66, 153, 225, 0.08); 
          transform: translateY(-1px); 
          transition: all 0.3s ease; 
        }
        .total-card { 
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
          padding: 30px; 
          border-radius: 20px; 
          margin-top: 30px; 
          border: 2px solid ${config.brandColor || "#4299e1"}; 
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 15px 0; 
          font-size: 16px; 
          padding: 10px 0; 
        }
        .grand-total { 
          font-size: 28px; 
          font-weight: 700; 
          color: ${config.brandColor || "#4299e1"}; 
          border-top: 3px solid ${config.brandColor || "#4299e1"}; 
          padding-top: 20px; 
          margin-top: 20px; 
        }
        .notes-card { 
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%); 
          padding: 25px; 
          border-radius: 15px; 
          margin-top: 30px; 
          border-left: 5px solid #f56565; 
        }
        .signature-section { 
          text-align: center; 
          margin-top: 40px; 
          padding: 30px; 
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
          border-radius: 15px; 
        }
        .signature-img { 
          max-height: 80px; 
          margin: 20px 0; 
          border-radius: 10px; 
        }
        .footer { 
          background: ${config.brandColor || "#4299e1"}; 
          color: white; 
          text-align: center; 
          padding: 30px; 
          font-size: 14px; 
        }
        @media print { 
          body { background: white; } 
          .container { box-shadow: none; margin: 0; } 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-content">
            <div class="company-info">
              ${
                companyInfo.logo
                  ? `<img src="${companyInfo.logo}" alt="Logo" class="company-logo">`
                  : ""
              }
              <h1>${companyInfo.name || "Modern Company Ltd."}</h1>
              <p>${companyInfo.address || "Modern Office Address"}</p>
              <p>${companyInfo.phone || "+91 XXXXX XXXXX"} | ${
    companyInfo.email || "hello@modern.com"
  }</p>
            </div>
            <div class="quote-badge">
              <div class="quote-number">#${
                orderDetails.quoteNumber || "QT-001"
              }</div>
              <div>${orderDetails.date || new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="info-grid">
            <div class="info-card">
              <div class="info-title">Bill To</div>
              <strong>${customerInfo.name || "Customer Name"}</strong><br>
              ${customerInfo.company || "Customer Company"}<br>
              ${customerInfo.address || "Customer Address"}<br>
              ${customerInfo.phone || "Phone"} | ${
    customerInfo.email || "Email"
  }
            </div>
            <div class="info-card">
              <div class="info-title">Quote Details</div>
              <strong>Valid Until:</strong> ${
                orderDetails.validUntil ||
                new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()
              }<br>
              <strong>Payment Terms:</strong> ${
                orderDetails.paymentTerms || "30 days"
              }<br>
              <strong>Delivery:</strong> ${
                orderDetails.deliveryTime || "7-14 days"
              }
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <strong>${
                      item.description || "Product/Service"
                    }</strong><br>
                    <small style="color: #718096;">${
                      item.details || "Detailed specifications"
                    }</small>
                  </td>
                  <td>${item.hsn || "HSN123"}</td>
                  <td>${item.quantity || 1}</td>
                  <td>₹${(item.price || 0).toLocaleString("en-IN")}</td>
                  <td><strong>₹${(
                    (item.quantity || 1) * (item.price || 0)
                  ).toLocaleString("en-IN")}</strong></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-card">
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
              <span>Total Amount:</span>
              <span>₹${total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          ${
            config.termsAndConditions
              ? `
            <div class="notes-card">
              <div class="info-title">Terms & Conditions</div>
              ${config.termsAndConditions}
            </div>
          `
              : ""
          }

          ${
            config.signature
              ? `
            <div class="signature-section">
              <p><strong>Authorized By:</strong></p>
              <img src="${
                config.signature
              }" alt="Signature" class="signature-img">
              <p><strong>${companyInfo.name || "Company Name"}</strong></p>
            </div>
          `
              : ""
          }
        </div>

        <div class="footer">
          <p>Thank you for choosing us! 🚀</p>
          <p>${companyInfo.website || "www.company.com"}</p>
        </div>
      </div>
    </body>
    </html>
    `;
}

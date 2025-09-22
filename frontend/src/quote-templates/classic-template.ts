export interface CompanyInfo {
  website: string;
  gstin: string;
  email: string;
  logo: any;
  name: string;
  address: string;
  phone: string;
}

export interface CustomerInfo {
  gstin?: any;
  address: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface OrderDetails {
  deliveryTime: string;
  paymentTerms: string;
  discount: any;
  validUntil: string;
  quoteNumber: string;
  date: string;
  items: Array<{
    hsn: string;
    details: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  taxRate?: number;
}

export interface Config {
  signature: any;
  termsAndConditions: string;
  bankDetails: any;
  brandColor?: string;
  accentColor?: string;
  headerFont?: string;
}

export function getClassicTemplate(
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
          font-family: 'Times New Roman', serif; 
          line-height: 1.6; 
          color: #333;
          background: #fff;
        }
        .header { 
          background: ${config.brandColor || "#1a365d"}; 
          color: white; 
          padding: 30px; 
          text-align: center;
          border-bottom: 4px solid ${config.accentColor || "#2c5282"};
        }
        .company-logo { 
          max-height: 60px; 
          margin-bottom: 15px; 
        }
        .company-name { 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 10px;
          font-family: ${config.headerFont || "Times New Roman"};
        }
        .company-details { 
          font-size: 14px; 
          opacity: 0.9; 
        }
        .content { 
          padding: 40px; 
        }
        .quote-header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 40px; 
          border-bottom: 2px solid #eee; 
          padding-bottom: 20px; 
        }
        .quote-title { 
          font-size: 32px; 
          color: ${config.brandColor || "#1a365d"}; 
          font-weight: bold; 
        }
        .quote-meta { 
          text-align: right; 
          font-size: 14px; 
        }
        .customer-section { 
          background: #f8f9fa; 
          padding: 25px; 
          margin-bottom: 30px; 
          border-left: 4px solid ${config.brandColor || "#1a365d"}; 
        }
        .section-title { 
          font-size: 18px; 
          font-weight: bold; 
          color: ${config.brandColor || "#1a365d"}; 
          margin-bottom: 15px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        th { 
          background: ${config.brandColor || "#1a365d"}; 
          color: white; 
          padding: 15px; 
          text-align: left; 
          font-weight: bold; 
        }
        td { 
          padding: 12px 15px; 
          border-bottom: 1px solid #eee; 
        }
        tr:nth-child(even) { 
          background: #f8f9fa; 
        }
        .total-section { 
          background: #f8f9fa; 
          padding: 25px; 
          margin-top: 30px; 
          border: 2px solid ${config.brandColor || "#1a365d"}; 
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 10px 0; 
          font-size: 16px; 
        }
        .grand-total { 
          font-size: 24px; 
          font-weight: bold; 
          color: ${config.brandColor || "#1a365d"}; 
          border-top: 2px solid ${config.brandColor || "#1a365d"}; 
          padding-top: 15px; 
        }
        .notes-section { 
          margin-top: 40px; 
          padding: 25px; 
          background: #fff; 
          border: 1px solid #ddd; 
        }
        .signature-section { 
          margin-top: 50px; 
          text-align: right; 
        }
        .signature-img { 
          max-height: 80px; 
          margin: 20px 0; 
        }
        .footer { 
          text-align: center; 
          margin-top: 50px; 
          padding: 30px; 
          background: ${config.brandColor || "#1a365d"}; 
          color: white; 
          font-size: 14px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${
          companyInfo.logo
            ? `<img src="${companyInfo.logo}" alt="Company Logo" class="company-logo">`
            : ""
        }
        <div class="company-name">${
          companyInfo.name || "Your Company Name"
        }</div>
        <div class="company-details">
          ${companyInfo.address || "Company Address"}<br>
          Phone: ${companyInfo.phone || "+91 XXXXX XXXXX"} | Email: ${
    companyInfo.email || "info@company.com"
  }<br>
          GSTIN: ${companyInfo.gstin || "XX XXXXX XXXXX XXX"}
        </div>
      </div>

      <div class="content">
        <div class="quote-header">
          <div class="quote-title">QUOTATION</div>
          <div class="quote-meta">
            <strong>Quote #:</strong> ${
              orderDetails.quoteNumber || "QT-001"
            }<br>
            <strong>Date:</strong> ${
              orderDetails.date || new Date().toLocaleDateString()
            }<br>
            <strong>Valid Until:</strong> ${
              orderDetails.validUntil ||
              new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()
            }
          </div>
        </div>

        <div class="customer-section">
          <div class="section-title">Bill To:</div>
          <strong>${customerInfo.name || "Customer Name"}</strong><br>
          ${customerInfo.company || "Customer Company"}<br>
          ${customerInfo.address || "Customer Address"}<br>
          Phone: ${customerInfo.phone || "Customer Phone"}<br>
          Email: ${customerInfo.email || "customer@email.com"}
          ${customerInfo.gstin ? `<br>GSTIN: ${customerInfo.gstin}` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>HSN/SAC</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td><strong>${
                  item.description || "Item Description"
                }</strong><br>
                    <small>${
                      item.details || "Item details and specifications"
                    }</small></td>
                <td>${item.hsn || "HSN123"}</td>
                <td>${item.quantity || 1}</td>
                <td>₹${(item.price || 0).toLocaleString("en-IN")}</td>
                <td>₹${(
                  (item.quantity || 1) * (item.price || 0)
                ).toLocaleString("en-IN")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
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
          ${
            orderDetails.discount
              ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${orderDetails.discount.toLocaleString("en-IN")}</span>
            </div>
          `
              : ""
          }
          <div class="total-row grand-total">
            <span>Total Amount:</span>
            <span>₹${(total - (orderDetails.discount || 0)).toLocaleString(
              "en-IN"
            )}</span>
          </div>
        </div>

        ${
          config.bankDetails
            ? `
          <div class="notes-section">
            <div class="section-title">Bank Details:</div>
            Bank Name: ${config.bankDetails.bankName}<br>
            Account Name: ${config.bankDetails.accountName}<br>
            Account Number: ${config.bankDetails.accountNumber}<br>
            IFSC Code: ${config.bankDetails.ifscCode}<br>
            Branch: ${config.bankDetails.branch}
          </div>
        `
            : ""
        }

        <div class="notes-section">
          <div class="section-title">Terms & Conditions:</div>
          ${
            config.termsAndConditions ||
            "Default terms and conditions will be displayed here."
          }
        </div>

        ${
          config.signature
            ? `
          <div class="signature-section">
            <p>Authorized Signature:</p>
            <img src="${
              config.signature
            }" alt="Signature" class="signature-img">
            <p><strong>${companyInfo.name || "Your Company"}</strong></p>
          </div>
        `
            : ""
        }
      </div>

      <div class="footer">
        Thank you for your business!<br>
        ${companyInfo.website || "www.yourcompany.com"} | ${
    companyInfo.email || "info@company.com"
  }
      </div>
    </body>
    </html>
    `;
}

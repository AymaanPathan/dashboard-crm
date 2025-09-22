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
          font-family: 'Georgia', 'Times New Roman', serif; 
          line-height: 1.4; 
          color: #2c3e50;
          background: #fff;
          font-size: 11px;
          max-width: 8.27in;
          margin: 0 auto;
        }
        
        /* Header Section */
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 0 15px 0;
          border-bottom: 3px solid ${config.brandColor || "#2c3e50"};
          margin-bottom: 20px;
        }
        .company-section {
          flex: 1;
        }
        .logo-container {
          text-align: right;
          flex: 0 0 120px;
        }
        .company-logo { 
          max-height: 50px; 
          max-width: 120px;
        }
        .company-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: ${config.brandColor || "#2c3e50"};
          margin-bottom: 6px;
          font-family: ${config.headerFont || "Georgia"};
        }
        .company-details { 
          font-size: 10px; 
          color: #5a6c7d;
          line-height: 1.3;
        }
        
        /* Document Header */
        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background: linear-gradient(135deg, ${
            config.brandColor || "#2c3e50"
          } 0%, ${config.accentColor || "#34495e"} 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
        }
        .document-title { 
          font-size: 20px; 
          font-weight: bold;
          letter-spacing: 1px;
        }
        .document-meta { 
          text-align: right; 
          font-size: 10px;
          line-height: 1.4;
        }
        .document-meta strong {
          display: inline-block;
          width: 70px;
        }
        
        /* Customer Section */
        .customer-billing {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .customer-box {
          flex: 0 0 48%;
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid ${config.brandColor || "#2c3e50"};
          border-radius: 0 4px 4px 0;
        }
        .section-title { 
          font-size: 12px; 
          font-weight: bold; 
          color: ${config.brandColor || "#2c3e50"}; 
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .customer-details {
          font-size: 10px;
          line-height: 1.4;
        }
        
        /* Items Table */
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 10px;
          border: 1px solid #ddd;
        }
        .items-table th { 
          background: linear-gradient(135deg, ${
            config.brandColor || "#2c3e50"
          } 0%, ${config.accentColor || "#34495e"} 100%);
          color: white; 
          padding: 8px 6px; 
          text-align: left; 
          font-weight: bold; 
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .items-table td { 
          padding: 8px 6px; 
          border-bottom: 1px solid #eee;
          vertical-align: top;
        }
        .items-table tr:nth-child(even) { 
          background: #f8f9fa; 
        }
        .item-desc {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 2px;
        }
        .item-details {
          color: #7f8c8d;
          font-size: 9px;
          font-style: italic;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        
        /* Totals Section */
        .totals-container {
          display: flex;
          justify-content: flex-end;
          margin: 15px 0;
        }
        .totals-section { 
          width: 280px;
          border: 2px solid ${config.brandColor || "#2c3e50"};
          border-radius: 4px;
        }
        .totals-header {
          background: ${config.brandColor || "#2c3e50"};
          color: white;
          padding: 8px 15px;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .totals-body {
          padding: 10px 15px;
          background: #f8f9fa;
        }
        .total-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 6px 0; 
          font-size: 10px;
          padding: 2px 0;
        }
        .grand-total { 
          font-size: 13px; 
          font-weight: bold; 
          color: ${config.brandColor || "#2c3e50"}; 
          border-top: 2px solid ${config.brandColor || "#2c3e50"}; 
          padding-top: 8px;
          margin-top: 8px;
        }
        
        /* Footer Sections */
        .footer-sections {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        .footer-box {
          flex: 1;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 4px;
          border-top: 3px solid ${config.brandColor || "#2c3e50"};
        }
        .footer-title {
          font-size: 10px;
          font-weight: bold;
          color: ${config.brandColor || "#2c3e50"};
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .footer-content {
          font-size: 9px;
          line-height: 1.4;
          color: #5a6c7d;
        }
        
        /* Signature */
        .signature-section { 
          text-align: right; 
          margin-top: 15px;
        }
        .signature-img { 
          max-height: 40px; 
          margin: 8px 0; 
        }
        .signature-text {
          font-size: 9px;
          color: #7f8c8d;
          border-top: 1px solid #ddd;
          padding-top: 5px;
          display: inline-block;
          min-width: 150px;
        }
        
        /* Final Footer */
        .final-footer { 
          text-align: center; 
          margin-top: 15px; 
          padding: 10px; 
          background: linear-gradient(135deg, ${
            config.brandColor || "#2c3e50"
          } 0%, ${config.accentColor || "#34495e"} 100%);
          color: white; 
          font-size: 9px;
          border-radius: 4px;
        }
        
        /* Print Optimizations */
        @media print {
          body { font-size: 10px; }
          .header-container { padding: 15px 0 10px 0; }
          .document-header { padding: 8px 15px; }
          .customer-box { padding: 10px; }
          .items-table th, .items-table td { padding: 5px 4px; }
          .totals-section { width: 250px; }
          .footer-sections { margin-top: 15px; }
          .final-footer { margin-top: 10px; padding: 8px; }
        }
      </style>
    </head>
    <body>
      <!-- Header Section -->
      <div class="header-container">
        <div class="company-section">
          <div class="company-name">${
            companyInfo.name || "Your Company Name"
          }</div>
          <div class="company-details">
            ${companyInfo.address || "Company Address"}<br>
            Phone: ${companyInfo.phone || "+91 XXXXX XXXXX"} • Email: ${
    companyInfo.email || "info@company.com"
  }<br>
            ${companyInfo.gstin ? `GSTIN: ${companyInfo.gstin}` : ""}
            ${companyInfo.website ? ` • ${companyInfo.website}` : ""}
          </div>
        </div>
        ${
          companyInfo.logo
            ? `
        <div class="logo-container">
          <img src="${companyInfo.logo}" alt="Company Logo" class="company-logo">
        </div>
        `
            : ""
        }
      </div>

      <!-- Document Header -->
      <div class="document-header">
        <div class="document-title">QUOTATION</div>
        <div class="document-meta">
          <strong>Quote #:</strong> ${orderDetails.quoteNumber || "QT-001"}<br>
          <strong>Date:</strong> ${
            orderDetails.date || new Date().toLocaleDateString("en-GB")
          }<br>
          <strong>Valid Until:</strong> ${
            orderDetails.validUntil ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-GB"
            )
          }
        </div>
      </div>

      <!-- Customer Information -->
      <div class="customer-billing">
        <div class="customer-box">
          <div class="section-title">Bill To</div>
          <div class="customer-details">
            <strong>${customerInfo.name || "Customer Name"}</strong><br>
            ${customerInfo.company ? `${customerInfo.company}<br>` : ""}
            ${customerInfo.address || "Customer Address"}<br>
            Phone: ${customerInfo.phone || "Customer Phone"}<br>
            Email: ${customerInfo.email || "customer@email.com"}
            ${customerInfo.gstin ? `<br>GSTIN: ${customerInfo.gstin}` : ""}
          </div>
        </div>
        <div class="customer-box">
          <div class="section-title">Quote Details</div>
          <div class="customer-details">
            <strong>Payment Terms:</strong> ${
              orderDetails.paymentTerms || "Net 30 days"
            }<br>
            <strong>Delivery Time:</strong> ${
              orderDetails.deliveryTime || "5-7 business days"
            }<br>
            <strong>Valid Until:</strong> ${
              orderDetails.validUntil ||
              new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-GB")
            }
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th width="5%">#</th>
            <th width="45%">Description</th>
            <th width="12%">HSN/SAC</th>
            <th width="8%">Qty</th>
            <th width="15%">Unit Price</th>
            <th width="15%">Amount</th>
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
                item.description || "Item Description"
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
            <td class="text-right">₹${(
              (item.quantity || 1) * (item.price || 0)
            ).toLocaleString("en-IN")}</td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <!-- Totals Section -->
      <div class="totals-container">
        <div class="totals-section">
          <div class="totals-header">Summary</div>
          <div class="totals-body">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${subtotal.toLocaleString("en-IN")}</span>
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
            <div class="total-row">
              <span>Tax (${((orderDetails.taxRate || 0.18) * 100).toFixed(
                0
              )}%):</span>
              <span>₹${tax.toLocaleString("en-IN")}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>₹${(total - (orderDetails.discount || 0)).toLocaleString(
                "en-IN"
              )}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Sections -->
      <div class="footer-sections">
        ${
          config.bankDetails
            ? `
        <div class="footer-box">
          <div class="footer-title">Bank Details</div>
          <div class="footer-content">
            <strong>${config.bankDetails.bankName || "Bank Name"}</strong><br>
            A/c: ${config.bankDetails.accountNumber || "Account Number"}<br>
            IFSC: ${config.bankDetails.ifscCode || "IFSC Code"}<br>
            Branch: ${config.bankDetails.branch || "Branch"}
          </div>
        </div>
        `
            : ""
        }
        <div class="footer-box">
          <div class="footer-title">Terms & Conditions</div>
          <div class="footer-content">
            ${
              config.termsAndConditions ||
              "Payment due within 30 days. Prices are subject to change without notice. All disputes subject to local jurisdiction."
            }
          </div>
        </div>
      </div>

      <!-- Signature -->
      ${
        config.signature
          ? `
      <div class="signature-section">
        <img src="${
          config.signature
        }" alt="Signature" class="signature-img"><br>
        <div class="signature-text">
          <strong>Authorized Signatory</strong><br>
          ${companyInfo.name || "Your Company"}
        </div>
      </div>
      `
          : ""
      }

      <!-- Final Footer -->
      <div class="final-footer">
        Thank you for considering our services • ${
          companyInfo.email || "info@company.com"
        } • ${companyInfo.phone || "+91 XXXXX XXXXX"}
      </div>
    </body>
    </html>
    `;
}

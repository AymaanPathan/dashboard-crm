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
    })
      .format(amount)
      .replace("₹", "₹");
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

  // Split tax for CGST/SGST (assuming equal split)
  const cgst = tax / 2;
  const sgst = tax / 2;
  const gstRate = (taxRate * 100).toFixed(0);

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
            font-family: 'Arial', sans-serif; 
            line-height: 1.2; 
            color: #333;
            background: #fff;
            font-size: 10px;
            max-width: 8.27in;
            margin: 0 auto;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* Header Section */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
            margin-bottom: 12px;
        }
        .company-info {
            flex: 1;
            max-width: 65%;
        }
        .company-name { 
            font-size: 20px; 
            font-weight: bold; 
            color: #333;
            margin-bottom: 3px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .company-details { 
            font-size: 9px; 
            color: #555;
            line-height: 1.3;
        }
        .logo-section {
            flex: 0 0 120px;
            text-align: right;
        }
        .company-logo { 
            max-height: 50px; 
            max-width: 120px;
        }
        
        /* Document Title */
        .doc-title {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .title-text { 
            font-size: 16px; 
            font-weight: bold;
            color: #333;
            letter-spacing: 0.5px;
        }
        .doc-meta { 
            text-align: right; 
            font-size: 9px;
            color: #555;
            line-height: 1.3;
        }
        
        /* Customer and Quote Details */
        .info-section {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }
        .info-box {
            flex: 1;
            border: 1px solid #ddd;
            background: #fafafa;
            padding: 10px;
        }
        .box-title { 
            font-size: 10px; 
            font-weight: bold; 
            color: #333; 
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
        }
        .box-content {
            font-size: 9px;
            line-height: 1.4;
            color: #555;
        }
        
        /* Items Table */
        .table-container {
            flex: 1;
            margin-bottom: 8px;
        }
        .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 9px;
            border: 1px solid #333;
        }
        .items-table th { 
            background: #f0f0f0;
            color: #333; 
            padding: 5px 4px; 
            text-align: center; 
            font-weight: bold; 
            font-size: 8px;
            text-transform: uppercase;
            border: 1px solid #333;
            vertical-align: middle;
        }
        .items-table td { 
            padding: 4px; 
            border: 1px solid #333;
            vertical-align: top;
            font-size: 8.5px;
        }
        .items-table tbody tr:nth-child(even) { 
            background: #f9f9f9; 
        }
        .item-desc {
            font-weight: 600;
            color: #333;
            margin-bottom: 1px;
        }
        .item-details {
            color: #666;
            font-size: 7.5px;
            font-style: italic;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        /* Bottom Section */
        .bottom-section {
            display: flex;
            gap: 12px;
            margin-top: auto;
        }
        
        /* Totals */
        .totals-container {
            flex: 0 0 200px;
        }
        .totals-table {
            width: 100%;
            border: 1px solid #333;
            font-size: 9px;
            border-collapse: collapse;
        }
        .totals-table th {
            background: #f0f0f0;
            color: #333;
            padding: 5px;
            font-weight: bold;
            text-align: center;
            font-size: 9px;
            text-transform: uppercase;
            border: 1px solid #333;
        }
        .totals-table td {
            padding: 4px 8px;
            border: 1px solid #333;
        }
        .total-label { 
            font-weight: 500; 
            text-align: left;
        }
        .total-amount { 
            text-align: right; 
            font-weight: 600; 
        }
        .grand-total-row {
            background: #f5f5f5;
            font-weight: bold;
            color: #333;
        }
        
        /* Terms and Bank Details */
        .left-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .terms-box, .bank-box {
            border: 1px solid #ddd;
            background: #fafafa;
            padding: 6px;
            font-size: 8px;
        }
        .info-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 3px;
            font-size: 8.5px;
            text-transform: uppercase;
        }
        .info-content {
            color: #555;
            line-height: 1.3;
        }
        
        /* Signature */
        .signature {
            text-align: right;
            margin-top: 6px;
            padding-right: 20px;
        }
        .signature-img { 
            max-height: 25px; 
            margin: 3px 0; 
        }
        .signature-text {
            font-size: 8px;
            color: #555;
            border-top: 1px solid #999;
            padding-top: 2px;
            display: inline-block;
            min-width: 100px;
        }
        
        /* Footer */
        .footer { 
            text-align: center; 
            margin-top: 6px; 
            padding: 4px; 
            background: #f5f5f5;
            color: #555; 
            font-size: 8px;
            border: 1px solid #ddd;
        }
        
        /* Print Optimization */
        @media print {
            body { 
                font-size: 9px; 
                -webkit-print-color-adjust: exact;
            }
            .items-table th, .items-table td { 
                padding: 3px 2px; 
                font-size: 8px;
            }
            .info-box { padding: 6px; }
            .totals-table td { padding: 2px 6px; }
            .terms-box, .bank-box { font-size: 7px; }
            @page {
                margin: 0.4in;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="company-info">
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-details">
                ${companyInfo.address}<br>
                Phone: ${companyInfo.phone} • Email: ${companyInfo.email}<br>
            </div>
        </div>
    </div>

    <!-- Document Title -->
    <div class="doc-title">
        <div class="title-text">QUOTATION</div>
        <div class="doc-meta">
            <strong>Quote No:</strong> ${orderDetails.quoteNumber}<br>
            <strong>Date:</strong> ${formatDate(
              Date.now().toLocaleString()
            )}<br>
            <strong>Valid Until:</strong> ${formatDate(orderDetails.validUntil)}
        </div>
    </div>

    <!-- Customer and Quote Info -->
    <div class="info-section">
        <div class="info-box">
            <div class="box-title">Bill To</div>
            <div class="box-content">
                <strong>${customerInfo.company}</strong><br>
                Attn: ${customerInfo.name}<br>
                Phone: ${customerInfo.phone}<br>
                Email: ${customerInfo.email}
            </div>
        </div>
        <div class="info-box">
            <div class="box-title">Quote Details</div>
            <div class="box-content">
                <strong>Quote Validity:</strong> ${formatDate(
                  orderDetails.validUntil
                )}<br>
                <strong>GST Rate:</strong> ${gstRate}% (As Applicable)
            </div>
        </div>
    </div>

    <!-- Items Table -->
    <div class="table-container">
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">S.No</th>
                    <th style="width: 40%;">Description of Goods/Services</th>
                    <th style="width: 8%;">HSN/SAC</th>
                    <th style="width: 6%;">Qty</th>
                    <th style="width: 5%;">Unit</th>
                    <th style="width: 12%;">Rate (₹)</th>
                    <th style="width: 12%;">Amount (₹)</th>
                    <th style="width: 6%;">GST%</th>
                </tr>
            </thead>
            <tbody>
                ${items
                  .map(
                    (item, index) => `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-center">Nos</td>
                    <td class="text-right">${formatCurrency(item.price).replace(
                      "₹",
                      ""
                    )}</td>
                    <td class="text-right">${formatCurrency(
                      item.quantity * item.price
                    ).replace("₹", "")}</td>
                    <td class="text-center">${gstRate}%</td>
                </tr>
                `
                  )
                  .join("")}
                ${
                  items.length < 5
                    ? Array(5 - items.length)
                        .fill(0)
                        .map(
                          () => `
                <tr>
                    <td class="text-center">-</td>
                    <td></td>
                    <td class="text-center">-</td>
                    <td class="text-center">-</td>
                    <td class="text-center">-</td>
                    <td class="text-right">-</td>
                    <td class="text-right">-</td>
                    <td class="text-center">-</td>
                </tr>
                `
                        )
                        .join("")
                    : ""
                }
            </tbody>
        </table>
    </div>

    <!-- Bottom Section -->
  <div class="bottom-wrapper">
  <div class="left-info">
    <!-- Terms & Conditions -->
    <div class="info-section">
      <div class="section-title">Terms & Conditions</div>
      <div class="section-content">
        ${
          config.termsAndConditions && config.termsAndConditions.length > 0
            ? config.termsAndConditions
                .map((line, idx) => `${idx + 1}. ${line}<br>`)
                .join("")
            : `1. Prices are valid for 30 days from quote date.<br>
               2. Payment terms as mentioned above.<br>
               3. Delivery as per agreed schedule.<br>
               4. All disputes subject to local jurisdiction.`
        }
      </div>
    </div>

    <!-- Bank Details -->
    ${
      config.bankDetails
        ? `
      <div class="info-section">
        <div class="section-title">Bank Details</div>
        <div class="section-content">
          ${
            Array.isArray(config.bankDetails)
              ? config.bankDetails.map((line) => `${line}<br>`).join("")
              : `<strong>${config.bankDetails.bankName}</strong><br>
                 A/c No: ${config.bankDetails.accountNumber}<br>
                 IFSC: ${config.bankDetails.ifsc}<br>`
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
    <div class="signature">
        <div class="signature-text">
            <strong>For ${companyInfo.name}</strong><br>
            Authorized Signatory
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        This is a computer generated quotation and does not require physical signature. | 
        For any queries, contact: ${companyInfo.email} | ${companyInfo.phone}
    </div>
</body>
</html>
    `;
}

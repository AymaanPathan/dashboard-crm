import puppeteer from "puppeteer";
import AWS from "aws-sdk";
import { quotation_bucket_name } from "../../constant/aws";
import { compressPdf } from "../compressPdf";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadQuotationPDF(quotationId: string, html: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();

  const compressedBuffer = await compressPdf(Buffer.from(pdfBuffer), "ebook");

  const key = `quotations/${quotationId}.pdf`;
  await s3
    .putObject({
      Bucket: quotation_bucket_name!,
      Key: key,
      Body: compressedBuffer,
      ContentType: "application/pdf",
    })
    .promise();

  return `https://${quotation_bucket_name}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

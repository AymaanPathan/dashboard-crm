import puppeteer from "puppeteer";
import { compressPdf } from "../compressPdf";
import { order_bucket_name } from "../../constant/aws";
import { uploadToS3 } from "./s3.utils";

export async function uploadOrderPDF(orderId: string, html: string) {
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

  // Compress PDF
  const compressedBuffer = await compressPdf(Buffer.from(pdfBuffer), "ebook");

  // Upload to S3 using existing function
  const key = `orders/${orderId}.pdf`;
  const pdfUrl = await uploadToS3(
    compressedBuffer,
    order_bucket_name!,
    key,
    "application/pdf"
  );

  return pdfUrl;
}

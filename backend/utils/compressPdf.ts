import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

/**
 * Compress PDF buffer using Ghostscript
 * @param pdfBuffer Buffer of the PDF to compress
 * @param quality Compression level: 'screen' | 'ebook' | 'printer' | 'prepress'
 */
export async function compressPdf(
  pdfBuffer: Buffer,
  quality: "screen" | "ebook" | "printer" | "prepress" = "ebook"
): Promise<Buffer> {
  const inputPath = path.join(tmpdir(), `input-${Date.now()}.pdf`);
  const outputPath = path.join(tmpdir(), `output-${Date.now()}.pdf`);
  const gsCommand = process.platform === "win32" ? "gswin64c" : "gs";

  await writeFile(inputPath, pdfBuffer);

  await new Promise<void>((resolve, reject) => {
    const gs = spawn(gsCommand, [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=/${quality}`, // e.g., ebook
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${outputPath}`,
      inputPath,
    ]);

    gs.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Ghostscript failed with code ${code}`));
    });
  });

  const compressedBuffer = await readFile(outputPath);

  // Clean up temp files
  await unlink(inputPath);
  await unlink(outputPath);

  return compressedBuffer;
}

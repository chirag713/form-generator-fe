"use client";

import type { TDocumentDefinitions, TCreatedPdf } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Define exact type for pdfMake
interface PdfMake {
  vfs?: Record<string, string>;
  createPdf: (definition: TDocumentDefinitions) => TCreatedPdf;
}

// Type-cast safely
const typedPdfMake = pdfMake as unknown as PdfMake;

// Assign fonts only if available
const fonts = (pdfFonts as { pdfMake?: { vfs: Record<string, string> }; vfs?: Record<string, string> });
typedPdfMake.vfs = fonts.pdfMake?.vfs ?? fonts.vfs ?? {};

export default typedPdfMake;

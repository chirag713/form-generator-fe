declare module "pdfmake/interfaces" {
  export interface TDocumentDefinitions {
    content: unknown[] | string;
    styles?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface TCreatedPdf {
    download: (fileName?: string, cb?: () => void) => void;
    getBase64: (cb: (data: string) => void) => void;
    open: () => void;
  }
}

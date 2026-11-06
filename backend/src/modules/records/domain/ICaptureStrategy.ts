export interface CaptureResult {
  buffer: Buffer;
  serverIp?: string;
  httpHeaders?: Record<string, string>;
  capturedAt: Date;
  mimeType: string;
}

/**
 * Interface para estratégias de captura automatizada em navegador headless.
 * Princípios SOLID:
 * - O (Open/Closed): O sistema pode ser estendido com novas estratégias (vídeo, full-page) sem alterar os Use Cases.
 * - L (Liskov Substitution): Qualquer implementação (PuppeteerScreenshot, PlaywrightScreenshot) deve ser intercambiável.
 */
export interface ICaptureStrategy {
  capture(url: string): Promise<CaptureResult>;
}


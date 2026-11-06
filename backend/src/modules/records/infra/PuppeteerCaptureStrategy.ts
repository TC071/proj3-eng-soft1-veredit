import puppeteer from 'puppeteer';
import { ICaptureStrategy, CaptureResult } from '../domain/ICaptureStrategy';

export class PuppeteerCaptureStrategy implements ICaptureStrategy {
  public async capture(url: string): Promise<CaptureResult> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      let serverIp = '127.0.0.1';
      let responseHeaders: Record<string, string> = {};

      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      if (response) {
        responseHeaders = response.headers();
        const remoteAddress = response.remoteAddress();
        if (remoteAddress && remoteAddress.ip) {
          serverIp = remoteAddress.ip;
        }
      }

      // Captura da tela da página (PNG)
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png',
      });

      const buffer = Buffer.isBuffer(screenshot) ? screenshot : Buffer.from(screenshot);

      return {
        buffer,
        serverIp,
        httpHeaders: responseHeaders,
        capturedAt: new Date(),
        mimeType: 'image/png',
      };
    } finally {
      await browser.close();
    }
  }
}


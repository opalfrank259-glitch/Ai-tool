/**
 * Editor Adapter Abstraction
 * As specified in TRD §9 and Milestone 5 (T-050)
 * Allows the application to work seamlessly with Photopea (embedded iframe)
 * or Screenshot/Preview upload mode, with future Photoshop UXP plugin compatibility.
 */

export interface DocumentInfo {
  width: number;
  height: number;
  dpi?: number;
  layers?: string[];
  texts?: string[];
}

export interface EditorAdapter {
  name: 'photopea' | 'photoshop-uxp' | 'screenshot';
  getDocumentInfo(): Promise<DocumentInfo | null>;
  getPreview(): Promise<Blob | null>;
  openStarterFile(fileData: string | ArrayBuffer): Promise<void>;
  getEmbedUrl?(starterJsonConfig?: any): string;
}

export class PhotopeaAdapter implements EditorAdapter {
  name = 'photopea' as const;
  private iframeRef: HTMLIFrameElement | null = null;

  constructor(iframe?: HTMLIFrameElement) {
    if (iframe) this.iframeRef = iframe;
  }

  setIframe(iframe: HTMLIFrameElement | null) {
    this.iframeRef = iframe;
  }

  getEmbedUrl(starterJsonConfig?: any): string {
    const baseUrl = 'https://www.photopea.com';
    if (!starterJsonConfig) {
      return `${baseUrl}#%7B%22environment%22%3A%7B%22theme%22%3A0%7D%7D`;
    }
    const encoded = encodeURIComponent(JSON.stringify(starterJsonConfig));
    return `${baseUrl}#${encoded}`;
  }

  async getDocumentInfo(): Promise<DocumentInfo | null> {
    // In live Photopea postMessage environment, queries app.activeDocument
    return {
      width: 1080,
      height: 1080,
      dpi: 300,
      layers: [
        '01_Color_Grading',
        '02_Typography_Badges',
        '03_Depth_Effects',
        '04_Hero_Subject',
        '05_Background',
      ],
      texts: ['KARACHI SPECIAL BIRYANI', 'FLAT 20% OFF', 'ORDER NOW: 0300-1234567'],
    };
  }

  async getPreview(): Promise<Blob | null> {
    return null;
  }

  async openStarterFile(fileData: string | ArrayBuffer): Promise<void> {
    if (!this.iframeRef?.contentWindow) return;
    this.iframeRef.contentWindow.postMessage(fileData, '*');
  }
}

export class ScreenshotAdapter implements EditorAdapter {
  name = 'screenshot' as const;

  async getDocumentInfo(): Promise<DocumentInfo | null> {
    return null; // Screenshots cannot verify hidden document properties
  }

  async getPreview(): Promise<Blob | null> {
    return null;
  }

  async openStarterFile(): Promise<void> {
    // No-op for screenshot mode
  }
}

export const defaultPhotopeaAdapter = new PhotopeaAdapter();
export const defaultScreenshotAdapter = new ScreenshotAdapter();

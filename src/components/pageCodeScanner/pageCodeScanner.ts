import { html, css } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Capacitor } from '@capacitor/core';
import { loadCss } from '../../shared/functions';

export class PageCodeScanner extends Page {
  @state() hasPermission: boolean | null = null;
  @state() error: string | null = null;
  @state() scanning: boolean = false;

  private videoElement: HTMLVideoElement | null = null;
  private codeReader: BrowserMultiFormatReader | null = null;
  private stream: MediaStream | null = null;
  private controls: any = null;
  private html5QrCode: any = null;

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
        background: black;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 9999;
      }

      #scanner-container {
        width: 100%;
        height: 100%;
        position: relative;
        background: black;
      }

      #video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #qr-reader {
        width: 100%;
        height: 100%;
        background: black;
        position: absolute;
        top: 0;
        left: 0;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: 10;
      }

      .scan-area {
        width: 250px;
        height: 250px;
        border: 3px solid rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
        position: relative;
      }

      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--group-button-active-bg, var(--palette-green));
        animation: scan 2s linear infinite;
      }

      @keyframes scan {
        0% { top: 0; }
        50% { top: 100%; }
        100% { top: 0; }
      }

      .controls {
        position: fixed;
        bottom: 25px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        pointer-events: auto;
        z-index: 20;
      }

      .back-btn {
        border: none;
        background-color: var(--group-button-active-bg, var(--palette-green));
        color: var(--group-button-active-text, #fff);
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
      }

      .error-msg {
        color: white;
        background: rgba(255, 0, 0, 0.8);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
        pointer-events: auto;
      }

      .permission-request {
        color: white;
        text-align: center;
        padding: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: black;
        z-index: 30;
      }
    `
  ];

  firstUpdated() {
    PageCodeScanner.styles.forEach((style, i) => {
      loadCss(String(style), `page-code-scanner-styles-${i}`);
    });
    setTimeout(() => this.startScanning(), 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopScanning();
  }

  private async checkCameraPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const { Camera } = await import('@capacitor/camera');
      let permission = await Camera.checkPermissions();
      
      if (permission.camera !== 'granted') {
        permission = await Camera.requestPermissions();
      }
      
      return permission.camera === 'granted';
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err) {
        console.error("Web camera permission error:", err);
        return false;
      }
    }
  }

  async startScanning() {
    this.error = null;
    try {
      const hasPermission = await this.checkCameraPermission();
      
      if (!hasPermission) {
        this.hasPermission = false;
        this.error = this.translations.cameraError || "Camera access denied or error starting scanner. Please check permissions.";
        return;
      }

      this.hasPermission = true;
      await this.setupCamera();
      this.scanning = true;

    } catch (err) {
      console.error("Error starting scanner:", err);
      this.hasPermission = false;
      this.error = this.translations.cameraError || "Camera access denied or error starting scanner. Please check permissions.";
    }
  }

  private async setupCamera() {
    console.log('setupCamera - isNativePlatform:', Capacitor.isNativePlatform());
    
    this.videoElement = this.querySelector('#video');

    if (!this.videoElement) {
      console.error("Video element not found");
      return;
    }

    if (Capacitor.isNativePlatform()) {
      await this.setupNativeScanner();
    } else {
      await this.setupWebScanner();
    }
  }

  private async setupNativeScanner() {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.videoElement!.srcObject = this.stream;
    await this.videoElement!.play();

    this.codeReader = new BrowserMultiFormatReader();
    
    try {
      this.controls = await this.codeReader.decodeFromVideoDevice(
        null, 
        this.videoElement!, 
        (result, _error) => {
          if (result) {
            console.log(`Scan result: ${result.getText()}`);
            this.stopScanning();
            this.triggerPageNavigation({ page: 'food', code: result.getText() });
          }
        }
      );
    } catch (err) {
      console.error("Error setting up native barcode reader:", err);
    }
  }

  private async setupWebScanner() {
    console.log('setupWebScanner - starting');
    const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
    console.log('setupWebScanner - imported html5-qrcode');
    
    const qrReader = this.querySelector('#qr-reader') as HTMLElement;
    console.log('setupWebScanner - qrReader:', qrReader);
    if (qrReader) {
      qrReader.style.display = 'block';
      qrReader.style.width = '100%';
      qrReader.style.height = '100%';
    }
    
    this.html5QrCode = new Html5Qrcode("qr-reader");
    console.log('setupWebScanner - html5QrCode created');
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.QR_CODE
      ]
    };

    try {
      console.log('setupWebScanner - starting camera...');
      await this.html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          console.log(`Scan result: ${decodedText}`);
          this.stopScanning();
          this.triggerPageNavigation({ page: 'food', code: decodedText });
        },
        () => {}
      );
      
      // Fix video positioning after html5-qrcode starts
      setTimeout(() => {
        const video = this.querySelector('#qr-reader video') as HTMLVideoElement;
        const qrReader = this.querySelector('#qr-reader');
        if (video && qrReader) {
          (video as any).style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important;';
          (qrReader as any).style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background: black !important;';
        }
        
        // Hide unwanted elements
        const dashboard = this.querySelector('#qr-reader__dashboard');
        if (dashboard) (dashboard as HTMLElement).style.display = 'none';
      }, 500);
      
      console.log('setupWebScanner - camera started successfully');
    } catch (err) {
      console.error("Error starting web scanner:", err);
    }
  }

  async stopScanning() {
    this.scanning = false;
    
    if (Capacitor.isNativePlatform()) {
      if (this.controls) {
        this.controls.stop();
        this.controls = null;
      }

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      if (this.videoElement) {
        this.videoElement.srcObject = null;
      }

      this.codeReader = null;
    } else {
      if (this.html5QrCode) {
        try {
          await this.html5QrCode.stop();
          this.html5QrCode.clear();
        } catch (err) {
          console.error("Error stopping web scanner:", err);
        }
        this.html5QrCode = null;
        
        const qrReader = this.querySelector('#qr-reader') as HTMLElement;
        if (qrReader) {
          qrReader.style.display = 'none';
        }
      }
    }
  }

  handleBack() {
    this.stopScanning();
    this.triggerPageNavigation({ page: 'search' });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div id="scanner-container">
        <video id="video" playsinline></video>
        <div id="qr-reader" style="display: none;"></div>
        
        ${this.hasPermission === false ? html`
          <div class="permission-request">
            <h2>${this.translations.cameraPermissionRequired}</h2>
            <p>${this.error || this.translations.cameraPermissionDesc}</p>
            <button class="back-btn" @click="${() => this.startScanning()}">${this.translations.retry}</button>
            <br><br>
            <button class="back-btn" @click="${this.handleBack}">${this.translations.goBack}</button>
          </div>
        ` : ''}

        <div class="overlay">
          ${this.error && this.hasPermission !== false ? html`<div class="error-msg">${this.error}</div>` : ''}
          ${this.scanning ? html`
            <div class="scan-area">
              <div class="scan-line"></div>
            </div>
          ` : ''}
        </div>

        <div class="controls">
          <button class="back-btn" @click="${this.handleBack}">${this.translations.cancel}</button>
        </div>
      </div>
    `;
  }
}

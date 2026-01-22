/**
 * Bluetooth Thermal Printer Integration
 * Works with Chrome/Edge browsers on Android/Windows/Mac tablets
 * 
 * Compatible printers:
 * - Bixolon SRP-350plus (recommended)
 * - Xprinter XP-80C
 * - Star Micronics mPOP
 * - Any ESC/POS compatible Bluetooth thermal printer
 */

// Type definitions for Web Bluetooth API (browser-only types)
// These are only available in the browser, not during build
// Using 'any' for browser-specific types to avoid build-time errors
type BluetoothDevice = any;
type BluetoothRemoteGATTServer = any;
type BluetoothRemoteGATTService = any;
type BluetoothRemoteGATTCharacteristic = any;

// ESC/POS command constants
const ESC = '\x1B';
const GS = '\x1D';

interface BluetoothPrinter {
  device: BluetoothDevice | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
  isConnected: boolean;
}

class BluetoothPrinterService {
  private printer: BluetoothPrinter = {
    device: null,
    characteristic: null,
    isConnected: false,
  };

  /**
   * Check if Web Bluetooth API is supported
   */
  isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  /**
   * Connect to Bluetooth printer
   */
  async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser. Please use Chrome or Edge.');
    }

    const bluetooth = (navigator as any).bluetooth;
    if (!bluetooth) {
      throw new Error('Web Bluetooth API is not available.');
    }

    try {
      // Request Bluetooth device
      this.printer.device = await bluetooth.requestDevice({
        filters: [
          { namePrefix: 'BIXOLON' }, // Bixolon printers
          { namePrefix: 'XP-' },     // Xprinter
          { namePrefix: 'Star' },    // Star Micronics
          { namePrefix: 'EPSON' },   // Epson
          { services: [0xff00] }     // Generic serial service
        ],
        optionalServices: [
          '0000ff00-0000-1000-8000-00805f9b34fb', // Serial port service
          '000018f0-0000-1000-8000-00805f9b34fb'   // Alternative service
        ]
      });

      console.log('Connecting to:', this.printer.device.name);

      // Connect to GATT server
      const server = await this.printer.device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Try to get the service (different printers use different service UUIDs)
      let service = null;
      const serviceUUIDs = [
        0xff00,
        '0000ff00-0000-1000-8000-00805f9b34fb',
        '000018f0-0000-1000-8000-00805f9b34fb'
      ];

      for (const uuid of serviceUUIDs) {
        try {
          service = await server.getPrimaryService(uuid);
          if (service) break;
        } catch (e) {
          // Try next service UUID
        }
      }

      if (!service) {
        throw new Error('Could not find printer service. Make sure the printer supports Bluetooth.');
      }

      // Get characteristic for writing (usually 0xff02)
      const characteristicUUIDs = [
        0xff02,
        '0000ff02-0000-1000-8000-00805f9b34fb',
        '0000ff01-0000-1000-8000-00805f9b34fb'
      ];

      for (const uuid of characteristicUUIDs) {
        try {
          this.printer.characteristic = await service.getCharacteristic(uuid);
          if (this.printer.characteristic) break;
        } catch (e) {
          // Try next characteristic UUID
        }
      }

      if (!this.printer.characteristic) {
        throw new Error('Could not find printer characteristic.');
      }

      // Listen for disconnection
      this.printer.device.addEventListener('gattserverdisconnected', () => {
        this.printer.isConnected = false;
        console.log('Printer disconnected');
      });

      this.printer.isConnected = true;
      console.log('Successfully connected to printer!');
      return true;
    } catch (error: any) {
      console.error('Bluetooth connection error:', error);
      
      if (error.name === 'NotFoundError') {
        throw new Error('No printer found. Make sure the printer is turned on and in pairing mode.');
      } else if (error.name === 'SecurityError') {
        throw new Error('Bluetooth permission denied. Please allow Bluetooth access.');
      } else if (error.name === 'NetworkError') {
        throw new Error('Failed to connect. Make sure the printer is within range.');
      } else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Disconnect from printer
   */
  disconnect(): void {
    if (this.printer.device?.gatt?.connected) {
      this.printer.device.gatt.disconnect();
    }
    this.printer.device = null;
    this.printer.characteristic = null;
    this.printer.isConnected = false;
  }

  /**
   * Check if printer is connected
   */
  getIsConnected(): boolean {
    return this.printer.isConnected && this.printer.device?.gatt?.connected === true;
  }

  /**
   * Send data to printer
   */
  async send(data: string): Promise<boolean> {
    if (!this.getIsConnected()) {
      throw new Error('Printer not connected. Please connect first.');
    }

    if (!this.printer.characteristic) {
      throw new Error('Printer characteristic not available.');
    }

    try {
      // Convert string to Uint8Array
      const encoder = new TextEncoder();
      const dataArray = encoder.encode(data);

      // Send in chunks (some printers have max packet size of 20 bytes)
      const chunkSize = 20;
      for (let i = 0; i < dataArray.length; i += chunkSize) {
        const chunk = dataArray.slice(i, i + chunkSize);
        await this.printer.characteristic.writeValue(chunk);
        // Small delay between chunks to prevent buffer overflow
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      return true;
    } catch (error: any) {
      console.error('Print error:', error);
      this.printer.isConnected = false;
      throw new Error(`Print failed: ${error.message}`);
    }
  }

  /**
   * Initialize printer (reset)
   */
  initialize(): string {
    return `${ESC}@`;
  }

  /**
   * Set text alignment
   */
  setAlign(align: 'left' | 'center' | 'right'): string {
    const alignCodes = { left: 0, center: 1, right: 2 };
    return `${ESC}a${String.fromCharCode(alignCodes[align])}`;
  }

  /**
   * Set text size
   */
  setTextSize(width: number = 1, height: number = 1): string {
    const size = (width - 1) | ((height - 1) << 4);
    return `${GS}!${String.fromCharCode(size)}`;
  }

  /**
   * Set bold text
   */
  setBold(enabled: boolean): string {
    return `${ESC}E${enabled ? '\x01' : '\x00'}`;
  }

  /**
   * Feed paper
   */
  feed(lines: number = 1): string {
    return `${ESC}d${String.fromCharCode(lines)}`;
  }

  /**
   * Cut paper
   */
  cutPaper(partial: boolean = true): string {
    return partial ? `${GS}V\x42\x00` : `${GS}V\x41\x03`;
  }

  /**
   * Print line
   */
  line(text: string = ''): string {
    return `${text}\n`;
  }

  /**
   * Print separator line
   */
  separator(char: string = '-'): string {
    return `${char.repeat(32)}\n`;
  }
}

// Export singleton instance
export const bluetoothPrinter = new BluetoothPrinterService();

/**
 * Format order as receipt for printing
 */
export function formatOrderReceipt(order: any): string {
  const printer = bluetoothPrinter;
  let receipt = '';

  // Initialize printer
  receipt += printer.initialize();

  // Header
  receipt += printer.setAlign('center');
  receipt += printer.setTextSize(2, 2);
  receipt += printer.line('STARZ BURGER');
  receipt += printer.line('PIZZA & SHAKES');
  receipt += printer.setTextSize(1, 1);
  receipt += printer.separator('=');

  // Order info
  receipt += printer.setAlign('left');
  receipt += printer.line(`Order #: ${order.id}`);
  receipt += printer.line(`Date: ${formatDate(order.createdAt)}`);
  receipt += printer.separator('-');

  // Customer info
  receipt += printer.line(`Customer: ${order.customerInfo.name}`);
  receipt += printer.line(`Phone: ${order.customerInfo.phone}`);
  if (order.customerInfo.email) {
    receipt += printer.line(`Email: ${order.customerInfo.email}`);
  }
  if (order.orderType === 'delivery' && order.customerInfo.address) {
    receipt += printer.line(`Address: ${order.customerInfo.address}`);
  }
  receipt += printer.separator('-');

  // Order type and payment
  receipt += printer.line(`Type: ${order.orderType.toUpperCase()}`);
  receipt += printer.line(`Payment: ${order.paymentMethod === 'card' ? 'Card' : 'Cash'}`);
  receipt += printer.separator('-');

  // Items
  receipt += printer.setBold(true);
  receipt += printer.line('ITEMS:');
  receipt += printer.setBold(false);
  
  order.items.forEach((item: any) => {
    receipt += printer.line(`${item.quantity}x ${item.name}`);
    
    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      Object.entries(item.selectedOptions).forEach(([key, value]) => {
        receipt += printer.line(`  ${key}: ${value}`);
      });
    }
    
    receipt += printer.line(`  £${(item.price * item.quantity).toFixed(2)}`);
    receipt += printer.line(''); // Empty line
  });

  receipt += printer.separator('-');

  // Totals
  receipt += printer.setAlign('right');
  receipt += printer.line(`Subtotal: £${order.subtotal.toFixed(2)}`);
  
  if (order.deliveryFee && order.deliveryFee > 0) {
    receipt += printer.line(`Delivery: £${order.deliveryFee.toFixed(2)}`);
  }
  
  receipt += printer.setBold(true);
  receipt += printer.setTextSize(1, 2);
  receipt += printer.line(`TOTAL: £${order.total.toFixed(2)}`);
  receipt += printer.setTextSize(1, 1);
  receipt += printer.setBold(false);
  
  receipt += printer.setAlign('left');
  receipt += printer.separator('-');
  receipt += printer.setAlign('center');
  receipt += printer.line('Thank you for your order!');
  receipt += printer.separator('=');

  // Feed paper
  receipt += printer.feed(3);

  // Cut paper
  receipt += printer.cutPaper(true);

  return receipt;
}

/**
 * Format date for receipt
 */
function formatDate(date: Date | any): string {
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Print order receipt
 */
export async function printOrder(order: any): Promise<boolean> {
  try {
    // Connect if not connected
    if (!bluetoothPrinter.getIsConnected()) {
      await bluetoothPrinter.connect();
    }

    // Format and send receipt
    const receipt = formatOrderReceipt(order);
    await bluetoothPrinter.send(receipt);

    return true;
  } catch (error: any) {
    console.error('Print error:', error);
    throw error;
  }
}

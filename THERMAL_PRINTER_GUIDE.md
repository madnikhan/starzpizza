# Thermal Printer Integration Guide

## Overview
This guide covers thermal printer compatibility and integration options for the Starz Burger Pizza & Shakes order system.

## 🎯 Tablet + Bluetooth Setup (Recommended for Your Use Case)

Since your client is using a **tablet**, Bluetooth connectivity is the ideal solution. This section covers Bluetooth-compatible printers and implementation.

### Best Bluetooth Thermal Printers for Tablets

#### 1. **Bixolon SRP-350plus** ⭐ (Top Recommendation)
- **Connection**: Bluetooth, USB, Ethernet, Wi-Fi
- **Paper Size**: 80mm (3.1")
- **Pros**: 
  - Excellent Bluetooth support
  - Works with Web Bluetooth API
  - Reliable connection
  - ESC/POS compatible
- **Price Range**: £150-£200
- **Best for**: Tablet-based operations

#### 2. **Star Micronics mPOP** ⭐
- **Connection**: Bluetooth, USB
- **Paper Size**: 58mm (2.3")
- **Pros**: 
  - Designed for mobile/tablet use
  - StarCloudPRNT compatible (via Bluetooth bridge)
  - Compact and portable
- **Price Range**: £180-£250
- **Best for**: Compact tablet setups

#### 3. **Xprinter XP-80C**
- **Connection**: Bluetooth, USB
- **Paper Size**: 80mm (3.1")
- **Pros**: 
  - Budget-friendly
  - Good Bluetooth range
  - ESC/POS compatible
- **Price Range**: £60-£100
- **Best for**: Budget-conscious tablet setups

#### 4. **Epson TM-T88V with Bluetooth Adapter**
- **Connection**: Bluetooth (via adapter), USB, Ethernet
- **Paper Size**: 80mm (3.1")
- **Pros**: 
  - Very reliable
  - Professional grade
  - Can add Bluetooth later
- **Price Range**: £300-£400 (including adapter)
- **Best for**: Professional setups needing reliability

#### 5. **Bixolon SRP-330**
- **Connection**: Bluetooth, USB
- **Paper Size**: 58mm (2.3")
- **Pros**: 
  - Compact
  - Good for small receipts
  - Affordable
- **Price Range**: £100-£150
- **Best for**: Compact tablet setups

### Browser Compatibility for Bluetooth

| Browser | Platform | Web Bluetooth Support |
|---------|----------|----------------------|
| Chrome | Android | ✅ Full Support |
| Chrome | Windows/Mac | ✅ Full Support |
| Edge | Android/Windows | ✅ Full Support |
| Safari | iOS | ❌ Limited (requires app) |
| Firefox | All | ❌ Not Supported |

**Important**: For iOS tablets (iPad), you'll need a native app or use a different method (Wi-Fi printing recommended).

## Compatible Thermal Printers

### 1. **Star Micronics** (Recommended)
- **Models**: TSP100, TSP650, TSP700, TSP800
- **Connection**: USB, Ethernet, Wi-Fi
- **Pros**: Excellent web integration, ESC/POS support, reliable
- **Price Range**: £150-£400
- **Best for**: Professional kitchen setups

### 2. **Epson TM Series**
- **Models**: TM-T20, TM-T82, TM-T88, TM-T88V
- **Connection**: USB, Ethernet, Wi-Fi
- **Pros**: Widely used, good driver support, ESC/POS compatible
- **Price Range**: £120-£350
- **Best for**: Budget-friendly options

### 3. **Bixolon**
- **Models**: SRP-350, SRP-350plus, SRP-330
- **Connection**: USB, Ethernet, Wi-Fi, Bluetooth
- **Pros**: Multi-interface, good for mobile setups
- **Price Range**: £100-£300
- **Best for**: Flexible connection needs

### 4. **Zebra ZD Series**
- **Models**: ZD220, ZD420, ZD620
- **Connection**: USB, Ethernet, Wi-Fi
- **Pros**: Industrial-grade, very reliable
- **Price Range**: £200-£500
- **Best for**: High-volume operations

### 5. **Xprinter**
- **Models**: XP-80C, XP-58, XP-80
- **Connection**: USB, Bluetooth
- **Pros**: Budget-friendly, compact
- **Price Range**: £50-£150
- **Best for**: Small operations, budget constraints

## Integration Approaches

### Option 1: Browser Print API (Simplest)
**How it works**: Uses browser's native print dialog
- ✅ No additional setup required
- ✅ Works with any printer
- ❌ Requires manual print action
- ❌ Not automatic

**Best for**: Manual printing when needed

### Option 2: ESC/POS via USB (Direct Connection)
**How it works**: Sends ESC/POS commands directly to printer
- ✅ Automatic printing
- ✅ Full control over formatting
- ❌ Requires printer connected to same computer
- ❌ Browser security restrictions (requires local app or extension)

**Best for**: Single computer setup with USB printer

### Option 3: Network/Ethernet Printing (Recommended)
**How it works**: Printer connected to network, accessed via API
- ✅ Automatic printing
- ✅ Multiple devices can print
- ✅ No USB cable needed
- ⚠️ Requires network setup

**Best for**: Professional kitchen with network printer

### Option 4: Cloud Printing Service
**How it works**: Third-party service handles printing
- ✅ Works from anywhere
- ✅ No local setup needed
- ❌ Monthly subscription fees
- ❌ Requires internet connection

**Services**:
- **PrintNode** (£9.99/month) - Most popular
- **StarCloudPRNT** (Free for Star printers)
- **Google Cloud Print** (Deprecated)

**Best for**: Remote printing or multiple locations

### Option 5: Server-Side Printing (Next.js API Route)
**How it works**: Server sends print jobs to printer
- ✅ Automatic printing
- ✅ Secure
- ✅ Works with network printers
- ⚠️ Requires printer accessible from server

**Best for**: Production deployments with network printers

## Recommended Solution for Your System

### **For Tablet + Bluetooth: Bixolon SRP-350plus** ⭐

**Why:**
1. **Bluetooth Support** - Works directly with tablets via Web Bluetooth API
2. **No Network Required** - Direct connection to tablet
3. **Automatic Printing** - Can trigger printing when order status changes
4. **Reliable** - Excellent Bluetooth connection stability
5. **80mm Paper** - Better readability than 58mm

**Setup:**
1. Pair printer with tablet via Bluetooth (one-time setup)
2. Implement Web Bluetooth API in admin dashboard
3. Connect to printer when needed
4. Send ESC/POS commands for printing
5. Auto-print when order status = "pending"

**Cost:**
- Printer: £150-£200
- Service: Free (no subscription needed)

### Alternative: Star Micronics mPOP (Compact Option)

**Why:**
1. **Designed for Mobile** - Built specifically for tablet/phone use
2. **Bluetooth Native** - Excellent mobile connectivity
3. **Compact** - Takes less space
4. **58mm Paper** - Smaller but still readable

**Cost:**
- Printer: £180-£250
- Service: Free

## Implementation Examples

### Using Web Bluetooth API (Recommended for Tablet + Bluetooth)

```typescript
// Web Bluetooth API for Thermal Printers
// Works with Chrome/Edge on Android/Windows/Mac tablets

// ESC/POS commands for thermal printers
const ESC = '\x1B';
const GS = '\x1D';

// Connect to Bluetooth printer
let bluetoothDevice: BluetoothDevice | null = null;
let bluetoothCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

async function connectBluetoothPrinter() {
  try {
    // Request Bluetooth device
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'BIXOLON' }, // For Bixolon printers
        { namePrefix: 'XP-' },     // For Xprinter
        { namePrefix: 'Star' },    // For Star printers
        { services: [0xff00] }      // Generic serial service
      ],
      optionalServices: ['0000ff00-0000-1000-8000-00805f9b34fb']
    });

    console.log('Connecting to:', bluetoothDevice.name);
    
    // Connect to GATT server
    const server = await bluetoothDevice.gatt?.connect();
    
    // Get service (usually 0xff00 for ESC/POS printers)
    const service = await server?.getPrimaryService(0xff00);
    
    // Get characteristic for writing
    bluetoothCharacteristic = await service?.getCharacteristic(0xff02);
    
    console.log('Connected to printer!');
    return true;
  } catch (error) {
    console.error('Bluetooth connection error:', error);
    alert('Failed to connect to printer. Make sure it is paired and turned on.');
    return false;
  }
}

// Send data to printer
async function sendToPrinter(data: string) {
  if (!bluetoothCharacteristic) {
    const connected = await connectBluetoothPrinter();
    if (!connected) return false;
  }

  try {
    // Convert string to Uint8Array (ESC/POS commands)
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);
    
    // Send in chunks (some printers have max packet size)
    const chunkSize = 20;
    for (let i = 0; i < dataArray.length; i += chunkSize) {
      const chunk = dataArray.slice(i, i + chunkSize);
      await bluetoothCharacteristic!.writeValue(chunk);
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    }
    
    return true;
  } catch (error) {
    console.error('Print error:', error);
    // Try to reconnect
    bluetoothDevice = null;
    bluetoothCharacteristic = null;
    return false;
  }
}

// Initialize printer
function initializePrinter() {
  return `${ESC}@`; // Reset printer
}

// Set text alignment
function setAlign(align: 'left' | 'center' | 'right') {
  const alignCodes = { left: 0, center: 1, right: 2 };
  return `${ESC}a${alignCodes[align]}`;
}

// Set text size
function setTextSize(width: number = 1, height: number = 1) {
  return `${GS}!${(width - 1) | ((height - 1) << 4)}`;
}

// Cut paper
function cutPaper() {
  return `${GS}V\x42\x00`; // Partial cut
}

// Print order receipt
async function printOrder(order: Order) {
  const receipt = formatOrderReceiptESC(order);
  const success = await sendToPrinter(receipt);
  
  if (success) {
    console.log('Order printed successfully!');
  } else {
    alert('Failed to print. Please try again.');
  }
}

// Format receipt with ESC/POS commands
function formatOrderReceiptESC(order: Order): string {
  let receipt = initializePrinter();
  
  // Header
  receipt += setAlign('center');
  receipt += setTextSize(2, 2);
  receipt += 'STARZ BURGER\n';
  receipt += 'PIZZA & SHAKES\n';
  receipt += setTextSize(1, 1);
  receipt += '================================\n';
  
  // Order info
  receipt += setAlign('left');
  receipt += `Order #: ${order.id}\n`;
  receipt += `Date: ${formatDate(order.createdAt)}\n`;
  receipt += '--------------------------------\n';
  
  // Customer info
  receipt += `Customer: ${order.customerInfo.name}\n`;
  receipt += `Phone: ${order.customerInfo.phone}\n`;
  if (order.orderType === 'delivery' && order.customerInfo.address) {
    receipt += `Address: ${order.customerInfo.address}\n`;
  }
  receipt += '--------------------------------\n';
  
  // Items
  receipt += 'ITEMS:\n';
  order.items.forEach(item => {
    receipt += `${item.quantity}x ${item.name}\n`;
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([key, value]) => {
        receipt += `  ${key}: ${value}\n`;
      });
    }
    receipt += `  £${(item.price * item.quantity).toFixed(2)}\n`;
  });
  
  receipt += '--------------------------------\n';
  
  // Totals
  receipt += `Subtotal: £${order.subtotal.toFixed(2)}\n`;
  if (order.deliveryFee && order.deliveryFee > 0) {
    receipt += `Delivery: £${order.deliveryFee.toFixed(2)}\n`;
  }
  receipt += setTextSize(1, 2);
  receipt += `TOTAL: £${order.total.toFixed(2)}\n`;
  receipt += setTextSize(1, 1);
  
  receipt += '--------------------------------\n';
  receipt += `Payment: ${order.paymentMethod === 'card' ? 'Card' : 'Cash'}\n`;
  receipt += `Status: ${order.status.toUpperCase()}\n`;
  receipt += '================================\n';
  receipt += 'Thank you for your order!\n';
  receipt += '\n\n\n'; // Feed paper
  
  // Cut paper
  receipt += cutPaper();
  
  return receipt;
}

// Helper function
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
```

### Using StarCloudPRNT (Alternative - Requires Wi-Fi)

// Format receipt
function formatOrderReceipt(order: Order): string {
  return `
================================
    STARZ BURGER PIZZA & SHAKES
================================
Order #: ${order.id}
Date: ${formatDate(order.createdAt)}
--------------------------------
Customer: ${order.customerInfo.name}
Phone: ${order.customerInfo.phone}
${order.orderType === 'delivery' ? `Address: ${order.customerInfo.address}` : ''}
--------------------------------
ITEMS:
${order.items.map(item => `
${item.quantity}x ${item.name}
  ${item.selectedOptions ? Object.entries(item.selectedOptions).map(([k, v]) => `  ${k}: ${v}`).join('\n') : ''}
  £${(item.price * item.quantity).toFixed(2)}
`).join('')}
--------------------------------
Subtotal: £${order.subtotal.toFixed(2)}
${order.deliveryFee ? `Delivery: £${order.deliveryFee.toFixed(2)}` : ''}
TOTAL: £${order.total.toFixed(2)}
--------------------------------
Payment: ${order.paymentMethod === 'card' ? 'Card' : 'Cash'}
Status: ${order.status.toUpperCase()}
================================
Thank you for your order!
================================
  `.trim();
}
```

### Using Browser Print API (Simple Alternative)

```typescript
// Create print-friendly view
function printOrder(order: Order) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Order ${order.id}</title>
        <style>
          body { font-family: monospace; font-size: 12px; }
          @media print {
            @page { size: 80mm auto; margin: 0; }
          }
        </style>
      </head>
      <body>
        ${formatOrderReceipt(order).replace(/\n/g, '<br>')}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
}
```

## Integration Steps

### Step 1: Choose Your Printer
- **Budget**: Xprinter XP-80C (£50-80)
- **Recommended**: Star Micronics TSP650 (£200-250)
- **Professional**: Epson TM-T88V (£300-350)

### Step 2: Set Up Connection
- **Bluetooth (Tablet)**: 
  1. Turn on printer Bluetooth
  2. Put printer in pairing mode
  3. Pair with tablet (one-time setup)
  4. Use Web Bluetooth API in browser
- **USB**: Connect to admin computer
- **Network**: Connect to Wi-Fi/Ethernet, note IP address
- **Cloud**: Register with StarCloudPRNT (Star printers only)

### Step 3: Install Integration
1. Add print button to admin dashboard
2. Format order data for receipt
3. Send to printer (method depends on connection type)
4. Optionally auto-print on new orders

### Step 4: Test
1. Place test order
2. Verify receipt format
3. Check all order details print correctly
4. Test with different order types (takeaway, delivery, collection)

## Auto-Print Feature

To automatically print when new order arrives (with Bluetooth):

```typescript
// In app/admin/page.tsx
useEffect(() => {
  // Connect to printer on component mount (optional - can also connect on demand)
  // connectBluetoothPrinter();
  
  const ordersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const order = { id: change.doc.id, ...change.doc.data() } as Order;
        
        // Auto-print new pending orders
        if (order.status === 'pending') {
          printOrder(order);
        }
      }
    });
  });

  return () => unsubscribe();
}, []);

// Add print button to OrderCard component
function OrderCard({ order, ... }: OrderCardProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printOrder(order);
    } finally {
      setIsPrinting(false);
    }
  };
  
  return (
    <div>
      {/* ... existing order card content ... */}
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isPrinting ? 'Printing...' : 'Print Receipt'}
      </button>
    </div>
  );
}
```

## Paper Size Options

- **58mm (2.3")**: Compact, good for small receipts
- **80mm (3.1")**: Standard, better readability (recommended)

## Cost Comparison

| Solution | Printer Cost | Service Cost | Setup Complexity |
|----------|-------------|--------------|------------------|
| Browser Print | £50-300 | Free | Easy |
| USB + ESC/POS | £50-300 | Free | Medium |
| Network + API | £150-400 | Free | Medium |
| StarCloudPRNT | £200-300 | Free | Easy |
| PrintNode | £50-400 | £9.99/mo | Easy |

## Recommendations by Use Case

### Tablet-Based Setup (Your Use Case) ⭐
- **Printer**: Bixolon SRP-350plus (recommended) or Xprinter XP-80C (budget)
- **Method**: Web Bluetooth API
- **Cost**: £60-200 per printer
- **Setup**: Pair once, use from browser

### Small Restaurant (1-2 printers, desktop)
- **Printer**: Xprinter XP-80C or Star TSP100
- **Method**: Browser Print API or USB
- **Cost**: £50-150

### Medium Restaurant (2-4 printers, network)
- **Printer**: Star TSP650 or Epson TM-T82
- **Method**: Network printing with StarCloudPRNT
- **Cost**: £200-300 per printer

### Large Restaurant / Multiple Locations
- **Printer**: Star TSP800 or Epson TM-T88V
- **Method**: Network printing or PrintNode
- **Cost**: £300-400 per printer + service fees

## Next Steps

1. **Decide on printer model** based on budget and needs
2. **Choose integration method** (StarCloudPRNT recommended for Star printers)
3. **Purchase printer** and set up connection
4. **Implement print function** in admin dashboard
5. **Test thoroughly** before going live

## Support Resources

- **Star Micronics**: https://www.starmicronics.com/support/
- **StarCloudPRNT Docs**: https://www.starmicronics.com/support/starcloudprnt/
- **Epson TM Series**: https://support.epson.co.uk/
- **PrintNode**: https://www.printnode.com/docs

## Bluetooth Setup Instructions

### Initial Pairing (One-Time Setup)

1. **Turn on the printer** and ensure Bluetooth is enabled
2. **Put printer in pairing mode** (usually hold a button for 3-5 seconds)
3. **On your tablet**:
   - Go to Settings > Bluetooth
   - Find your printer (e.g., "BIXOLON SRP-350plus")
   - Tap to pair
   - Enter PIN if required (usually "0000" or "1234")
4. **In the admin dashboard**:
   - Click "Connect Printer" button (first time)
   - Select your printer from the list
   - Grant Bluetooth permissions
   - Printer will be remembered for future use

### Troubleshooting Bluetooth

**Printer not found:**
- Ensure printer is in pairing mode
- Check printer is within range (usually 10 meters)
- Restart Bluetooth on tablet

**Connection fails:**
- Unpair and re-pair the printer
- Check printer battery (if battery-powered)
- Ensure no other device is connected to printer

**Printing doesn't work:**
- Verify printer has paper
- Check printer is online/ready
- Try reconnecting via Web Bluetooth API

## Questions to Consider

1. **What tablet is your client using?** (Android/iOS affects compatibility)
2. How many printers do you need? (Kitchen, counter, etc.)
3. What's your budget per printer?
4. Do you need automatic printing or manual is okay?
5. Will printers be stationary or need to move around?
6. Do you need to print from multiple tablets?

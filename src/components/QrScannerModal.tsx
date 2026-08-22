import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCode,
  Camera,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ItemCategory } from '../types';

export interface ScannedProductData {
  rawText: string;
  itemName: string;
  modelNumber?: string;
  brand?: string;
  category?: ItemCategory;
  estimatedCost?: number;
  notes?: string;
}

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: ScannedProductData) => void;
}

// Sample presets for quick testing without physical QR codes
const SAMPLE_QR_PRESETS = [
  {
    id: 'sample-washer',
    label: 'LG AI DirectDrive Washer',
    code: 'JSON: {"brand": "LG", "model": "F4V909WTS", "name": "LG 9kg AI DirectDrive Front Load Washer", "category": "home_appliances", "cost": 42990}',
    parsed: {
      rawText: 'LG AI DirectDrive Front Load Washer (Model: F4V909WTS)',
      brand: 'LG',
      modelNumber: 'F4V909WTS',
      itemName: 'LG 9kg AI DirectDrive Front Load Washer (F4V909WTS)',
      category: 'home_appliances' as ItemCategory,
      estimatedCost: 42990,
      notes: 'DirectDrive Inverter Motor • 1400 RPM',
    },
  },
  {
    id: 'sample-laptop',
    label: 'Dell XPS 15 9520',
    code: 'Model: Dell XPS 15 9520 | Type: Laptop | Category: Computers | Serial: 8XK9023 | SvcTag: D9520X',
    parsed: {
      rawText: 'Model: Dell XPS 15 9520 | Type: Laptop | Category: Computers | SvcTag: D9520X',
      brand: 'Dell',
      modelNumber: 'XPS 15 9520',
      itemName: 'Dell XPS 15 9520 (Intel i7 / RTX 3050)',
      category: 'computers_laptops' as ItemCategory,
      estimatedCost: 145000,
      notes: 'Service Tag: D9520X • 15.6" OLED Display',
    },
  },
  {
    id: 'sample-airfryer',
    label: 'Philips HD9252 Air Fryer',
    code: 'Brand: Philips | Model: HD9252/90 | Product: Essential Airfryer 4.1L 1400W | Category: kitchen_appliances',
    parsed: {
      rawText: 'Brand: Philips | Model: HD9252/90 | Product: Essential Airfryer 4.1L',
      brand: 'Philips',
      modelNumber: 'HD9252/90',
      itemName: 'Philips HD9252/90 Essential Airfryer (4.1L)',
      category: 'kitchen_appliances' as ItemCategory,
      estimatedCost: 8999,
      notes: '1400W Rapid Air Technology',
    },
  },
  {
    id: 'sample-phone',
    label: 'Apple iPhone 13 (A2633)',
    code: 'Apple Inc. | Model: iPhone 13 (A2633) | EMC 3997 | 128GB Midnight | IMEI: 354890123456789',
    parsed: {
      rawText: 'Apple iPhone 13 (A2633) | EMC 3997 | 128GB Midnight',
      brand: 'Apple',
      modelNumber: 'iPhone 13 A2633',
      itemName: 'Apple iPhone 13 (128GB)',
      category: 'mobile_phones' as ItemCategory,
      estimatedCost: 54900,
      notes: 'A15 Bionic • 6.1-inch Super Retina XDR',
    },
  },
];

/**
 * Smart Parser to extract product brand, model number, category, and name from any scanned QR text or barcode
 */
export function parseScannedQrText(raw: string): ScannedProductData {
  const trimmed = raw.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const json = JSON.parse(trimmed);
      const brand = json.brand || json.manufacturer || json.make || '';
      const model = json.model || json.modelNumber || json.sku || json.partNumber || '';
      const name = json.name || json.product || json.itemName || json.title || `${brand} ${model}`.trim();
      const category = mapCategoryString(json.category || json.type || json.productType);
      const cost = Number(json.cost || json.price || json.estimatedCost || json.originalCost) || undefined;

      return {
        rawText: trimmed,
        itemName: name || (model ? `Device (Model ${model})` : 'Scanned Appliance / Device'),
        modelNumber: model || undefined,
        brand: brand || undefined,
        category,
        estimatedCost: cost,
        notes: json.notes || json.description || (model ? `Model: ${model}` : undefined),
      };
    } catch {
      // Fall through if not valid JSON
    }
  }

  // 2. Try parsing URL parameters (e.g., https://service.samsung.com/qr?m=WW80T504DAX&b=Samsung)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const m = url.searchParams.get('m') || url.searchParams.get('model') || url.searchParams.get('sku');
      const b = url.searchParams.get('b') || url.searchParams.get('brand');
      const p = url.searchParams.get('product') || url.searchParams.get('name');

      if (m || b || p) {
        const brand = b || '';
        const model = m || '';
        const name = p || `${brand} ${model}`.trim();
        return {
          rawText: trimmed,
          itemName: name || (model ? `Equipment (Model ${model})` : 'Scanned Device'),
          modelNumber: model || undefined,
          brand: brand || undefined,
          category: mapCategoryString(name || url.pathname),
          notes: `Extracted from product URL: ${url.hostname}`,
        };
      }
    } catch {
      // ignore
    }
  }

  // 3. Try parsing Key-Value delimiter pairs (e.g., Brand: LG | Model: F4V909WTS | Type: Washer)
  const lines = trimmed.split(/[\n|\r|;|•|\|]+/).map((s) => s.trim()).filter(Boolean);
  let brand = '';
  let modelNumber = '';
  let categoryStr = '';
  let productName = '';
  let serial = '';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith('brand:') || lower.startsWith('make:') || lower.startsWith('mfr:')) {
      brand = line.split(':')[1]?.trim() || '';
    } else if (lower.startsWith('model:') || lower.startsWith('mod:') || lower.startsWith('model no:')) {
      modelNumber = line.split(':')[1]?.trim() || '';
    } else if (lower.startsWith('product:') || lower.startsWith('name:') || lower.startsWith('item:')) {
      productName = line.split(':')[1]?.trim() || '';
    } else if (lower.startsWith('category:') || lower.startsWith('type:')) {
      categoryStr = line.split(':')[1]?.trim() || '';
    } else if (lower.startsWith('sn:') || lower.startsWith('serial:') || lower.startsWith('svctag:')) {
      serial = line.split(':')[1]?.trim() || '';
    }
  }

  if (brand || modelNumber || productName) {
    const combinedName =
      productName ||
      [brand, modelNumber].filter(Boolean).join(' ') ||
      `Scanned Device (Model ${modelNumber})`;
    return {
      rawText: trimmed,
      itemName: combinedName,
      modelNumber: modelNumber || undefined,
      brand: brand || undefined,
      category: mapCategoryString(categoryStr || productName || combinedName),
      notes: serial ? `Serial / Tag: ${serial}` : undefined,
    };
  }

  // 4. Fallback: Search for regex patterns like "Model XYZ-1234"
  const modelMatch = trimmed.match(/(?:Model|Mod|Type|Cat|P\/N|SKU)[\s:#]+([A-Za-z0-9\-_./]{3,24})/i);
  const foundModel = modelMatch ? modelMatch[1] : undefined;

  return {
    rawText: trimmed,
    itemName: trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed,
    modelNumber: foundModel,
    category: mapCategoryString(trimmed),
    notes: foundModel ? `Detected Model: ${foundModel}` : 'Extracted from QR / Barcode label',
  };
}

function mapCategoryString(str?: string): ItemCategory | undefined {
  if (!str) return undefined;
  const s = str.toLowerCase();
  if (s.includes('wash') || s.includes('refrigerat') || s.includes('dryer') || s.includes('ac') || s.includes('conditioner') || s.includes('appliance')) {
    return 'home_appliances';
  }
  if (s.includes('tv') || s.includes('audio') || s.includes('speaker') || s.includes('headphone') || s.includes('amplifier')) {
    return 'electronics';
  }
  if (s.includes('phone') || s.includes('iphone') || s.includes('samsung galaxy') || s.includes('pixel') || s.includes('mobile')) {
    return 'mobile_phones';
  }
  if (s.includes('laptop') || s.includes('computer') || s.includes('pc') || s.includes('macbook') || s.includes('desktop') || s.includes('monitor')) {
    return 'computers_laptops';
  }
  if (s.includes('bike') || s.includes('bicycle') || s.includes('cycle') || s.includes('mtb')) {
    return 'bicycles';
  }
  if (s.includes('chair') || s.includes('table') || s.includes('desk') || s.includes('sofa') || s.includes('cabinet') || s.includes('furniture')) {
    return 'furniture';
  }
  if (s.includes('microwave') || s.includes('fryer') || s.includes('blender') || s.includes('toaster') || s.includes('coffee') || s.includes('kettle') || s.includes('kitchen')) {
    return 'kitchen_appliances';
  }
  if (s.includes('circuit') || s.includes('breaker') || s.includes('wire') || s.includes('mcb') || s.includes('socket') || s.includes('electric')) {
    return 'electrician';
  }
  if (s.includes('pipe') || s.includes('drain') || s.includes('geyser') || s.includes('faucet') || s.includes('tap') || s.includes('plumb')) {
    return 'plumber';
  }
  return undefined;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [detectedResult, setDetectedResult] = useState<ScannedProductData | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'repairconnect-qr-reader';

  // Stop scanner when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanupScanner();
      setDetectedResult(null);
      setScanError(null);
    }
  }, [isOpen]);

  const cleanupScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Scanner cleanup warning:', err);
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  // Start live camera stream
  const startCameraScanner = async () => {
    setScanError(null);
    setDetectedResult(null);

    // Give DOM time to render reader div
    setTimeout(async () => {
      try {
        await cleanupScanner();

        const qrScanner = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = qrScanner;

        const config = {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        };

        setIsScanning(true);

        await qrScanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            handleDecodedText(decodedText);
          },
          () => {
            // Ignore frame parse misses
          }
        );
      } catch (err: any) {
        console.warn('Camera scanner initialization error:', err);
        setIsScanning(false);
        setScanError(
          'Unable to access camera. Please check camera permissions, or upload a photo of the product label instead.'
        );
      }
    }, 150);
  };

  // Handle scanned file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setScanError(null);
    setIsUploading(true);

    try {
      await cleanupScanner();
      const qrScanner = new Html5Qrcode('repairconnect-file-reader-dummy');
      html5QrCodeRef.current = qrScanner;

      const decodedText = await qrScanner.scanFile(file, true);
      setIsUploading(false);
      handleDecodedText(decodedText);
    } catch (err: any) {
      setIsUploading(false);
      console.warn('File decode error:', err);
      setScanError(
        'No clear QR code or barcode found in this image. Try taking a closer, well-lit photo of the rating plate or manual.'
      );
    }
  };

  // Handle successful decode
  const handleDecodedText = (decodedText: string) => {
    cleanupScanner();
    const parsed = parseScannedQrText(decodedText);
    setDetectedResult(parsed);
  };

  // Switch tabs
  const handleTabChange = (tab: 'camera' | 'upload' | 'samples') => {
    setActiveTab(tab);
    setScanError(null);
    if (tab === 'camera') {
      startCameraScanner();
    } else {
      cleanupScanner();
    }
  };

  // Apply scanned result to diagnosis workspace
  const handleApplyResult = () => {
    if (detectedResult) {
      onScanComplete(detectedResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>Scan Product Label / QR</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase">
                  Auto-Fill
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Scan rating plate, barcode, or manual to auto-populate item details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabChange('camera')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('upload')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('samples')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Sample QR Codes</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Result Card (When decoded) */}
          {detectedResult ? (
            <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-5 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Product Data Successfully Detected!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetectedResult(null);
                    if (activeTab === 'camera') startCameraScanner();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                >
                  Scan Again
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Item Name & Model
                  </span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {detectedResult.itemName}
                  </span>
                </div>

                {detectedResult.modelNumber && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Model / Part Number
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                      {detectedResult.modelNumber}
                    </span>
                  </div>
                )}

                {detectedResult.category && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Auto-Matched Category
                    </span>
                    <span className="text-xs font-bold text-emerald-700 capitalize mt-0.5 block">
                      {detectedResult.category.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {detectedResult.estimatedCost && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Estimated Retail Cost
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      ₹{detectedResult.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {detectedResult.notes && (
                <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700">Specifications: </span>
                  {detectedResult.notes}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyResult}
                  className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Auto-Fill Diagnosis Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Camera Tab View */}
              {activeTab === 'camera' && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square max-w-sm mx-auto flex items-center justify-center">
                    {/* Scanner container for html5-qrcode */}
                    <div id={scannerContainerId} className="w-full h-full" />

                    {!isScanning && !scanError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900/90 space-y-3 z-10">
                        <Camera className="w-8 h-8 text-blue-400 animate-pulse" />
                        <p className="text-xs font-semibold text-slate-300">
                          Starting high-definition optical QR / Barcode reader...
                        </p>
                        <button
                          type="button"
                          onClick={startCameraScanner}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                        >
                          Launch Camera
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Point camera directly at the appliance rating label (usually on back or bottom panel), user manual barcode, or QR warranty sticker.
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Tab View */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  {/* Hidden dummy div for file reader instance */}
                  <div id="repairconnect-file-reader-dummy" className="hidden" />

                  <label
                    htmlFor="qr-file-input"
                    className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {isUploading ? 'Decoding image barcode...' : 'Upload Image of Rating Plate or Label'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Supports JPG, PNG, WEBP, or PDF screenshots</p>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      Browse Image
                    </span>
                  </label>

                  <input
                    id="qr-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              )}

              {/* Sample QR Codes for Instant Testing */}
              {activeTab === 'samples' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    Test the auto-populate feature instantly by selecting a simulated appliance rating plate or device label:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SAMPLE_QR_PRESETS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setDetectedResult(sample.parsed);
                        }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/60 text-left transition-all cursor-pointer group space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                            {sample.label}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 capitalize">
                            {sample.parsed.category?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 truncate">
                          {sample.parsed.modelNumber} • ₹{sample.parsed.estimatedCost?.toLocaleString()}
                        </p>
                        <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Simulate Scan</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan Error Notice */}
              {scanError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">Scan Notice: </span>
                    <span>{scanError}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  Camera,
  X,
  AlertTriangle,
  HelpCircle,
  FileVideo,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  RefreshCw,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { CATEGORIES, DEMO_PRESETS } from '../data/mockData';
import { DiagnosisResultData, ItemCategory } from '../types';
import { diagnoseItemApi } from '../services/api';
import { QrScannerModal, ScannedProductData } from './QrScannerModal';

interface DiagnosisWorkspaceProps {
  initialFile?: File | null;
  onDiagnosisComplete: (result: DiagnosisResultData) => void;
  prefillCategory?: ItemCategory;
}

const COMMON_SYMPTOMS_BY_CATEGORY: Record<ItemCategory, string[]> = {
  home_appliances: [
    'Loud banging or roaring noise',
    'Stops mid-cycle',
    'Water not draining',
    'Violent shaking/vibration',
    'Not heating / cooling',
    'Door latch error code',
  ],
  electronics: [
    'Won’t power on (no standby light)',
    'Sound works but no screen display',
    'Distorted lines across display',
    'Randomly shuts down after 10 mins',
    'Faint burning odor',
  ],
  mobile_phones: [
    'Cracked front screen / glass',
    'Touch screen unresponsive / ghost touch',
    'Battery drains in 2 hours or swollen',
    'Charging port loose / intermittent',
    'Rear camera blurry / cracked lens',
  ],
  computers_laptops: [
    'Loud continuous fan noise / overheating',
    'Blue screen / random thermal shutdown',
    'Broken or stiff display hinge',
    'Keys not responding or sticky',
    'Screen cracked / flickering backlight',
  ],
  bicycles: [
    'Chain slips loudly under pedaling load',
    'Gears skip or won’t shift cleanly',
    'Brakes squeal loudly or feel spongy',
    'Wobbly wheel / loose spoke',
    'Ticking noise in bottom bracket crank',
  ],
  furniture: [
    'Wobbly or loose mortise/tenon joint',
    'Cracked wooden leg / frame split',
    'Sagging seat springs / worn foam',
    'Drawer slide jammed or broken',
    'Scratched / peeling veneer finish',
  ],
  kitchen_appliances: [
    'Microwave turntable spins but no heat',
    'Blender motor smells like burning plastic',
    'Espresso machine leaking from group head',
    'Air fryer fan stopped spinning',
    'Toaster lever won’t lock down',
  ],
  electrician: [
    'Circuit breaker (MCB) trips when appliance starts',
    'Sparks or buzzing sound from wall socket',
    'Flickering lights / voltage drops',
    'Earthing shock / mild tingling sensation',
    'Switchboard smoking / burnt plastic smell',
  ],
  plumber: [
    'Water dripping from geyser/heater base',
    'Low water pressure from pump / purifier',
    'Inlet/drain pipe leaking water under unit',
    'Drainage backup / slow gurgling drain',
    'Faucet cartridge whistling or seizing',
  ],
  other: [
    'Loose fasteners / stripped screws',
    'Power cord frayed or cut',
    'Mechanical jam in moving parts',
    'Battery contacts corroded',
  ],
};

export const DiagnosisWorkspace: React.FC<DiagnosisWorkspaceProps> = ({
  initialFile,
  onDiagnosisComplete,
  prefillCategory,
}) => {
  const [itemName, setItemName] = useState('Front Load Washing Machine');
  const [modelNumber, setModelNumber] = useState('WM-FL75-PRO');
  const [category, setCategory] = useState<ItemCategory>(prefillCategory || 'home_appliances');
  const [problemDescription, setProblemDescription] = useState(
    'The machine is making a loud banging noise and stops during the high-speed spin cycle.'
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Loud banging or roaring noise',
    'Stops mid-cycle',
    'Violent shaking/vibration',
  ]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [itemAgeYears, setItemAgeYears] = useState<number>(4);
  const [originalCost, setOriginalCost] = useState<number>(28000);

  // Media State
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaMimeType, setMediaMimeType] = useState<string>('image/jpeg');
  const [isVideo, setIsVideo] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Camera Capture Modal
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // QR Code Scanner Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedProductData | null>(null);

  // Analysis Loading State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Handle QR scan auto-population
  const handleQrScanComplete = (data: ScannedProductData) => {
    setScannedData(data);
    if (data.itemName) {
      setItemName(data.itemName);
    }
    if (data.modelNumber) {
      setModelNumber(data.modelNumber);
    }
    if (data.category) {
      handleCategoryChange(data.category, false);
    }
    if (data.estimatedCost) {
      setOriginalCost(data.estimatedCost);
    }
    if (data.notes && !problemDescription.includes(data.notes)) {
      setProblemDescription((prev) =>
        prev.trim() ? `${prev}\n[Product Specs: ${data.notes}]` : `[Product Specs: ${data.notes}]`
      );
    }
  };

  // Handle initialFile passed from hero
  useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  // Update symptoms on category change
  const handleCategoryChange = (newCat: ItemCategory, updateSampleDefaults = true) => {
    setCategory(newCat);
    const defaults = COMMON_SYMPTOMS_BY_CATEGORY[newCat] || [];
    setSelectedSymptoms(defaults.slice(0, 2));

    if (updateSampleDefaults) {
      if (newCat === 'mobile_phones') {
        setItemName('Smartphone (6.7" OLED)');
        setModelNumber('SM-G998B');
      } else if (newCat === 'computers_laptops') {
        setItemName('15.6" Laptop');
        setModelNumber('XPS-15-9520');
      } else if (newCat === 'bicycles') {
        setItemName('21-Speed Hybrid Bicycle');
        setModelNumber('HYB-21S-DISC');
      } else if (newCat === 'furniture') {
        setItemName('Solid Wood Dining Chair');
        setModelNumber('OAK-DC-04');
      } else if (newCat === 'kitchen_appliances') {
        setItemName('Countertop Microwave Oven (28L)');
        setModelNumber('MW-28L-INV');
      } else if (newCat === 'electronics') {
        setItemName('55" 4K Smart TV');
        setModelNumber('TV-55-UHD-4K');
      } else if (newCat === 'home_appliances') {
        setItemName('Front Load Washing Machine');
        setModelNumber('WM-FL75-PRO');
      }
    }
  };

  const handleFileSelected = (file: File) => {
    const isVid = file.type.startsWith('video/');
    setIsVideo(isVid);
    setMediaMimeType(file.type || (isVid ? 'video/mp4' : 'image/jpeg'));

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      if (customSymptomInput.trim() && !selectedSymptoms.includes(customSymptomInput.trim())) {
        setSelectedSymptoms((prev) => [...prev, customSymptomInput.trim()]);
        setCustomSymptomInput('');
      }
    }
  };

  // Camera Live Capture
  const startCamera = async () => {
    setShowCameraModal(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or declined. You can upload an image file instead.');
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setMediaPreview(dataUrl);
        setMediaMimeType('image/jpeg');
        setIsVideo(false);
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Run AI Diagnosis
  const handleRunDiagnosis = async () => {
    if (!itemName.trim() || !problemDescription.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep((s) => (s < 4 ? s + 1 : s));
    }, 600);

    try {
      const result = await diagnoseItemApi({
        itemName,
        modelNumber: modelNumber.trim() || undefined,
        category,
        problemDescription,
        symptoms: selectedSymptoms,
        itemAgeYears,
        originalCost,
        imageBase64: mediaPreview || undefined,
        mimeType: mediaMimeType,
      });

      clearInterval(stepInterval);
      setAnalysisStep(4);
      setTimeout(() => {
        setIsAnalyzing(false);
        onDiagnosisComplete(result);
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      console.error('Diagnosis failed:', err);
    }
  };

  // Load a demo preset directly into the form
  const loadPresetIntoForm = (preset: DiagnosisResultData) => {
    setItemName(preset.itemName);
    setModelNumber(preset.modelNumber || '');
    setCategory(preset.category);
    setProblemDescription(preset.userProblemDescription);
    setSelectedSymptoms(preset.userSymptoms || []);
    setItemAgeYears(preset.itemAgeYears || 3);
    setOriginalCost(preset.originalCost || 20000);
    setMediaPreview(preset.imageUrl || null);
    setIsVideo(false);
    setScannedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>AI Diagnostic Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Describe & Diagnose Your Item
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload evidence, specify symptoms, and let Gemini AI analyze failure causes and repair-worthiness.
          </p>
        </div>

        {/* Quick Demo Preloads */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400">Presets:</span>
          <div className="flex gap-1 overflow-x-auto">
            {DEMO_PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPresetIntoForm(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer border border-slate-200 whitespace-nowrap"
              >
                {preset.itemName.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Diagnostic Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Step 1: Upload Photo or Video */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Upload Photo or Video Evidence
            </span>
            <span className="text-xs font-normal text-slate-400">Optional but improves accuracy</span>
          </label>

          {mediaPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950/5 max-h-80 flex items-center justify-center group">
              {isVideo ? (
                <video src={mediaPreview} controls className="max-h-80 w-auto rounded-xl" />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Item for diagnosis"
                  className="max-h-80 w-full object-contain rounded-xl"
                />
              )}
              <button
                id="remove-media-btn"
                onClick={() => setMediaPreview(null)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400'
              }`}
            >
              <input
                type="file"
                id="workspace-file-upload"
                accept="image/*,video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                className="hidden"
              />

              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Drag and drop your photo or video here, or{' '}
                    <label
                      htmlFor="workspace-file-upload"
                      className="text-blue-600 hover:text-blue-700 underline font-bold cursor-pointer"
                    >
                      browse files
                    </label>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Take a clear shot of the damaged area, control panel, or warning lights.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <label
                    htmlFor="workspace-file-upload"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Image</span>
                  </label>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Take Live Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>Scan Product QR / Label</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Item Name & Category */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Product Details & Category
            </label>

            <button
              type="button"
              id="open-qr-scanner-btn"
              onClick={() => setShowQrModal(true)}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Scan QR code, barcode, or manual cover to auto-fill product details"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span>Scan QR / Barcode Label</span>
            </button>
          </div>

          {/* Scanned Badge Banner */}
          {scannedData && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Auto-populated from QR: <strong className="font-extrabold">{scannedData.itemName}</strong>
                  {scannedData.modelNumber && (
                    <span className="ml-1 text-emerald-700 font-mono bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {scannedData.modelNumber}
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScannedData(null)}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 underline font-bold cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="item-name-input" className="block text-xs font-semibold text-slate-600">
                  Item Name / Brand
                </label>
                {scannedData?.itemName && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                    Scanned
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="item-name-input"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Front Load Washing Machine, iPhone 13..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="model-number-input" className="block text-xs font-semibold text-slate-600">
                  Model / Part Number
                </label>
                <div className="flex items-center gap-1">
                  {modelNumber && scannedData?.modelNumber === modelNumber && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                      Auto-filled
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                    title="Scan rating label to auto-fill"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  id="model-number-input"
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. WM-FL75-PRO, F4V909WTS, A2633"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="item-category-select" className="block text-xs font-semibold text-slate-600 mb-1">
                Product Category
              </label>
              <select
                id="item-category-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Describe the Problem */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Describe the Problem in Your Own Words
            </span>
            <span className="text-xs font-normal text-slate-400">Be as descriptive as possible</span>
          </label>

          <textarea
            id="problem-description-input"
            rows={3}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="What happened? When did it start? Are there any unusual noises, smells, error codes, leaks, or physical damage?"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all resize-y"
          />

          {/* Quick Symptoms Tag Cloud */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Select Observed Symptoms:</span>
              <span className="text-[11px] text-slate-400">Click to toggle</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(COMMON_SYMPTOMS_BY_CATEGORY[category] || []).map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Symptom Adder */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                onKeyDown={handleAddCustomSymptom}
                placeholder="Add custom symptom..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSymptom}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Age and Replacement Cost (for Repair-Worthiness ROI) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              Lifespan & Replacement Estimates
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Calculates Repair vs Replacement ROI
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Product Age:</span>
                <span className="text-blue-600 font-bold">{itemAgeYears} {itemAgeYears === 1 ? 'Year' : 'Years'} Old</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={itemAgeYears}
                onChange={(e) => setItemAgeYears(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Brand new (0y)</span>
                <span>5 years</span>
                <span>10+ years</span>
              </div>
            </div>

            <div>
              <label htmlFor="item-cost-input" className="block text-xs font-semibold text-slate-600 mb-1">
                Original Purchase / New Replacement Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="item-cost-input"
                  type="number"
                  min="500"
                  step="500"
                  value={originalCost}
                  onChange={(e) => setOriginalCost(parseInt(e.target.value) || 0)}
                  placeholder="28000"
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Responsible AI & Safety Notice Banner */}
        <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Responsible AI Safety Commitment</p>
            <p className="text-amber-800 leading-relaxed">
              RepairConnect provides AI-assisted estimates for safe troubleshooting only. High-voltage electricity,
              pressurized gas lines, and structural hazard inspections require certified professionals.
            </p>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            id="analyze-item-submit-btn"
            type="button"
            disabled={isAnalyzing || !itemName.trim() || !problemDescription.trim()}
            onClick={handleRunDiagnosis}
            className={`w-full py-4 rounded-xl font-bold text-base text-white transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer ${
              isAnalyzing
                ? 'bg-blue-500 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>
                  {analysisStep === 1 && 'Scanning uploaded media & symptoms...'}
                  {analysisStep === 2 && 'Matching failure patterns & schematics...'}
                  {analysisStep === 3 && 'Evaluating repair-worthiness & carbon ROI...'}
                  {analysisStep >= 4 && 'Finalizing repair recommendations...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Analyze My Item</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Take Live Photo</span>
              </h2>
              <button
                onClick={stopCamera}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{cameraError}</div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              {!cameraError && (
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code & Barcode Scanner Modal */}
      <QrScannerModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onScanComplete={handleQrScanComplete}
      />
    </div>
  );
};

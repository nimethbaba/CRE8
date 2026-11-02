import React, { useState, useRef, useId } from 'react';
import { CustomSignConfig, MaterialOption, FontOption, SignShape, FinishEdge, StandoffHardware, BacklightColor, CustomOrder } from '../types';
import { STUDIO_MATERIALS } from '../data/mockData';
import { ThreeCncViewer } from './ThreeCncViewer';
import {
  Sparkles,
  Upload,
  Type,
  Layers,
  Sliders,
  Send,
  MessageSquare,
  Mail,
  Check,
  CheckCircle2,
  Maximize2,
  Palette,
  Box,
  Compass,
  FileCheck,
  HelpCircle,
  X,
  PhoneCall,
} from 'lucide-react';

interface RemixStudioProps {
  initialConfig?: Partial<CustomSignConfig>;
  onBackToHome: () => void;
  onSubmitOrder: (order: CustomOrder) => void;
}

export const RemixStudio: React.FC<RemixStudioProps> = ({
  initialConfig,
  onBackToHome,
  onSubmitOrder,
}) => {
  const fileInputId = useId();
  // State for the sign configuration
  const [config, setConfig] = useState<CustomSignConfig>({
    text: initialConfig?.text || 'CRE8 STUDIO',
    subtext: initialConfig?.subtext || 'CNC BESPOKE DESIGN',
    font: (initialConfig?.font as FontOption) || 'montserrat',
    shape: (initialConfig?.shape as SignShape) || 'rect-chamfer',
    materialId: initialConfig?.materialId || 'mat-walnut',
    reliefType: initialConfig?.reliefType || 'emboss-raised',
    reliefDepthMm: initialConfig?.reliefDepthMm || 3,
    edgeFinish: (initialConfig?.edgeFinish as FinishEdge) || 'chamfer-45',
    standoff: (initialConfig?.standoff as StandoffHardware) || 'brass-milled',
    backlight: (initialConfig?.backlight as BacklightColor) || 'warm',
    widthMm: initialConfig?.widthMm || 480,
    heightMm: initialConfig?.heightMm || 240,
    thicknessMm: initialConfig?.thicknessMm || 20,
    uploadedImageUri: initialConfig?.uploadedImageUri || null,
    uploadedImageName: initialConfig?.uploadedImageName || undefined,
  });

  const [activeTab, setActiveTab] = useState<'text-shape' | 'material-finish' | 'dimensions'>('text-shape');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmittedSuccess, setOrderSubmittedSuccess] = useState(false);

  // Customer order form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current material info
  const selectedMaterial = STUDIO_MATERIALS.find((m) => m.id === config.materialId) || STUDIO_MATERIALS[0];

  // Real-time calculations
  const areaCm2 = (config.widthMm / 10) * (config.heightMm / 10);
  const volumeCm3 = areaCm2 * (config.thicknessMm / 10);
  const weightGrams = Math.round(volumeCm3 * selectedMaterial.densityGPerCm3);
  const estimatedPrice = Math.round(
    areaCm2 * selectedMaterial.pricePerCm2 * 2.2 +
    (config.backlight !== 'none' ? 45 : 0) +
    (config.standoff !== 'magnetic-rear' ? 35 : 15) +
    config.reliefDepthMm * 8 + 50
  );

  const estimatedMillingHours = (
    (areaCm2 / 120) * 0.45 +
    (selectedMaterial.category === 'metal' ? 1.8 : 0.8) +
    config.reliefDepthMm * 0.25
  ).toFixed(1);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setConfig((prev) => ({
        ...prev,
        uploadedImageUri: result,
        uploadedImageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setConfig((prev) => ({
      ...prev,
      uploadedImageUri: null,
      uploadedImageName: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate Email & WhatsApp payloads
  const formatOrderSpecs = () => {
    return `
CRE8 STUDIO CUSTOM CNC SIGN SPECIFICATIONS
==========================================
Custom Text: "${config.text}"
Subtext: "${config.subtext || 'None'}"
Font: ${config.font.toUpperCase()}
Shape: ${config.shape}
Stock Material: ${selectedMaterial.name} (${selectedMaterial.category.toUpperCase()})
Relief Profile: ${config.reliefType} (Depth: ${config.reliefDepthMm}mm)
Edge Bevel: ${config.edgeFinish}
Mounting Hardware: ${config.standoff}
Halo Backlight: ${config.backlight.toUpperCase()}
Dimensions: ${config.widthMm}mm (W) x ${config.heightMm}mm (H) x ${config.thicknessMm}mm (T)
Estimated Weight: ~${weightGrams}g
Machine Runtime Est: ~${estimatedMillingHours} hours
Estimated Quote: $${estimatedPrice} USD
Has Custom Vector/Logo: ${config.uploadedImageUri ? 'YES (Image attached/loaded)' : 'NO (Text only)'}
==========================================
Client Name: ${customerName || 'Pending'}
Email: ${customerEmail || 'Pending'}
Phone: ${customerPhone || 'Pending'}
Notes: ${customerNotes || 'Standard fabrication'}
    `.trim();
  };

  const handleSendViaEmail = () => {
    const emailTo = 'nimethsiir@gmail.com';
    const subject = `New Custom CNC Sign Order: ${config.text} - CRE8 Studio`;
    const body = formatOrderSpecs();
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    finalizeOrderSubmission();
  };

  const handleSendViaWhatsApp = () => {
    const phone = '9828351409';
    const message = `*NEW CRE8 CNC DESIGN ORDER*\n\n` + formatOrderSpecs();
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    finalizeOrderSubmission();
  };

  const finalizeOrderSubmission = () => {
    const newOrder: CustomOrder = {
      id: `CR8-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: customerName || 'Studio Client',
      email: customerEmail || 'nimethsiir@gmail.com',
      phone: customerPhone || '9828351409',
      notes: customerNotes,
      config: { ...config },
      status: 'New',
      estimatedPrice,
    };

    onSubmitOrder(newOrder);
    setOrderSubmittedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in-up">
      {/* Studio Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-white/10 transition-colors"
          >
            ← Back to Studio Overview
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h1 className="text-lg font-bold font-mono tracking-tight uppercase text-white">
              CRE8 3D Remix Studio
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 uppercase">
              Real-Time 360° CAM View
            </span>
          </div>
        </div>

        {/* Top Direct Dispatch Actions - White Font & White Glow */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-5 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="text-white">Send Design & Order (${estimatedPrice})</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 360° Rotatable 3D Interactive Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl bg-zinc-950 border border-white/15 p-2 shadow-2xl">
            {/* Viewport Corner Crosshairs */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400/80 pointer-events-none z-10" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400/80 pointer-events-none z-10" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400/80 pointer-events-none z-10" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400/80 pointer-events-none z-10" />

            <ThreeCncViewer
              config={config}
              autoRotate={false}
              lazy={false}
              heightClass="h-[460px] sm:h-[540px] lg:h-[600px]"
              onMaterialChange={(matId) => setConfig((prev) => ({ ...prev, materialId: matId }))}
            />
          </div>

          {/* Real-time CNC Telemetry & Spec Sheet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Calculated Mass</span>
              <span className="text-zinc-200 font-bold text-sm block">~{weightGrams} grams</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Machining Est.</span>
              <span className="text-zinc-200 font-bold text-sm block">{estimatedMillingHours} hrs</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Linear Envelope</span>
              <span className="text-zinc-200 font-bold text-sm block">{config.widthMm} x {config.heightMm} mm</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Spindle Spec</span>
              <span className="text-amber-400 font-bold text-sm block">±0.025 mm</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Live Editor */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tabs for Clean Ergonomics */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('text-shape')}
              className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'text-shape'
                  ? 'bg-white/15 text-white font-bold border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-white" />
              <span>Text & Logo</span>
            </button>
            <button
              onClick={() => setActiveTab('material-finish')}
              className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'material-finish'
                  ? 'bg-white/15 text-white font-bold border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-white" />
              <span>Materials</span>
            </button>
            <button
              onClick={() => setActiveTab('dimensions')}
              className={`py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'dimensions'
                  ? 'bg-white/15 text-white font-bold border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>Dimensions</span>
            </button>
          </div>

          {/* TAB 1: Text, Image Upload, Shape */}
          {activeTab === 'text-shape' && (
            <div className="space-y-5 rounded-2xl bg-zinc-950 border border-white/10 p-5">
              {/* Text Inputs */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary Sign Text:</span>
                </label>
                <input
                  type="text"
                  value={config.text}
                  onChange={(e) => setConfig((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="e.g. CRE8 STUDIO"
                  maxLength={24}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white font-mono text-sm uppercase"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <span>Subtext / Secondary Line:</span>
                </label>
                <input
                  type="text"
                  value={config.subtext || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, subtext: e.target.value }))}
                  placeholder="e.g. CNC BESPOKE DESIGN"
                  maxLength={36}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-white font-mono text-xs uppercase"
                />
              </div>

              {/* Typography Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Typography Style:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'montserrat', label: 'Montserrat', sub: 'Geometric Sans' },
                    { id: 'playfair', label: 'Playfair Display', sub: 'Luxury Serif' },
                    { id: 'jetbrains', label: 'JetBrains Mono', sub: 'Technical CNC' },
                    { id: 'poppins', label: 'Poppins', sub: 'Modern Architectural' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setConfig((prev) => ({ ...prev, font: font.id as FontOption }))}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        config.font === font.id
                          ? 'bg-amber-400/15 border-amber-400 text-white'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{font.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{font.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image / Vector Logo Upload */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label htmlFor={fileInputId} className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Custom Logo / Vector:</span>
                  </label>
                  {config.uploadedImageUri && (
                    <button
                      onClick={removeUploadedImage}
                      className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    id={fileInputId}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {config.uploadedImageUri ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-emerald-500/40">
                      <img
                        src={config.uploadedImageUri}
                        alt="Uploaded vector"
                        className="w-12 h-12 object-contain rounded bg-black p-1 border border-white/10"
                      />
                      <div className="text-xs font-mono space-y-0.5 truncate">
                        <span className="text-emerald-400 font-bold block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Emboss Mask Loaded</span>
                        </span>
                        <span className="text-zinc-400 text-[11px] truncate block">
                          {config.uploadedImageName || 'custom_logo_vector.png'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 px-4 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-dashed border-white/20 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-all"
                    >
                      <Upload className="w-5 h-5 text-zinc-500" />
                      <span className="text-xs font-mono">Upload PNG / JPG / SVG Emblem</span>
                      <span className="text-[10px] text-zinc-500">Auto-milled into 3D relief surface</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Base Shape Selection */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Base Plate Profile:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { id: 'rect-chamfer', label: 'Chamfer Box' },
                    { id: 'hexagon', label: 'Hexagon' },
                    { id: 'pill', label: 'Architectural Pill' },
                    { id: 'diamond', label: 'Diamond' },
                    { id: 'rect-rounded', label: 'Soft Roundover' },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setConfig((prev) => ({ ...prev, shape: shape.id as SignShape }))}
                      className={`p-2 rounded text-center border transition-all ${
                        config.shape === shape.id
                          ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Materials & Finishes */}
          {activeTab === 'material-finish' && (
            <div className="space-y-5 rounded-2xl bg-zinc-950 border border-white/10 p-5">
              {/* Material Group Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Choose Material Stock:
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {STUDIO_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setConfig((prev) => ({ ...prev, materialId: mat.id }))}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                        config.materialId === mat.id
                          ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: mat.color }}
                        />
                        <div>
                          <span className="text-xs font-bold block text-white">{mat.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                            {mat.category} • {mat.description.slice(0, 48)}...
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-amber-400 shrink-0">
                        ${mat.pricePerCm2 * 100}/m²
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Relief Milling Style */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Relief & Carving Style:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { id: 'emboss-raised', label: 'Raised Inlay' },
                    { id: 'engrave-pocket', label: 'Pocket Carve' },
                    { id: 'through-stencil', label: 'Through Cut' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig((prev) => ({ ...prev, reliefType: style.id as any }))}
                      className={`p-2 rounded text-center border transition-all ${
                        config.reliefType === style.id
                          ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edge Finish Profile */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Perimeter Edge Bevel:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { id: 'chamfer-45', label: '45° Chamfer' },
                    { id: 'roundover', label: 'Bullnose Arc' },
                    { id: 'square-90', label: 'Razor 90°' },
                  ].map((edge) => (
                    <button
                      key={edge.id}
                      onClick={() => setConfig((prev) => ({ ...prev, edgeFinish: edge.id as FinishEdge }))}
                      className={`p-2 rounded text-center border transition-all ${
                        config.edgeFinish === edge.id
                          ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {edge.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standoff Mounting Hardware */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Mounting Hardware:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { id: 'brass-milled', label: 'Turned Brass Standoffs' },
                    { id: 'aluminum-anodized', label: 'Black Alloy Standoffs' },
                    { id: 'flush-countersink', label: 'Flush Screw Holes' },
                    { id: 'magnetic-rear', label: 'Hidden Magnetic Mount' },
                  ].map((hardware) => (
                    <button
                      key={hardware.id}
                      onClick={() => setConfig((prev) => ({ ...prev, standoff: hardware.id as StandoffHardware }))}
                      className={`p-2 rounded text-left border transition-all ${
                        config.standoff === hardware.id
                          ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {hardware.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Halo LED Backlight */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Rear Halo LED Illumination:
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                  {[
                    { id: 'none', label: 'None', color: 'bg-zinc-800' },
                    { id: 'warm', label: 'Warm', color: 'bg-amber-200' },
                    { id: 'neutral', label: 'Clean', color: 'bg-white' },
                    { id: 'cyan', label: 'Cyan', color: 'bg-cyan-400' },
                    { id: 'amber', label: 'Amber', color: 'bg-orange-500' },
                  ].map((light) => (
                    <button
                      key={light.id}
                      onClick={() => setConfig((prev) => ({ ...prev, backlight: light.id as BacklightColor }))}
                      className={`p-2 rounded text-center border transition-all flex flex-col items-center gap-1 ${
                        config.backlight === light.id
                          ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${light.color}`} />
                      <span className="text-[10px]">{light.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Dimensions */}
          {activeTab === 'dimensions' && (
            <div className="space-y-6 rounded-2xl bg-zinc-950 border border-white/10 p-5">
              {/* Width Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase">Width:</span>
                  <span className="text-amber-400 font-bold">{config.widthMm} mm ({(config.widthMm / 25.4).toFixed(1)}")</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="10"
                  value={config.widthMm}
                  onChange={(e) => setConfig((prev) => ({ ...prev, widthMm: Number(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>200 mm</span>
                  <span>800 mm</span>
                </div>
              </div>

              {/* Height Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase">Height:</span>
                  <span className="text-amber-400 font-bold">{config.heightMm} mm ({(config.heightMm / 25.4).toFixed(1)}")</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="500"
                  step="10"
                  value={config.heightMm}
                  onChange={(e) => setConfig((prev) => ({ ...prev, heightMm: Number(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>120 mm</span>
                  <span>500 mm</span>
                </div>
              </div>

              {/* Thickness Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase">Stock Thickness:</span>
                  <span className="text-amber-400 font-bold">{config.thicknessMm} mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="2"
                  value={config.thicknessMm}
                  onChange={(e) => setConfig((prev) => ({ ...prev, thicknessMm: Number(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>10 mm</span>
                  <span>35 mm</span>
                </div>
              </div>

              {/* Relief Depth Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase">Relief Depth:</span>
                  <span className="text-amber-400 font-bold">{config.reliefDepthMm} mm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={config.reliefDepthMm}
                  onChange={(e) => setConfig((prev) => ({ ...prev, reliefDepthMm: Number(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>1 mm (Subtle)</span>
                  <span>5 mm (Deep Pocket)</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Card */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Estimated Quote</span>
                <span className="text-3xl font-extrabold text-white font-mono">${estimatedPrice}</span>
              </div>
              <div className="text-right text-xs font-mono text-zinc-400">
                <span>Free CAD Review</span>
                <span className="text-zinc-300 block">Lead Time: 5-7 Days</span>
              </div>
            </div>

            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full py-3.5 rounded bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] active:scale-95"
            >
              <Send className="w-4 h-4 text-white" />
              <span className="text-white">Send Design & Order to Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Dispatch Modal (Email & WhatsApp Integration) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => {
                setShowOrderModal(false);
                setOrderSubmittedSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderSubmittedSuccess ? (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-mono">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>DIRECT DISPATCH TO CRE8 STUDIO</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-sans uppercase">
                    Order Custom Workpiece
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Your 3D design will be compiled into CAM production specs and transmitted directly to lead maker Nimeth Siir.
                  </p>
                </div>

                {/* Design Summary Card */}
                <div className="p-3.5 rounded-lg bg-zinc-900 border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Sign Text:</span>
                    <span className="text-white font-bold uppercase truncate max-w-[240px]">{config.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Material Stock:</span>
                    <span className="text-amber-400">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dimensions:</span>
                    <span className="text-zinc-300">{config.widthMm} x {config.heightMm} x {config.thicknessMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estimated Total:</span>
                    <span className="text-emerald-400 font-bold">${estimatedPrice} USD</span>
                  </div>
                </div>

                {/* Client Contact Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                        Your Full Name:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                        Your Email:
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="marcus@vancedesign.ch"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                      WhatsApp / Phone:
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+9828351409"
                      className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                      Special CNC / Mounting Instructions (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="e.g. Please provide extra 20mm standoff spacers for stone masonry wall mounting."
                      className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white resize-none"
                    />
                  </div>
                </div>

                {/* Primary Dispatch Actions: Email & WhatsApp - White Font & White Glow */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Send to Email */}
                    <button
                      onClick={handleSendViaEmail}
                      className="py-3 px-4 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all"
                    >
                      <Mail className="w-4 h-4 text-white" />
                      <span className="text-white">Send to Email</span>
                    </button>

                    {/* Send to WhatsApp */}
                    <button
                      onClick={handleSendViaWhatsApp}
                      className="py-3 px-4 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-white" />
                      <span className="text-white">Send via WhatsApp</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center font-mono pt-1">
                    Direct destination: nimethsiir@gmail.com & WhatsApp (+9828351409).
                  </p>
                </div>
              </>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/40 text-white flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-sans uppercase text-white">
                    Design Transmitted!
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Your custom piece is logged in our CAM queue. We will review toolpath clearance and verify your vector file within 2 hours.
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setOrderSubmittedSuccess(false);
                    }}
                    className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-mono uppercase text-zinc-200"
                  >
                    Return to 3D Editor
                  </button>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      onBackToHome();
                    }}
                    className="w-full py-2.5 rounded bg-white/15 hover:bg-white/25 text-white font-bold text-xs font-mono uppercase border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Back to Studio Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

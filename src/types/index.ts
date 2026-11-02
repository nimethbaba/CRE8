export type MaterialCategory = 'wood' | 'acrylic' | 'metal' | 'hybrid';

export interface MaterialOption {
  id: string;
  name: string;
  category: MaterialCategory;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  transmission?: number;
  textureType: 'wood-walnut' | 'wood-oak' | 'wood-birch' | 'acrylic-frosted' | 'acrylic-smoke' | 'acrylic-neon' | 'metal-aluminum' | 'metal-brass' | 'metal-black' | 'metal-titanium';
  description: string;
  densityGPerCm3: number;
  pricePerCm2: number;
}

export type SignShape = 'rect-chamfer' | 'rect-rounded' | 'hexagon' | 'pill' | 'diamond' | 'shield';

export type FontOption = 'montserrat' | 'playfair' | 'jetbrains' | 'poppins';

export type FinishEdge = 'chamfer-45' | 'roundover' | 'square-90';

export type StandoffHardware = 'brass-milled' | 'aluminum-anodized' | 'flush-countersink' | 'magnetic-rear';

export type BacklightColor = 'warm' | 'neutral' | 'cyan' | 'amber' | 'none';

export interface CustomSignConfig {
  text: string;
  subtext?: string;
  font: FontOption;
  shape: SignShape;
  materialId: string;
  reliefType: 'engrave-pocket' | 'emboss-raised' | 'through-stencil';
  reliefDepthMm: number; // 1 to 5 mm
  edgeFinish: FinishEdge;
  standoff: StandoffHardware;
  backlight: BacklightColor;
  widthMm: number; // 150 to 800 mm
  heightMm: number; // 100 to 500 mm
  thicknessMm: number; // 6 to 30 mm
  uploadedImageUri: string | null;
  uploadedImageName?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: MaterialCategory;
  tags: string[];
  dimensions: string;
  material: string;
  finish: string;
  tolerance: string;
  spindleRpm: string;
  tooling: string;
  machineHours: string;
  summary: string;
  description: string;
  imagePrompt: string;
  thumbnailBg: string;
  highlightSpecs: { label: string; value: string }[];
  preset3dConfig?: Partial<CustomSignConfig>;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  stats: { views: number; likes: number };
}

export type OrderStatus = 'New' | 'In Review' | 'CAD/CAM Ready' | 'Machining' | 'Quality Check' | 'Dispatched';

export interface CustomOrder {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  notes: string;
  config: CustomSignConfig;
  status: OrderStatus;
  estimatedPrice: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Sheets & Slabs' | 'Billets & Rods' | 'Endmills & Tooling' | 'Hardware & Fasteners';
  material: string;
  specifications: string;
  stockQuantity: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  status: 'In Stock' | 'Low Stock' | 'Reorder';
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
}

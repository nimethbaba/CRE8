import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CustomSignConfig, MaterialOption } from '../types';
import { STUDIO_MATERIALS } from '../data/mockData';
import { getProceduralTexture, createSignGraphicsTexture } from '../utils/proceduralTextures';
import { Eye, EyeOff, RotateCcw, Layers, Sparkles, Maximize2, ShieldCheck, Compass } from 'lucide-react';

// Software WebGL detection
const isSoftwareGl = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

interface ThreeCncViewerProps {
  config: CustomSignConfig;
  autoRotate?: boolean;
  showControlsDock?: boolean;
  heightClass?: string;
  lazy?: boolean;
  onMaterialChange?: (materialId: string) => void;
}

export const ThreeCncViewer: React.FC<ThreeCncViewerProps> = ({
  config,
  autoRotate = false,
  showControlsDock = true,
  heightClass = 'h-[500px] md:h-[620px]',
  lazy = false,
  onMaterialChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
  const [showToolpaths, setShowToolpaths] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [backlightGlow, setBacklightGlow] = useState(config.backlight !== 'none');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });

  // References for scene manipulation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const toolpathGroupRef = useRef<THREE.Group | null>(null);
  const haloMeshRef = useRef<THREE.Mesh | null>(null);
  const plateMeshRef = useRef<THREE.Mesh | null>(null);
  const faceDecalRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction tracking (orbiting)
  const isPointerDownRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.25, y: -0.35 });
  const currentRotationRef = useRef({ x: 0.25, y: -0.35 });
  const targetZoomRef = useRef(5.5);
  const currentZoomRef = useRef(5.5);

  // Lazy loading observer
  useEffect(() => {
    if (!lazy) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    if (mountRef.current) {
      observer.observe(mountRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Construct Sign Base Plate Shape
  const createBaseShape = useCallback((shape: string, width: number, height: number): THREE.Shape => {
    const s = new THREE.Shape();
    const w = width / 2;
    const h = height / 2;
    const chamfer = Math.min(width, height) * 0.12;

    if (shape === 'rect-chamfer') {
      s.moveTo(-w + chamfer, -h);
      s.lineTo(w - chamfer, -h);
      s.lineTo(w, -h + chamfer);
      s.lineTo(w, h - chamfer);
      s.lineTo(w - chamfer, h);
      s.lineTo(-w + chamfer, h);
      s.lineTo(-w, h - chamfer);
      s.lineTo(-w, -h + chamfer);
      s.closePath();
    } else if (shape === 'hexagon') {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = w * Math.cos(angle);
        const y = h * Math.sin(angle);
        if (i === 0) s.moveTo(x, y);
        else s.lineTo(x, y);
      }
      s.closePath();
    } else if (shape === 'pill') {
      const radius = h;
      s.moveTo(-w + radius, -h);
      s.lineTo(w - radius, -h);
      s.absarc(w - radius, 0, radius, -Math.PI / 2, Math.PI / 2, false);
      s.lineTo(-w + radius, h);
      s.absarc(-w + radius, 0, radius, Math.PI / 2, (3 * Math.PI) / 2, false);
      s.closePath();
    } else if (shape === 'diamond') {
      s.moveTo(0, -h);
      s.lineTo(w, 0);
      s.lineTo(0, h);
      s.lineTo(-w, 0);
      s.closePath();
    } else {
      // rect-rounded
      const r = chamfer;
      s.moveTo(-w + r, -h);
      s.lineTo(w - r, -h);
      s.quadraticCurveTo(w, -h, w, -h + r);
      s.lineTo(w, h - r);
      s.quadraticCurveTo(w, h, w - r, h);
      s.lineTo(-w + r, h);
      s.quadraticCurveTo(-w, h, -w, h - r);
      s.lineTo(-w, -h + r);
      s.quadraticCurveTo(-w, -h, -w + r, -h);
    }

    return s;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVisible || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.08);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, targetZoomRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    const warmKeyLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
    warmKeyLight.position.set(4, 5, 6);
    warmKeyLight.castShadow = !isSoftwareGl;
    warmKeyLight.shadow.mapSize.width = 1024;
    warmKeyLight.shadow.mapSize.height = 1024;
    warmKeyLight.shadow.bias = -0.0005;
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.DirectionalLight(0x88bbff, 1.2);
    coolFillLight.position.set(-5, -2, 4);
    scene.add(coolFillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111122, 0.6);
    scene.add(hemiLight);

    // 6. Contact Grounding Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.5,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.3, 0);
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    // 7. Master Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Animation Loop
    let lastTime = performance.now();
    const renderLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth camera orbit damping
      if (isRotating && !isPointerDownRef.current) {
        targetRotationRef.current.y += delta * 0.4;
      }

      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        targetRotationRef.current.x,
        10,
        delta
      );
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        targetRotationRef.current.y,
        10,
        delta
      );
      currentZoomRef.current = THREE.MathUtils.damp(
        currentZoomRef.current,
        targetZoomRef.current,
        8,
        delta
      );

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.x = currentRotationRef.current.x;
        modelGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoomRef.current;
      }

      // Update CNC coordinate telemetry
      const xDeg = ((currentRotationRef.current.y * 180) / Math.PI) % 360;
      const yDeg = ((currentRotationRef.current.x * 180) / Math.PI) % 360;
      setCoordinates({
        x: Math.round(xDeg * 10) / 10,
        y: Math.round(yDeg * 10) / 10,
        z: Math.round((currentZoomRef.current - 5.5) * 40 * 10) / 10,
      });

      renderer.render(scene, camera);
      setIsCanvasLoaded(true);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isVisible, createBaseShape, isRotating]);

  // Pointer Interaction Handlers for 360 Rotation & Zoom
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(
      -Math.PI / 2.2,
      Math.min(Math.PI / 2.2, targetRotationRef.current.x + deltaY * 0.008)
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetZoomRef.current = Math.max(3.0, Math.min(9.0, targetZoomRef.current + e.deltaY * 0.003));
  };

  const resetCamera = () => {
    targetRotationRef.current = { x: 0.2, y: -0.3 };
    targetZoomRef.current = 5.5;
  };

  // Rebuild 3D Workpiece when config changes
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const modelGroup = modelGroupRef.current;

    // Clear existing children
    while (modelGroup.children.length > 0) {
      const obj = modelGroup.children[0];
      modelGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    }

    const materialDef = STUDIO_MATERIALS.find((m) => m.id === config.materialId) || STUDIO_MATERIALS[0];

    // Scale dimensions normalized for 3D viewport (e.g. 400mm width -> ~3.4 units)
    const normalizedW = (config.widthMm / 400) * 3.4;
    const normalizedH = (config.heightMm / 200) * 1.7;
    const normalizedDepth = (config.thicknessMm / 20) * 0.18;

    // 1. Base Plate Shape
    const baseShape = createBaseShape(config.shape, normalizedW, normalizedH);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: normalizedDepth,
      bevelEnabled: config.edgeFinish !== 'square-90',
      bevelSegments: 4,
      steps: 1,
      bevelSize: config.edgeFinish === 'chamfer-45' ? 0.04 : 0.06,
      bevelThickness: config.edgeFinish === 'chamfer-45' ? 0.04 : 0.06,
    };

    const plateGeo = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    plateGeo.center();

    // Base Material with Procedural Finish
    const baseTexture = getProceduralTexture(materialDef.textureType);
    let plateMat: THREE.Material;

    if (materialDef.category === 'acrylic') {
      plateMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(materialDef.color),
        metalness: materialDef.metalness,
        roughness: materialDef.roughness,
        transmission: isSoftwareGl ? 0 : (materialDef.transmission ?? 0.8),
        opacity: isSoftwareGl ? 0.6 : 0.9,
        transparent: true,
        ior: 1.49,
        thickness: 0.5,
        wireframe: showWireframe,
      });
    } else {
      plateMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(materialDef.color),
        map: baseTexture,
        metalness: materialDef.metalness,
        roughness: materialDef.roughness,
        wireframe: showWireframe,
      });
    }

    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.castShadow = !isSoftwareGl;
    plateMesh.receiveShadow = !isSoftwareGl;
    modelGroup.add(plateMesh);
    plateMeshRef.current = plateMesh;

    // 2. Halo Backlight Glow (if enabled)
    if (backlightGlow && config.backlight !== 'none') {
      let glowHex = 0xffe0a3; // warm
      if (config.backlight === 'cyan') glowHex = 0x00f0ff;
      else if (config.backlight === 'amber') glowHex = 0xff8c00;
      else if (config.backlight === 'neutral') glowHex = 0xf0f6ff;

      const haloGeo = new THREE.PlaneGeometry(normalizedW * 1.25, normalizedH * 1.35);
      const haloMat = new THREE.MeshBasicMaterial({
        color: glowHex,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(0, 0, -normalizedDepth / 2 - 0.08);
      modelGroup.add(haloMesh);
      haloMeshRef.current = haloMesh;
    }

    // 3. Standoff Mount Hardware (4 corner cylinders)
    if (config.standoff !== 'magnetic-rear') {
      const standoffRadius = 0.09;
      const standoffLen = 0.28;
      const standoffGeo = new THREE.CylinderGeometry(standoffRadius, standoffRadius, standoffLen, 24);
      standoffGeo.rotateX(Math.PI / 2);

      const capGeo = new THREE.CylinderGeometry(standoffRadius * 1.15, standoffRadius * 1.15, 0.05, 24);
      capGeo.rotateX(Math.PI / 2);

      const standoffColor = config.standoff === 'brass-milled' ? 0xd4a23b : 0x22252a;
      const standoffMat = new THREE.MeshStandardMaterial({
        color: standoffColor,
        metalness: 0.95,
        roughness: 0.2,
      });

      const offsetX = normalizedW * 0.42;
      const offsetY = normalizedH * 0.38;
      const positions = [
        [-offsetX, -offsetY],
        [offsetX, -offsetY],
        [-offsetX, offsetY],
        [offsetX, offsetY],
      ];

      positions.forEach(([px, py]) => {
        const barrel = new THREE.Mesh(standoffGeo, standoffMat);
        barrel.position.set(px, py, -standoffLen / 2 + normalizedDepth / 2);
        barrel.castShadow = !isSoftwareGl;
        modelGroup.add(barrel);

        const cap = new THREE.Mesh(capGeo, standoffMat);
        cap.position.set(px, py, normalizedDepth / 2 + 0.03);
        cap.castShadow = !isSoftwareGl;
        modelGroup.add(cap);
      });
    }

    // 4. Face Graphics & Relief Decal
    createSignGraphicsTexture(
      config.text,
      config.subtext,
      config.font,
      config.reliefType,
      materialDef.category,
      config.uploadedImageUri
    ).then((graphicsTex) => {
      if (!modelGroupRef.current) return;

      const decalGeo = new THREE.PlaneGeometry(normalizedW * 0.88, normalizedH * 0.78);
      const decalMat = new THREE.MeshStandardMaterial({
        map: graphicsTex,
        transparent: true,
        roughness: 0.3,
        metalness: config.reliefType === 'emboss-raised' ? 0.8 : 0.1,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });

      const decalMesh = new THREE.Mesh(decalGeo, decalMat);
      const zOffset = normalizedDepth / 2 + 0.02 + (config.reliefType === 'emboss-raised' ? 0.015 : 0);
      decalMesh.position.set(0, 0, zOffset);
      modelGroup.add(decalMesh);
      faceDecalRef.current = decalMesh;
    });

    // 5. Toolpath G-Code Visualization (Simulated CNC toolpaths)
    if (showToolpaths) {
      const toolpathGroup = new THREE.Group();
      const points: THREE.Vector3[] = [];
      const toolZ = normalizedDepth / 2 + 0.06;
      const stepY = 0.12;
      const xSpan = normalizedW * 0.44;

      // Raster serpentine toolpaths
      let sweepLeft = true;
      for (let y = -normalizedH * 0.38; y <= normalizedH * 0.38; y += stepY) {
        if (sweepLeft) {
          points.push(new THREE.Vector3(-xSpan, y, toolZ));
          points.push(new THREE.Vector3(xSpan, y, toolZ));
        } else {
          points.push(new THREE.Vector3(xSpan, y, toolZ));
          points.push(new THREE.Vector3(-xSpan, y, toolZ));
        }
        sweepLeft = !sweepLeft;
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5,
      });
      const toolpathLine = new THREE.Line(lineGeo, lineMat);
      toolpathGroup.add(toolpathLine);

      // Add a simulated miniature spindle / cutter head indicator
      const cutterGeo = new THREE.ConeGeometry(0.04, 0.18, 12);
      cutterGeo.rotateX(Math.PI);
      const cutterMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const cutterMesh = new THREE.Mesh(cutterGeo, cutterMat);
      cutterMesh.position.set(xSpan * 0.5, normalizedH * 0.2, toolZ + 0.12);
      toolpathGroup.add(cutterMesh);

      modelGroup.add(toolpathGroup);
      toolpathGroupRef.current = toolpathGroup;
    }
  }, [config, createBaseShape, showToolpaths, showWireframe, backlightGlow]);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden select-none bg-[#09090b] rounded-lg border border-white/10 group`}>
      {/* 3D WebGL Canvas Container with Smooth Fade-in */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`w-full h-full cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700 ease-out ${
          isCanvasLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Overlay: Technical CNC Telemetry & Quick Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/80 border border-white/10 text-xs font-mono text-zinc-300 backdrop-blur-none">
          <Compass className="w-3.5 h-3.5 text-zinc-400" />
          <span>X: {coordinates.x}°</span>
          <span>Y: {coordinates.y}°</span>
          <span>Z: {coordinates.z}mm</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 border border-white/10 text-[11px] font-mono text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>TOLERANCE ±0.025MM</span>
        </div>
      </div>

      {/* Top Right Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause 360° Spin' : 'Start 360° Spin'}
          className={`p-2 rounded text-xs font-mono border transition-all duration-200 ${
            isRotating
              ? 'bg-white/15 text-white border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
              : 'bg-black/80 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={resetCamera}
          title="Reset View"
          className="p-2 rounded text-xs font-mono bg-black/80 text-zinc-400 border border-white/10 hover:text-white hover:border-white/30 transition-all duration-200"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Collapsible Bottom Control Dock (Ergonomic, zero central viewport occlusion) */}
      {showControlsDock && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-300 max-w-[min(940px,94vw)] w-full px-4 ${
            dockCollapsed ? 'bottom-2' : 'bottom-4'
          }`}
        >
          {/* Collapse Toggle Handle */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setDockCollapsed(!dockCollapsed)}
              className="px-3 py-0.5 rounded-t text-[10px] tracking-wider uppercase font-mono bg-zinc-900 border-t border-x border-white/10 text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {dockCollapsed ? <Eye className="w-3 h-3 text-white" /> : <EyeOff className="w-3 h-3 text-zinc-400" />}
              <span>{dockCollapsed ? 'Expand 3D Controls' : 'Zen View (Hide Dock)'}</span>
            </button>
          </div>

          {/* Dock Content */}
          {!dockCollapsed && (
            <div className="p-2.5 sm:p-3 rounded-lg bg-zinc-950/95 border border-white/15 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Material Quick Swatches */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                <span className="text-[10px] uppercase font-mono text-zinc-500 whitespace-nowrap">Material:</span>
                {STUDIO_MATERIALS.slice(0, 5).map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => onMaterialChange && onMaterialChange(mat.id)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono border transition-all whitespace-nowrap ${
                      config.materialId === mat.id
                        ? 'bg-white/15 text-white border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                        : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="hidden sm:inline">{mat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Visualization Toggles with White Font & White Glow */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowToolpaths(!showToolpaths)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all duration-200 ${
                    showToolpaths
                      ? 'bg-white/20 text-white border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                      : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white hover:border-white/25'
                  }`}
                  title="Visualize CNC Toolpath Stepover Lines"
                >
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Toolpaths</span>
                </button>

                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all duration-200 ${
                    showWireframe
                      ? 'bg-white/20 text-white border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                      : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white hover:border-white/25'
                  }`}
                  title="Mesh CAD Wireframe"
                >
                  <span className="w-3.5 h-3.5 text-center font-bold text-xs leading-none">#</span>
                  <span className="hidden sm:inline">Wireframe</span>
                </button>

                <button
                  onClick={() => setBacklightGlow(!backlightGlow)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all duration-200 ${
                    backlightGlow
                      ? 'bg-white/20 text-white border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                      : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white hover:border-white/25'
                  }`}
                  title="Toggle Halo Backlight LED"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Halo LED</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtle Hint */}
      <div className="absolute bottom-2 right-4 pointer-events-none hidden md:block text-[10px] font-mono text-zinc-600">
        DRAG TO ROTATE (360°) • SCROLL TO ZOOM
      </div>
    </div>
  );
};

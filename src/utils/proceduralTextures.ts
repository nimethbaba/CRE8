import * as THREE from 'three';

// Cache generated textures so we don't recreate them needlessly
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getProceduralTexture(type: string): THREE.CanvasTexture {
  if (textureCache.has(type)) {
    return textureCache.get(type)!;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const size = 1024;
  canvas.width = size;
  canvas.height = size;

  if (type === 'wood-walnut') {
    // Deep chocolate walnut with subtle growth rings and longitudinal grain pores
    ctx.fillStyle = '#2d1c15';
    ctx.fillRect(0, 0, size, size);

    // Wavy wood grain lines
    for (let i = 0; i < 400; i++) {
      const y = (i / 400) * size;
      const alpha = 0.05 + Math.sin(i * 0.1) * 0.03;
      ctx.fillStyle = i % 2 === 0 ? `rgba(62, 39, 35, ${alpha})` : `rgba(28, 18, 14, ${alpha * 1.5})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= size; x += 30) {
        const wave = Math.sin(x * 0.008 + i * 0.05) * 8 + Math.cos(x * 0.02) * 3;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineWidth = 1.5 + Math.random() * 2;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    }

    // Wood pores / micro flecks
    for (let j = 0; j < 3000; j++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(20, 12, 10, 0.25)' : 'rgba(80, 52, 46, 0.15)';
      ctx.fillRect(px, py, 1.2, Math.random() * 8 + 2);
    }
  } else if (type === 'wood-oak') {
    // Scandinavian White Oak: Blonde architectural timber with straight medullary rays
    ctx.fillStyle = '#bca078';
    ctx.fillRect(0, 0, size, size);

    // Linear grain lines
    for (let i = 0; i < 500; i++) {
      const y = (i / 500) * size;
      const alpha = 0.06 + Math.cos(i * 0.08) * 0.04;
      ctx.fillStyle = i % 3 === 0 ? `rgba(138, 114, 82, ${alpha})` : `rgba(224, 204, 168, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= size; x += 40) {
        const wave = Math.sin(x * 0.005 + i * 0.02) * 4;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineWidth = 1.2 + Math.random() * 1.5;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    }

    // Medullary oak flecks
    for (let j = 0; j < 2000; j++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      ctx.fillStyle = 'rgba(92, 75, 52, 0.2)';
      ctx.fillRect(px, py, 1.5, Math.random() * 12 + 4);
    }
  } else if (type === 'wood-birch') {
    // Multi-ply Baltic birch with pale golden surface
    ctx.fillStyle = '#e6d3ad';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 300; i++) {
      const y = (i / 300) * size;
      const alpha = 0.04 + Math.sin(i * 0.1) * 0.03;
      ctx.fillStyle = `rgba(180, 155, 115, ${alpha})`;
      ctx.fillRect(0, y, size, 2);
    }
  } else if (type === 'metal-aluminum') {
    // Directional brushed aluminum with high micro-contrast scratches
    ctx.fillStyle = '#d0d4da';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 1500; i++) {
      const y = Math.random() * size;
      const len = Math.random() * 400 + 200;
      const x = Math.random() * size;
      const val = Math.random() > 0.5 ? 255 : 120;
      ctx.fillStyle = `rgba(${val}, ${val}, ${val}, ${Math.random() * 0.08 + 0.02})`;
      ctx.fillRect(x, y, len, 0.8);
    }
  } else if (type === 'metal-brass') {
    // Machined C360 Gold Brass
    ctx.fillStyle = '#d4a23b';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 1200; i++) {
      const y = Math.random() * size;
      const len = Math.random() * 500 + 100;
      const x = Math.random() * size;
      const alpha = Math.random() * 0.09 + 0.02;
      ctx.fillStyle = Math.random() > 0.4 ? `rgba(255, 230, 140, ${alpha})` : `rgba(150, 100, 20, ${alpha})`;
      ctx.fillRect(x, y, len, 0.9);
    }
  } else if (type === 'metal-black') {
    // Matte anodized black metal with subtle micro-speckle
    ctx.fillStyle = '#1c1f24';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 3000; i++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(50, 55, 65, 0.15)' : 'rgba(10, 12, 15, 0.25)';
      ctx.fillRect(px, py, 1.2, 1.2);
    }
  } else if (type === 'metal-titanium') {
    // Bead-blasted titanium velvet texture
    ctx.fillStyle = '#7a838d';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 4000; i++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(160, 170, 180, 0.12)' : 'rgba(80, 90, 100, 0.15)';
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  } else if (type === 'acrylic-frosted') {
    // Translucent frosted optical acrylic
    ctx.fillStyle = '#e8eff5';
    ctx.fillRect(0, 0, size, size);

    // Micro frosted noise
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  } else {
    // Default neutral texture
    ctx.fillStyle = '#26262b';
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  textureCache.set(type, texture);
  return texture;
}

/**
 * Creates dynamic 2D canvas texture for custom sign text, subtext, and uploaded image.
 */
export function createSignGraphicsTexture(
  text: string,
  subtext: string | undefined,
  fontFamily: string,
  reliefType: 'engrave-pocket' | 'emboss-raised' | 'through-stencil',
  materialCategory: string,
  uploadedImageUri: string | null
): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1024;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    if (!ctx) {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      resolve(tex);
      return;
    }

    // Transparent background
    ctx.clearRect(0, 0, width, height);

    const drawContent = () => {
      // Determine contrast color based on relief & material
      let textColor = '#ffffff';
      let shadowColor = 'rgba(0, 0, 0, 0.8)';
      
      if (reliefType === 'engrave-pocket') {
        if (materialCategory === 'wood') {
          textColor = '#120b08'; // Dark burned/carved pocket
          shadowColor = 'rgba(255, 255, 255, 0.15)';
        } else if (materialCategory === 'metal') {
          textColor = '#0a0b0d'; // Deep milled groove with dark infill
          shadowColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          textColor = '#0d131a';
        }
      } else if (reliefType === 'emboss-raised') {
        if (materialCategory === 'wood') {
          textColor = '#e5b85a'; // Brass-like inlay
        } else if (materialCategory === 'acrylic') {
          textColor = '#ffffff';
        } else {
          textColor = '#ffffff';
        }
      } else {
        // Through-cut stencil
        textColor = '#050507';
      }

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Pick font string
      let fontStr = 'bold 54px Montserrat, sans-serif';
      if (fontFamily === 'playfair') {
        fontStr = 'italic 60px "Playfair Display", serif';
      } else if (fontFamily === 'jetbrains') {
        fontStr = 'bold 50px "JetBrains Mono", monospace';
      } else if (fontFamily === 'poppins') {
        fontStr = '600 56px "Poppins", sans-serif';
      }

      const centerY = subtext ? height * 0.48 : height * 0.5;

      // Draw subtle bevel shadow for tactile CNC milling read
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = reliefType === 'engrave-pocket' ? 6 : 10;
      ctx.shadowOffsetX = reliefType === 'engrave-pocket' ? 2 : -2;
      ctx.shadowOffsetY = reliefType === 'engrave-pocket' ? 2 : -2;

      ctx.fillStyle = textColor;
      ctx.font = fontStr;

      // Trim text if too long
      const displayText = text.trim() || 'CRE8 STUDIO';
      ctx.fillText(displayText.toUpperCase(), width / 2, centerY);

      if (subtext && subtext.trim()) {
        ctx.shadowBlur = 3;
        ctx.font = '500 24px Montserrat, sans-serif';
        ctx.fillStyle = reliefType === 'engrave-pocket' ? textColor : 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(subtext.trim().toUpperCase(), width / 2, centerY + 58);
      }

      // Add subtle CNC registration marks / corner ticks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      const pad = 40;
      // Top-left crosshair
      ctx.beginPath();
      ctx.moveTo(pad - 10, pad); ctx.lineTo(pad + 10, pad);
      ctx.moveTo(pad, pad - 10); ctx.lineTo(pad, pad + 10);
      // Top-right crosshair
      ctx.moveTo(width - pad - 10, pad); ctx.lineTo(width - pad + 10, pad);
      ctx.moveTo(width - pad, pad - 10); ctx.lineTo(width - pad, pad + 10);
      // Bottom-left crosshair
      ctx.moveTo(pad - 10, height - pad); ctx.lineTo(pad + 10, height - pad);
      ctx.moveTo(pad, height - pad - 10); ctx.lineTo(pad, height - pad + 10);
      // Bottom-right crosshair
      ctx.moveTo(width - pad - 10, height - pad); ctx.lineTo(width - pad + 10, height - pad);
      ctx.moveTo(width - pad, height - pad - 10); ctx.lineTo(width - pad, height - pad + 10);
      ctx.stroke();

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      resolve(texture);
    };

    if (uploadedImageUri) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw user uploaded image badge / emblem
        const imgSize = 130;
        const imgY = subtext ? height * 0.24 : height * 0.28;
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, imgY, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, (width - imgSize) / 2, imgY - imgSize / 2, imgSize, imgSize);
        ctx.restore();

        // Border around uploaded image
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(width / 2, imgY, imgSize / 2, 0, Math.PI * 2);
        ctx.stroke();

        drawContent();
      };
      img.onerror = () => {
        drawContent();
      };
      img.src = uploadedImageUri;
    } else {
      drawContent();
    }
  });
}

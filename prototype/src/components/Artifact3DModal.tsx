import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Artifact } from '../data/heritageSites';
import { X, RotateCw, Box, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';

interface Artifact3DModalProps {
  artifact: Artifact;
  lang: 'vi' | 'en';
  onClose: () => void;
}

export const Artifact3DModal: React.FC<Artifact3DModalProps> = ({ artifact, lang, onClose }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  const [activeDisplayMode, setActiveDisplayMode] = useState<'3d' | 'photo'>('3d');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isPointerDownRef = useRef<boolean>(false);
  const prevPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e1117);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Museum Three-Point Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.8);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.5);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Group for the 3D Artifact
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Pedestal Stand
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.9,
      metalness: 0.1,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.6;
    scene.add(pedestal);

    // Build specific 3D Artifact Geometry based on type
    buildArtifactGeometry(group, artifact.geometryType);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isRotating && !isPointerDownRef.current && meshGroupRef.current) {
        meshGroupRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasContainerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [artifact]);

  const buildArtifactGeometry = (group: THREE.Group, type: string) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (type === 'gong') {
      // 3D Ancient Sacred Gong
      const gongGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.18, 48);
      const gongMat = new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.45,
        metalness: 0.8,
      });
      const gongMesh = new THREE.Mesh(gongGeo, gongMat);
      gongMesh.rotation.x = Math.PI / 2;
      group.add(gongMesh);

      // Central Boss / Nipple
      const bossGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const bossMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.35,
        metalness: 0.9,
      });
      const boss = new THREE.Mesh(bossGeo, bossMat);
      boss.position.z = 0.12;
      boss.scale.z = 0.6;
      group.add(boss);

      // Etched Concentric Rings
      const ringGeo = new THREE.TorusGeometry(0.9, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);
    } else if (type === 'pottery') {
      // 3D Unvarnished Clay Cooking Pot / Ceramic Vessel
      const points = [];
      points.push(new THREE.Vector2(0.3, -1.0));
      points.push(new THREE.Vector2(1.1, -0.6));
      points.push(new THREE.Vector2(1.3, 0.1));
      points.push(new THREE.Vector2(0.9, 0.7));
      points.push(new THREE.Vector2(0.7, 0.9));
      points.push(new THREE.Vector2(0.85, 1.1));
      points.push(new THREE.Vector2(0.75, 1.15));
      points.push(new THREE.Vector2(0.65, 0.9));
      points.push(new THREE.Vector2(0.2, -0.95));

      const potGeo = new THREE.LatheGeometry(points, 48);
      const potMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412, // Earthen terracotta
        roughness: 0.85,
        metalness: 0.05,
      });
      const potMesh = new THREE.Mesh(potGeo, potMat);
      group.add(potMesh);

      // Rim collar band
      const collarGeo = new THREE.TorusGeometry(0.86, 0.04, 16, 48);
      const collarMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 1.12;
      group.add(collar);
    } else if (type === 'loom') {
      // 3D Antique Hardwood Shuttle
      const shuttleGeo = new THREE.BoxGeometry(0.4, 0.25, 2.6);
      const shuttleMat = new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.5,
        metalness: 0.1,
      });
      const shuttle = new THREE.Mesh(shuttleGeo, shuttleMat);
      group.add(shuttle);

      // Silk bobbin inside center hole
      const threadGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 24);
      const threadMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
      const thread = new THREE.Mesh(threadGeo, threadMat);
      thread.rotation.x = Math.PI / 2;
      group.add(thread);
    } else {
      // 3D Metal Sickle / Artifact Blade
      const bladeCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.8, 0),
        new THREE.Vector3(0.5, 0.2, 0),
        new THREE.Vector3(1.2, 1.1, 0),
        new THREE.Vector3(0.2, 1.5, 0)
      );
      const bladeGeo = new THREE.TubeGeometry(bladeCurve, 32, 0.08, 12, false);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.95,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      group.add(blade);

      // Wooden handle
      const handleGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.8, 16);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(0, -1.1, 0);
      group.add(handle);
    }
  };

  // Toggle Wireframe
  const handleToggleWireframe = () => {
    setIsWireframe(!isWireframe);
    if (meshGroupRef.current) {
      meshGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.wireframe = !isWireframe;
          }
        }
      });
    }
  };

  // Drag to rotate artifact
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    prevPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !meshGroupRef.current) return;
    const deltaX = e.clientX - prevPointerPosRef.current.x;
    const deltaY = e.clientY - prevPointerPosRef.current.y;
    prevPointerPosRef.current = { x: e.clientX, y: e.clientY };

    meshGroupRef.current.rotation.y += deltaX * 0.01;
    meshGroupRef.current.rotation.x += deltaY * 0.01;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#10141d] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white rounded-xl border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D WebGL Inspection Canvas OR Real Photo Inspection View */}
        <div className="relative flex-1 h-full min-h-[350px] bg-[#0c0f16] flex items-center justify-center select-none overflow-hidden">
          {activeDisplayMode === '3d' ? (
            <>
              <div
                ref={canvasContainerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />

              {/* Canvas Floating Action Buttons */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isRotating
                      ? 'bg-amber-600/30 border-amber-500/50 text-amber-300'
                      : 'bg-black/40 border-white/10 text-stone-400'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                  {lang === 'vi' ? 'Tự xoay 360°' : 'Auto-rotate 360°'}
                </button>
                <button
                  onClick={handleToggleWireframe}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isWireframe
                      ? 'bg-sky-600/30 border-sky-500/50 text-sky-300'
                      : 'bg-black/40 border-white/10 text-stone-400'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  {isWireframe
                    ? (lang === 'vi' ? 'Bề mặt khối' : 'Solid surface')
                    : (lang === 'vi' ? 'Lưới khung Wireframe' : 'Wireframe mesh')}
                </button>
              </div>

              <div className="absolute top-5 left-5 pointer-events-none text-xs font-mono text-stone-400 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'vi' ? 'Kéo chuột hoặc ngón tay để xem chi tiết 3D' : 'Drag with a mouse or finger to inspect the 3D model'}</span>
              </div>
            </>
          ) : (
            /* Real Museum Artifact Photograph View */
            <div className="relative w-full h-full p-8 flex flex-col items-center justify-center bg-[#090b10]">
              <div className="relative max-w-full max-h-[80%] rounded-xl overflow-hidden border border-amber-500/40 shadow-2xl">
                <img
                  src={artifact.realImageUrl}
                  alt={artifact.name}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-xs font-mono text-amber-200">
                  <span className="font-bold text-amber-400">{lang === 'vi' ? 'Ảnh hiện vật thực tế: ' : 'Artifact photograph: '}</span>
                  <span>{lang === 'vi' ? artifact.realImageCaption : artifact.englishName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mode Switcher Floating Pill: 3D vs Real Photo */}
          <div className="absolute top-5 right-16 z-20 flex items-center bg-black/70 backdrop-blur-md border border-white/15 rounded-xl p-1 shadow-xl">
            <button
              onClick={() => setActiveDisplayMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeDisplayMode === '3d'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Mô hình 3D' : '3D model'}
            </button>
            <button
              onClick={() => setActiveDisplayMode('photo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeDisplayMode === 'photo'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> {lang === 'vi' ? 'Ảnh thật bảo tàng' : 'Museum photo'}
            </button>
          </div>
        </div>

        {/* Right Side: Museum Curatorial Accession Sheet */}
        <div className="w-full md:w-[420px] h-full p-8 overflow-y-auto bg-[#131722]/90 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="text-xs uppercase tracking-widest text-amber-500 font-mono flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Hồ Sơ Giám Định Hiện Vật Số' : 'Digital Artifact Record'}</span>
            </div>

            <h2 className="text-2xl font-serif text-amber-100 font-medium leading-snug">{lang === 'vi' ? artifact.name : artifact.englishName}</h2>

            {/* Accession Definition List */}
            <div className="my-6 space-y-3 text-xs border-y border-white/10 py-4 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">{lang === 'vi' ? 'Mã lưu trữ di sản:' : 'Accession number:'}</span>
                <span className="text-amber-300 font-bold">{artifact.accessionNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">{lang === 'vi' ? 'Niên đại ước định:' : 'Estimated period:'}</span>
                <span className="text-stone-200">{artifact.era}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">{lang === 'vi' ? 'Chất liệu chế tác:' : 'Material:'}</span>
                <span className="text-stone-200">{artifact.material}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">{lang === 'vi' ? 'Thông số kích thước:' : 'Dimensions:'}</span>
                <span className="text-stone-200">{artifact.dimension}</span>
              </div>
            </div>

            {/* Description & Cultural Significance */}
            <div className="space-y-4 text-xs leading-relaxed text-stone-300">
              <div>
                <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1 font-mono">{lang === 'vi' ? 'Mô tả giám định' : 'Description'}</h4>
                <p className="text-stone-300">{artifact.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1 font-mono">{lang === 'vi' ? 'Ý nghĩa văn hóa bản địa' : 'Cultural significance'}</h4>
                <p className="text-stone-300 bg-amber-950/20 border-l-2 border-amber-600 pl-3 py-1 italic">
                  {artifact.culturalSignificance}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Close Prompt */}
          <div className="pt-6 border-t border-white/10 mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-medium rounded-xl transition-all"
            >
              {lang === 'vi' ? 'Đóng và tiếp tục hành trình khám phá' : 'Close and continue exploring'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

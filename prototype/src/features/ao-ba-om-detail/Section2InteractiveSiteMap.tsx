import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  MapPin,
  Layers,
  Sparkles,
  Eye,
  Box,
  RotateCw,
  Compass,
  Maximize2,
  Minimize2,
  X,
  History,
  Info,
  ChevronRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { SITE_ZONES } from './aoBaOm5PartsData';
import type { SiteZone, AoLanguage } from './types';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { useAudioContentContext } from '../../audio/context';
import { restoredParams } from '../../experience/state';

interface Section2InteractiveSiteMapProps {
  lang: AoLanguage;
  active?: boolean;
  onOpenPanorama?: (zone: SiteZone) => void;
}

export const Section2InteractiveSiteMap: React.FC<Section2InteractiveSiteMapProps> = ({
  lang,
  active = false,
  onOpenPanorama,
}) => {
  const [selectedZone, setSelectedZone] = useState<SiteZone>(() => SITE_ZONES.find(zone => zone.id === restoredParams('ao-ba-om').get('place')) ?? SITE_ZONES[0]);
  useAudioContentContext(`ao-ba-om:zone:${selectedZone.id}`, active, 'ao-ba-om');
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'beforeAfter' | '3dModel' | 'panorama'>('info');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');

  // 3D Canvas ref
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Setup 3D scene when 3dModel tab is active
  useEffect(() => {
    if (activeTab !== '3dModel' || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0e14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffedd5, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfef08a, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, 3, -3);
    scene.add(dirLight2);

    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Create procedural 3D model based on modelType
    const modelType = selectedZone.modelType || 'boat';

    if (modelType === 'boat') {
      // Sacred Ngo Boat: elongated hull with pointed curved prow
      const hullGeo = new THREE.CylinderGeometry(0.25, 0.4, 3.8, 16);
      hullGeo.rotateZ(Math.PI / 2);
      hullGeo.scale(1, 0.6, 1.4);
      const hullMat = new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.4,
        metalness: 0.2,
      });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      group.add(hull);

      // Naga dragon prow ornaments
      const prowGeo = new THREE.ConeGeometry(0.2, 0.9, 8);
      prowGeo.rotateZ(-Math.PI / 3);
      const prowMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
      const prow = new THREE.Mesh(prowGeo, prowMat);
      prow.position.set(1.9, 0.3, 0);
      group.add(prow);

      // Gold trims
      const trimGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 24);
      const trimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
      const trim = new THREE.Mesh(trimGeo, trimMat);
      trim.position.set(0, 0, 0);
      group.add(trim);
    } else if (modelType === 'roots') {
      // Sculptural root arch system
      for (let i = 0; i < 5; i++) {
        const rootCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.2 + i * 0.5, -1, (i % 2) * 0.4),
          new THREE.Vector3(-0.8 + i * 0.4, 0.8 - i * 0.1, 0.3),
          new THREE.Vector3(0.5 - i * 0.2, 1.2, -0.2),
          new THREE.Vector3(1.2 - i * 0.3, -1, 0.1),
        ]);
        const rootGeo = new THREE.TubeGeometry(rootCurve, 20, 0.12 - i * 0.015, 8, false);
        const rootMat = new THREE.MeshStandardMaterial({ color: 0x573a21, roughness: 0.8 });
        group.add(new THREE.Mesh(rootGeo, rootMat));
      }
    } else if (modelType === 'temple') {
      // Angkor Stupa tower & tiered roof
      const baseGeo = new THREE.BoxGeometry(2, 0.6, 2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.7 });
      group.add(new THREE.Mesh(baseGeo, baseMat));

      const roof1Geo = new THREE.ConeGeometry(1.6, 0.8, 4);
      roof1Geo.rotateY(Math.PI / 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
      const roof1 = new THREE.Mesh(roof1Geo, roofMat);
      roof1.position.y = 0.7;
      group.add(roof1);

      const stupaGeo = new THREE.ConeGeometry(0.6, 1.8, 8);
      const stupaMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.4, roughness: 0.3 });
      const stupa = new THREE.Mesh(stupaGeo, stupaMat);
      stupa.position.y = 1.8;
      group.add(stupa);
    } else {
      // Ancient Khmer ceramic urn
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.3) * 0.6 + 0.2, (i - 5) * 0.25));
      }
      const urnGeo = new THREE.LatheGeometry(points, 24);
      const urnMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
      group.add(new THREE.Mesh(urnGeo, urnMat));
    }

    // Animation Loop with Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !group) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !group || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const animate = () => {
      if (!isDragging) {
        targetRotationY += 0.005;
      }
      if (group) {
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.1;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.1;
      }
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [activeTab, selectedZone]);

  const filteredZones = activeFilterCategory === 'all'
    ? SITE_ZONES
    : SITE_ZONES.filter((z) => z.category === activeFilterCategory);

  return (
    <section id="section-2-map" className="kiosk-section relative min-h-screen bg-[#080a0f] text-[#f4efe6] py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-between select-none overflow-hidden">
      {/* Ambient Neon Mists */}
      <div className="kiosk-neon-mist -top-40 -left-40 bg-amber-500/10 pointer-events-none" />
      <div className="kiosk-neon-mist -bottom-40 -right-40 bg-sky-500/10 pointer-events-none" />
      
      {/* Top Header: Section Identity */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
              {lang === 'vi' ? 'PHẦN 02 · BẢN ĐỒ CHI TIẾT & PHÂN KHU DI TÍCH' : 'PART 02 · INTERACTIVE MASTER SITE MAP'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-50">
            {lang === 'vi' ? 'Sơ Đồ Không Gian & Tuyến Trải Nghiệm Ao Bà Om' : 'Spatial Plan & Heritage Zones of Ao Ba Om'}
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-400 max-w-2xl mt-1">
            {lang === 'vi'
              ? 'Ranh giới bảo vệ cấp quốc gia, phân chia 6 phân khu chức năng, các công trình tiêu biểu, ảnh xưa - nay và mô hình 3D tương tác.'
              : 'National protected boundaries, 6 functional zones, landmark architecture, historical before/after views, and 3D artifacts.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilterCategory === 'all' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Tất cả' : 'All'}
          </button>
          <button
            onClick={() => setActiveFilterCategory('water')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilterCategory === 'water' ? 'bg-sky-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Mặt hồ' : 'Water'}
          </button>
          <button
            onClick={() => setActiveFilterCategory('forest')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilterCategory === 'forest' ? 'bg-emerald-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Rừng rễ trồi' : 'Forest'}
          </button>
          <button
            onClick={() => setActiveFilterCategory('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilterCategory === 'architecture' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Chùa Âng' : 'Monastery'}
          </button>
        </div>
      </div>

      {/* Main Map Workspace: 2-Column Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Center (Lg: Col 7): Stylized 2.5D Vector Map Canvas (Matching Slice 2 in Reference) */}
        <div className="lg:col-span-7 bg-[#10141d]/90 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Top Controls Overlay */}
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>{lang === 'vi' ? 'SƠ ĐỒ TỌA ĐỘ VÙNG LÕI DI TÍCH (TỶ LỆ 1:2000)' : 'CORE MONUMENT SURVEY GRID (1:2000)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-0.5 bg-amber-400" />
              <span className="text-[11px] text-amber-300 font-mono">
                {lang === 'vi' ? 'Vành đai bảo vệ I & II' : 'Protected Perimeter I & II'}
              </span>
            </div>
          </div>

          {/* Interactive SVG Site Map Canvas */}
          <div className="relative w-full aspect-[16/10] bg-[#090b10] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
            
            {/* Topographic Background Grayscale Contours (Matching Slice 2) */}
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full object-cover select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glowing Filter for Boundary Lines */}
                <filter id="glow-boundary" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Diagonal grid pattern */}
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="1000" height="600" fill="url(#grid-pattern)" />

              {/* 3D Topographic Contour Elevation Rings */}
              <path
                d="M 50,500 Q 180,550 480,560 Q 820,570 940,480 Q 980,300 900,120 Q 750,40 500,40 Q 200,40 80,150 Q 20,300 50,500 Z"
                fill="#121722"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
              />
              <path
                d="M 100,470 Q 250,510 500,520 Q 780,530 880,450 Q 930,300 850,150 Q 720,70 500,70 Q 220,70 120,180 Q 60,300 100,470 Z"
                fill="#151b27"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />

              {/* CORE PROTECTED BOUNDARY ENCLOSURE LINE (Line bao quanh di tích theo đúng yêu cầu) */}
              <path
                d="M 120,450 Q 260,490 500,500 Q 750,510 850,440 Q 900,320 830,170 Q 700,90 500,90 Q 240,90 140,190 Q 80,310 120,450 Z"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                filter="url(#glow-boundary)"
                opacity="0.85"
              />

              {/* ZONE POLYGONS (Phân chia khu vực theo đúng map) */}
              {SITE_ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                const isHovered = hoveredZoneId === zone.id;

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => {
                      setSelectedZone(zone);
                      setIsInspectorOpen(true);
                    }}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                  >
                    {/* Zone Fill & Border */}
                    <polygon
                      points={zone.polygonPoints}
                      fill={
                        isSelected
                          ? `${zone.highlightColor}33`
                          : isHovered
                          ? `${zone.highlightColor}22`
                          : 'rgba(255,255,255,0.02)'
                      }
                      stroke={isSelected ? '#fbbf24' : isHovered ? zone.highlightColor : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1'}
                      className="transition-all duration-200"
                    />

                    {/* Zone Name Label on Canvas */}
                    <text
                      x={zone.coordinates.x * 10}
                      y={zone.coordinates.y * 6 - 15}
                      fill={isSelected ? '#fbbf24' : '#e2e8f0'}
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow-md uppercase tracking-wider"
                    >
                      {lang === 'vi' ? zone.name.vi : zone.name.en}
                    </text>
                  </g>
                );
              })}

              {/* INTERACTIVE LOCATION PINS (Pins phát sáng tại các vị trí quan trọng) */}
              {SITE_ZONES.map((zone, idx) => {
                const isSelected = selectedZone.id === zone.id;
                const px = zone.coordinates.x * 10;
                const py = zone.coordinates.y * 6;

                return (
                  <g
                    key={`pin-${zone.id}`}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedZone(zone);
                      setIsInspectorOpen(true);
                    }}
                  >
                    {/* Pulsing Pin Ring */}
                    {isSelected && (
                      <circle cx={px} cy={py} r="18" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="animate-ping opacity-60" />
                    )}

                    {/* Pin Outer Disc */}
                    <circle
                      cx={px}
                      cy={py}
                      r="12"
                      fill={isSelected ? '#fbbf24' : '#1e293b'}
                      stroke={isSelected ? '#ffffff' : zone.highlightColor}
                      strokeWidth="2"
                      className="transition-transform duration-200 hover:scale-125"
                    />

                    {/* Pin Number */}
                    <text
                      x={px}
                      y={py + 4}
                      fill={isSelected ? '#000000' : '#ffffff'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Mini Compass at Corner */}
            <div className="absolute bottom-4 left-4 p-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-sm text-[10px] font-mono text-stone-400 flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Bắc (N) ↑</span>
              <span className="text-stone-500">|</span>
              <span>Khu Di Tích Lịch Sử</span>
            </div>
          </div>

          {/* Quick Zone Selector Carousel Bar under Map */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SITE_ZONES.map((zone, idx) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    setIsInspectorOpen(true);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 border'
                      : 'bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center font-bold text-[10px] text-amber-300">
                    {idx + 1}
                  </span>
                  <span>{lang === 'vi' ? zone.name.vi : zone.name.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (Lg: Col 5): Detailed Zone & Building Inspector Panel */}
        <div className="lg:col-span-5 bg-[#10141d]/95 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
          
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                {selectedZone.code}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                {lang === 'vi' ? selectedZone.name.vi : selectedZone.name.en}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedZone.highlightColor }} />
              <span className="capitalize">{selectedZone.category}</span>
            </div>
          </div>

          {/* Interactive Inspection Mode Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/50 border border-white/10 rounded-xl text-xs font-mono">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTab === 'info' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Thông tin' : 'Info'}</span>
            </button>
            <button
              onClick={() => setActiveTab('beforeAfter')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTab === 'beforeAfter' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Xưa – Nay' : 'Past-Now'}</span>
            </button>
            <button
              onClick={() => setActiveTab('3dModel')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTab === '3dModel' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Mô hình 3D' : '3D Model'}</span>
            </button>
            <button
              onClick={() => setActiveTab('panorama')}
              className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeTab === 'panorama' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Ảnh 360°' : '360° View'}</span>
            </button>
          </div>

          {/* TAB 1: THÔNG TIN CHI TIẾT (Kiến trúc, Chức năng, Lịch sử, Sự kiện, Hiện vật) */}
          {activeTab === 'info' && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {/* Photo Preview */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src={selectedZone.image}
                  alt={lang === 'vi' ? selectedZone.name.vi : selectedZone.name.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-xs font-serif text-stone-200">
                  {lang === 'vi' ? selectedZone.summary.vi : selectedZone.summary.en}
                </div>
              </div>

              {/* Requirement: Nơi này là gì, từng được dùng để làm gì */}
              <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'vi' ? 'Nơi này là gì & Từng được dùng làm gì?' : 'Historical Function & Purpose'}</span>
                </div>
                <p className="text-xs sm:text-sm font-serif text-stone-200 leading-relaxed">
                  {lang === 'vi' ? selectedZone.functionHistory.vi : selectedZone.functionHistory.en}
                </p>
              </div>

              {/* Requirement: Kiến trúc & Quy hoạch */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold">
                  {lang === 'vi' ? 'Đặc điểm Kiến Trúc & Cảnh Quan' : 'Architectural & Landscape Specs'}
                </h4>
                <p className="text-xs sm:text-sm font-serif text-stone-300 leading-relaxed">
                  {lang === 'vi' ? selectedZone.architecture.vi : selectedZone.architecture.en}
                </p>
              </div>

              {/* Requirement: Sự kiện & Câu chuyện gắn liền */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  {lang === 'vi' ? 'Sự Kiện Lịch Sử & Giai Thoại Gắn Liền' : 'Events & Stories'}
                </h4>
                <p className="text-xs sm:text-sm font-serif text-stone-300 leading-relaxed">
                  {lang === 'vi' ? selectedZone.eventsAndStories.vi : selectedZone.eventsAndStories.en}
                </p>
              </div>

              {/* Requirement: Hiện vật tiêu biểu */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold">
                  {lang === 'vi' ? 'Hiện Vật & Di Sản Tiêu Biểu' : 'Featured Artifacts'}
                </h4>
                <p className="text-xs sm:text-sm font-serif text-amber-200/90 leading-relaxed">
                  {lang === 'vi' ? selectedZone.artifacts.vi : selectedZone.artifacts.en}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ĐỐI CHIẾU ẢNH XƯA – NAY (Before/After Slider) */}
          {activeTab === 'beforeAfter' && (
            <div className="space-y-3">
              <BeforeAfterSlider
                lang={lang}
                pastImage={selectedZone.pastImage || selectedZone.image}
                pastLabel={lang === 'vi' ? `Tư liệu lịch sử (${selectedZone.pastYear || 'Xưa'})` : `Historical (${selectedZone.pastYear || 'Past'})`}
                pastYear={selectedZone.pastYear || '1920'}
                pastDescription={
                  selectedZone.pastDescription
                    ? (lang === 'vi' ? selectedZone.pastDescription.vi : selectedZone.pastDescription.en)
                    : (lang === 'vi' ? 'Hình ảnh tư liệu thời kỳ đầu thế kỷ XX tại Ao Bà Om.' : 'Early 20th century archive photograph of Ao Ba Om.')
                }
                presentImage={selectedZone.image}
                presentLabel={lang === 'vi' ? 'Diện mạo hiện nay' : 'Present Day Landscape'}
                presentDescription={lang === 'vi' ? selectedZone.summary.vi : selectedZone.summary.en}
              />
            </div>
          )}

          {/* TAB 3: MÔ HÌNH 3D TƯƠNG TÁC (Three.js 3D Model Inspector) */}
          {activeTab === '3dModel' && (
            <div className="space-y-3">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0e14]">
                <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur rounded-lg border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shadow-lg">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span>{lang === 'vi' ? 'Kéo để xoay 3D (360°)' : 'Drag to rotate 3D (360°)'}</span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur rounded-lg border border-white/10 text-[10px] font-mono text-stone-400 pointer-events-none">
                  {lang === 'vi' ? '✦ Hỗ trợ cảm ứng kiosk' : '✦ Kiosk touch enabled'}
                </div>
              </div>
              <p className="text-xs font-serif text-stone-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Mô phỏng 3D cổ vật gắn liền với khu vực: Thuyền Ngo độc mộc đua Ok Om Bok, mạng rễ trồi cổ thụ và kiến trúc chánh điện Khmer.'
                  : '3D digital twin of area artifact: Dugout racing boat, sculptural roots, and Khmer pagoda stupa architecture.'}
              </p>
            </div>
          )}

          {/* TAB 4: ẢNH 360° TOÀN CẢNH & HOTSPOTS */}
          {activeTab === 'panorama' && (
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={selectedZone.image}
                  alt={lang === 'vi' ? selectedZone.name.vi : selectedZone.name.en}
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Hotspot overlay pins on panorama preview */}
                {selectedZone.hotspots?.map((hs) => (
                  <div
                    key={hs.id}
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <span className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 items-center justify-center text-[10px] text-black font-bold">
                        +
                      </span>
                    </span>
                  </div>
                ))}

                <button
                  onClick={() => onOpenPanorama?.(selectedZone)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/75 hover:bg-black text-amber-300 border border-amber-400/50 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 backdrop-blur cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Xem Toàn Cảnh 360°' : 'Launch 360° Mode'}</span>
                </button>
              </div>

              {/* Hotspot Descriptions List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                  {lang === 'vi' ? 'Các Điểm Chạm (Hotspots) Tiêu Biểu Trong Khu Vực:' : 'Area Hotspots:'}
                </span>
                {selectedZone.hotspots?.map((hs) => (
                  <div key={hs.id} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-amber-200">
                      {lang === 'vi' ? hs.label.vi : hs.label.en}
                    </span>
                    <p className="text-stone-300 text-[11px] font-serif">
                      {lang === 'vi' ? hs.description.vi : hs.description.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

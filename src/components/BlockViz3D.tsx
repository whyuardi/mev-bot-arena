"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Cube } from "@phosphor-icons/react";

// ─── Block Instance ───
interface BlockData {
  mesh: THREE.Mesh;
  wireframe: THREE.LineSegments;
  targetY: number;
  popTime: number;
  floatOffset: number;
}

// ─── Scene Manager ───
function useMempoolScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    blocks: BlockData[];
    particles: THREE.Points;
    animFrame: number;
    resizeObs: ResizeObserver | null;
  } | null>(null);

  const generateBlocks = useCallback(() => {
    const mgr = sceneRef.current;
    if (!mgr) return;

    const colors = [
      "#f04444", "#f97316", "#22c55e", "#3b82f6",
      "#a855f7", "#ec4899", "#14b8a6", "#eab308",
    ];

    // Remove old blocks
    mgr.blocks.forEach((b) => {
      mgr.scene.remove(b.mesh);
      mgr.scene.remove(b.wireframe);
      b.mesh.geometry.dispose();
      (b.mesh.material as THREE.Material).dispose();
      b.wireframe.geometry.dispose();
      (b.wireframe.material as THREE.Material).dispose();
    });
    mgr.blocks = [];

    const newBlocks: BlockData[] = [];
    const gridSize = 3.5;
    const step = 1.8;

    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let z = -gridSize; z <= gridSize; z += step) {
        if (Math.abs(x) < 1.2 && Math.abs(z) < 1.2) continue;

        const size = 0.35 + Math.random() * 0.55;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const emissiveColor = new THREE.Color(color);
        const matColor = new THREE.Color(color);

        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhysicalMaterial({
          color: matColor,
          emissive: emissiveColor,
          emissiveIntensity: 0.15 + Math.random() * 0.35,
          metalness: 0.3,
          roughness: 0.4,
          clearcoat: 0.1,
          transparent: true,
          opacity: 0.92,
        });

        const mesh = new THREE.Mesh(geometry, material);
        const targetY = (Math.random() - 0.5) * 2;
        mesh.position.set(
          x + (Math.random() - 0.5) * 0.3,
          targetY - 3, // start below
          z + (Math.random() - 0.5) * 0.3
        );

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.25,
        });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        wireframe.position.copy(mesh.position);

        mgr.scene.add(mesh);
        mgr.scene.add(wireframe);

        newBlocks.push({
          mesh,
          wireframe,
          targetY,
          popTime: Date.now() + Math.random() * 2000,
          floatOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    mgr.blocks = newBlocks;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf04444, 0.5);
    fillLight.position.set(-5, 2, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 0.3);
    rimLight.position.set(0, -5, 5);
    scene.add(rimLight);

    // Particles
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: "#f04444",
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Ground grid helper
    const gridHelper = new THREE.GridHelper(12, 20, 0x1a1a30, 0x1a1a30);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    const mgr = {
      scene,
      camera,
      renderer,
      blocks: [] as BlockData[],
      particles,
      animFrame: 0,
      resizeObs: null as ResizeObserver | null,
    };
    sceneRef.current = mgr;

    // Generate initial blocks
    generateBlocks();

    // Animation loop
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Auto-rotation
      mgr.camera.position.x = 6 * Math.cos(now * 0.00015);
      mgr.camera.position.z = 6 * Math.sin(now * 0.00015);
      mgr.camera.lookAt(0, 0, 0);

      // Particles rotation
      mgr.particles.rotation.y += delta * 0.02;

      // Animate blocks
      const now_ms = Date.now();
      mgr.blocks.forEach((b) => {
        // Pop animation
        const elapsed = now_ms - b.popTime;
        if (elapsed < 0) {
          const scale = 0;
          b.mesh.scale.setScalar(scale);
          b.wireframe.scale.setScalar(scale);
        } else if (elapsed < 500) {
          const t = elapsed / 500;
          // Ease out back (overshoot)
          const c1 = 1.70158;
          const c3 = c1 + 1;
          const scale = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
          b.mesh.scale.setScalar(scale);
          b.wireframe.scale.setScalar(scale);
          // Move up
          const progress = Math.min(t * 2, 1);
          b.mesh.position.y = b.targetY - 3 + (b.targetY + 3) * progress;
          b.wireframe.position.y = b.mesh.position.y;
        } else {
          b.mesh.scale.setScalar(1);
          b.wireframe.scale.setScalar(1);
          b.mesh.position.y = b.targetY;
          b.wireframe.position.y = b.targetY;
        }

        // Float bob
        if (elapsed >= 500) {
          const bob = Math.sin(now * 0.001 + b.floatOffset) * 0.08;
          b.mesh.position.y = b.targetY + bob;
          b.wireframe.position.y = b.targetY + bob;
        }

        // Rotation
        b.mesh.rotation.x += delta * 0.15;
        b.mesh.rotation.y += delta * 0.2;
        b.wireframe.rotation.x = b.mesh.rotation.x;
        b.wireframe.rotation.y = b.mesh.rotation.y;
      });

      mgr.renderer.render(mgr.scene, mgr.camera);
      mgr.animFrame = requestAnimationFrame(animate);
    };
    mgr.animFrame = requestAnimationFrame(animate);

    // Resize observer
    const resizeObs = new ResizeObserver(() => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      mgr.camera.aspect = newW / newH;
      mgr.camera.updateProjectionMatrix();
      mgr.renderer.setSize(newW, newH);
    });
    resizeObs.observe(container);
    mgr.resizeObs = resizeObs;

    return () => {
      cancelAnimationFrame(mgr.animFrame);
      resizeObs.disconnect();
      mgr.blocks.forEach((b) => {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.Material).dispose();
        b.wireframe.geometry.dispose();
        (b.wireframe.material as THREE.Material).dispose();
        mgr.scene.remove(b.mesh);
        mgr.scene.remove(b.wireframe);
      });
      mgr.scene.remove(mgr.particles);
      particleGeo.dispose();
      particleMat.dispose();
      mgr.renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { generateBlocks };
}

// ─── Main Component ───
export default function BlockViz3D() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { generateBlocks } = useMempoolScene(canvasRef, containerRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Regenerate blocks periodically to simulate new blocks being mined
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      generateBlocks();
    }, 12000);
    return () => clearInterval(interval);
  }, [mounted, generateBlocks]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card/30 h-[420px] w-full"
    >
      {/* Header */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <Cube size={14} weight="fill" className="text-accent" />
        <span>Mempool Visualization</span>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-3 text-[10px] uppercase tracking-wider text-zinc-600">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#f04444]" /> Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#22c55e]" /> Validated
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#3b82f6]" /> Mempool
        </span>
      </div>

      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </div>
  );
}

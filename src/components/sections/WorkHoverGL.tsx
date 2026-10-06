"use client";

import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The work rail's hover: one shared WebGL canvas over the page. While a case
 * study is hovered, a plane matched to its media box draws the same image
 * with a soft displacement around the pointer, like a thumb on glass.
 * Loaded only on capable desktops; everyone else gets the CSS scale.
 */

// R3F 9.8 still constructs THREE.Clock, deprecated in three r183. Drop that one
// known notice from a dependency; forward everything else untouched.
THREE.setConsoleFunction(
  (level: "log" | "warn" | "error", message: unknown, ...params: unknown[]) => {
    if (typeof message === "string" && message.includes("Clock: This module has been deprecated")) {
      return;
    }
    console[level](message, ...params);
  },
);

const DisplaceMaterial = shaderMaterial(
  {
    uTexture: null as THREE.Texture | null,
    uHover: 0,
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uSize: new THREE.Vector2(1, 1),
    uRadius: 0,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uHover;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uSize;
    uniform float uRadius;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float roundedBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uSize.x / uSize.y, 1.0);
      float d = distance(uv * aspect, uMouse * aspect);
      float ripple = sin(d * 26.0 - uTime * 3.2) * exp(-d * 5.0);
      vec2 dir = normalize((uv - uMouse) * aspect + 1e-5);
      float n = noise(uv * 5.0 + uTime * 0.35) - 0.5;
      uv += (dir * ripple * 0.02 + vec2(n, -n) * 0.012) * uHover;
      uv = (uv - 0.5) * (1.0 - 0.035 * uHover) + 0.5;

      vec3 color = texture2D(uTexture, clamp(uv, 0.0, 1.0)).rgb;
      float edge = roundedBox((vUv - 0.5) * uSize, uSize * 0.5, uRadius);
      float alpha = 1.0 - smoothstep(-1.0, 0.5, edge);
      gl_FragColor = vec4(color, alpha * smoothstep(0.0, 0.02, uHover));
    }
  `,
);

extend({ DisplaceMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    displaceMaterial: ThreeElement<typeof DisplaceMaterial>;
  }
}

type MaterialInstance = InstanceType<typeof DisplaceMaterial> & {
  uTexture: THREE.Texture | null;
  uHover: number;
  uTime: number;
  uMouse: THREE.Vector2;
  uSize: THREE.Vector2;
  uRadius: number;
};

const TONE_INK: Record<string, string> = {
  midnight: "#f3f4f8",
  dusk: "#f3f4f8",
  lilac: "#1b1638",
  haze: "#1b1638",
  screenlight: "#1b1638",
};

/** A texture for the hovered media: the real image if there is one, else a drawn placeholder. */
function textureFor(element: HTMLElement): THREE.Texture {
  const image = element.querySelector("img");
  if (image?.complete && image.naturalWidth) {
    const texture = new THREE.Texture(image);
    texture.colorSpace = THREE.NoColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  const slot = element.querySelector<HTMLElement>("[role='img']") ?? element;
  const rect = element.getBoundingClientRect();
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(rect.width * scale));
  canvas.height = Math.max(2, Math.round(rect.height * scale));
  const context = canvas.getContext("2d");
  if (context) {
    const styles = getComputedStyle(slot);
    context.fillStyle = styles.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Grain, matching the placeholder's film texture.
    const grain = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < grain.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 22;
      grain.data[i] = (grain.data[i] ?? 0) + n;
      grain.data[i + 1] = (grain.data[i + 1] ?? 0) + n;
      grain.data[i + 2] = (grain.data[i + 2] ?? 0) + n;
    }
    context.putImageData(grain, 0, 0);
    const label = slot.textContent ?? "";
    const tone = Array.from(slot.classList)
      .find((c) => c.startsWith("media-tone-"))
      ?.slice(11);
    context.fillStyle = TONE_INK[tone ?? "dusk"] ?? "#f3f4f8";
    context.font = `700 ${14 * scale}px Poppins, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

type HoverState = {
  element: HTMLElement | null;
  target: number;
  mouse: THREE.Vector2;
};

function HoverPlane({ state, onIdle }: { state: React.RefObject<HoverState>; onIdle: () => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<MaterialInstance>(null);
  const textures = useRef(new Map<HTMLElement, THREE.Texture>());
  const current = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cache = textures.current;
    return () => {
      cache.forEach((texture) => texture.dispose());
      cache.clear();
    };
  }, []);

  useFrame(({ size, clock }, delta) => {
    const m = material.current;
    const plane = mesh.current;
    const hover = state.current;
    if (!m || !plane || !hover) return;

    if (hover.element && hover.element !== current.current && m.uHover < 0.05) {
      current.current = hover.element;
    }
    const element = current.current;
    if (!element) return;

    const cache = textures.current;
    if (!cache.has(element)) cache.set(element, textureFor(element));
    m.uTexture = cache.get(element) ?? null;

    const target = hover.element === element ? hover.target : 0;
    m.uHover += (target - m.uHover) * (1 - Math.exp(-delta * 5));
    m.uTime = clock.elapsedTime;
    m.uMouse.lerp(hover.mouse, 1 - Math.exp(-delta * 8));

    const rect = element.getBoundingClientRect();
    plane.position.set(
      rect.left + rect.width / 2 - size.width / 2,
      size.height / 2 - (rect.top + rect.height / 2),
      0,
    );
    plane.scale.set(rect.width, rect.height, 1);
    m.uSize.set(rect.width, rect.height);
    m.uRadius = element.dataset.ratio === "9:16" ? 28 : 0;

    if (target === 0 && m.uHover < 0.002) {
      m.uHover = 0;
      current.current = null;
      onIdle();
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <displaceMaterial ref={material} transparent depthTest={false} />
    </mesh>
  );
}

export default function WorkHoverGL() {
  const state = useRef<HoverState>({
    element: null,
    target: 0,
    mouse: new THREE.Vector2(0.5, 0.5),
  });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = document.getElementById("work");
    if (!section) return;
    section.dataset.gl = "";
    const media = Array.from(section.querySelectorAll<HTMLElement>("[data-work-media]"));

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      state.current.element = event.currentTarget as HTMLElement;
      state.current.target = 1;
      setActive(true);
    };
    const onMove = (event: PointerEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      state.current.mouse.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
    };
    const onLeave = () => {
      state.current.target = 0;
    };

    media.forEach((element) => {
      element.addEventListener("pointerenter", onEnter);
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
    });
    return () => {
      delete section.dataset.gl;
      media.forEach((element) => {
        element.removeEventListener("pointerenter", onEnter);
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      });
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "demand"}
        flat
        // The overlay must never catch clicks meant for the page.
        style={{ pointerEvents: "none" }}
      >
        <HoverPlane state={state} onIdle={() => setActive(false)} />
      </Canvas>
    </div>
  );
}

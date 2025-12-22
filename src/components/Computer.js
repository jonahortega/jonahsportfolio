import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnimationMixer } from 'three';
import './Computer.css';

const Computer = ({ onViewChange }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    mountRef.current.appendChild(canvas);
    rendererRef.current = renderer;
    
    // Make canvas pointer-events enabled
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'grab';

    // Cyberpunk lighting with green/cyan tones
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.4);
    scene.add(ambientLight);

    // Green cyberpunk point lights
    const pointLight1 = new THREE.PointLight(0x00ff00, 1.2, 100);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 1.0, 100);
    pointLight2.position.set(-10, 5, 10);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    // Cyan directional light
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.9);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Additional green fill light
    const fillLight = new THREE.PointLight(0x00ff00, 0.6, 100);
    fillLight.position.set(0, 5, -10);
    scene.add(fillLight);

    // Orbit controls for rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controlsRef.current = controls;

    // Load the computer terminal scene
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/commodore_64_computer/scene.gltf',
      (gltf) => {
        // Load the model exactly as provided
        const model = gltf.scene;
        
        // Apply cyberpunk styling to materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Add subtle green emissive glow to materials (cyberpunk effect)
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              // Add subtle green emissive for cyberpunk glow
              if (material.emissive) {
                material.emissive.setRGB(0.1, 0.3, 0.1); // Subtle green glow
                material.emissiveIntensity = 0.3;
              }
              // Keep original textures and colors, just add glow
              material.needsUpdate = true;
            });
          }
        });
        
        // Calculate bounding box for proper scaling
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Model is large (200+ units), scale appropriately - make it larger/more zoomed
        const maxDim = Math.max(size.x, size.y, size.z);
        let scale = 1;
        if (maxDim > 200) {
          scale = 0.05; // Increased from 0.02
        } else if (maxDim > 100) {
          scale = 0.1; // Increased from 0.05
        } else if (maxDim > 50) {
          scale = 0.2; // Increased from 0.1
        } else {
          scale = 0.4; // Increased from 0.2
        }
        
        model.scale.multiplyScalar(scale);
        
        // Center the model
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        
        // Make camera look at the front of the computer (after model is positioned)
        camera.lookAt(model.position);
        controls.target.copy(model.position);
        controls.update();
        
        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
          mixerRef.current = mixer;
        }
        
        // Add the entire scene as-is
        scene.add(model);
        modelRef.current = model;
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      if (mixerRef.current) {
        mixerRef.current.uncacheRoot(modelRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="computer" className="computer-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Computer
        </motion.h2>

        <div className="computer-container">
          {isLoading && (
            <div className="computer-loading">
              <p>LOADING TERMINAL...</p>
            </div>
          )}
          <div ref={mountRef} className="computer-3d-canvas"></div>
          
          <div className="computer-instructions">
            <p>Drag to rotate • Scroll to zoom • Pan to move</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Computer;


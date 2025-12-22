import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KHR_materials_pbrSpecularGlossiness } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';
import './Jeremiah.css';

const Jeremiah = ({ onViewChange }) => {
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
    camera.position.set(0, 4, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for mobile performance
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

    // Load the hack scene (Jeremiah model) - load exactly as is
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/hack/scene.gltf',
      (gltf) => {
        // Load the model exactly as provided - no modifications
        const model = gltf.scene;
        
        // Load headshot texture for computer screen and replace blinn4 material
        const textureLoader = new THREE.TextureLoader();
        const headshotTexture = textureLoader.load(
          '/models/hack/textures/JonahHeadshot.jpeg',
          (texture) => {
            // Configure texture
            texture.flipY = false;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            
            console.log('Headshot texture loaded, searching for blinn4 material...');
            
            // Find the blinn4 material (computer screen) and replace its texture
            let foundBlinn4 = false;
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                // Check if this mesh uses the blinn4 material (computer screen)
                // Mesh name is "pasted__Body_pasted__blinn4_0" or material name is "pasted__blinn4"
                const isBlinn4Mesh = child.name && child.name.toLowerCase().includes('blinn4');
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                
                materials.forEach((material, index) => {
                  const isBlinn4Material = material.name && material.name.toLowerCase().includes('blinn4');
                  
                  if (isBlinn4Mesh || isBlinn4Material) {
                    foundBlinn4 = true;
                    console.log('Found blinn4 material:', child.name, material.name);
                    
                    // Replace the diffuse texture - works for both standard and KHR extension materials
                    if (material.map) {
                      material.map.dispose(); // Clean up old texture
                    }
                    
                    // Set the new texture - use the loaded texture parameter
                    material.map = texture;
                    
                    // Lower brightness by adjusting material color (darker = lower brightness)
                    material.color.setRGB(0.6, 0.6, 0.6); // Reduce brightness to 60%
                    
                    // Reduce emissive if present
                    if (material.emissive) {
                      material.emissive.setRGB(0.1, 0.1, 0.1); // Very low emissive
                    }
                    
                    // Ensure proper visibility
                    material.transparent = false;
                    material.opacity = 1.0;
                    
                    // Force material update
                    material.needsUpdate = true;
                    
                    console.log('Headshot applied to material:', material.name || 'unnamed');
                  }
                });
              }
            });
            
            if (!foundBlinn4) {
              console.warn('Blinn4 material not found! Searching all materials...');
              model.traverse((child) => {
                if (child.isMesh && child.material) {
                  const materials = Array.isArray(child.material) ? child.material : [child.material];
                  materials.forEach((mat) => {
                    console.log('Material found:', child.name, mat.name);
                  });
                }
              });
            } else {
              console.log('Headshot texture successfully applied to computer screen');
            }
          },
          undefined,
          (error) => {
            console.error('Could not load headshot texture:', error);
          }
        );
        
        // Apply cyberpunk styling to materials and mark screen for click detection
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Add subtle green emissive glow to materials (cyberpunk effect)
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              // Check if this is the blinn4 material (computer screen)
              const isBlinn4 = material.name && material.name.toLowerCase().includes('blinn4');
              
              if (isBlinn4) {
                // Mark this mesh as the screen for click detection
                child.userData.isScreen = true;
                child.userData.clickable = true;
              } else {
                // Add subtle green emissive for cyberpunk glow to other materials
                if (material.emissive) {
                  material.emissive.setRGB(0.1, 0.3, 0.1); // Subtle green glow
                  material.emissiveIntensity = 0.3;
                }
                // Keep original textures and colors, just add glow
                material.needsUpdate = true;
              }
            });
          }
        });
        
        // Calculate bounding box for proper scaling
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Model is large (200+ units), scale appropriately
        const maxDim = Math.max(size.x, size.y, size.z);
        let scale = 1;
        if (maxDim > 200) {
          scale = 0.02;
        } else if (maxDim > 100) {
          scale = 0.05;
        } else if (maxDim > 50) {
          scale = 0.1;
        } else {
          scale = 0.2;
        }
        
        model.scale.multiplyScalar(scale);
        
        // Center the model
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        
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
        
        // Create 3D text box above the computer guy - single connected box
        const createTextSprite = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          // Better aspect ratio to prevent stretching
          canvas.width = 1400;
          canvas.height = 320;
          
          // Background
          context.fillStyle = 'rgba(0, 0, 0, 0.85)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Border with gradient effect
          context.strokeStyle = '#00ff00';
          context.lineWidth = 3;
          context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
          
          // Top border accent (cyan)
          context.strokeStyle = '#00ffff';
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(10, 10);
          context.lineTo(canvas.width - 10, 10);
          context.stroke();
          
          // Title text
          context.fillStyle = '#00ff00';
          context.font = 'bold 56px "Courier New", monospace';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.shadowColor = '#00ff00';
          context.shadowBlur = 15;
          
          const titleText = '> JONAH ORTEGA\'S PORTFOLIO <';
          context.fillText(titleText, canvas.width / 2, 100);
          
          // Subtitle text (smaller)
          context.fillStyle = '#00ffff';
          context.font = 'bold 36px "Courier New", monospace';
          context.shadowColor = '#00ffff';
          context.shadowBlur = 10;
          
          const subtitleText = 'click on the computer';
          context.fillText(subtitleText, canvas.width / 2, 220);
          
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1
          });
          
          const sprite = new THREE.Sprite(spriteMaterial);
          // Better aspect ratio to match canvas (1400/320 = 4.375)
          sprite.scale.set(6, 1.37, 1);
          
          return sprite;
        };
        
        // Calculate text position above the model
        const modelTop = model.position.y + (size.y * scale / 2);
        const textHeight = 5; // Moved further above
        
        // Create single combined text sprite
        const textSprite = createTextSprite();
        textSprite.position.set(model.position.x, modelTop + textHeight, model.position.z);
        scene.add(textSprite);
        
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    // Raycasting for screen clicks - only on the computer screen (blinn4 material)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let screenMeshes = [];
    
    const handleClick = (event) => {
      if (!onViewChange || !modelRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Only use raycasting - no fallback area detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([modelRef.current], true);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        // Check if clicked object is marked as the screen
        if (clickedObject.userData && clickedObject.userData.isScreen) {
          onViewChange('apps');
          return;
        }
        
        // Check if clicked object uses the blinn4 material (computer screen with headshot)
        const materials = Array.isArray(clickedObject.material) 
          ? clickedObject.material 
          : [clickedObject.material];
        
        for (const material of materials) {
          const isBlinn4 = material.name && material.name.toLowerCase().includes('blinn4');
          if (isBlinn4) {
            onViewChange('apps');
            return;
          }
        }
        
        // Also check parent objects
        let current = clickedObject.parent;
        while (current) {
          if (current.userData && current.userData.isScreen) {
            onViewChange('apps');
            return;
          }
          if (current.isMesh && current.material) {
            const parentMaterials = Array.isArray(current.material) 
              ? current.material 
              : [current.material];
            for (const material of parentMaterials) {
              const isBlinn4 = material.name && material.name.toLowerCase().includes('blinn4');
              if (isBlinn4) {
                onViewChange('apps');
                return;
              }
            }
          }
          current = current.parent;
        }
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
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

    // Handle resize (including mobile orientation changes)
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
      renderer.setSize(width, height);
    };
    // Also handle orientation change on mobile
    const handleOrientationChange = () => {
      setTimeout(handleResize, 100);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (mountRef.current && renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (mixerRef.current) {
        mixerRef.current.uncacheRoot(modelRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="jeremiah" className="jeremiah-section">
      <div className="container">
        <div className="jeremiah-container">
          {isLoading && (
            <div className="jeremiah-loading">
              <p>LOADING MODEL...</p>
            </div>
          )}
          <div ref={mountRef} className="jeremiah-3d-canvas"></div>
        </div>
      </div>
    </section>
  );
};

export default Jeremiah;


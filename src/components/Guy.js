import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnimationMixer } from 'three';
import './Guy.css';

const Guy = ({ onViewChange }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const backgroundRef = useRef(null);
  const textMeshRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;
    
    // Load galaxy background first
    const backgroundLoader = new GLTFLoader();

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
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

    // Lighting - Cyberpunk style
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff00, 2, 100);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ff88, 1.5, 100);
    pointLight2.position.set(-10, 5, 10);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Orbit controls for rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // Load the galaxy background
    backgroundLoader.load(
      '/models/starry_galaxy_sky_hdri_background_photosphere/scene.gltf',
      (gltf) => {
        const backgroundModel = gltf.scene;
        
        // Find the skybox/sphere mesh (usually the largest or only mesh)
        let skyboxMesh = null;
        let maxSize = 0;
        
        backgroundModel.traverse((child) => {
          if (child.isMesh) {
            const box = new THREE.Box3().setFromObject(child);
            const size = box.getSize(new THREE.Vector3());
            const volume = size.x * size.y * size.z;
            
            if (volume > maxSize) {
              maxSize = volume;
              skyboxMesh = child;
            }
          }
        });
        
        if (skyboxMesh) {
          // Scale it to be very large (background)
          skyboxMesh.scale.set(100, 100, 100);
          
            // Apply cyberpunk styling to the skybox
            if (skyboxMesh.material) {
              const textureLoader = new THREE.TextureLoader();
              
              // Load emissive texture if available
              let emissiveMap = null;
              if (skyboxMesh.material.emissiveMap) {
                emissiveMap = skyboxMesh.material.emissiveMap;
              } else {
                // Try to load the emissive texture from the textures folder
                emissiveMap = textureLoader.load('/models/starry_galaxy_sky_hdri_background_photosphere/textures/material_emissive.png');
              }
              
              const cyberpunkSkyMaterial = new THREE.MeshStandardMaterial({
                map: skyboxMesh.material.map || skyboxMesh.material.emissiveMap,
                emissiveMap: emissiveMap,
                emissive: 0x00ff00, // Green cyberpunk glow
                emissiveIntensity: 0.6,
                color: 0x88ff88, // Tint everything green
                metalness: 0.2,
                roughness: 0.8,
                side: THREE.BackSide, // Render inside the sphere
                transparent: false
              });
              
              skyboxMesh.material = cyberpunkSkyMaterial;
            }
          
          // Position it behind everything
          skyboxMesh.position.set(0, 0, 0);
          scene.add(skyboxMesh);
          backgroundRef.current = skyboxMesh;
        } else {
          // If no mesh found, try to use the whole scene as background
          backgroundModel.scale.set(100, 100, 100);
          backgroundModel.traverse((child) => {
            if (child.isMesh) {
              const cyberpunkSkyMaterial = new THREE.MeshStandardMaterial({
                map: child.material?.map,
                emissive: 0x002200,
                emissiveIntensity: 0.3,
                color: 0x88ff88,
                side: THREE.BackSide
              });
              child.material = cyberpunkSkyMaterial;
            }
          });
          scene.add(backgroundModel);
          backgroundRef.current = backgroundModel;
        }
      },
      undefined,
      (error) => {
        console.warn('Could not load galaxy background:', error);
      }
    );

    // Load the Kitboga scene
    const loader = new GLTFLoader();
    loader.load(
      '/models/kitboga/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        
        // Apply cyberpunk styling to all meshes
        model.traverse((child) => {
          if (child.isMesh) {
            // Create cyberpunk material
            const cyberpunkMaterial = new THREE.MeshStandardMaterial({
              color: 0x88ff88,
              emissive: 0x002200,
              emissiveIntensity: 0.5,
              metalness: 0.4,
              roughness: 0.6,
              transparent: true,
              opacity: 0.9
            });
            
            // Handle both single materials and arrays
            if (Array.isArray(child.material)) {
              child.material = child.material.map(() => cyberpunkMaterial.clone());
            } else {
              child.material = cyberpunkMaterial;
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Scale and position the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Scale to fit nicely
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.multiplyScalar(scale);
        
        // Center the model
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        
        // Add cyberpunk wireframe overlay
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.2
        });
        
        model.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const wireframe = new THREE.WireframeGeometry(child.geometry);
            const wireframeLine = new THREE.LineSegments(wireframe, wireframeMaterial);
            child.add(wireframeLine);
          }
        });
        
        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
          mixerRef.current = mixer;
        }
        
        scene.add(model);
        modelRef.current = model;
        
        // Create floating "Click Computer" text above the screen
        // Create text using canvas texture
        const textCanvas = document.createElement('canvas');
        const textContext = textCanvas.getContext('2d');
        textCanvas.width = 512;
        textCanvas.height = 128;
        
        // Draw text with cyberpunk style
        textContext.fillStyle = '#000000';
        textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
        
        textContext.font = 'bold 48px Courier New';
        textContext.fillStyle = '#00ff00';
        textContext.textAlign = 'center';
        textContext.textBaseline = 'middle';
        textContext.shadowColor = '#00ff00';
        textContext.shadowBlur = 20;
        textContext.fillText('CLICK COMPUTER', textCanvas.width / 2, textCanvas.height / 2);
        
        // Add border
        textContext.strokeStyle = '#00ff00';
        textContext.lineWidth = 3;
        textContext.strokeRect(5, 5, textCanvas.width - 10, textCanvas.height - 10);
        
        const textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.needsUpdate = true;
        
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textTexture,
          transparent: true,
          side: THREE.DoubleSide,
          emissive: 0x00ff00,
          emissiveIntensity: 0.8
        });
        
        const textGeometry = new THREE.PlaneGeometry(2, 0.5);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Position text above the computer screen - higher up
        // Find the screen position or use a default position
        let screenPosition = new THREE.Vector3(0, 2.5, 0);
        model.traverse((child) => {
          if (child.userData && child.userData.isScreen) {
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            screenPosition = worldPos.clone();
            screenPosition.y += 1.5; // Position higher above screen
          }
        });
        
        // If no screen found, position above center of model - higher
        if (screenPosition.y === 2.5) {
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          screenPosition = center.clone();
          screenPosition.y += 2.0; // Position much higher above model
        }
        
        textMesh.position.copy(screenPosition);
        
        // Make text always face camera (billboard) - will be updated in animation loop
        textMesh.lookAt(camera.position);
        
        scene.add(textMesh);
        
        // Store reference for animation
        textMeshRef.current = textMesh;
        
        // Mark computer screen as clickable - be more aggressive in detection
        const screenMeshes = [];
        model.traverse((child) => {
          if (child.isMesh) {
            const name = child.name.toLowerCase();
            let isScreen = false;
            
            // Identify computer screen by name patterns
            if (name.includes('screen') || name.includes('monitor') || 
                name.includes('display') || name.includes('laptop') ||
                name.includes('computer') || name.includes('desktop')) {
              isScreen = true;
            }
            
            // Check by position and geometry - screens are usually in front and elevated
            if (!isScreen && child.geometry) {
              child.geometry.computeBoundingBox();
              const box = child.geometry.boundingBox;
              if (box) {
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                // Get world position
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);
                
                // Screens are usually:
                // - Wider than they are tall (landscape orientation)
                // - Relatively thin (depth is small)
                // - Positioned in front (positive Z) and elevated
                const isWide = size.x > size.y * 0.7;
                const isThin = size.z < size.y * 0.5 && size.z < size.x * 0.3;
                const isInFront = worldPos.z > -1 && worldPos.z < 2;
                const isElevated = worldPos.y > 0.3 && worldPos.y < 2;
                
                if (isWide && isThin && isInFront && isElevated) {
                  isScreen = true;
                }
              }
            }
            
            if (isScreen) {
              child.userData.clickable = true;
              child.userData.isScreen = true;
              screenMeshes.push(child);
              console.log('Found screen mesh:', child.name, child.position);
            }
          }
        });
        
        console.log(`Found ${screenMeshes.length} screen mesh(es)`);
        
        // If no screens found by name/geometry, mark ALL meshes as potentially clickable
        // and use a more lenient approach
        if (screenMeshes.length === 0) {
          console.log('No screens found by detection, marking all meshes as clickable');
          model.traverse((child) => {
            if (child.isMesh) {
              child.userData.clickable = true;
            }
          });
        }
        
        setIsLoading(false);
      },
      (progress) => {
        console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    // Raycasting for screen clicks and hover effects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredScreen = null;
    
    // Define handlers - use canvas that was just created
    const handleClick = (event) => {
      console.log('Click event fired!', event);
      
      if (!onViewChange) {
        console.error('onViewChange is not available');
        return;
      }
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      console.log('Mouse position:', mouse.x, mouse.y);

      // Simple approach: if clicking in the upper center area (where monitor is), navigate to apps
      // This works regardless of model detection
      if (mouse.y > 0.1 && mouse.y < 0.6 && Math.abs(mouse.x) < 0.5) {
        console.log('Clicked in monitor area (upper center), navigating to apps');
        onViewChange('apps');
        return;
      }

      // Also try raycasting if model is loaded
      if (modelRef.current) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([modelRef.current], true);

        console.log('Raycast intersects:', intersects.length);
        
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          console.log('Clicked object:', clickedObject.name || 'unnamed', clickedObject.userData);
          
          let current = clickedObject;
          
          // Check if clicked object or its parent is the screen
          while (current) {
            if (current.userData && current.userData.isScreen) {
              console.log('Screen clicked! Navigating to apps');
              onViewChange('apps');
              return;
            }
            current = current.parent;
          }
          
          // Fallback: if we clicked any object in the front/upper area, navigate to apps
          const worldPos = new THREE.Vector3();
          clickedObject.getWorldPosition(worldPos);
          console.log('World position:', worldPos);
          
          if (worldPos.z > -1 && worldPos.z < 2 && worldPos.y > 0.2) {
            console.log('Clicked object in screen area, navigating to apps');
            onViewChange('apps');
            return;
          }
        }
      } else {
        console.log('Model not loaded yet, using area-based navigation');
      }
    };
    
    const handleMouseMove = (event) => {
      if (!modelRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([modelRef.current], true);

      let foundScreen = null;
      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        let current = hoveredObject;
        
        while (current) {
          if (current.userData && current.userData.isScreen) {
            foundScreen = current;
            break;
          }
          current = current.parent;
        }
      }
      
      // Update cursor and hover effect
      if (foundScreen !== hoveredScreen) {
        // Remove hover effect from previous screen
        if (hoveredScreen && hoveredScreen.material) {
          if (Array.isArray(hoveredScreen.material)) {
            hoveredScreen.material.forEach(mat => {
              if (mat.emissiveIntensity) mat.emissiveIntensity = 0.5;
            });
          } else {
            if (hoveredScreen.material.emissiveIntensity) {
              hoveredScreen.material.emissiveIntensity = 0.5;
            }
          }
        }
        
        // Add hover effect to new screen
        if (foundScreen && foundScreen.material) {
          if (Array.isArray(foundScreen.material)) {
            foundScreen.material.forEach(mat => {
              if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 1.0;
            });
          } else {
            if (foundScreen.material.emissiveIntensity !== undefined) {
              foundScreen.material.emissiveIntensity = 1.0;
            }
          }
          mountRef.current.style.cursor = 'pointer';
        } else {
          mountRef.current.style.cursor = 'grab';
        }
        
        hoveredScreen = foundScreen;
      }
    };

    // Add event listeners to the renderer's DOM element (the canvas)
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    console.log('Click handlers attached to canvas');

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      // Slowly rotate the background for a dynamic cyberpunk effect
      if (backgroundRef.current) {
        backgroundRef.current.rotation.y += 0.0005; // Slow rotation
      }
      
      // Animate floating text (pulse and face camera)
      if (textMeshRef.current) {
        const time = Date.now() * 0.002;
        const scale = 1 + Math.sin(time) * 0.1;
        textMeshRef.current.scale.set(scale, scale, scale);
        
        // Make text always face camera
        textMeshRef.current.lookAt(camera.position);
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
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mixerRef.current) {
        mixerRef.current.uncacheRoot(modelRef.current);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="guy" className="guy-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Guy
        </motion.h2>

        <div className="guy-container">
          {isLoading && (
            <div className="guy-loading">
              <p>LOADING MODEL...</p>
            </div>
          )}
          <div ref={mountRef} className="guy-3d-canvas"></div>
          
          <div className="guy-instructions">
            <p>Drag to rotate • Scroll to zoom • Pan to move</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guy;


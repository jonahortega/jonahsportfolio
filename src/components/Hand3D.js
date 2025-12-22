import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaProjectDiagram, FaUser, FaTimes } from 'react-icons/fa';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './Hand3D.css';

const Hand3D = ({ onViewChange }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const handModelRef = useRef(null);
  const controlsRef = useRef(null);
  const [fingerMenu, setFingerMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Finger apps mapping - 5 fingers, 2 apps each
  const fingerApps = [
    [
      { id: 'github', name: 'GitHub', icon: FaGithub, url: 'https://github.com/jonahortega', external: true },
      { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/jonah-ortega', external: true }
    ],
    [
      { id: 'email', name: 'Email', icon: FaEnvelope, url: 'mailto:jonahortega7@me.com', external: true },
      { id: 'projects', name: 'Projects', icon: FaProjectDiagram, view: 'projects' }
    ],
    [
      { id: 'organizations', name: 'Organizations', icon: FaUser, view: 'organizations' },
      { id: 'contact', name: 'Contact', icon: FaEnvelope, view: 'contact' }
    ],
    [
      { id: 'github2', name: 'GitHub', icon: FaGithub, url: 'https://github.com/jonahortega', external: true },
      { id: 'linkedin2', name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/jonah-ortega', external: true }
    ],
    [
      { id: 'email2', name: 'Email', icon: FaEnvelope, url: 'mailto:jonahortega7@me.com', external: true },
      { id: 'projects2', name: 'Projects', icon: FaProjectDiagram, view: 'projects' }
    ]
  ];

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
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - Cyberpunk style
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff00, 2, 100);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ff88, 1.5, 100);
    pointLight2.position.set(-10, -10, 10);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Orbit controls for rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controlsRef.current = controls;

    // Load realistic hand model from GLTF file
    const loader = new GLTFLoader();
    
    // Try to load hand model, fallback to procedural if not found
    const loadHandModel = () => {
      loader.load(
        '/models/hand.glb',
        (gltf) => {
          const handModel = gltf.scene;
          
          // Remove only the duplicate "Circle.003" mesh, keep everything else
          const objectsToRemove = [];
          
          // Traverse and identify ONLY Circle.003 to remove (the duplicate outline)
          handModel.traverse((child) => {
            // Only remove the specific "Circle.003" mesh - keep everything else
            if (child.isMesh && child.name === 'Circle.003') {
              objectsToRemove.push(child);
            }
          });
          
          // Remove only the duplicate circle object
          objectsToRemove.forEach(obj => {
            if (obj.parent) {
              obj.parent.remove(obj);
            }
            // Dispose of geometry and material to free memory
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(mat => mat.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });
          
          // Apply cyberpunk styling to the model
          handModel.traverse((child) => {
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
              
              // Add userData for finger identification - try multiple naming patterns
              const name = child.name.toLowerCase();
              let fingerIndex = getFingerIndexFromName(name);
              
              // If not found by name, try to identify by position or parent
              if (fingerIndex === null) {
                // Try to identify fingers by their position in the hierarchy
                let parent = child.parent;
                while (parent && fingerIndex === null) {
                  fingerIndex = getFingerIndexFromName(parent.name.toLowerCase());
                  parent = parent.parent;
                }
              }
              
              // If still not found, mark all meshes as potentially clickable
              // We'll use raycasting to identify which finger was clicked
              child.userData.clickable = true;
              if (fingerIndex !== null) {
                child.userData.fingerIndex = fingerIndex;
              }
            }
          });
          
          // Scale and position the hand
          handModel.scale.set(2, 2, 2);
          handModel.position.set(0, 0, 0);
          handModel.rotation.y = Math.PI;
          
          // Add cyberpunk wireframe overlay
          const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.2
          });
          
          handModel.traverse((child) => {
            if (child.isMesh && child.geometry) {
              const wireframe = new THREE.WireframeGeometry(child.geometry);
              const wireframeLine = new THREE.LineSegments(wireframe, wireframeMaterial);
              child.add(wireframeLine);
            }
          });
          
          scene.add(handModel);
          handModelRef.current = handModel;
          setIsLoading(false);
        },
        (progress) => {
          // Loading progress
          console.log('Loading hand model:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.warn('Could not load hand.glb, trying hand.gltf...', error);
          // Try GLTF format
          loader.load(
            '/models/hand.gltf',
            (gltf) => {
              const handModel = gltf.scene;
              
              // Remove ONLY the duplicate "Circle.003" mesh
              const objectsToRemove = [];
              handModel.traverse((child) => {
                // Only target the specific "Circle.003" mesh
                if (child.isMesh && child.name === 'Circle.003') {
                  objectsToRemove.push(child);
                }
              });
              
              // Remove only the duplicate circle mesh
              objectsToRemove.forEach(obj => {
                if (obj.parent) {
                  obj.parent.remove(obj);
                }
                // Clean up resources
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                  if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                  } else {
                    obj.material.dispose();
                  }
                }
              });
              
              // Apply cyberpunk styling
              handModel.traverse((child) => {
                if (child.isMesh) {
                  const cyberpunkMaterial = new THREE.MeshStandardMaterial({
                    color: 0x88ff88,
                    emissive: 0x002200,
                    emissiveIntensity: 0.5,
                    metalness: 0.4,
                    roughness: 0.6,
                    transparent: true,
                    opacity: 0.9
                  });
                  
                  if (Array.isArray(child.material)) {
                    child.material = child.material.map(() => cyberpunkMaterial.clone());
                  } else {
                    child.material = cyberpunkMaterial;
                  }
                  
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.userData.clickable = true;
                  
                  const name = child.name.toLowerCase();
                  const fingerIndex = getFingerIndexFromName(name);
                  if (fingerIndex !== null) {
                    child.userData.fingerIndex = fingerIndex;
                  }
                }
              });
              
              handModel.scale.set(2, 2, 2);
              handModel.position.set(0, 0, 0);
              handModel.rotation.y = Math.PI;
              
              const wireframeMaterial = new THREE.LineBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.2
              });
              
              handModel.traverse((child) => {
                if (child.isMesh && child.geometry) {
                  const wireframe = new THREE.WireframeGeometry(child.geometry);
                  const wireframeLine = new THREE.LineSegments(wireframe, wireframeMaterial);
                  child.add(wireframeLine);
                }
              });
              
              scene.add(handModel);
              handModelRef.current = handModel;
              setIsLoading(false);
            },
            undefined,
            (gltfError) => {
              console.warn('Could not load hand model, using procedural fallback:', gltfError);
              // Fallback to procedural hand
              const handModel = createDetailedHand();
              scene.add(handModel);
              handModelRef.current = handModel;
              setIsLoading(false);
            }
          );
        }
      );
    };
    
    // Helper function to identify finger from mesh name
    const getFingerIndexFromName = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('thumb')) return 0;
      if (lowerName.includes('index')) return 1;
      if (lowerName.includes('middle')) return 2;
      if (lowerName.includes('ring')) return 3;
      if (lowerName.includes('pinky') || lowerName.includes('little')) return 4;
      return null;
    };

    // Create a detailed realistic hand (fallback)
    const createDetailedHand = () => {
      const handGroup = new THREE.Group();
      handGroup.userData = { isHand: true };

      // Base material with cyberpunk styling
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x88ff88,
        emissive: 0x002200,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 0.9
      });

      const jointMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x004400,
        metalness: 0.6,
        roughness: 0.4
      });

      // Create a more realistic palm using rounded box
      const palmShape = new THREE.Shape();
      palmShape.moveTo(-0.8, -0.3);
      palmShape.lineTo(0.8, -0.3);
      palmShape.quadraticCurveTo(0.9, -0.2, 0.9, 0);
      palmShape.lineTo(0.9, 0.3);
      palmShape.quadraticCurveTo(0.8, 0.4, 0.6, 0.4);
      palmShape.lineTo(-0.6, 0.4);
      palmShape.quadraticCurveTo(-0.8, 0.4, -0.8, 0.2);
      palmShape.lineTo(-0.8, -0.3);
      
      const palmGeometry = new THREE.ExtrudeGeometry(palmShape, {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
      });
      const palm = new THREE.Mesh(palmGeometry, baseMaterial);
      palm.rotation.x = Math.PI / 2;
      palm.position.set(0, -0.2, 0);
      palm.castShadow = true;
      palm.receiveShadow = true;
      handGroup.add(palm);

      // Create realistic finger with proper phalanges
      const createRealisticFinger = (fingerIndex, config) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.userData = { fingerIndex, clickable: true };
        
        const { metacarpalLength, proximalLength, middleLength, distalLength, 
                baseWidth, tipWidth, position, rotation, spread } = config;

        // Metacarpal (palm to first joint)
        const metacarpalGeometry = new THREE.CylinderGeometry(
          baseWidth * 0.9,
          baseWidth,
          metacarpalLength,
          16
        );
        const metacarpal = new THREE.Mesh(metacarpalGeometry, baseMaterial);
        metacarpal.rotation.x = Math.PI / 2;
        metacarpal.position.y = metacarpalLength / 2;
        metacarpal.castShadow = true;
        fingerGroup.add(metacarpal);

        // Metacarpal joint
        const mcJoint = new THREE.Mesh(
          new THREE.SphereGeometry(baseWidth * 0.8, 16, 16),
          jointMaterial
        );
        mcJoint.position.y = metacarpalLength;
        mcJoint.castShadow = true;
        fingerGroup.add(mcJoint);

        // Proximal phalanx
        const proximalGeometry = new THREE.CylinderGeometry(
          baseWidth * 0.85,
          baseWidth * 0.75,
          proximalLength,
          16
        );
        const proximal = new THREE.Mesh(proximalGeometry, baseMaterial);
        proximal.rotation.x = Math.PI / 2;
        proximal.position.y = metacarpalLength + proximalLength / 2;
        proximal.castShadow = true;
        fingerGroup.add(proximal);

        // PIP joint
        const pipJoint = new THREE.Mesh(
          new THREE.SphereGeometry(baseWidth * 0.7, 16, 16),
          jointMaterial
        );
        pipJoint.position.y = metacarpalLength + proximalLength;
        pipJoint.castShadow = true;
        fingerGroup.add(pipJoint);

        // Middle phalanx
        const middleGeometry = new THREE.CylinderGeometry(
          baseWidth * 0.7,
          baseWidth * 0.6,
          middleLength,
          16
        );
        const middle = new THREE.Mesh(middleGeometry, baseMaterial);
        middle.rotation.x = Math.PI / 2;
        middle.position.y = metacarpalLength + proximalLength + middleLength / 2;
        middle.castShadow = true;
        fingerGroup.add(middle);

        // DIP joint
        const dipJoint = new THREE.Mesh(
          new THREE.SphereGeometry(baseWidth * 0.6, 16, 16),
          jointMaterial
        );
        dipJoint.position.y = metacarpalLength + proximalLength + middleLength;
        dipJoint.castShadow = true;
        fingerGroup.add(dipJoint);

        // Distal phalanx (tip)
        const distalGeometry = new THREE.CylinderGeometry(
          baseWidth * 0.55,
          tipWidth,
          distalLength,
          16
        );
        const distal = new THREE.Mesh(distalGeometry, baseMaterial);
        distal.rotation.x = Math.PI / 2;
        distal.position.y = metacarpalLength + proximalLength + middleLength + distalLength / 2;
        distal.castShadow = true;
        fingerGroup.add(distal);

        // Fingertip
        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(tipWidth * 0.8, 16, 16),
          jointMaterial
        );
        tip.position.y = metacarpalLength + proximalLength + middleLength + distalLength;
        tip.castShadow = true;
        fingerGroup.add(tip);

        fingerGroup.position.copy(position);
        fingerGroup.rotation.z = rotation;
        fingerGroup.rotation.y = spread;

        return fingerGroup;
      };

      // Realistic finger proportions (in units)
      const fingerConfigs = [
        {
          // Thumb
          metacarpalLength: 0.5,
          proximalLength: 0.4,
          middleLength: 0.3,
          distalLength: 0.25,
          baseWidth: 0.2,
          tipWidth: 0.12,
          position: new THREE.Vector3(-0.6, -0.1, 0.3),
          rotation: -0.5,
          spread: 0.3
        },
        {
          // Index
          metacarpalLength: 0.6,
          proximalLength: 0.5,
          middleLength: 0.35,
          distalLength: 0.3,
          baseWidth: 0.14,
          tipWidth: 0.08,
          position: new THREE.Vector3(-0.3, 0.15, 0),
          rotation: 0,
          spread: -0.1
        },
        {
          // Middle
          metacarpalLength: 0.65,
          proximalLength: 0.55,
          middleLength: 0.4,
          distalLength: 0.35,
          baseWidth: 0.15,
          tipWidth: 0.09,
          position: new THREE.Vector3(0, 0.2, 0),
          rotation: 0,
          spread: 0
        },
        {
          // Ring
          metacarpalLength: 0.6,
          proximalLength: 0.5,
          middleLength: 0.35,
          distalLength: 0.3,
          baseWidth: 0.13,
          tipWidth: 0.08,
          position: new THREE.Vector3(0.3, 0.15, 0),
          rotation: 0,
          spread: 0.1
        },
        {
          // Pinky
          metacarpalLength: 0.45,
          proximalLength: 0.35,
          middleLength: 0.25,
          distalLength: 0.25,
          baseWidth: 0.11,
          tipWidth: 0.07,
          position: new THREE.Vector3(0.5, 0, 0),
          rotation: 0.2,
          spread: 0.15
        }
      ];

      fingerConfigs.forEach((config, index) => {
        const finger = createRealisticFinger(index, config);
        handGroup.add(finger);
      });

      // Add subtle cyberpunk wireframe
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2
      });

      handGroup.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const wireframe = new THREE.WireframeGeometry(child.geometry);
          const wireframeLine = new THREE.LineSegments(wireframe, wireframeMaterial);
          child.add(wireframeLine);
        }
      });

      return handGroup;
    };

    // Load the hand model
    loadHandModel();

    // Raycasting for finger clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Search through all objects in the hand model
      if (!handModelRef.current) return;
      const intersects = raycaster.intersectObjects([handModelRef.current], true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        let fingerIndex = null;
        let current = clickedObject;
        
        // Traverse up the hierarchy to find finger index
        while (current && fingerIndex === null) {
          if (current.userData && current.userData.fingerIndex !== undefined && current.userData.fingerIndex !== null) {
            fingerIndex = current.userData.fingerIndex;
            break;
          }
          current = current.parent;
        }
        
        // If still not found, try to identify by position
        if (fingerIndex === null && clickedObject.position) {
          // Use position-based heuristics to identify fingers
          const worldPos = new THREE.Vector3();
          clickedObject.getWorldPosition(worldPos);
          
          // Thumb is typically on the left side
          if (worldPos.x < -0.3) fingerIndex = 0;
          // Index finger
          else if (worldPos.x < -0.1 && worldPos.y > 0.1) fingerIndex = 1;
          // Middle finger (tallest)
          else if (worldPos.x > -0.1 && worldPos.x < 0.1 && worldPos.y > 0.15) fingerIndex = 2;
          // Ring finger
          else if (worldPos.x > 0.1 && worldPos.x < 0.3 && worldPos.y > 0.1) fingerIndex = 3;
          // Pinky
          else if (worldPos.x > 0.3) fingerIndex = 4;
        }

        if (fingerIndex !== null && fingerIndex >= 0 && fingerIndex < 5) {
          setFingerMenu(fingerIndex);
        }
      }
    };

    mountRef.current.addEventListener('click', handleClick);
    setIsLoading(false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
      mountRef.current?.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleAppClick = (app) => {
    setFingerMenu(null);
    if (app.external) {
      if (app.url && app.url.startsWith('http')) {
        window.open(app.url, '_blank', 'noopener,noreferrer');
      } else if (app.url && app.url.startsWith('mailto')) {
        window.location.href = app.url;
      }
    } else if (app.view && onViewChange) {
      onViewChange(app.view);
    }
  };

  return (
    <section id="hands" className="hands-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hands
        </motion.h2>

        <div className="hand-container">
          {isLoading && (
            <div className="hand-loading">
              <p>LOADING HAND MODEL...</p>
            </div>
          )}
          <div ref={mountRef} className="hand-3d-canvas"></div>
          
          <div className="hand-instructions">
            <p>Drag to rotate • Scroll to zoom • Click finger to select</p>
          </div>
        </div>

        {/* Finger Menu Overlays */}
        <AnimatePresence>
          {fingerMenu !== null && (
            <motion.div
              className="finger-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFingerMenu(null)}
            >
              <motion.div
                className="finger-menu-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="finger-menu-close" onClick={() => setFingerMenu(null)}>
                  <FaTimes />
                </button>
                <h3 className="finger-menu-title">SELECT OPTION</h3>
                <div className="finger-menu-options">
                  {fingerApps[fingerMenu].map((app, index) => {
                    const Icon = app.icon;
                    return (
                      <motion.div
                        key={app.id}
                        className="finger-menu-option"
                        whileHover={{ scale: 1.05, x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppClick(app)}
                      >
                        <Icon className="finger-menu-icon" />
                        <span>{app.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hand3D;

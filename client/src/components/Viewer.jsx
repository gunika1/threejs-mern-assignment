import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function Loader(){ const {progress}=useProgress(); return <Html center><div className="loader">Loading {progress.toFixed(0)}%</div></Html> }
function Model({ url }){ const {scene}=useGLTF(url); return <primitive object={scene} scale={1.4} position={[0,-0.6,0]}/> }
function Scene({modelUrl,onControlsReady}){ const controlsRef=useRef(); const {camera}=useThree(); return <>
  <ambientLight intensity={1.2}/><directionalLight position={[4,4,5]} intensity={1.4}/>
  <Suspense fallback={<Loader/>}>{modelUrl ? <Model url={modelUrl}/> : <Html center><div className="empty">Upload a .glb file to preview it here</div></Html>}<Environment preset="city"/></Suspense>
  <OrbitControls ref={(ref)=>{controlsRef.current=ref; if(ref) onControlsReady?.(ref,camera)}} enableDamping dampingFactor={0.08}/>
</>}
export default function Viewer({modelUrl,onControlsReady}){return <Canvas camera={{position:[0,1.2,5], fov:50}}><Scene modelUrl={modelUrl} onControlsReady={onControlsReady}/></Canvas>}

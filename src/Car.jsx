import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PositionalAudio } from '@react-three/drei';

const carGLB = "/carrof1.glb";
const motorSound = "/motor.mp3"; 

const Car = ({ cameraRef, onSpeedChange }) => { // passa onSpeedChange como prop
  const group = useRef();
  const [speed, setSpeed] = useState(0); 
  const [steering, setSteering] = useState(0); 
  const maxSteeringAngle = Math.PI / 4;
  const turnRate = 0.05; 
  
  const { scene } = useGLTF(carGLB);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setSpeed(-1); 
          break;
        case 'ArrowDown':
          setSpeed(1); 
          break;
        case 'ArrowLeft':
          setSteering(-1); 
          break;
        case 'ArrowRight':
          setSteering(1); 
          break;
        default:
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          setSpeed(0); 
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          setSteering(0); 
          break;
        default:
          break;
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    onSpeedChange(speed);
  }, [speed, onSpeedChange]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y -= steering * turnRate;

      group.current.position.x -= Math.sin(group.current.rotation.y) * speed;
      group.current.position.z -= Math.cos(group.current.rotation.y) * speed;

      if (cameraRef.current) {
        cameraRef.current.position.set(
          group.current.position.x,
          2, 
          group.current.position.z + 5
        );
        cameraRef.current.lookAt(group.current.position);
      }
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
      <PositionalAudio url={motorSound} loop autoplay />
    </group>
  );
};

export default Car;

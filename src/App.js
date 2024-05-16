import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, PerspectiveCamera, Sphere, Html } from '@react-three/drei';
import Car from './Car';

export default function App() {
  const cameraRef = useRef();
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#4caf50');
  const [lap, setLap] = useState(1);
  const totalLaps = 57;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setSpeed((prevSpeed) => Math.min(prevSpeed + 1, 300)); // Para frente
      } else if (event.key === 'ArrowDown') {
        setSpeed((prevSpeed) => Math.max(prevSpeed - 1, -40)); // ré
      }
    };

    const handleKeyUp = () => {
      setSpeed(0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setProgress((speed / 300) * 100);

    if (speed > 250) {
      setColor('#ff5722');
    } else if (speed > 120) {
      setColor('#ffeb3b');
    } else {
      setColor('#4caf50');
    }
  }, [speed]);

  return (
    <div className="container">
      <Canvas gl={{ toneMappingExposure: 0.9}} shadows>
        <Suspense fallback={null}>
          <Environment files="/paisagem8k.hdr" ground={{ height: 5, radius: 100 }}/>
          <spotLight angle={1} position={[-30, 200, -100]} intensity={1} castShadow />
          <Car cameraRef={cameraRef} onSpeedChange={setSpeed} />
          <Sphere args={[1, 32, 32]} position={[0, 2, 0]} visible={false}>
            <meshBasicMaterial color="transparent" opacity={0.5} transparent />
          </Sphere>

          <ContactShadows
            renderOrder={2}
            resolution={1024}
            scale={120}
            blur={5}
            opacity={1.0}
            far={100}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.25}
        />

        <PerspectiveCamera
          ref={cameraRef}
          position={[-10, 100, 120]}
          fov={35}
        />
      </Canvas>

      <div className="info">
        <div className="speedometer"><a>km/h:</a>{speed > 0 ? speed : (speed < 0 ? 'R' : '0')}</div>
        <div className="progressbar-container">
          <div className="progressbar" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
      </div>

      <div className="profile">
        <img src="https://t4.ftcdn.net/jpg/07/64/77/11/360_F_764771113_bcBujlEzrhSeBet4uibc4Sszv4piQBxW.jpg" alt="Profile" />
        <div className="name">Rodrigo Silva</div>
        <div className="team">Renault da Shopee</div>
      </div>

      <div className="leaderboard">
        <h3>Tabela de Classificação</h3>
        <ul>
          <li><span>1.</span> Rodrigo Silva <span>1:34.250</span></li>
          <li><span>2.</span> Lewis Hamilton <span>1:35.250</span></li>
          <li><span>3.</span> Max Verstappen <span>1:35.750</span></li>
          <li><span>4.</span> Valtteri Bottas <span>1:36.200</span></li>
          <li><span>5.</span> Charles Leclerc <span>1:36.500</span></li>
          <li><span>6.</span> Sergio Perez <span>1:36.800</span></li>
        </ul>
      </div>

      <div className="lap-counter">
        <h2>Volta {lap}/{totalLaps}</h2>
      </div>
    </div>
  );
}

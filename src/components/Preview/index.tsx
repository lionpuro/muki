import * as Three from "three";
import { Canvas } from "@react-three/fiber";
import { Grid, PerspectiveCamera, CameraControls } from "@react-three/drei";
import { Mug } from "./Mug";
import { TbRotate360 } from "react-icons/tb";
import { useRef } from "react";

const closestDivisible = (num: number, div: number) => {
	if (div < 0) {
		return Math.floor((num + div + 1) / div) * div;
	}
	return Math.floor((num + div - 1) / div) * div;
};

const Preview = () => {
	const controlsRef = useRef<CameraControls>(null);

	const rotate = (angle: number) => {
		if (!controlsRef.current) return;
		const ang = controlsRef.current.azimuthAngle;
		const rad = angle * Three.MathUtils.DEG2RAD;
		const closest = closestDivisible(ang, rad);
		const azimuth = closest - ang + rad;
		controlsRef.current.rotate(azimuth, 0, true);
	};
	return (
		<div className="flex flex-col min-h-[300px] h-1/3 max-h-[500px] sm:min-h-[500px] border-b border-zinc-800">
			<Canvas>
				<PerspectiveCamera
					makeDefault
					fov={35}
					position={[0, 1, 5]}
					zoom={0.75}
				/>
				<group
					position={[0, -1.35, 0]}
					rotation={new Three.Euler(0, Math.PI / 2, 0, "XYZ")}
				>
					<Mug />
					<Grid
						side={Three.DoubleSide}
						cellSize={0.5}
						cellThickness={1}
						cellColor={new Three.Color("#777")}
						sectionSize={0}
						sectionColor={new Three.Color("#777")}
						args={[5, 5]}
					/>
				</group>
				<directionalLight
					color={new Three.Color(0xffffff)}
					intensity={Math.PI * 0.5}
					position={[5, 0.5, 0]}
				/>
				<directionalLight
					color={new Three.Color(0xffffff)}
					intensity={Math.PI * 0.5}
					position={[-5, 1.5, 1]}
				/>
				<ambientLight
					color={new Three.Color(0xffffff)}
					intensity={Math.PI * 0.5}
				/>
				<CameraControls
					ref={controlsRef}
					minDistance={2}
					maxDistance={5}
					minPolarAngle={-5}
					maxPolarAngle={5}
					draggingSmoothTime={0}
					polarRotateSpeed={0.9}
					azimuthRotateSpeed={0.9}
					dollyDragInverted={true}
					dollySpeed={1.25}
					truckSpeed={0}
				/>
			</Canvas>
			<div className="flex justify-center">
				<button onClick={() => rotate(90)} className="p-2">
					<TbRotate360 className="size-6 rotate-[135deg] scale-x-[-1]" />
				</button>
				<button onClick={() => rotate(-90)} className="p-2">
					<TbRotate360 className="size-6 rotate-[225deg]" />
				</button>
			</div>
		</div>
	);
};
export default Preview;

import * as Three from "three";
import { Canvas } from "@react-three/fiber";
import { Grid, PerspectiveCamera, CameraControls } from "@react-three/drei";
import { Mug } from "./Mug";
import {
	MdZoomIn as ZoomInIcon,
	MdZoomOut as ZoomOutIcon,
	MdRotateLeft,
	MdRotateRight,
} from "react-icons/md";
import { useRef } from "react";

const closestDivisible = (num: number, div: number) => {
	const offsetDiv = div < 0 ? div + 1 : div - 1;
	return Math.floor((num + offsetDiv) / div) * div;
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
	const zoom = (step: number) => {
		if (!controlsRef.current) return;
		controlsRef.current.dolly(step, true);
	};
	return (
		<div className="relative bg-base-white flex flex-col min-h-[300px] h-1/3 max-h-[500px] sm:min-h-[500px] border-b border-base-200">
			<Canvas>
				<PerspectiveCamera
					makeDefault
					fov={35}
					position={[0, 1, 5]}
					zoom={0.75}
				/>
				<CameraControls
					ref={controlsRef}
					minDistance={2}
					maxDistance={6}
					minPolarAngle={0.5}
					maxPolarAngle={2.5}
					draggingSmoothTime={0}
					polarRotateSpeed={0.9}
					azimuthRotateSpeed={0.9}
					dollyDragInverted={true}
					dollySpeed={1.25}
					truckSpeed={0}
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
			</Canvas>
			<div className="absolute left-2 sm:left-4 top-0 h-full flex flex-col justify-center pointer-events-none">
				<div className="flex flex-col bg-base-100 text-base-800 rounded-md pointer-events-auto">
					<button onClick={() => zoom(1)} className="p-2">
						<ZoomInIcon className="size-6" />
					</button>
					<button onClick={() => zoom(-1)} className="p-2">
						<ZoomOutIcon className="size-6" />
					</button>
					<button onClick={() => rotate(90)} className="p-2">
						<MdRotateRight className="size-6" />
					</button>
					<button onClick={() => rotate(-90)} className="p-2">
						<MdRotateLeft className="size-6" />
					</button>
				</div>
			</div>
		</div>
	);
};
export default Preview;

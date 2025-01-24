import * as Three from "three";
import { Canvas } from "@react-three/fiber";
import { Grid, PerspectiveCamera, CameraControls } from "@react-three/drei";
import { Mug } from "./mug";
import {
	MdZoomIn as ZoomInIcon,
	MdZoomOut as ZoomOutIcon,
} from "react-icons/md";
import { useRef } from "react";
import { Rotate360Icon } from "~/lib/icons";
import useMobile from "~/hooks/useMobile";

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

	const { isMobile } = useMobile();

	return (
		<div
			className={`relative grow bg-base-white flex flex-col
			rounded-lg overflow-hidden
			min-h-[200px] h-full
			sm:h-auto sm:min-h-[300px]`}
		>
			<Canvas>
				<PerspectiveCamera
					makeDefault
					fov={35}
					position={[0, 1, isMobile ? 9 : 7]}
					zoom={0.75}
				/>
				<CameraControls
					ref={controlsRef}
					minDistance={2}
					maxDistance={9}
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
			<div className="absolute bottom-3 sm:bottom-auto w-full sm:w-auto sm:top-0 sm:left-3 sm:left-4 sm:h-full flex sm:flex-col justify-center pointer-events-none">
				<div className="flex sm:flex-col text-base-800 bg-base-white border border-base-100 rounded-lg pointer-events-auto">
					<button onClick={() => zoom(1)} className="p-2">
						<ZoomInIcon className="size-6" />
					</button>
					<button onClick={() => zoom(-1)} className="p-2">
						<ZoomOutIcon className="size-6" />
					</button>
					<button onClick={() => rotate(90)} className="p-2">
						<Rotate360Icon className="size-6" />
					</button>
					<button onClick={() => rotate(-90)} className="p-2">
						<Rotate360Icon className="size-6 scale-x-[-1]" />
					</button>
				</div>
			</div>
		</div>
	);
};
export default Preview;

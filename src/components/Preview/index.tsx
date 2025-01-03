import * as Three from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { Mug } from "./Mug";

const Preview = () => {
	return (
		<div className="flex min-h-[300px] h-1/3 max-h-[500px] sm:min-h-[500px] border-b border-zinc-800">
			<Canvas
				orthographic
				camera={{
					isPerspectiveCamera: true,
					fov: 30,
					position: [0, 0, 10],
					zoom: 120,
				}}
			>
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
				<Environment preset="warehouse" background blur={4} />
				<OrbitControls
					enableDamping={false}
					enablePan={false}
					minDistance={1}
					maxDistance={5}
					minPolarAngle={-5}
					maxPolarAngle={5}
					autoRotate={false}
					target={new Three.Vector3(0, 0, 0)}
					position={new Three.Vector3(0, 0, 0)}
					panSpeed={1.1}
				/>
			</Canvas>
		</div>
	);
};
export default Preview;

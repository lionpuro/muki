import { useGLTF } from "@react-three/drei";
import { CylinderGeometry, MeshPhysicalMaterial, Texture, Mesh } from "three";
import { GLTF } from "three-stdlib";
import useTextures from "~/hooks/useTextures";

type MugGLTF = GLTF & {
	nodes: {
		["11oz-Mug"]: Mesh;
	};
	materials: {
		["Mug-Material"]: MeshPhysicalMaterial;
	};
	//animations: GLTFAction[]
};

const Cylinder = ({ texture }: { texture: Texture }) => {
	const offset = Math.PI / 6;
	const geometry = new CylinderGeometry(
		1.11,
		1.11,
		2.5,
		64,
		1,
		true,
		0 + offset,
		Math.PI * 2 - offset * 2,
	);
	return (
		<mesh
			rotation={[0, 0, 0]}
			dispose={null}
			geometry={geometry}
			position={[0, 1.35, 0.01]}
		>
			<meshBasicMaterial transparent map={texture} />
		</mesh>
	);
};

export const Mug = () => {
	const { nodes, materials } = useGLTF("/models/mug.glb") as MugGLTF;
	const material = materials["Mug-Material"];
	material.roughness = 0.1;

	const { texture } = useTextures();
	return (
		<>
			<group
				position={[0, -0.1, 0.01]}
				rotation={[0, Math.PI, 0]}
				dispose={null}
			>
				<mesh
					scale={[0.441, 0.445, 0.441]}
					geometry={nodes["11oz-Mug"].geometry}
					material={material}
				/>
			</group>
			<Cylinder texture={texture} />
		</>
	);
};

useGLTF.preload("/models/mug.glb");

import Editor from "~/editor";
import Preview from "~/preview";
import { TextureProvider } from "~/context/TextureContext";

const App = () => {
	return (
		<TextureProvider>
			<div className="h-full flex flex-col">
				<Preview />
				<Editor />
			</div>
		</TextureProvider>
	);
};

export default App;

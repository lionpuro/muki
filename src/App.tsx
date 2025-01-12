import Editor from "~/components/Editor";
import Preview from "~/components/Preview";
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

import Editor from "~/components/Editor";
import Preview from "~/components/Preview";
import { TextureProvider } from "~/TextureContext";

const App = () => {
	return (
		<TextureProvider>
			<div className="h-full flex flex-col">
				<Preview />
				<div className="flex flex-col p-4 gap-4">
					<Editor />
				</div>
			</div>
		</TextureProvider>
	);
};

export default App;

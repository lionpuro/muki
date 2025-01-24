import { TextureProvider } from "~/context/TextureContext";
import { StageProvider } from "./context/StageContext";
import { Layout } from "./layout";

const App = () => {
	return (
		<TextureProvider>
			<StageProvider>
				<Layout />
			</StageProvider>
		</TextureProvider>
	);
};

export default App;

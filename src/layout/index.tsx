import { ButtonHTMLAttributes, ReactNode, useContext, useState } from "react";
import clsx from "clsx";
import useMobile from "~/hooks/useMobile";
import { EditIcon, Rotation3dIcon } from "~/lib/icons";
import Editor from "~/editor";
import Preview from "~/preview";
import { StageContext } from "~/context/StageContext";

const MobileLayout = ({ currentTab }: { currentTab: "editor" | "preview" }) => {
	return (
		<>
			<Container>
				<div
					className={clsx("flex h-full", currentTab !== "preview" && "hidden")}
				>
					<Preview />
				</div>
				<div
					className={clsx(
						"flex flex-col h-full gap-3",
						currentTab !== "editor" && "hidden",
					)}
				>
					<Editor />
				</div>
			</Container>
		</>
	);
};

export const Layout = () => {
	const { isMobile } = useMobile();
	const [currentTab, setCurrentTab] = useState<"editor" | "preview">("editor");
	return (
		<div className="h-full flex flex-col">
			<Header />
			<TabBar current={currentTab} setCurrent={setCurrentTab} />
			{isMobile ? (
				<MobileLayout currentTab={currentTab} />
			) : (
				<>
					<Container>
						<div
							className={clsx(
								"flex h-full",
								currentTab !== "preview" && "hidden",
							)}
						>
							<Preview />
						</div>
						<div
							className={clsx(
								"flex flex-col h-full gap-3",
								currentTab !== "editor" && "hidden",
							)}
						>
							<Editor />
						</div>
					</Container>
				</>
			)}
		</div>
	);
};

const Header = () => {
	const { stageToDataURL } = useContext(StageContext);

	const handleExport = () => {
		const uri = stageToDataURL();
		if (!uri) return;
		const link = document.createElement("a");
		link.download = "muki.png";
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="flex items-center p-3 gap-2 border-b justify-between">
			<img src="/logo-sm.png" className="mx-1 min-h-10 max-h-10" />
			<div className="flex h-full">
				<button
					onClick={handleExport}
					className="flex items-center rounded-lg gap-2 py-2 px-5 text-sm font-semibold bg-primary-500 text-base-white"
				>
					Valmis
				</button>
			</div>
		</div>
	);
};

const Container = ({ children }: { children?: ReactNode }) => (
	<div className="h-full flex flex-col p-3 pt-0 gap-3 min-w-0 md:my-auto md:h-full">
		{children}
	</div>
);

const Tab = ({
	selected,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	selected: boolean;
	children: ReactNode;
}) => (
	<button
		className={clsx(
			"flex flex-col justify-center gap-2 rounded-lg",
			"text-sm font-semibold",
			selected ? "bg-primary-300 text-base-900" : "bg-base-200 text-base-800",
		)}
		{...props}
	>
		<span className="flex items-center gap-2 p-2 px-4">{children}</span>
	</button>
);

const TabBar = ({
	current,
	setCurrent,
}: {
	current: "editor" | "preview";
	setCurrent: (t: "editor" | "preview") => void;
}) => (
	<div className="mx-3 mb-3 flex gap-2">
		<Tab onClick={() => setCurrent("editor")} selected={current === "editor"}>
			<EditIcon className="size-5" /> Muokkaa
		</Tab>
		<Tab onClick={() => setCurrent("preview")} selected={current === "preview"}>
			<Rotation3dIcon className="size-5" />
			Esikatselu
		</Tab>
	</div>
);

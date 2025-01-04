import { useEffect } from "react";

export default function useOnLoadCallback(callback: () => void) {
	useEffect(() => {
		callback();
		return () => callback();
	}, [callback]);
}

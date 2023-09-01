import "./App.css";
import Router from "./Router/Routes";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { HelmetProvider } from "react-helmet-async";

function App() {
	return (
		<div>
			<BrowserRouter>
				<NextUIProvider>
					<HelmetProvider>
						<Router />
					</HelmetProvider>
				</NextUIProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;

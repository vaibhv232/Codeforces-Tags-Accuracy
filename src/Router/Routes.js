import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "../Views/Home"
const Router = (props) => {
	return (
		<Switch >
			<Route component={Home} />
		</Switch >
	);
};

export default Router;

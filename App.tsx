import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./Main";
import Login from "./scenes/account/Login";
import Register from "./scenes/account/Register";
import SignUp from "./scenes/account/SignUp";
import StackScene from "./scenes/stack/Stack";
import Calibration from "./scenes/calibration/Main";
import StackScene2 from "./scenes/stack/StackSecond";

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="Home" component={MainScreen} />
				<Stack.Screen options={{ headerShown: false }} name="StackScene2" component={StackScene2} />
				<Stack.Screen options={{ headerShown: false }} name="Stack" component={StackScene} />
				<Stack.Screen options={{ headerShown: false }} name="Calibration" component={Calibration} />
				<Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
				<Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
				<Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./Main";

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={{ headerShown: false }} name="Home" component={MainScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
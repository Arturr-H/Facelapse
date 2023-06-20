import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";

/* Scenes */
import MainScreen from "./Main";
import Login from "./scenes/account/Login";
import Register from "./scenes/account/Register";
import SignUp from "./scenes/account/SignUp";
import StackScene from "./scenes/stack/Stack";
import Calibration from "./scenes/calibration/Main";
import StackScene2 from "./scenes/stack/StackSecond";
import SplashScene from "./scenes/splash/SplashScene";

const Stack = createStackNavigator();

const App = () => {
	/* Hooks */
	const [appIsReady, setAppIsReady] = React.useState(false);

	/* Wait for app to load */
	React.useEffect(() => {
		async function prepare() {
			try {
				await new Promise(resolve => setTimeout(resolve, 2000));
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			};
		}
	
		prepare();
	}, []);

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);
	
	if (!appIsReady) {
		return <SplashScene />;
	}

	/* Render */
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{/* <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} /> */}
				<Stack.Screen options={{ headerShown: false }} name="Home" component={MainScreen} />
				<Stack.Screen options={{ headerShown: false }} name="StackScene2" component={StackScene2} />
				<Stack.Screen options={{ headerShown: false }} name="Stack" component={StackScene} />
				<Stack.Screen options={{ headerShown: false }} name="Calibration" component={Calibration} />
				<Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
				<Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
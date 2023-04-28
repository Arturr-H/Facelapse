/* Imports */
import { Dimensions, StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		backgroundColor: "#F7F2F2",
		alignItems: "center",
		justifyContent: "center",

		// transform: [{ scale: 0.5 }]
	},
	body: {
		flex: 1,
		height: "100%",
		width: "100%",

		position: "absolute",
	},
	sceneContainer: {
		width: Dimensions.get("window").width*2,
		height: "100%",

		display: "flex",
		flexDirection: "row",
		flex: 1,

		transform: [{ translateX: 0 }]
	},
	temp: {
		width: "100%",
		height: "100%",

		backgroundColor: "#F7F2F2"
	},

	panHandler: {
		width: "100%",
		height: "100%",

		position: "absolute",
		zIndex: 10,
	}
});

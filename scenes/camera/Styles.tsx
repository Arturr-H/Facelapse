/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",

		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	camera: {
		width: "100%",
		height: "100%",

		justifyContent: "center",
		alignItems: "center",
	},
	face: {
		width: "60%",
		height: "100%",

		position: "absolute",
		resizeMode: "contain",

		opacity: 0.2
	},

	backgroundBlur: {
		height: "100%",
		width: "100%",

		position: "absolute",
		zIndex: 10
	},

	flashButton: {
		width: 45,
		height: 45,

		backgroundColor: "#EF3054",

		position: "absolute",
		top: 125,
		right: 20,

		borderRadius: 35,
		display: "flex",
		justifyContent: "center",
			alignItems: "center"
	}
});

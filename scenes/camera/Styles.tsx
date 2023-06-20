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

		opacity: 0.2,
		transform: [{ translateY: 24 }, { translateX: -10 }]
	},

	backgroundBlur: {
		height: "100%",
		width: "100%",

		position: "absolute",
		zIndex: 10
	},

	alignContainer: {
		width: 75,
		height: 100,

		position: "absolute",
		zIndex: 15,
		bottom: 175,

		display: "flex",
		justifyContent: "center",
			alignItems: "center"
	},
	alignImage: {
		width: 75,
		height: 100,
		position: "absolute",

		opacity: 0.3
	},

	onionskinImage: {
		width: "100%",
		height: "100%",
		position: "absolute",

		opacity: 0
	},

	viewShot: {
		width: "100%",
		height: "100%",
		position: "absolute",
		justifyContent: "center",
			alignItems: "center",
		// zIndex: 21,
		// opacity: 0
	}
});

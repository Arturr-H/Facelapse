/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	poster: {
		width: 180,
		height: 230,

		padding: 8,
		backgroundColor: "#fff",

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.23,
		shadowRadius: 13.97,
		elevation: 21,

		display: "flex",
		alignItems: "center",

		marginBottom: 20,
		marginTop: 20,
	},
	posterSmall: {
		width: 120,
		height: 160,

		padding: 6,
	},
	posterBig: {
		width: 240,
		height: 320,

		padding: 10,
	},

	image: {
		width: "100%",
		aspectRatio: 1,

		resizeMode: "cover",

		transform: [{ scaleX: -1 }]
	},
	posterDate: {
		fontSize: 12,
		fontWeight: "300",
		color: "#999",

		position: "absolute",
		right: 5,
		bottom: 5,
	},
	posterDateBig: {
		fontSize: 16,
	},

	pin: {
		width: 30,
		height: 30,

		position: "absolute",
		transform: [{ translateY: -25 }]
	},
	pinSmall: {
		width: 22,
		height: 22,

		position: "absolute",
		transform: [{ translateY: -17.5 }]
	},
	pinBig: {
		zIndex: 10,
		width: 38,
		height: 38,

		position: "absolute",

		/// We have translateX: 5 because it's centered
		/// but doesn't look like it is.
		transform: [{ translateY: -30 }, { translateX: 5 }]
	}
});

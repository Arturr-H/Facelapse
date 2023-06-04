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

	pin: {
		width: 30,
		height: 30,

		position: "absolute",
		transform: [{ translateY: -25 }]
	}
});

/* Imports */
import { Dimensions, StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",

		flex: 1,

		position: "relative",
		zIndex: 11,
		alignItems: "center",
	},

	flatlist: {
		display: "flex",
        justifyContent: "center",
			alignItems: "center",

		position: "relative"
	},
	imageContainer: {
		height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,

		display: "flex",
        justifyContent: "center",
			alignItems: "center",
		
	},
	imageWrapper: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.53,
		shadowRadius: 13.97,
		elevation: 21,
	},
	image: {
		width: "70%",
		aspectRatio: 3 / 5,
		resizeMode: "cover",
		borderRadius: 15,
	},

	dateContainer: {
		width: "100%",
		height: "100%",

		display: "flex",
		justifyContent: "center",
			alignItems: "center",
	},
	dateText: {
		fontSize: 36,
		fontWeight: "700",
		color: "#fff"
	}
});

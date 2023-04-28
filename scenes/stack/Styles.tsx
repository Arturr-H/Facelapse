/* Imports */
import { Dimensions, StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		height: "100%",

		flex: 1,

		position: "relative",
		zIndex: 11
	},
	flatlist: {
		flex: 1,
		display: "flex",
		flexDirection: "column",

		marginTop: 105,
	}
});

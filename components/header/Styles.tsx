/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	header: {
		width: "100%",

		paddingVertical: 10,
		paddingHorizontal: 20,

		display: "flex",
		justifyContent: "space-between",
			alignItems: "center",
		flexDirection: "row",

		borderBottomColor: "#00000055",
		borderBottomWidth: 1,
		
		position: "absolute",
		zIndex: 4,
		top: 0,

		paddingTop: 45
	},
	logo: {
		height: 50,
		width: 120,
		
		resizeMode: "contain",
	},
});

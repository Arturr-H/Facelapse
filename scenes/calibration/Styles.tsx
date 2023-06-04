/* Imports */
import { Dimensions, StyleSheet } from "react-native";
import { BorderAll } from "../../styling/Global";

/* Main styles */
export default StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		height: "100%",

		flex: 1,
		display: "flex",
		alignItems: "center",
		flexDirection: "column",

		position: "relative",
		zIndex: 11,
	},
	camera: {
		width: "100%",
		height: "100%",
	},
	faceMetadataWrapper: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
			alignItems: "center",

		width: "100%",
	},
	faceMetadataContainer: {
		width: "100%",
		aspectRatio: 9 / 16,

		borderRadius: 10,
		...BorderAll,

		flex: 2,
	},

	body: {
		width: "100%",
		height: "100%",
		flex: 1,
		display: "flex",
		flexDirection: "column",
		gap: 10,

		paddingHorizontal: 25,
		paddingVertical: 20,
	},
	faceMetadataInfoView: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",

		height: "100%",
		paddingHorizontal: 10,

		flex: 3,
		gap: 6,
	},
	row: {
		width: "100%",
		height: 25,

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
			alignItems: "center",
	},
	first: {
		fontWeight: "500",
		backgroundColor: "#ececec",
		paddingHorizontal: 5,
		paddingVertical: 2.5,

		borderRadius: 6,
		overflow: "hidden",
		color: "#999"

	},
	last: {
		fontWeight: "400",
		color: "#999"
	},

	confirmButton: {
		width: "100%",
		height: 50,

		backgroundColor: "#FBAF00",

		borderRadius: 15,
		
		display: "flex",
		justifyContent: "center",
			alignItems: "center",

		bottom: 40,
		position: "absolute",

		alignSelf: "center",
	},
	confirmButtonText: {
		color: "#F7F2F2",
		fontWeight: "700",
		fontSize: 24
	}
});

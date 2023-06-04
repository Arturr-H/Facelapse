/* Imports */
import { StyleSheet } from "react-native";

/* Constants */
const NAVBAR_HEIGHT = 110;
const MARGIN = 8;

/* Main styles */
export default StyleSheet.create({
	navbarWrapper: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.53,
		shadowRadius: 13.97,
		elevation: 21,

		width: "82.5%",
		height: NAVBAR_HEIGHT,

		position: "absolute",
		zIndex: 15,
		bottom: 40,
	},
	navbar: {
		width: "100%",
		height: NAVBAR_HEIGHT,

		borderRadius: 30,
		overflow: "hidden",
		padding: MARGIN,
		paddingHorizontal: MARGIN*1.5,

		display: "flex",
		flexDirection: "row"
	},
	navbarTile: {
		flex: 1,
		overflow: "hidden",

		display: "flex",
		justifyContent: "center",
			alignItems: "center"
	},
	navbarTileMiddle: {
		display: "flex",
		justifyContent: "center",
			alignItems: "center"
	},

	/* Picbutton */
	touchableHighlight: {  },
	pictureButtonOuter: {
		width: 80,
		height: 80,

		padding: 5,
		borderWidth: 5,
		borderColor: "#fff",

		borderRadius: 80
	},
	pictureButtonInner: {
		width: "100%",
		height: "100%",

		backgroundColor: "#fff",
		borderRadius: 50,

		display: "flex",
		justifyContent: "center",
			alignItems: "center"
	},
	buttonText: {
		color: "#141617",
		fontWeight: "700",
		fontSize: 25,
		textTransform: "uppercase",
	},

	flashlightView: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		zIndex: 143,

		width: 42,
		height: 42,
	},

	/* Setup nav */
	setupNav: {
		width: "100%",
		height: 150,

		position: "absolute",
		zIndex: 15,

		/* Keep this it needs to be opaque */
		borderBottomColor: "#cccccc22",
		borderBottomWidth: 2,
	},
	setupNavInner: {
		width: "100%",
		height: "100%",

		display: "flex",
		flexDirection: "row",

		justifyContent: "center",
			alignItems: "center",

		paddingHorizontal: "10%",
		paddingTop: "15%"
	},

	anchorContainer: {
		width: "100%",
		height: "100%",

		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
			alignItems: "center"
	},
	topNavButtonText: {
		fontWeight: "500",
		fontSize: 18,

		color: "#cccccc99",

		marginHorizontal: 15
	},
	topNavButtonTextActive: {
		fontWeight: "700",
		fontSize: 18,

		color: "#fff",
		marginHorizontal: 15
	},

	navButtonWrapper: {
		borderRadius: 20,

		height: 40,
		display: "flex",
		justifyContent: "center",
			alignItems: "center",
	},
	navButtonBackground: {
		backgroundColor: "#FBAF00",

		width: "100%",
		height: "100%",
		
		position: "absolute",
		borderRadius: 20,
	}
});

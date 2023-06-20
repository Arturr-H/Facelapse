/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",

		display: "flex",
		justifyContent: "center",
		alignItems: "center",

        paddingHorizontal: 20
	},
    logo: {
        width: "80%",
        resizeMode: "contain"
    },

    activityIndicator: {
        position: "absolute",

        bottom: "25%"
    }
});

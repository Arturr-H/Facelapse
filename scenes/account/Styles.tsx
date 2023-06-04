/* Imports */
import { Dimensions, StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
    outer: {
        backgroundColor: "#F7F2F2",
    },
    container: {
        width: "100%",
        height: "100%",

        display: "flex",
        flexDirection: "column",
    },

    /* Header */
	header: {
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
	},
    logo: {
        width: "50%",

        resizeMode: "contain"
    },

    /* Body */
	body: {
        flex: 4,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        gap: 10,
        padding: 10,

	},

    button: {
        width: "100%",
        height: 50,

        backgroundColor: "#FBAF00", //#E85F5C, #F9627D, #DB7F67, #7F7EFF, #2191FB, #5C9EAD, #FBAF00

        borderRadius: 15,
        
        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    buttonText: {
        color: "#F7F2F2",
        fontWeight: "700",
        fontSize: 24
    }
});

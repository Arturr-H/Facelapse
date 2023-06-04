/* Imports */
import { Dimensions, StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
    textInputOuter: {
        width: "100%",
        height: 50,

        borderRadius: 10,
        paddingLeft: 20,

        borderColor: "#ececec",
        borderWidth: 2,

        display: "flex",
        flexDirection: "row",
    },
    textInputInner: {
        flex: 1,
    },

    iconContainer: {
        height: "100%",
        width: 50,
        padding: 12.5,
    },
    textInputIcon: {
        opacity: 0.1,
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },

    numberInputContainer: {
        width: "100%",
        height: 50,

        borderRadius: 10,
        padding: 5,

        borderColor: "#ececec",
        borderWidth: 2,

        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    inputButton: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        backgroundColor: "#ececec",
        flex: 1,
        borderRadius: 5
    },
    inputButtonActive: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 1,
        backgroundColor: "#FBAF00",
        borderRadius: 5,

        width: "100%",
        height: "100%",
    },
    inputButtonTextActive: {
        fontWeight: "700",
        fontSize: 20,
        color: "#fff"
    },
    inputButtonText: {
        fontWeight: "700",
        fontSize: 20,
        color: "#fff"
    },
});

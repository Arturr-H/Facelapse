/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
    indicatorContainer: {
        zIndex: 2,

        position: "absolute",
        width: 40,
        height: 40,
    },
    indicator: {
        width: 40,
        height: 40,
        opacity: 0.4,
    },
    active: {
        opacity: 0.8
    },

    touchable: {
        width: "100%",
        height: "100%",

        display: "flex",
        alignItems: "center"
    }
});

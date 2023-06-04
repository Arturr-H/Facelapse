/* Imports */
import React from "react";
import { View } from "react-native";
import Styles from "./Styles";
import Edit from "./scenes/Edit";
import SetupNav from "../../components/nav/SetupNav";
import FaceCalibration from "./scenes/FaceCalibration";
import Save from "./scenes/Save";

/* Interfaces */
interface Props {}
interface State {
    scene: Scene
}

/* Types */
type Scene = "edit" | "calibrate" | "save";

/* Main */
export default class Calibration extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            scene: "save"
        }

        /* Bindings */
        this.changeActive = this.changeActive.bind(this);
    }

    /* Change the condig scene */
    changeActive(to: Scene): void {
        this.setState({ scene : to });
    }

    /* Render */
    render() {
        return (
            <View style={Styles.container}>
				<SetupNav
                    relative={this.state.scene !== "calibrate"}
                    changeActive={this.changeActive}
                />

                {
                    this.state.scene ===
                        "calibrate" ? <FaceCalibration /> : this.state.scene ===
                        "edit"      ? <Edit />            : this.state.scene ===
                        "save"      ? <Save />               : null
                }
            </View>
        )
    }
}

/* Imports */
import { View, Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import React from "react";
import { BlurView } from "expo-blur";
import Icon from "../icon/Icon";

/* Interfaces */
interface Props {
    rightButtonIcon?: ImageSourcePropType,
    rightButtonOnPress?: () => void
}

/* Main */
export default class Header extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    /* Render */
	render() {
		return (
            <BlurView tint="dark" intensity={40} style={Styles.header}>
                <Image
                    style={Styles.logo}
                    source={require("../../assets/facelapse-wide.png")}
                />

                {this.props.rightButtonIcon &&
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.props.rightButtonOnPress}
                    >
                        <Icon
                            source={this.props.rightButtonIcon}
                            size={32}
                        />
                    </TouchableOpacity>
                }
            </BlurView>
		);
	}
}

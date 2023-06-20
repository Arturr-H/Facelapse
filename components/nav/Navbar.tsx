
/* Imports */
import { TouchableHighlight, TouchableOpacity, View, Text, Animated, Easing, ActivityIndicator } from "react-native";
import Styles from "./Styles";
import React, { ReactElement } from "react";
import { Haptic } from "../../funcitonal/Haptics";
import { BlurView } from "expo-blur";
import Icon from "../icon/Icon";
import { animate } from "../../funcitonal/Animate";

/* Interfaces */
interface Props {
    takePic?: () => void,
    usePic?: () => void,
    scrapPic?: () => void,
    toggleFlashlight?: () => void,
    flashlightOn?: boolean,
    loading?: boolean,

    flashlightButton?: boolean,

    chlidren?: JSX.Element | JSX.Element[]
}
interface State {
    innerButtonScale: Animated.Value,

    /* Border radius */
    innerButtonBradius: Animated.Value,
    outerButtonBradius: Animated.Value,

    buttonWidth: Animated.Value,
    opacity: Animated.Value,
    
    leftTileFlex: Animated.Value,

    buttonState: "default" | "confirm"
}

/* Main */
export default class Navbar extends React.PureComponent<Props, State> {
    buttonBackgroundX: any;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            innerButtonScale: new Animated.Value(1),

            innerButtonBradius: new Animated.Value(50),
            outerButtonBradius: new Animated.Value(70),

            buttonWidth: new Animated.Value(80),
            opacity: new Animated.Value(0),

            leftTileFlex: new Animated.Value(1),

            buttonState: "default"
        }

        /* Bindings */
        this.animatePicBtn = this.animatePicBtn.bind(this);
    }

    /* Animate pic button */
    animatePicBtn(to: "pressed" | "default"): void {
        Haptic("selection");

        if (to === "pressed") {
            animate(this.state.innerButtonScale, 0.9, 60, false);
        }else {
            animate(this.state.innerButtonScale, 1, 30, false);
        }
    }

    /*
        Picture button transitions.
        "default" - The default state of the
        picture button, when pressed will snap
        a picture.

        "confirm" - The state of the picture
        button when the picture has been snapped
        and the user has to confirm wether the
        picture should be saved or not.
    */
    transitionPicButton(into: "default" | "confirm"): void {
        this.setState({ buttonState: into });

        if (into === "confirm") {
            animate(this.state.outerButtonBradius, 20, 200, false);
            animate(this.state.innerButtonBradius, 10, 200, false);
            animate(this.state.buttonWidth, 125, 200, false);
            animate(this.state.opacity, 1, 200, false);
            animate(this.state.leftTileFlex, 0, 200, false);
        }else {
            animate(this.state.innerButtonBradius, 50, 200, false);
            animate(this.state.outerButtonBradius, 70, 200, false);
            animate(this.state.buttonWidth, 80, 200, false);
            animate(this.state.opacity, 0, 200, false);
            animate(this.state.leftTileFlex, 1, 200, false);
        };
    }

    /* Render */
	render() {
		return (
            <View style={Styles.navbarWrapper}>
                <BlurView intensity={50} tint="dark" style={Styles.navbar}>

                    {this.props.chlidren === undefined ? <React.Fragment>
                        {/* Flashlight View */}
                        <Animated.View style={{
                            ...Styles.navbarTile,
                            flex: this.state.leftTileFlex,
                            
                            /* Fade out */
                            opacity: this.state.opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0]
                            })
                        }}>
                            {this.props.flashlightButton === true || this.props.flashlightButton === undefined ? 
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={Styles.flashlightView}
                                    onPress={this.props.toggleFlashlight}
                                >
                                    {this.props.flashlightOn
                                    ? <Icon
                                        size={"100%"}
                                        source={require("../../assets/icons/light/flashlight-filled.png")}
                                    />
                                    : <Icon
                                        size={"100%"}
                                        source={require("../../assets/icons/light/flashlight.png")}
                                    />}
                                </TouchableOpacity>
                            : null}
                        </Animated.View>


                        {/* Camera snap button view */}
                        <View style={Styles.navbarTileMiddle}>

                            {/* Picture button */}
                            <TouchableHighlight
                                style={Styles.touchableHighlight}
                                onPressIn={() => this.animatePicBtn("pressed")}
                                onPressOut={() => this.animatePicBtn("default")}
                                onPress={
                                    this.state.buttonState === "default"
                                        ? this.props.takePic
                                        : this.props.usePic
                                }
                                underlayColor={"transparent"}
                            >

                                {/* Outer button (the ring around it) */}
                                <Animated.View
                                    style={{
                                        ...Styles.pictureButtonOuter,
                                        borderRadius: this.state.outerButtonBradius,
                                        width: this.state.buttonWidth,
                                    }}
                                >

                                    {/* Inner animated button */}
                                    <Animated.View style={{
                                        ...Styles.pictureButtonInner,
                                        borderRadius: this.state.innerButtonBradius,
                                        transform: [{ scale: this.state.innerButtonScale }]
                                    }}>

                                        {/* Loading or text */}
                                        {
                                            this.props.loading
                                            ? <ActivityIndicator />
                                            : <Animated.Text style={{
                                                ...Styles.buttonText,
                                                opacity: this.state.opacity
                                            }}>USE</Animated.Text>
                                        }
                                    </Animated.View>
                                </Animated.View>
                            </TouchableHighlight>
                        </View>

                        {/* Delete button view */}
                        <Animated.View style={{
                            ...Styles.navbarTile,
                            alignItems: "flex-end",
                            opacity: this.state.opacity
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ marginRight: 30 }}
                                onPress={this.props.scrapPic}    
                            >
                                <Icon source={require("../../assets/icons/light/trash.png")} size={38} />
                            </TouchableOpacity>
                        </Animated.View>
                    </React.Fragment> : this.props.chlidren}
                </BlurView>
            </View>
		);
	}
}

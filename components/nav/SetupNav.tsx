
/* Imports */
import { TouchableHighlight, TouchableOpacity, View, Text, Animated, Easing, ActivityIndicator } from "react-native";
import Styles from "./Styles";
import React, { ReactElement, RefObject } from "react";
import { Haptic } from "../../funcitonal/Haptics";
import { BlurView } from "expo-blur";
import Icon from "../icon/Icon";
import { animate } from "../../funcitonal/Animate";
import { Line, Svg } from "react-native-svg";

/* Types */
type ActiveButton = "edit" | "calibrate" | "save";

/* Interfaces */
interface Props {
    relative?: boolean,

    /* Change the scene */
    changeActive: (to: ActiveButton) => void
}
interface State {
    /* We cant do calc(100% - BALL_SIZE) like in css, so we use this */
    lineWidth: string | number,

    /* What nav button state we're in */
    active: ActiveButton
}

/* Constants */
const BALL_SIZE = 35;

/* Main */
export default class SetupNav extends React.PureComponent<Props, State> {
    line: RefObject<Svg>;

    /* Navbuttons */
    b1: RefObject<NavBtn>;
    b2: RefObject<NavBtn>;
    b3: RefObject<NavBtn>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            lineWidth: "100%",
            active: "edit"
        }

        /* Bindings */
        this.onClick = this.onClick.bind(this);

        /* Refs */
        this.line = React.createRef();

        this.b1 = React.createRef();
        this.b2 = React.createRef();
        this.b3 = React.createRef();
    }

    /* On navbar button press (changes scene) */
    onClick(to: ActiveButton) {
        this.setState({ active: to });
        this.props.changeActive(to);

        if (to === "calibrate") {
            this.b1.current?.animate("inactive");
            this.b2.current?.animate("active");
            this.b3.current?.animate("inactive");
        }else if (to === "edit") {
            this.b1.current?.animate("active");
            this.b2.current?.animate("inactive");
            this.b3.current?.animate("inactive");
        }else {
            this.b1.current?.animate("inactive");
            this.b2.current?.animate("inactive");
            this.b3.current?.animate("active");
        }
    }

    /* Render */
	render() {
		return (
            <View style={[Styles.setupNav, this.props.relative && { position: "relative" }]}>
                <BlurView intensity={20} tint="default" style={Styles.setupNavInner}>
                    <View style={Styles.anchorContainer}>
                        <NavBtn ref={this.b1} name="edit" onClick={this.onClick} active={this.state.active} title="Start" />
                        <NavBtn ref={this.b2} name="calibrate" onClick={this.onClick} active={this.state.active} title="Calibrate" />
                        <NavBtn ref={this.b3} name="save" onClick={this.onClick} active={this.state.active} title="Save" />
                    </View>
                </BlurView>
            </View>
		);
	}
}

/* Nav button interfaces */
interface NBProps {
    title: string,
    active: ActiveButton,
    name: ActiveButton,
    onClick: (active: ActiveButton) => void
}
interface NBState {
    bgScale: Animated.Value
}

/* The nav button at the top */
class NavBtn extends React.PureComponent<NBProps, NBState> {
    constructor(props: NBProps) {
        super(props);

        this.state = {
            bgScale: new Animated.Value(this.props.active === this.props.name ? 1 : 0)
        };
    }

    /* Animate the background view */
    animate(to: "active" | "inactive") {
        if (to === "active") {
            Animated.timing(this.state.bgScale, {
                duration: 120,
                toValue: 1,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            }).start();
        }else {
            Animated.timing(this.state.bgScale, {
                duration: 60,
                toValue: 0,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            }).start();
        }
    }

    /* Render */
    render(): React.ReactNode {
        return (
            <TouchableOpacity
                style={Styles.navButtonWrapper}
                onPress={() => {
                    Haptic("light");
                    this.props.onClick(this.props.name)
                }}
            >
                <Animated.View style={[Styles.navButtonBackground, { transform: [{ scale: this.state.bgScale }] }]} />
                <Text style={this.props.active === this.props.name ? Styles.topNavButtonTextActive : Styles.topNavButtonText}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

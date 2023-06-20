/* Imports */
import React from "react";
import Styles from "./Styles";
import { Animated, Easing, TouchableOpacity, View } from "react-native";
import Icon from "../icon/Icon";

/* Interfaces */
export interface FaceIndicatorItem {
    active: boolean,
    left: number,
    top: number,
    width: number,
    height: number,
    id: number,

    onClick: (activeFace: number) => void
}
interface State {
    position: Animated.ValueXY,
    scale: Animated.ValueXY,
    vertical: Animated.Value
}

/* Main */
export default class FaceIndicator extends React.PureComponent<FaceIndicatorItem, State> {
	
	/* Construct */
	constructor(props: FaceIndicatorItem) {
		super(props);

		/* State */
		this.state = {
            position: new Animated.ValueXY({ x: this.props.left, y: this.props.top }),
            scale: new Animated.ValueXY({ x: this.props.width, y: this.props.height }),
            vertical: new Animated.Value(0),
        };
	}

	/* Lifecycle */
	componentDidMount(): void {
        // Animated.loop(
        //     Animated.sequence([
        //         Animated.timing(this.state.vertical, {
        //             toValue: -10, 
        //             duration: 500, 
        //             easing: Easing.inOut(Easing.ease),
        //             useNativeDriver: false,
        //         }),
        //         Animated.timing(this.state.vertical, {
        //             toValue: 0,
        //             duration: 500,
        //             easing: Easing.inOut(Easing.ease),
        //             useNativeDriver: false,
        //         }),
        //     ]),
        // ).start();
    }
	componentWillUnmount(): void {}
    componentDidUpdate(prevProps: Readonly<FaceIndicatorItem>, prevState: Readonly<State>, snapshot?: any): void {
        const { left, top, width, height } = this.props;

        if (prevProps.left !== left || prevProps.top !== top) {
            Animated.timing(this.state.position, {
                toValue: { x: left, y: top },
                duration: 100, 
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
            Animated.timing(this.state.scale, {
                toValue: { x: width, y: height },
                duration: 100, 
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }
    }

	/* Render */
	render() {
        const { position, vertical, scale } = this.state;
		return (
            <Animated.View
                style={[
                    Styles.indicatorContainer,
                    this.props.active ? Styles.active : {},
                    {
                        left: position.x,
                        top: position.y,
                        width: scale.x,
                        height: scale.y,
                        // transform: [{ translateY: this.state.vertical }]
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={() => this.props.onClick(this.props.id)}
                    style={Styles.touchable}
                >
                    {this.props.active === true
                        ? <Icon size={40} source={require("../../assets/icons/light/face-indicator-fill.png")} />
                        : <Icon size={40} source={require("../../assets/icons/light/face-indicator.png")} />}
                </TouchableOpacity>
            </Animated.View>
		);
	};
}

export function toFaceIndicator(input: any): FaceIndicatorItem {
    const width = Math.max(input.rightEyePosition.x - input.leftEyePosition.x, input.rightMouthPosition.x - input.leftMouthPosition.x) * 2;
    return {
        left: (input.leftEyePosition.x + input.rightEyePosition.x) / 2 - width / 2,
        top: input.bounds.origin.y - 25,
        width,
        height: Math.max(input.rightMouthPosition.y - input.rightEyePosition.y, input.leftMouthPosition.y - input.leftEyePosition.y) * 3,
        
        /* These will be manually set */
        active: false,
        onClick: () => {},
        id: 0
    }
}

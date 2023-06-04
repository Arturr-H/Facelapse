import React from "react";
import { View, Animated, Easing, PanResponder, Keyboard, Text, Dimensions, PanResponderInstance } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const MODAL_START_Y = -100;
const MODAL_DURATION = 500;
const MODAL_FAST_DURATION = 100;
const VELOCITY_MIN = 1.9;
const center = { x: 0, y: 0 };

let concurrent_modals = 0;

interface State {
    drag: Animated.ValueXY,
    modalRotation: Animated.Value,
    modalInteractable: boolean,

    vxmap: number[],
    vymap: number[],
    anglemap: number[],
}
interface Props {
    children: string | JSX.Element | JSX.Element[] | null,
    disable: () => void
}

export default class Modal extends React.PureComponent<Props, State> {
    modalY: Animated.Value;
    modalO: Animated.Value;

    panResponder: PanResponderInstance;

    constructor(props: Props) {
        super(props);

        this.state = {
            drag: new Animated.ValueXY({ x: 0, y: 0 }),
            modalRotation: new Animated.Value(-1.6),
            modalInteractable: true,

            vxmap: Array(24).fill(0),
            vymap: Array(24).fill(0),
            anglemap: Array(12).fill(0),
        };

        /*- Modal intro start animation y-value -*/
        this.modalY = new Animated.Value(MODAL_START_Y);
        this.modalO = new Animated.Value(0);

        /*- Function bindings -*/
        this.animate = this.animate.bind(this);

        /*- Modal pan responder -*/
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // @ts-ignore (we ignore because __getValue is a private method)
                this.state.drag.setOffset(this.state.drag.__getValue());
                this.state.drag.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (_, gesture) => {
                const { dy, dx, vx, vy } = gesture;
                
                /*- Add the velocities to their responding maps -*/
                this.state.vxmap.push(vx);
                this.state.vymap.push(vy);

                /*- Remove the oldest velocity -*/
                this.state.vxmap.shift();
                this.state.vymap.shift();

                /*- The angle should point in the direction of the velocity -*/
                const average = {
                    vx: this.state.vxmap.reduce((a, b) => a + b, 0) / this.state.vxmap.length,
                    vy: this.state.vymap.reduce((a, b) => a + b, 0) / this.state.vymap.length,
                }

                /*- The angle should point in the direction of the velocity -*/
                const angle = (Math.atan2(average.vy, average.vx));

                /*- Set the rotation -*/
                this.state.modalRotation.setValue(angle);

                /*- Set the drag -*/
                this.state.drag.setValue({ x: dx, y: dy });

                /*- Move the modal -*/
                this.state.drag.setValue({ x: dx, y: dy });
            },
            onPanResponderEnd: (_, gesture) => {
                const { dx, dy, vx, vy } = gesture;

                /*- Animate a lauch animation in the velocioysty direction -*/
                this.state.drag.flattenOffset();
                this.state.modalRotation.flattenOffset();

                /*- If the velocity is high enough -*/
                if (Math.abs(vx) > VELOCITY_MIN || Math.abs(vy) > VELOCITY_MIN) {

                    let close_speed = 300;
                    if (concurrent_modals > 0) close_speed = MODAL_FAST_DURATION;

                    /*- Animate the modal moving to the direction -*/
                    this.animate(this.state.drag, { x: -dx*-4, y: -dy*-4 }, close_speed, () => {});
                    this.animate(this.modalO, 0, close_speed, () => {
                        this.props.disable();
                    });
                }else {

                    /*- If the user drags the modal mid-animation,
                        it looks kinda funky and we don't want that -*/
                    this.setState({ modalInteractable: false });

                    /*- Animate the modal back to the center -*/
                    this.animate(this.state.drag, center, 400, () => {
                        this.state.drag.setValue(center);
                        this.setState({ modalInteractable: true });
                    });

                    this.animate(this.state.modalRotation, -1.6, 400, () => {});
                }
            },
            onPanResponderRelease: () => {
                this.state.drag.flattenOffset();
            },
        });
    };

    /*- Simple animate function to avoid repetitive code -*/
    animate(value: any, toValue: any, duration = MODAL_DURATION, callback?: () => void) {
        Animated.timing(value, {
            toValue,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.165, 0.84, 0.44, 1.0)
        }).start();

        setTimeout(() => {
            if (callback) callback();
        }, duration);
    };

    /*- Enable / disable functions -*/
    enable() {
        this.animate(this.modalY, -height * 0.3);
        this.animate(this.modalO, 1);
    };

    /*- Before init -*/
    componentDidMount() {
        /*- Animate it -*/
        this.enable();
    };

    render() {
        const spin = this.state.modalRotation.interpolate({
            inputRange: [-1.6, 4.7],
            outputRange: ['0deg', '360deg']
        })

        return (
            <Animated.View pointerEvents={this.state.modalInteractable ? "auto" : "none"} style={{
                transform: [
                    { translateX: this.state.drag.x },
                    { translateY: this.state.drag.y },
                    { rotate: spin },
                    { scale: this.modalO }
                ],
                opacity: this.modalO,
                zIndex: 50,

                position: "absolute",
            }}
                {...this.panResponder.panHandlers}
            >
                {this.props.children}
            </Animated.View>
        );
    };
}
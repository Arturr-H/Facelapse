
/* Imports */
import { StatusBar } from "expo-status-bar";
import { View, Animated, Dimensions, Easing, GestureResponderEvent, PanResponder, PanResponderInstance, PanResponderGestureState } from "react-native";
import Styles from "./styling/Global";
import React from "react";
import Header from "./components/header/Header";
import Navbar from "./components/nav/Navbar";
import CameraScene from "./scenes/camera/Camera";
import StackScene from "./scenes/stack/Stack";
import { NavigationProp } from '@react-navigation/native';

/* Constants */
const SWIPE_VELOCITY = 2;

/* Body content */
export enum BodyView {
	Camera = 0, Stash = 1
}

/* Interfaces */
interface Props {
    navigation?: NavigationProp<any>;
}
interface State {
	body: BodyView,
	scenesPosX: Animated.Value,
	cameraActive: boolean,
}

/* Main app */
export default class Main extends React.PureComponent<Props, State> {
	panResponder: PanResponderInstance;
	pan: Animated.ValueXY;
	prevStartDown: number;
	currentDragX: number;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {

			/* These two values have to relate to eachother
                (BodyView.Camera = cameraActive: true, else false) */
			body: BodyView.Camera,
			cameraActive: true,

			scenesPosX: new Animated.Value(0),
		};

		/* Bindings */
		this.switch = this.switch.bind(this);

		this.prevStartDown = 0;
		this.currentDragX = 0;
		this.pan = new Animated.ValueXY();
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderMove: (e: GestureResponderEvent, gstate: PanResponderGestureState) => {
				this.currentDragX =  Math.max(
					Math.min(
						this.prevStartDown + gstate.dx,
						0 /* CMP */
					),
					-Dimensions.get("window").width /* CMP */
				)
			},
			onPanResponderRelease: (e: GestureResponderEvent, gstate: PanResponderGestureState) => {
				this.prevStartDown = this.prevStartDown + gstate.dx;
				this.pan.extractOffset();
			},
			onPanResponderEnd: (e: GestureResponderEvent, gstate: PanResponderGestureState) => {
				const delta = (this.prevStartDown + gstate.dx) - this.prevStartDown;
				this.prevStartDown = this.prevStartDown + gstate.dx;

				if (delta < -75) {
					/* RIGHT */
					this.switch(BodyView.Stash);
				}else if (delta > 75) {
					/* Left */
					this.switch(BodyView.Camera);
				}
			}
		});
	}

	/* Switch body view */
	switch(body: BodyView) {
		this.setState({ body })
		switch (body) {
			case BodyView.Camera:
				this.setState({ cameraActive: true });
				Animated.timing(this.state.scenesPosX, {
					duration: 200,
					easing: Easing.inOut(Easing.ease),
					toValue: 0,
					useNativeDriver: false
				}).start();

				break;

			case BodyView.Stash:
				Animated.timing(this.state.scenesPosX, {
					duration: 200,
					easing: Easing.inOut(Easing.ease),
					toValue: -Dimensions.get("window").width,
					useNativeDriver: false
				}).start();

				/* To prevent lag spike in animation */
				setTimeout(() => {
					this.setState({ cameraActive: false });
				}, 200);

				break;

			default:
				break;
		}
	}

	/* Render */
	render() {
		return (
			<View style={Styles.container}>
				{/* Static header */}
				<Header />

				{/* Body */}
				<View style={Styles.body}>
					{/* Camera */}
					<CameraScene
						cameraActive={this.state.cameraActive}
					/>
				</View>

				{/* Status bar (where time and battery is) */}
				<StatusBar style="auto" />
			</View>
		);
	}
}

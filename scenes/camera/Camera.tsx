
/* Imports */
import { View, Image, Animated, Dimensions, Easing, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import React, { RefObject } from "react";
import { CameraType, Camera, CameraCapturedPicture } from "expo-camera";
import Poster from "../../components/poster/Poster";
import HeightGrabber from "../../components/poster/Styles";
import { BlurView } from "expo-blur";
import Modal from "../../components/modal/Modal";
import { PrimaryButton } from "../../components/nav/Navbar";
import Icon from "../../components/icon/Icon";

/* Interfaces */
interface State {
	cameraPermission: boolean,
	photo: CameraCapturedPicture | null,
	takingPicture: boolean,

	cameraState: "delete" | "active"
}
interface Props {
	cameraActive: boolean,
}

/* Main */
export default class CameraScene extends React.Component<Props, State> {
	camera: RefObject<Camera>;

	constructor(props: Props) {
		super(props);

		this.state = {
			cameraPermission: false,
			photo: null,
			takingPicture: false,

			cameraState: "active"
		};

		/* Refs */
		this.camera = React.createRef();

		/* Bindings */
		this.takePicture = this.takePicture.bind(this);
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		const { status } = await Camera.requestCameraPermissionsAsync();
		this.setState({ cameraPermission: status === "granted" });
	}

	/* Take picture */
	takePicture() {
		console.log("Taking pic");
		if (!this.state.takingPicture) {
			this.setState({ takingPicture: true });

			this.camera.current?.takePictureAsync().then(photo => {
				this.setState({ photo, takingPicture: false, cameraState: "delete" })
			})
		}
	}

	/* Render */
	render() {
		return (
			<View style={Styles.container}>

				{/* Modal */}
				{this.state.photo && <Modal disable={() => this.setState({ photo: null, cameraState: "active" })}>
					<SnappedPicture photo={this.state.photo} />
				</Modal>}

				{/* Background blur (animated) */}
				<BlurView intensity={this.state.photo !== null ? 80 : 0} tint="dark" style={Styles.backgroundBlur} />

				{/* Camera (only active when view visible) */}
				{
					this.props.cameraActive === true
					? <Camera ref={this.camera} style={Styles.camera} type={CameraType.front}>
						<Image style={Styles.face} source={require("../../assets/face.png")} />
					</Camera>
					: null
				}

				{/* Take pic button */}
				<PrimaryButton
					onScrap={() => this.setState({ photo: null, cameraState: "active" })}
					onTake={this.takePicture}
					active={this.state.cameraState}
				/>

				<TouchableHighlight style={Styles.flashButton}>
					<Icon size={32} source={require("../../assets/icons/light/camera.png")} />
				</TouchableHighlight>
			</View>
		);
	}
}

/* Snapped picture (when we take an image with
	our camera, we see a preview of the image) */
interface SnappedPictureProps { photo: CameraCapturedPicture | null }
interface SnappedPictureState { picturePosY: Animated.Value }

class SnappedPicture extends React.PureComponent<SnappedPictureProps, SnappedPictureState> {
	item: RefObject<View>;

	constructor(props: SnappedPictureProps) {
		super(props);

		/* State */
		this.state = {
			picturePosY: new Animated.Value(
				Dimensions.get("window").height // Screen height
			),
		};

		/* Refs */
		this.item = React.createRef();
	}

	/* Component lifetime */
	componentDidMount(): void {
		const animConfig = {
			duration: 1000,
			useNativeDriver: false,
		};
		
		const toValueY =
			Dimensions.get("window").height / 2 // Half of screen
			- HeightGrabber.poster.height / 2; // Half of poster

		Animated.timing(this.state.picturePosY, {
			toValue: toValueY,
			easing: Easing.out(Easing.exp),
			...animConfig
		}).start();
	}

	/* Render */
	render() {
		return (
			// <Animated.View
			// 	ref={this.item}
			// 	style={{
			// 		position: "absolute",
			// 		// width: 200,
			// 		// height: 200,
			// 		top:  this.state.picturePosY,
			// 		left: Dimensions.get("window").width / 2 // Half of screen
			// 			- HeightGrabber.poster.width / 2, // Half of poster,

			// 		zIndex: 12
			// 	}}
			// >
				<Poster
					date={Date.now()}
					randomX={false}
					source={{ uri: this.props.photo?.uri }}
				/>
			// </Animated.View>
		)
	}
}
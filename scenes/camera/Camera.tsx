
/* Imports */
import { View, Image, Animated, Dimensions, Easing } from "react-native";
import Styles from "./Styles";
import React, { RefObject } from "react";
import { CameraType, Camera, CameraCapturedPicture, FlashMode, FaceDetectionResult } from "expo-camera";
import Poster from "../../components/poster/Poster";
import { BlurView } from "expo-blur";
import Modal from "../../components/modal/Modal";
import Navbar from "../../components/nav/Navbar";
import { Haptic } from "../../funcitonal/Haptics";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";
import saveImage, { getImageB64 } from "../../funcitonal/OnionskinImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Line } from "react-native-svg";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const MOUTH_OVERLAY_WIDTH = 30;

/* Interfaces */
interface State {
	cameraPermission: boolean,
	photo: CameraCapturedPicture | null,

	/// Wether we're in the default state of the camera or if
	/// we're in the scene where you can choose to use the pic
	/// or not.
	takingPicture: boolean,

	cameraState: "delete" | "active",
	flashlightOn: boolean,

	bottomMouthPosition: { x: number, y: number },
	leftEyePosition: { x: number, y: number },
	rightEyePosition: { x: number, y: number },

	/// Current total metadata provided by the face-detector API.
	totalMetadata: string | null,

	/// The previous photo the user has taken will often
	/// contain face metadata such as what the coordinates
	/// of both eyes are and more. 
	prevFaceMetadata: any | null,
	mouthEyeDist: number,

	/// The amount of things like mouth pos, mouthEyeDist that
	/// are not where they should be. Closer to 0 = better.
	alignError: number,

	translateX: number,
	translateY: number,

	onionskinURI: string | null
}
interface Props {
	cameraActive: boolean,
}

/* Main */
export default class CameraScene extends React.Component<Props, State> {
	camera: RefObject<Camera>;
	nav: RefObject<Navbar>;
	snappedPic: RefObject<SnappedPicture>;

	hasSuccessVibrated: boolean;

	constructor(props: Props) {
		super(props);

		this.state = {
			cameraPermission: false,
			photo: null,
			takingPicture: false,

			cameraState: "active",
			flashlightOn: false,

			bottomMouthPosition: { x: 0, y: 0 },
			leftEyePosition: { x: 0, y: 0 },
			rightEyePosition: { x: 0, y: 0 },
			totalMetadata: null,
			prevFaceMetadata: null,
			mouthEyeDist: 1,
			alignError: 0,

			translateX: 0,
			translateY: 0,

			onionskinURI: null
		};

		/* Refs */
		this.camera = React.createRef();
		this.nav = React.createRef();
		this.snappedPic = React.createRef();

		/* Bindings */
		this.usePic = this.usePic.bind(this);
		this.takePicture = this.takePicture.bind(this);
		this.setOverlays = this.setOverlays.bind(this);
		this.clearPicture = this.clearPicture.bind(this);
		this.toggleFlashlight = this.toggleFlashlight.bind(this);
		this.handleFaceDetection = this.handleFaceDetection.bind(this);

		/* Vars */
		this.hasSuccessVibrated = false;
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		const { status } = await Camera.requestCameraPermissionsAsync();
		this.setState({ cameraPermission: status === "granted" });
		this.setOverlays();
	}

	/* Take picture */
	takePicture() {
		if (!this.state.takingPicture) {
			this.setState({ takingPicture: true });
			
			this.camera.current?.takePictureAsync().then(photo => {
				this.nav.current?.transitionPicButton("confirm");
				this.setState({ photo, cameraState: "delete" });
			})
		}
	}
	clearPicture() {
		this.nav.current?.transitionPicButton("default");

		this.setState({
			photo: null,
			cameraState: "active",
			takingPicture: false
		})
	}

	/* Use the picture */
	async usePic() {
		this.nav.current?.transitionPicButton("default");
		this.snappedPic.current?.animateToRight();

		await saveImage(this.state.photo!.uri, () => {
			this.setOverlays();
		});

		/* Save photo to users media lib */
		MediaLibrary.saveToLibraryAsync(this.state.photo!.uri);

		/* Save metadata about face POI:s */
		if (this.state.totalMetadata) {
			await AsyncStorage.setItem("@prev_face_metadata", this.state.totalMetadata)
		}else {
			console.warn("No face was in picture");
		}
	}
	async setOverlays() {
		const onionskinURI = await getImageB64();
		let prevFaceMetadata = await AsyncStorage.getItem("@prev_face_metadata");
		if (prevFaceMetadata) 
			prevFaceMetadata = JSON.parse(prevFaceMetadata);

		console.log(prevFaceMetadata);

		this.setState({ onionskinURI, prevFaceMetadata });
	}

	/* Flashlight */
	toggleFlashlight() {
		Haptic("medium");
		this.setState({ flashlightOn: !this.state.flashlightOn });
	}

	/* Face detection */
	handleFaceDetection(faces: FaceDetectionResult) {
		// TODO: fix multiple faces swapping
		const face = faces.faces[0];

		if (face && !this.state.takingPicture) {
			// @ts-ignore
			const { bottomMouthPosition, leftEyePosition, rightEyePosition } = face;
			const mouthEyeDist = (bottomMouthPosition.y - (rightEyePosition.y + leftEyePosition.y) / 2) / 100;

			const translateX = (((this.state.rightEyePosition.x + this.state.leftEyePosition.x) / 2) * -1 + Dimensions.get("window").width / 2);
			const translateY = (((this.state.rightEyePosition.y + this.state.leftEyePosition.y) / 2) * -1 + Dimensions.get("window").height / 2);

			const alignError = Math.abs(translateX) + Math.abs(translateY) + Math.abs(mouthEyeDist * 5);

			if (alignError < 20 && !this.hasSuccessVibrated) {
				Haptic("light");
				this.hasSuccessVibrated = true;
			}else if (alignError > 20) {
				this.hasSuccessVibrated = false;
			}

			this.setState({
				bottomMouthPosition, leftEyePosition, rightEyePosition, mouthEyeDist,
				translateX, translateY,
				alignError, // *5 to increase the error
				totalMetadata: JSON.stringify(face)
			})
		}
	}

	/* Render */
	render() {
		return (
			<View style={Styles.container}>

				{/* Alignings */}
				<View style={Styles.alignContainer}>
					<Image
						style={[Styles.alignImage, {
							transform: [
								{ translateX: this.state.translateX / 10 },
								{ translateY: this.state.translateY / 10 },
								{ scale: this.state.mouthEyeDist }
							],
							opacity: this.state.alignError < 300 ? (this.state.alignError / 500) + 0.1 : 0.7
						}]}
						source={require("../../assets/align/align-inner.png")}
					/>
					<Image
						style={[Styles.alignImage, {
							transform: [
								{ translateX: this.state.translateX / -50 },
								{ translateY: this.state.translateY / -50 },
							]
						}]}
						source={require("../../assets/align/align-outline.png")}
					/>
				</View>

				{this.state.prevFaceMetadata && 
					<>
						<Ball
							size={10}
							left={this.state.prevFaceMetadata.leftEyePosition.x}
							top={this.state.prevFaceMetadata.leftEyePosition.y}
							stroke="#f00"
						/>
						<Ball
							size={10}
							left={this.state.prevFaceMetadata.rightEyePosition.x}
							top={this.state.prevFaceMetadata.rightEyePosition.y}
							stroke="#f00"
						/>


						<Ball
							size={5}
							left={WIDTH/2 - MOUTH_OVERLAY_WIDTH}
							top={HEIGHT/2 + 100}
							stroke="#f0f"
						/>
						<Ball
							size={5}
							left={WIDTH/2 + MOUTH_OVERLAY_WIDTH}
							top={HEIGHT/2 + 100}
							stroke="#f0f"
						/>

						<Svg height="100%" width="100%" style={{ position: "absolute", zIndex: 14 }}>
							<Line
								x1={WIDTH/2 - MOUTH_OVERLAY_WIDTH}
								y1={HEIGHT/2 + 100}
								x2={WIDTH/2 + MOUTH_OVERLAY_WIDTH}
								y2={HEIGHT/2 + 100}
								stroke="#f0f"
								strokeWidth="2"
							/>
						</Svg>
					</>
				}

				{/* Modal */}
				{this.state.photo && <Modal disable={this.clearPicture}>
					<SnappedPicture ref={this.snappedPic} photo={this.state.photo} />
				</Modal>}

				{/* Background blur (animated) */}
				<BlurView intensity={this.state.photo !== null ? 80 : 0} tint="dark" style={Styles.backgroundBlur} />

				{/* Camera (only active when view visible) */}
				{
					this.props.cameraActive === true
					? <Camera
						ref={this.camera}
						style={[Styles.camera, {
							// transform: [
							// 	{ translateX: ((this.state.rightEyePosition.x + this.state.leftEyePosition.x) / 2) * -1 + Dimensions.get("window").width / 2 },
							// 	{ translateY: ((this.state.rightEyePosition.y + this.state.leftEyePosition.y) / 2) * -1 + Dimensions.get("window").height / 2 },
							// ]
						}]}
						type={CameraType.front}
						flashMode={this.state.flashlightOn ? FlashMode.on : FlashMode.off}
						onFacesDetected={this.handleFaceDetection}
						
						faceDetectorSettings={{
							mode: FaceDetector.FaceDetectorMode.fast,
							detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
							runClassifications: FaceDetector.FaceDetectorClassifications.none,
							minDetectionInterval: 5,
							tracking: true,
						}}
					>
					
					</Camera>
					: null
				}

				{this.state.onionskinURI && <Image style={Styles.onionskinImage} source={{ uri: this.state.onionskinURI }} />}

				{/* Navbar */}
				<Navbar
					loading={this.state.takingPicture && this.state.photo === null}
					ref={this.nav}
					takePic={this.takePicture}
					usePic={this.usePic}
					scrapPic={this.clearPicture}
					flashlightOn={this.state.flashlightOn}
					toggleFlashlight={this.toggleFlashlight}
				/>
			</View>
		);
	}
}

/* Snapped picture (when we take an image with
	our camera, we see a preview of the image) */
interface SnappedPictureProps { photo: CameraCapturedPicture | null }
interface SnappedPictureState { picturePos: Animated.ValueXY, pictureRotation: Animated.Value }

class SnappedPicture extends React.PureComponent<SnappedPictureProps, SnappedPictureState> {
	item: RefObject<View>;

	constructor(props: SnappedPictureProps) {
		super(props);

		/* State */
		this.state = {
			picturePos: new Animated.ValueXY({ x: 0, y: -100 }),
			pictureRotation: new Animated.Value(0),
		};

		/* Refs */
		this.item = React.createRef();

		/* Bindings */
		this.animateToRight = this.animateToRight.bind(this);
	}

	/* Component lifetime */
	componentDidMount(): void {}

	/*
		When the user clicks "use", this
		poster will glide to the right
		(later being saved).
	*/
	animateToRight() {
		Animated.timing(this.state.picturePos, {
			duration: 1000,
			toValue: { x: Dimensions.get("window").width*2, y: -400 },
			useNativeDriver: true,
			easing: Easing.inOut(Easing.exp)
		}).start();
		Animated.timing(this.state.pictureRotation, {
			duration: 1000,
			toValue: 90,
			useNativeDriver: true,
			easing: Easing.inOut(Easing.exp)
		}).start();

		setTimeout(() => {
			Haptic("medium");
		}, 500);
	}

	/* Render */
	render() {
		const rotate = this.state.pictureRotation.interpolate({
			inputRange: [0, 360],
			outputRange: ["0deg", "360deg"]
		})

		return (
			<Animated.View
				ref={this.item}

				style={{
					height: 500,
					display: "flex",
					justifyContent: "flex-end",
					transform: [
						{ translateX: this.state.picturePos.x },
						{ translateY: this.state.picturePos.y },
						{ rotate: rotate }
					]
				}}
			>
				<Poster
					size="normal"
					date={Date.now()}
					randomX={false}
					source={{ uri: this.props.photo?.uri }}
				/>
			</Animated.View>
		)
	}
}


const Ball = ({ size, left, top, stroke }: { size: number, left: number, top: number, stroke: string }) => {
	return <View
		style={{
			width: size,
			height: size,
			transform: [{ translateX: -size/2 }, { translateY: -size/2 }],
			borderRadius: size/2,
			backgroundColor: stroke,
			position: "absolute",
			zIndex: 112,

			left,
			top
		}}
	/>
}
// Object {
// 	"faces": Array [
// 	  Object {
// 		"bottomMouthPosition": Object {
// 		  "x": 38.21041163802147,
// 		  "y": 479.16458573937416,
// 		},
// 		"bounds": Object {
// 		  "origin": Object {
// 			"x": -89.08750921487808,
// 			"y": 282.5083292722702,
// 		  },
// 		  "size": Object {
// 			"height": 257.1333417892456,
// 			"width": 257.1333417892456,
// 		  },
// 		},
// 		"faceID": 6,
// 		"leftCheekPosition": Object {
// 		  "x": -12.116673350334167,
// 		  "y": 438.98750108480453,
// 		},
// 		"leftEarPosition": Object {
// 		  "x": 3.5312438309192657,
// 		  "y": 406.4229166805744,
// 		},
// 		"leftEyePosition": Object {
// 		  "x": 4.3770771920681,
// 		  "y": 378.08749908208847,
// 		},
// 		"leftMouthPosition": Object {
// 		  "x": -2.389589697122574,
// 		  "y": 471.55208548903465,
// 		},
// 		"noseBasePosition": Object {
// 		  "x": 26.36874458193779,
// 		  "y": 409.38333344459534,
// 		},
// 		"rightCheekPosition": Object {
// 		  "x": 107.56874725222588,
// 		  "y": 433.4895842373371,
// 		},
// 		"rightEarPosition": Object {
// 		  "x": 166.77708253264427,
// 		  "y": 403.0395832359791,
// 		},
// 		"rightEyePosition": Object {
// 		  "x": 88.5374966263771,
// 		  "y": 374.70416563749313,
// 		},
// 		"rightMouthPosition": Object {
// 		  "x": 86.42291322350502,
// 		  "y": 465.6312519609928,
// 		},
// 		"rollAngle": 1.6829290390014648,
// 		"yawAngle": -23.166505813598633,
// 	  },
// 	],
// 	"target": 1237,
// 	"type": "face",
//   }
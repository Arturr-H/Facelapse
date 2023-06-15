
/* Imports */
import { View, Image, Animated, Dimensions, Easing, Text, TransformsStyle } from "react-native";
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
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import Globals, { dbg } from "../../funcitonal/Globals";
import { antiZero, hypotenuse, percentage } from "../../funcitonal/Utils";
import { withAnchorPoint } from 'react-native-anchor-point';
import FaceIndicator, { FaceIndicatorItem, toFaceIndicator } from "../../components/face-indicator/FaceIndicator";

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

	/// These 4 following structs indicate the current position
	/// which is being reacognized by the Face-detector API.
	leftEyePosition: { x: number, y: number },
	rightEyePosition: { x: number, y: number },

	rightMouthPosition: { x: number, y: number },
	leftMouthPosition: { x: number, y: number },

	/// Total metadata provided by the face calibration
	totalMetadata: any | null,

	/// The previous photo the user has taken will often
	/// contain face metadata such as what the coordinates
	/// of both eyes are and more. 
	mouthEyeDist: number,

	/// The amount of things like mouth pos, mouthEyeDist that
	/// are not where they should be. Closer to 0 = better.
	alignError: number,

	/// Only for the aligning face.
	translateX: number,
	translateY: number,

	/// The aligning face will fade out / in with this animated value
	alignFaceOpacity: Animated.Value,

	/// The 4 transparent balls which indicate the calibrated mouth
	/// features such as mouth left, right and eye left and right
	/// should be switched to a more vibrant color indicating that
	/// the user has aligned that feature pretty well.
	calibrationDots: {
		leftEye: boolean,
		rightEye: boolean,
		leftMouth: boolean,
		rightMouth: boolean,
	},

	/// There may be more than one face on the screen, if there are
	/// "face-indicators" will pop up and allow for selecting other
	/// faces to use
	faceIndicators: FaceIndicatorItem[],

	/// The index of which face is selected
	activeFace: number,

	/// TODO; Might remove because onion skin looks funky?
	onionskinURI: string | null
}
interface Props { }

/* Main */
export default class CameraScene extends React.Component<Props, State> {
	camera: RefObject<Camera>;
	nav: RefObject<Navbar>;
	snappedPic: RefObject<SnappedPicture>;

	hasSuccessVibrated: boolean;

	/* These values control the end image manipulation to align images */
	translateX: number;
	translateY: number;
	rotation: any[];
	scale: number;

	constructor(props: Props) {
		super(props);

		this.state = {
			cameraPermission: false,
			photo: null,
			takingPicture: false,

			cameraState: "active",
			flashlightOn: false,

			leftEyePosition: { x: 0, y: 0 },
			rightEyePosition: { x: 0, y: 0 },
			leftMouthPosition: { x: 0, y: 0 },
			rightMouthPosition: { x: 0, y: 0 },

			totalMetadata: null,
			mouthEyeDist: 1,
			alignError: 0,

			calibrationDots: {
				leftEye: false,
				rightEye: false,
				leftMouth: false,
				rightMouth: false,
			},

			translateX: 0,
			translateY: 0,

			faceIndicators: [],
			activeFace: 0,

			alignFaceOpacity: new Animated.Value(1),

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
		this.alignFaceFade = this.alignFaceFade.bind(this);
		this.toggleActiveFace = this.toggleActiveFace.bind(this);
		this.toggleFlashlight = this.toggleFlashlight.bind(this);
		this.handleFaceDetection = this.handleFaceDetection.bind(this);
		this.updateCalibrationDots = this.updateCalibrationDots.bind(this);

		/* Vars */
		this.hasSuccessVibrated = false;
		this.translateX = 0;
		this.translateY = 0;
		this.rotation = [];
		this.scale = 0;
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
			cameraState: "active",
			takingPicture: false
		});
		
		/* Wait for modal picture to dissapear */
		setTimeout(() => {
			this.setState({ photo: null })
		}, 600);
	}

	/* Use the picture */
	async usePic() {
		this.nav.current?.transitionPicButton("default");
		this.snappedPic.current?.animateToRight();

		/* Flip image because for some reason expo
			camera decides to save it mirrored... */
		const flippedImage = await manipulateAsync(
			this.state.photo!.uri,
			[{ flip: FlipType.Horizontal }],
			{ compress: 0.1, format: SaveFormat.JPEG }
		);

		/* Set onion skin overlay image  */
		// TODO: maybe remove this
		await saveImage(flippedImage.uri, () => {
			this.setOverlays();
		});

		/* Save photo to users media lib */
		MediaLibrary.saveToLibraryAsync(flippedImage.uri);

		/* Upload to servers if user has upload key -- DEV ONLY */
		AsyncStorage.getItem("@dev_uid").then(async uid => {
			if (typeof uid === "string") {
				let body = new FormData();
				body.append("photo", {
					uri: flippedImage.uri,
					name: "image.jpg",
					type: "image/jpeg",
				} as any);

				dbg(Globals.backendUrl + "post_image");
				await fetch(Globals.backendUrl + "post_image", {
					method: "POST",
					headers: {
						uid,
						"leftMouthPosition": percentage("width", this.state.leftMouthPosition.x) + "," + percentage("height", this.state.leftMouthPosition.y),
						"rightMouthPosition": percentage("width",this.state.rightMouthPosition.x) + "," + percentage("height", this.state.rightMouthPosition.y),
						"leftEyePosition": percentage("width",this.state.leftEyePosition.x) + "," + percentage("height", this.state.leftEyePosition.y),
						"rightEyePosition": percentage("width",this.state.rightEyePosition.x) + "," + percentage("height", this.state.rightEyePosition.y),
					} as any,
					body,
				})
					.then(async e => alert(await e.text()))
					.catch((_) => {})
			}
		})

		/* Return to deafult state */
		this.clearPicture();
	}
	async setOverlays() {
		const onionskinURI = await getImageB64();
		let totalMetadata = await AsyncStorage.getItem("@calibrated_face_metadata");
		if (totalMetadata) 
			totalMetadata = JSON.parse(totalMetadata);

		this.setState({ onionskinURI, totalMetadata });
	}

	/* Update the calibration dots to indicate
		wether the user is aligned well or not  */
	updateCalibrationDots() {
		const mdata = this.state.totalMetadata;

		this.setState({
			calibrationDots: {
				leftEye: this.shouldActivate(this.state.leftEyePosition, mdata.leftEyePosition),
				rightEye: this.shouldActivate(this.state.rightEyePosition, mdata.rightEyePosition),
				rightMouth: this.shouldActivate(this.state.rightMouthPosition, mdata.rightMouthPosition),
				leftMouth: this.shouldActivate(this.state.leftMouthPosition, mdata.leftMouthPosition),
			}
		})
	}
	shouldActivate(n1: { x: number, y: number }, n2: { x: number, y: number }): boolean {
		const activationThreshhold: number = 5;
		const dx = Math.abs(n1.x - n2.x);
		const dy = Math.abs(n1.y - n2.y);

		return (dx + dy < activationThreshhold) ? true : false;
	}

	/* Flashlight */
	toggleFlashlight() {
		Haptic("medium");
		this.setState({ flashlightOn: !this.state.flashlightOn });
	}

	/* Face detection */
	/* UGLY CODE PLEASE DON'T OPEN! (for your own safety) */
	handleFaceDetection(faces: FaceDetectionResult) {
		const face = faces.faces[this.state.activeFace] as any;
		this.setState({ faceIndicators: faces.faces.map(e => toFaceIndicator(e)) })

		/* If there are no faces */
		if (faces.faces.length === 0) return this.alignFaceFade("out");

		/* Face found */
		if (
			face && !this.state.takingPicture
			&& this.state.totalMetadata
		) {
			this.alignFaceFade("in");

			// @ts-ignore
			const { rightMouthPosition, leftMouthPosition, leftEyePosition, rightEyePosition } = face;
			const [calibratedLeftMouthPosition, calibratedRightMouthPosition] =
				[this.state.totalMetadata.leftMouthPosition,
				this.state.totalMetadata.rightMouthPosition];
			const [calibratedLeftEyePosition, calibratedRightEyePosition] =
				[this.state.totalMetadata.leftEyePosition,
				this.state.totalMetadata.rightEyePosition];

			/*
				Average values,
				C = Calibrated,
				R = Recently captured,
				M = Mouth,
				E = Eyes,
				Y = y axis
			*/
			const C_M_Y = ((calibratedLeftMouthPosition.y + calibratedRightMouthPosition.y) / 2);
			const C_E_Y = ((calibratedLeftEyePosition.y + calibratedRightEyePosition.y) / 2);
			const C_M_X = ((calibratedLeftMouthPosition.x + calibratedRightMouthPosition.x) / 2);
			const C_E_X = ((calibratedLeftEyePosition.x + calibratedRightEyePosition.x) / 2);

			const R_M_Y = ((rightMouthPosition.y + leftMouthPosition.y) / 2);
			const R_E_Y = ((rightEyePosition.y + leftEyePosition.y) / 2)
			const R_M_X = ((rightMouthPosition.x + leftMouthPosition.x) / 2);
			const R_E_X = ((rightEyePosition.x + leftEyePosition.x) / 2)

			/*
				The distance between the current captured faces'
				mouth and eye positions compared to the calibrated
				mouth and eye positions features.
			*/
			const mouthEyeDist = (C_M_Y - C_E_Y) / (R_M_Y - R_E_Y);

			const translateX = (C_M_X - R_M_X) + (C_E_X - R_E_X);
			const translateY = (C_M_Y - R_M_Y) + (C_E_Y - R_E_Y);

			const alignError = Math.abs(translateX) + Math.abs(translateY) + Math.abs(mouthEyeDist * 5);

			if (alignError < 20 && !this.hasSuccessVibrated) {
				Haptic("light");
				this.hasSuccessVibrated = true;
			}else if (alignError > 20) {
				this.hasSuccessVibrated = false;
			}

			this.setState({
				leftEyePosition, rightEyePosition,
				rightMouthPosition, leftMouthPosition,
				mouthEyeDist,
				translateX, translateY,
				alignError, // *5 to increase the error
			}, () => {
				this.updateCalibrationDots();
			});
		}
	}

	/* The little face which gives you an idea of what 
		direction you should move your face to center
		it, will fade out when there are no faces on
		screen and fade in when there is */
	alignFaceFade(to: "out" | "in"): void {
		Animated.timing(this.state.alignFaceOpacity, {
			toValue: to === "out" ? 0 : 1,
			duration: 50,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: true
		}).start();
	}

	/* Change what face to have as active */
	toggleActiveFace(activeFace: number): void {
		this.setState({ activeFace });
	}

	/* Render */
	render() {
		let rotation: TransformsStyle;
		let translateX: number;
		let translateY: number;
		let scale: number;

		if (this.state.totalMetadata) {
			scale = (
				(
					hypotenuse(this.state.totalMetadata.rightEyePosition, this.state.totalMetadata.rightMouthPosition) /
					antiZero(hypotenuse(this.state.rightEyePosition, this.state.rightMouthPosition))
				) + (
					hypotenuse(this.state.totalMetadata.leftEyePosition, this.state.totalMetadata.leftMouthPosition) /
					antiZero(hypotenuse(this.state.leftEyePosition, this.state.leftMouthPosition))
				)
			) / 2;

			translateX = (
				(((this.state.totalMetadata.leftEyePosition.x + this.state.totalMetadata.rightEyePosition.x) / 2) // mid y ttm
				- ((this.state.leftEyePosition.x + this.state.rightEyePosition.x) / 2)  // mid y stt
				+
				((this.state.totalMetadata.leftMouthPosition.x + this.state.totalMetadata.rightMouthPosition.x) / 2) 
				- ((this.state.leftMouthPosition.x + this.state.rightMouthPosition.x) / 2))
				/ 2
			);
			translateY = (
				(((this.state.totalMetadata.leftEyePosition.y + this.state.totalMetadata.rightEyePosition.y) / 2) // mid y ttm
				- ((this.state.leftEyePosition.y + this.state.rightEyePosition.y) / 2)  // mid y stt
				+
				((this.state.totalMetadata.leftMouthPosition.y + this.state.totalMetadata.rightMouthPosition.y) / 2) 
				- ((this.state.leftMouthPosition.y + this.state.rightMouthPosition.y) / 2))
				/ 2
			);

			let rot = Math.atan2(this.state.totalMetadata.rightEyePosition.y - this.state.totalMetadata.leftEyePosition.y, this.state.totalMetadata.rightEyePosition.x - this.state.totalMetadata.leftEyePosition.x) -
				Math.atan2(this.state.rightEyePosition.y - this.state.leftEyePosition.y, this.state.rightEyePosition.x - this.state.leftEyePosition.x);

			let centerY = 
				(((this.state.leftEyePosition.y + this.state.rightEyePosition.y) / 2) +
				((this.state.leftMouthPosition.y + this.state.rightMouthPosition.y) / 2)) / 2;
			let centerX = 
				(((this.state.rightEyePosition.x + this.state.rightMouthPosition.x) / 2) +
				((this.state.leftEyePosition.x + this.state.leftMouthPosition.x) / 2)) / 2;
			rotation = withAnchorPoint(
				{ transform: [{ rotate: rot + "rad" }]},
				{ 
					x: (centerX) / Dimensions.get("window").width,
					y: (centerY) / Dimensions.get("window").height
				},
				{
					width: Dimensions.get("window").width,
					height: Dimensions.get("window").height
				}
			);

			this.translateX = translateX;
			this.translateY = translateY;
			this.rotation = rotation.transform!;
			this.scale = scale;
			// console.log(rotation.transform!);
		}
		return (
			<View style={Styles.container}>

				{/* Alignings */}
				{this.state.takingPicture === false && <Animated.View style={[Styles.alignContainer, { opacity: this.state.alignFaceOpacity }]}>
					<Image
						style={[Styles.alignImage, {
							transform: [
								{ translateX: this.state.translateX / 10 },
								{ translateY: this.state.translateY / 10 },
								{ scale: Math.min(this.state.mouthEyeDist, 1.4) },
							],
							opacity: this.state.alignError < 300 ? (this.state.alignError / 500) + 0.1 : 0.7
						}]}
						source={require("../../assets/align/align-inner.png")}
					/>
					<Image
						style={[Styles.alignImage, {
							transform: [
								{ translateX: this.state.translateX / -10 },
								{ translateY: this.state.translateY / -10 },
							],
						}]}
						source={require("../../assets/align/align-outline.png")}
					/>
				</Animated.View>}

				{(this.state.totalMetadata !== null && this.state.takingPicture === false) && 
					<>
						{/* Eyes */}
						<Ball size={10} left={this.state.totalMetadata.leftEyePosition.x} top={this.state.totalMetadata.leftEyePosition.y} stroke={this.state.calibrationDots.leftEye == true ? "#FBAF00d1" : "#FBAF0055"} />
						<Ball size={10} left={this.state.totalMetadata.rightEyePosition.x} top={this.state.totalMetadata.rightEyePosition.y} stroke={this.state.calibrationDots.rightEye == true ? "#FBAF00d1" : "#FBAF0055"} />

						{/* Mouth */}
						<Ball size={5} left={this.state.totalMetadata.leftMouthPosition.x} top={this.state.totalMetadata.leftMouthPosition.y} stroke={this.state.calibrationDots.leftMouth == true ? "#FBAF00d1" : "#FBAF0055"} />
						<Ball size={5} left={this.state.totalMetadata.rightMouthPosition.x} top={this.state.totalMetadata.rightMouthPosition.y} stroke={this.state.calibrationDots.rightMouth == true ? "#FBAF00d1" : "#FBAF0055"} />

						{/* Svg mouth lines */}
						<Svg height="100%" width="100%" style={{ position: "absolute", zIndex: 14 }}>
							<Line
								x1={this.state.totalMetadata.leftMouthPosition.x}
								y1={this.state.totalMetadata.leftMouthPosition.y}
								x2={this.state.totalMetadata.rightMouthPosition.x}
								y2={this.state.totalMetadata.rightMouthPosition.y}
								stroke={this.state.calibrationDots.leftMouth === true && this.state.calibrationDots.rightMouth === true ? "#FBAF00d1" : "#FBAF0055"}
								strokeWidth="5"
							/>
						</Svg>
					</>
				}

				{/* Modal */}
				{this.state.photo && <Modal disable={this.clearPicture}>
					<SnappedPicture ref={this.snappedPic} photo={this.state.photo} />
				</Modal>}

				{/* Face indicators */}
				{this.state.faceIndicators.map((props, index) => 
					<FaceIndicator
						{...props}
						active={index === this.state.activeFace}
						key={"findc-" + index}
						onClick={this.toggleActiveFace}
					/>
				)}

				{/* Background blur (animated) */}
				{/* <BlurView intensity={this.state.photo !== null ? 80 : 0} tint="dark" style={Styles.backgroundBlur} /> */}

				{/* Camera (only active when view visible) */}
				<Camera
					ref={this.camera}
					style={[Styles.camera, this.state.totalMetadata && {
						// transform: [
						// 	//@ts-ignore
						// 	{ scale },

						// 	//@ts-ignore
						// 	{ translateY },

						// 	//@ts-ignore
						// 	{ translateX },

						// 	//@ts-ignore
						// 	...rotation.transform
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
				/>
				
				{/* Onion skin image */}
				{this.state.onionskinURI && <Image style={Styles.onionskinImage} source={{ uri: this.state.onionskinURI }} />}

				{/* Navbar */}
				<Navbar
					loading={this.state.takingPicture && this.state.photo === null}
					ref={this.nav}
					takePic={this.takePicture}
					usePic={this.usePic}
					scrapPic={() => {
						this.snappedPic.current?.animateToLeft();
						this.clearPicture();
					}}
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

	/* Used when "scrapping" photo */
	animateToLeft() {
		Animated.timing(this.state.picturePos, {
			duration: 1000,
			toValue: { x: -Dimensions.get("window").width*2, y: -400 },
			useNativeDriver: true,
			easing: Easing.inOut(Easing.exp)
		}).start();
		Animated.timing(this.state.pictureRotation, {
			duration: 1000,
			toValue: -90,
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
			zIndex: 40,

			left,
			top
		}}
	/>
}

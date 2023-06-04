
/* Imports */
import { View, Dimensions } from "react-native";
import Styles from "../Styles";
import React from "react";
import { Camera, CameraType, FaceDetectionResult } from "expo-camera";
import { FaceDetectorClassifications, FaceDetectorLandmarks, FaceDetectorMode } from "expo-face-detector";
import { Line, Svg } from "react-native-svg";
import Navbar from "../../../components/nav/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

/* Interfaces */
interface State {
	faceMetadata: null | any
}
interface Props {}

/* Main */
export default class FaceCalibration extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			faceMetadata: null
		};

		/* Bindings */
		this.handleFaceDetection = this.handleFaceDetection.bind(this);
		this.useCalibration = this.useCalibration.bind(this);
	}

	/* Lifetime */
	componentDidMount() { }

	/* On face detect */
	handleFaceDetection(faces: FaceDetectionResult) {
		// TODO: fix multiple faces swapping
		const faceMetadata = faces.faces[0];
		
		if (faceMetadata) {
			this.setState({ faceMetadata })
		}
	}

	/* Use the defined metadata for face */
	async useCalibration() {
		if (this.state.faceMetadata !== null) {
			await AsyncStorage.setItem("@calibrated_face_metadata", JSON.stringify(this.state.faceMetadata));
		}else {
			alert("No face was found. Make sure to put your face in the middle of the screen");
		}
	}

	/* Render */
	render() {
		return (
            <View style={Styles.container}>

				{/* Camera */}
				<Camera
					style={Styles.camera}
					type={CameraType.front}

					onFacesDetected={this.handleFaceDetection}
					faceDetectorSettings={{
						mode: FaceDetectorMode.fast,
						detectLandmarks: FaceDetectorLandmarks.all,
						runClassifications: FaceDetectorClassifications.none,
						minDetectionInterval: 50,
						tracking: true,
					}}
				/>

				{/* Face feature */}
				{this.state.faceMetadata && <>
					<Ball size={10} left={this.state.faceMetadata.leftEyePosition.x} top={this.state.faceMetadata.leftEyePosition.y} stroke="#FBAF00" />
					<Ball size={10} left={this.state.faceMetadata.rightEyePosition.x} top={this.state.faceMetadata.rightEyePosition.y} stroke="#FBAF00" />

					<Ball size={5} left={this.state.faceMetadata.leftMouthPosition.x} top={this.state.faceMetadata.leftMouthPosition.y} stroke="#FBAF00" />
					<Ball size={5} left={this.state.faceMetadata.rightMouthPosition.x} top={this.state.faceMetadata.rightMouthPosition.y} stroke="#FBAF00" />

					<Svg height="100%" width="100%" style={{ position: "absolute", zIndex: 2 }}>
						<Line
							x1={this.state.faceMetadata.leftEyePosition.x} y1={this.state.faceMetadata.leftEyePosition.y}
							x2={this.state.faceMetadata.rightEyePosition.x} y2={this.state.faceMetadata.rightEyePosition.y}
							stroke="#FBAF00" strokeWidth="2"
						/>
						<Line
							x1={this.state.faceMetadata.leftMouthPosition.x} y1={this.state.faceMetadata.leftMouthPosition.y}
							x2={this.state.faceMetadata.rightMouthPosition.x} y2={this.state.faceMetadata.rightMouthPosition.y}
							stroke="#FBAF00" strokeWidth="2"
						/>
					</Svg>
				</>}

				{/* Alignment lines */}
				{/* Horizontal */}
				<Line x1={0} y1={HEIGHT/2 - 45} x2={WIDTH} y2={HEIGHT/2 - 45} stroke="#FBAF00" strokeWidth="2" opacity={0.35} />
				<Line x1={0} y1={HEIGHT/2 + 57.5} x2={WIDTH} y2={HEIGHT/2 + 57.5} stroke="#FBAF00" strokeWidth="2" opacity={0.35} />

				{/* Vertical */}
				<Line x1={WIDTH/2 - 45} y1={0} x2={WIDTH/2 - 45} y2={HEIGHT} stroke="#FBAF00" strokeWidth="2" opacity={0.35} />
				<Line x1={WIDTH/2 + 45} y1={0} x2={WIDTH/2 + 45} y2={HEIGHT} stroke="#FBAF00" strokeWidth="2" opacity={0.35} />

				{/* Bottom navbar for taking pics */}
				<Navbar
					takePic={this.useCalibration}
					usePic={() => {}}
					scrapPic={() => {}}
					toggleFlashlight={() => {}}
					flashlightOn={false}
					loading={false}
					flashlightButton={false}
				/>
            </View>
		);
	}
}

/* Ball (important comment) */
export const Ball = ({ size, left, top, stroke }: { size: number, left: number | string, top: number | string, stroke: string }) => {
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

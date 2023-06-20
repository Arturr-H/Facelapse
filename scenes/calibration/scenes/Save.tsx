/* Imports */
import React from "react";
import { Animated, Dimensions, Easing, Text, TouchableOpacity, View } from "react-native";
import Styles from "../Styles";
import { Header1 } from "../../../components/text/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ball } from "./FaceCalibration";
import { Line, Svg } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Globals, { dbg } from "../../../funcitonal/Globals";
import { percentage } from "../../../funcitonal/Utils";

/* Interfaces */
interface State {
	faceMetadata: any | null,
}
interface Props {
	navigation: StackNavigationProp<{ Home: undefined }, "Home">
}

/* Main */
class Save extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			faceMetadata: null,
		};

		/* Bindings */
		this.calculateMouthPrecision = this.calculateMouthPrecision.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	/* Lifetime */
	async componentDidMount() {
		const cf_metadata = await AsyncStorage.getItem("@calibrated_face_metadata");
		if (cf_metadata !== null) {
			this.setState({ faceMetadata: JSON.parse(cf_metadata) });
		}else {
			console.log("no");
		}
	}

	/* Get dimensions inside of faceMetadataContainer */
	getDim(num: number, dim: "width" | "height"): string {
		if (dim === "width") {
			return (num / Dimensions.get("window").width) * 100 + "%"
		}else {
			return (num / Dimensions.get("window").height) * 100 + "%"
		}
	}

	/* Calculate precisions */
	calculateMouthPrecision(): string | null {
		if (!this.state.faceMetadata) return null;

		return ((1 - (Math.abs(
			(this.state.faceMetadata.leftMouthPosition.x + this.state.faceMetadata.rightMouthPosition.x) / 2
			/ Dimensions.get("window").width
			- 0.5
		) * 2)) * 100).toFixed(1) + "%"
	}
	calculateEyePrecision(): string | null {
		if (!this.state.faceMetadata) return null;

		return ((1 - (Math.abs(
			(this.state.faceMetadata.leftEyePosition.x + this.state.faceMetadata.rightEyePosition.x) / 2
			/ Dimensions.get("window").width
			- 0.5
		) * 2)) * 100).toFixed(1) + "%"
	}

	/* Get background grid lines */
	getGridLines(dir: "horizontal" | "vertical"): JSX.Element[] {
		let end: JSX.Element[] = [];
		const X_STEP: number = 5;
		const Y_STEP: number = 5 * (16 / 9); // 16 / 9 is the aspect ratio so we get perfect squares

		if (dir === "horizontal") {
			for (let i = 1; i < X_STEP; i++) {
				const x = (i / X_STEP) * 100 + "%";
				
				end.push(<Line key={`x-line${i}`} x1={x} x2={x} y1={"0%"} y2={"100%"} stroke={"#ececec"} strokeWidth={2} />)
			}
		}else {
			for (let i = 1; i < Y_STEP; i++) {
				const y = (i / Y_STEP) * 100 + "%";
				
				end.push(<Line key={`y-line${i}`} y1={y} y2={y}  x1={"0%"} x2={"100%"} stroke={"#ececec"} strokeWidth={2} />)
			}
		}

		return end;
	}

	/* Confirm & save - then switch scene */
	confirm() {
		this.props.navigation.navigate("Home");
	}

	/* Render */
	render() {
		return (
			<>
				{/* Configuraion */}
				<View style={Styles.body}>
					<Header1>🙌 Confirm</Header1>

					<View style={Styles.faceMetadataWrapper}>
						<View style={Styles.faceMetadataContainer}>
							{this.state.faceMetadata && <>
								{/* Mouth */}
								<Ball size={5} left={this.getDim(this.state.faceMetadata.rightMouthPosition.x, "width")} top={this.getDim(this.state.faceMetadata.rightMouthPosition.y, "height")} stroke="#FBAF00" />
								<Ball size={5} left={this.getDim(this.state.faceMetadata.leftMouthPosition.x, "width")} top={this.getDim(this.state.faceMetadata.leftMouthPosition.y, "height")} stroke="#FBAF00" />

								{/* Eyes */}
								<Ball size={5} left={this.getDim(this.state.faceMetadata.leftEyePosition.x, "width")} top={this.getDim(this.state.faceMetadata.leftEyePosition.y, "height")} stroke="#FBAF00" />
								<Ball size={5} left={this.getDim(this.state.faceMetadata.rightEyePosition.x, "width")} top={this.getDim(this.state.faceMetadata.rightEyePosition.y, "height")} stroke="#FBAF00" />

								<Svg style={{ zIndex: 2 }}>
									{/* Eyes */}
									<Line
										x1={this.getDim(this.state.faceMetadata.leftEyePosition.x, "width")} y1={this.getDim(this.state.faceMetadata.leftEyePosition.y, "height")}
										x2={this.getDim(this.state.faceMetadata.rightEyePosition.x, "width")} y2={this.getDim(this.state.faceMetadata.rightEyePosition.y, "height")}
										stroke="#FBAF00" strokeWidth="2"
									/>

									{/* Mouth */}
									<Line
										x1={this.getDim(this.state.faceMetadata.leftMouthPosition.x, "width")} y1={this.getDim(this.state.faceMetadata.leftMouthPosition.y, "height")}
										x2={this.getDim(this.state.faceMetadata.rightMouthPosition.x, "width")} y2={this.getDim(this.state.faceMetadata.rightMouthPosition.y, "height")}
										stroke="#FBAF00" strokeWidth="2"
									/>
								</Svg>
							</>}

							{/* Background grid lines */}
							<Svg style={{ position: "absolute", zIndex: 0 }}>
								{this.getGridLines("vertical")}
								{this.getGridLines("horizontal")}
							</Svg>
						</View>

						<View style={Styles.faceMetadataInfoView}>
							{/* <Header1>Info</Header1> */}
							<Row first="Last modified" last={null} />
							<Row first="Mouth precision" last={this.calculateMouthPrecision()} />
							<Row first="Eye precision" last={this.calculateEyePrecision()} />
							<Row first="Pics per day" last={null} />
						</View>
					</View>

					{/* TEMPORARY UPLOAD BUTTON */}
					<TouchableOpacity activeOpacity={0.8} style={[Styles.confirmButton, {
						bottom: 100
					}]} onPress={async () => {
						const metadata = JSON.parse((await AsyncStorage.getItem("@calibrated_face_metadata"))!);
						dbg(Globals.backendUrl + "upload-face-calib");
						await fetch(Globals.backendUrl + "upload-face-calib", {
							method: "POST",
							headers: {
								uid: await AsyncStorage.getItem("@dev_uid"),
								"leftMouthPosition": percentage("width", metadata.leftMouthPosition.x) + "," + percentage("height", metadata.leftMouthPosition.y),
								"rightMouthPosition": percentage("width", metadata.rightMouthPosition.x) + "," + percentage("height", metadata.rightMouthPosition.y),
								"leftEyePosition": percentage("width", metadata.leftEyePosition.x) + "," + percentage("height", metadata.leftEyePosition.y),
								"rightEyePosition": percentage("width", metadata.rightEyePosition.x) + "," + percentage("height", metadata.rightEyePosition.y),
							} as any
						}).then(async e => alert(await e.text()));
					}}>
						<Text style={Styles.confirmButtonText}>Upload face calib</Text>
					</TouchableOpacity>

					{/* Confirm button */}
					<TouchableOpacity activeOpacity={0.8} style={Styles.confirmButton} onPress={this.confirm}>
						<Text style={Styles.confirmButtonText}>Confirm</Text>
					</TouchableOpacity>
				</View>
			</>
		);
	}
}

/* Create info row */
const Row = ({ first, last }: { first: string, last: string | null }) => {
	const random = Math.random() * 40 + 40
	const x_bob = React.useRef<Animated.Value>(new Animated.Value(random)).current;
	
	/* Start animation */
	React.useEffect(() => {
		Animated.timing(x_bob, {
			duration: 500 + Math.random() * 100,
			easing: Easing.elastic(1.5),
			toValue: 10,
			useNativeDriver: true,
		}).start();
	}, []);

	/* Render */
	return (
		<Animated.View
			style={[Styles.row, {
				transform: [{ translateX: x_bob }]
			}]}
		>
			<Text style={Styles.first}>{first}:</Text>

			<Text style={Styles.last}>{last || "⏤"}</Text>
		</Animated.View>
	)
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Save {...props} navigation={navigation} />;
}
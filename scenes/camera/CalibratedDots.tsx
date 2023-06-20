/* Imports */
import React from "react";
import { View } from "react-native";
import { Line, Svg } from "react-native-svg";

/* Interfaces */
interface Props {
    leftEyePosition: { x: number, y: number },
    rightEyePosition: { x: number, y: number },
    leftMouthPosition: { x: number, y: number },
    rightMouthPosition: { x: number, y: number },

    calibrationDots: {
        leftEye: boolean,
        rightEye: boolean,
        leftMouth: boolean,
        rightMouth: boolean,
    }
}
interface State {}

/* Main */
export default class CalibratedDots extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {};
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Render */
	render() {
		return (
            <>
                {/* Eyes */}
                <Ball size={10} left={this.props.leftEyePosition.x} top={this.props.leftEyePosition.y} stroke={this.props.calibrationDots.leftEye == true ? "#FBAF00d1" : "#FBAF0055"} />
                <Ball size={10} left={this.props.rightEyePosition.x} top={this.props.rightEyePosition.y} stroke={this.props.calibrationDots.rightEye == true ? "#FBAF00d1" : "#FBAF0055"} />

                {/* Mouth */}
                <Ball size={5} left={this.props.leftMouthPosition.x} top={this.props.leftMouthPosition.y} stroke={this.props.calibrationDots.leftMouth == true ? "#FBAF00d1" : "#FBAF0055"} />
                <Ball size={5} left={this.props.rightMouthPosition.x} top={this.props.rightMouthPosition.y} stroke={this.props.calibrationDots.rightMouth == true ? "#FBAF00d1" : "#FBAF0055"} />

                {/* Svg mouth lines */}
                <Svg height="100%" width="100%" style={{ position: "absolute", zIndex: 14 }}>
                    <Line
                        x1={this.props.leftMouthPosition.x}
                        y1={this.props.leftMouthPosition.y}
                        x2={this.props.rightMouthPosition.x}
                        y2={this.props.rightMouthPosition.y}
                        stroke={this.props.calibrationDots.leftMouth === true && this.props.calibrationDots.rightMouth === true ? "#FBAF00d1" : "#FBAF0055"}
                        strokeWidth="5"
                    />
                </Svg>
            </>
		);
	};
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

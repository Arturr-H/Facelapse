/* Imports */
import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class SplashScene extends React.PureComponent<Props, State> {
	
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
            <View style={Styles.container}>
                <Image style={Styles.logo} source={require("../../assets/facelapse-wide-deco.png")} />

                <ActivityIndicator style={Styles.activityIndicator} />
            </View>
		);
	};
}

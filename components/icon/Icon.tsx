
/* Imports */
import { Image, ImageSourcePropType, StyleProp } from "react-native";
import React from "react";

/* Interfaces */
interface Props {
    source: ImageSourcePropType,
    size: number | string,
    style?: {}
}

/* Main */
export default class Icon extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    /* Render */
	render() {
		return (
            <Image
                source={this.props.source}
                style={{ width: this.props.size, height: this.props.size, ...this.props.style }}
            />
		);
	}
}

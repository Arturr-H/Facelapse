
/* Imports */
import { Dimensions, Image, ImageSourcePropType, Text, View } from "react-native";
import React from "react";
import Styles from "./Styles";
import getFormattedDate from "../../funcitonal/FormatDate";

/* Interfaces */
interface Props {
    source: ImageSourcePropType,
    date: number,

    size: "normal" | "small" | "big",
    removePin?: boolean
}

/* Main */
export default class Poster extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    /* Render */
	render() {
		return (
            <View
                style={{
                    ...Styles.poster,
                    ...(
                        this.props.size === "small" ? Styles.posterSmall :
                        this.props.size === "big" ? Styles.posterBig : {}
                    ),
                }}
            >
                {/* Pin (at the top of the poster) */}
                {this.props.removePin ?? <Image
                    source={require("../../assets/pin.png")}
                    style={
                        this.props.size === "small" ? Styles.pinSmall :
                        this.props.size === "big" ? Styles.pinBig : Styles.pin}
                />}

                {/* The actual image */}
                <Image style={Styles.image} source={this.props.source} />
                
                {/* Date? (yes / no) */}
                <Text style={[Styles.posterDate, this.props.size === "big" ? Styles.posterDateBig : {}]}>{getFormattedDate(this.props.date)}</Text>
            </View>
		);
	}
}

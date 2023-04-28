
/* Imports */
import { View, Image, ScrollView, FlatList } from "react-native";
import Styles from "./Styles";
import React from "react";
import Poster from "../../components/poster/Poster";
import { SharedElement, SharedElementNode, nodeFromRef } from "react-native-shared-element";

/* Interfaces */
interface State {}
interface Props {}

/* Main */
export default class StackScene extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {};
	}

	/* Lifetime */
	componentDidMount() { }

	/* Render */
	render() {
		return (
            <View style={Styles.container}>

                {/* Image list */}
                <FlatList
                    style={Styles.flatlist}
                    data={[0,0,1,0,0]}
                    renderItem={(item) => <Poster />}
                    keyExtractor={(item, i) => Math.random().toString()}
                />
            </View>
		);
	}
}


/* Imports */
import { View, Image, ScrollView, FlatList, Text, ListRenderItem } from "react-native";
import Styles from "./Styles";
import React from "react";
import Poster from "../../components/poster/Poster";
import { SharedElement, SharedElementNode, nodeFromRef } from "react-native-shared-element";
import Header from "../../components/header/Header";
import getFormattedDate from "../../funcitonal/FormatDate";

/* Interfaces */
interface State {}
interface Props {}
interface Item {
	date: number,
	images: string[]
}

/* Main */
export default class StackScene extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {};

		/* Bindings */
		this.renderItem = this.renderItem.bind(this);
	}

	/* Lifetime */
	componentDidMount() { }

	/* Render item for flatlist */
	renderItem: ListRenderItem<Item> = ({ item }) => {
		return (
			<View style={Styles.flatlistItem} key={"o-" + item.date}>
				<Text style={Styles.itemDate}>{getFormattedDate(item.date)}</Text>

				<View style={Styles.flatlistImages}>
					{item.images.map((e, index) =>
						<Poster
							size={"small"}
							key={index}
							date={1684712442141}
							randomX={false}
							source={{ uri: "https://media.istockphoto.com/id/166578820/vector/painted-poppies-on-summer-meadow.jpg?s=612x612&w=0&k=20&c=yqccCgouNLXVD7RducYtBGITcIOhaRfEwOiPlaHcTxM=" }}
						/>	
					)}
				</View>
			</View>
		)
	}

	/* Render */
	render() {
		return (
            <View style={Styles.container}>
				{/* Static header */}
				<Header />

                {/* Image list */}
                <FlatList
                    style={Styles.flatlist}
                    data={[
						{
							date: 1412347912512,
							images: ["", "", "", "", ""]
						},
						{
							date: 1355677912512,
							images: ["", ""]
						},
					]}
                    renderItem={this.renderItem}
                    keyExtractor={(item, i) => i.toString()}
                />
            </View>
		);
	}
}

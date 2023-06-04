
/* Imports */
import { View, Image, ScrollView, FlatList, Text, ListRenderItem, ImageSourcePropType, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Animated, Easing } from "react-native";
import Styles from "./Styles";
import React, { RefObject } from "react";
import Poster from "../../components/poster/Poster";
import { SharedElement, SharedElementNode, nodeFromRef } from "react-native-shared-element";
import Header from "../../components/header/Header";
import getFormattedDate from "../../funcitonal/FormatDate";
import Navbar from "../../components/nav/Navbar";

/* Interfaces */
interface State {
	imageIndex: number,
	posterRotate: Animated.Value,
}
interface Props {}
interface Item {
	date: number,
	src: ImageSourcePropType
}

/* Main */
export default class StackScene2 extends React.PureComponent<Props, State> {
	images: Item[];
	prevScrollX: number;

	constructor(props: Props) {
		super(props);

		this.state = {
			imageIndex: 0,
			posterRotate: new Animated.Value(0),
		};

		/* Bindings */
		this.renderItem = this.renderItem.bind(this);

		/* Previous flatlist x scroll position (for calculating Δ) */
		this.prevScrollX = 0;

		/* The images (placeholder rn) */
		this.images = [
			{ date: 0, src: { uri: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } },
			{ date: 1349125912572, src: { uri: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } },
			{ date: 1449125912572, src: { uri: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } },
			{ date: 1449125912572, src: { uri: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } },
		];
	}

	/* Lifetime */
	componentDidMount() { }

	/* Render item for flatlist */
	renderItem: ListRenderItem<Item> = ({ item }) => {
		return (
			<View style={Styles.imageContainer}>
				{/* Pin is outside of poster because it shouldn't rotate */}
				<Image
                    source={require("../../assets/pin.png")}
                    style={{
						zIndex: 10,
						width: 38,
						height: 38,
						position: "absolute",
						transform: [{ translateY: -176.5 }, { translateX: 5 }]
					}}
                />

				{/* The poster */}
				<Animated.View style={{
					height: 700,
					display: "flex",
					justifyContent: "flex-end",
					transform: [
						{ translateY: -350/2 },
						{ rotate: this.state.posterRotate.interpolate({
							inputRange: [-180, 180],
							outputRange: ["-180deg", "180deg"]
						})
					}],
				}}>

					<Poster removePin date={item.date} size="big" source={item.src} />
				</Animated.View>
			</View>
		)
	}

	/* Get what image we're at rn */
	handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { contentOffset, layoutMeasurement, velocity } = event.nativeEvent;
		const scrollPosition = contentOffset.x + layoutMeasurement.width / 2;
		const imageIndex = Math.floor(scrollPosition / layoutMeasurement.width);
		const scrollDeltaX = contentOffset.x - this.prevScrollX;
		
		this.prevScrollX = contentOffset.x;

		Animated.spring(this.state.posterRotate, {
			// duration: 100,
			toValue: scrollDeltaX / 20,
			speed: 40,
			// easing: Easing.linear,
			useNativeDriver: true,
		}).start();

		this.setState({ imageIndex });
	};

	/* Format the date */
	formatDate(number: number): string {
		const date = new Date(number);
		const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-US", options);
	}

	/* Render */
	render() {
		return (
            <View style={Styles.container}>
				{/* Static header */}
				<Header />

                {/* Image list */}
                <FlatList
					contentContainerStyle={Styles.flatlist}
					horizontal={true}
                    data={this.images}
                    renderItem={this.renderItem}
                    keyExtractor={(item, i) => i.toString()}
					snapToAlignment="start"
					decelerationRate={"fast"}
					onScroll={this.handleScroll}
					snapToInterval={Dimensions.get("window").width}
                />
            </View>
		);
	}
}

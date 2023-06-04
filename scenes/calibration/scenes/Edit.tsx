/* Imports */
import React from "react";
import { Keyboard, View } from "react-native";
import Styles from "../Styles";
import TextInput from "../../../components/input/TextInput";
import { Br, Header1, P } from "../../../components/text/Text";
import NumberInput from "../../../components/input/NumberInput";

/* Interfaces */
interface State {}
interface Props {}

/* Main */
export default class Edit extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
		};

		/* Bindings */
	}

	/* Lifetime */
	componentDidMount() { }

	/* Render */
	render() {
		return (
			<>
				{/* Configuraion */}
				<View style={Styles.body}>
					<Header1>⚙️ Preferences</Header1>

					<Br />

					{/* Name input */}
					<P>I don't really know why I have this</P>
					<TextInput
						returnKeyType="done"
						placeholder="What's your name?"
						autoCorrect={false}
						keyboardType="default"
						icon={require("../../../assets/icons/dark/tag.png")}
						onChangeText={() => {}}
						onSubmitEditing={Keyboard.dismiss}
					/>

					<Br />

					{/* How many times the user wishes to pic per day */}
					<P>How many times per day would you like to take pictures of yourself?</P>
					<NumberInput buttons={[1, 2, 3, "🤷‍♂️"]} defaultIndex={0} />
				</View>
			</>
		);
	}
}

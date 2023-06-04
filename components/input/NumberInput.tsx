/* Imports */
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Styles from "./Styles";
import { Haptic } from "../../funcitonal/Haptics";

/* Interfaces */
interface Props {
    buttons: (string | number)[],

    /* Index of the default item */
    defaultIndex?: number
}
interface State {
    active: number | undefined
}

export default class NumberInput extends React.PureComponent<Props, State> {
    maxValue: number;
    minValue: number;

	/* Construct the component */
	constructor(props: Props) {
		super(props);

        this.state = {
            active: this.props.defaultIndex ?? 0
        };

        /* Bindings */
        this.switch = this.switch.bind(this);

        /* Static */
        this.maxValue = 15;
        this.minValue = 0;
	}

    /* Increment of decrement count */
    switch(to: number) {
        Haptic("light");
        this.setState({ active: to });
    }

    /* Render */
	render() {
		return (
            <View style={Styles.numberInputContainer}>
                {this.props.buttons.map((e, index) => 
                    <TouchableOpacity
                        key={index}
                        onPress={() => this.switch(index)}
                        activeOpacity={0.7}
                        style={index == this.state.active ? Styles.inputButtonActive : Styles.inputButton}
                    >
                        <Text style={index == this.state.active ? Styles.inputButtonTextActive : Styles.inputButtonText}>{e}</Text>
                    </TouchableOpacity>
                )}
            </View>
		);
	}
}



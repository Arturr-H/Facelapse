/* Imports */
import React, { RefObject } from "react";
import {
    TextInput as TInput, KeyboardType, NativeSyntheticEvent,
    TextInputSubmitEditingEventData,
    View,
    Image,
    ImageSourcePropType,
    KeyboardTypeIOS
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Styles from "./Styles";

/* Interfaces */
interface Props {
    placeholder: string,
    autoCorrect: boolean,
    keyboardType: "email-address" | "default" | "numeric"
                    | "phone-pad" | "number-pad" | "decimal-pad"
                    | "visible-password" | "ascii-capable"
                    | "numbers-and-punctuation" | "url" |
                    "name-phone-pad" | "twitter" | "web-search",
    onSubmitEditing: ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void) | undefined
    onChangeText: ((text: string) => void) | undefined,
    value?: string,
    icon: ImageSourcePropType,
    secureTextEntry?: boolean,

    returnKeyType?: "done" | "go" | "next" | "search" | "send"
}
interface State {
    focus: boolean
}

export default class TextInput extends React.PureComponent<Props, State> {
    item: RefObject<TInput>;

	/* Construct the component */
	constructor(props: Props) {
		super(props);

        this.state = {
            focus: false
        };

        /* Refs */
        this.item = React.createRef();

        /* Bindings */
        this.focus = this.focus.bind(this);
	}

    /* Methods */
    focus() {
        this.item.current?.focus();
    }

    /* Render */
	render() {
		return (
            <View style={{
                ...Styles.textInputOuter,
                ...(this.state.focus ? {
                    borderColor: "#FBAF00",
                    borderWidth: 2
                } : {})
            }}>
                <TInput
                    style={Styles.textInputInner}
                    placeholder          = {this.props.placeholder}
                    autoCapitalize       = {"none"}
                    autoCorrect          = {this.props.autoCorrect}
                    spellCheck           = {false}
                    keyboardType         = {this.props.keyboardType}
                    returnKeyType        = {this.props.returnKeyType || "next"}
                    onSubmitEditing      = {this.props.onSubmitEditing}
                    onChangeText         = {this.props.onChangeText}
                    value                = {this.props.value}
                    onFocus              = {() => this.setState({ focus: true })}
                    onBlur               = {() => this.setState({ focus: false })}
                    blurOnSubmit		 = {false}
                    secureTextEntry      = {this.props.secureTextEntry}
                    passwordRules={"required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"}
                />

                <TouchableHighlight style={Styles.iconContainer}>
                    <Image source={this.props.icon} style={[Styles.textInputIcon, this.state.focus ? { opacity: 0.3 } : {}]} />
                </TouchableHighlight>
            </View>
		);
	}
}



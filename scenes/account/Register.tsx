/* Imports */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, KeyboardAvoidingView, Image, SafeAreaView, Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class Register extends React.PureComponent {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
			<SafeAreaView style={Styles.outer}>
				<KeyboardAvoidingView behavior="padding" style={Styles.container}>
                    <View style={Styles.header}>
                        <Image source={require("../../assets/facelapse-wide.png")} style={Styles.logo} />
                    </View>

                    <View style={Styles.body}>
                        <TouchableHighlight style={Styles.button} onPress={() => console.log("navigate signup")}>
                            <Text style={Styles.buttonText}>Sign Up</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={Styles.button} onPress={() => console.log("navigate Login")}>
                            <Text style={Styles.buttonText}>Login</Text>
                        </TouchableHighlight>
                    </View>
                    
                    <StatusBar style="auto" />
                </KeyboardAvoidingView>
            </SafeAreaView>
		);
	}
}

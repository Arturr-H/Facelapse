/* Imports */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, KeyboardAvoidingView, Image, SafeAreaView, Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<any, any>
}
interface State {}

/* Main */
class Register extends React.PureComponent<Props, State> {
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
                        <TouchableHighlight style={Styles.button} onPress={() => this.props.navigation.navigate("SignUp")}>
                            <Text style={Styles.buttonText}>Sign Up</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={Styles.button} onPress={() => this.props.navigation.navigate("Login")}>
                            <Text style={Styles.buttonText}>Login</Text>
                        </TouchableHighlight>
                    </View>
                    
                    <StatusBar style="auto" />
                </KeyboardAvoidingView>
            </SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Register {...props} navigation={navigation} />;
}

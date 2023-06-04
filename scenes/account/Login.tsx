/* Imports */
import React, { RefObject } from "react";
import { StatusBar } from "expo-status-bar";
import { View, KeyboardAvoidingView, Keyboard, Image, ActivityIndicator, Text, SafeAreaView } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import TextInput from "../../components/input/TextInput";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {
	email: string,
	password: string,
	loading: boolean,
}

export default class Login extends React.PureComponent<Props, State> {
	inputEmailRef: RefObject<TextInput>;
	inputPasswordRef: RefObject<TextInput>;

	/* Construct the component */
	constructor(props: Props) {
		super(props);

		/* States, just like useState() */
		this.state = {
			email: "",
			password: "",
			loading: false,
		};

		/* Refs for the inputs  useful for autoselecting the next one in queue */
		this.inputEmailRef = React.createRef();
		this.inputPasswordRef = React.createRef();

		/* Bind the functions */
		this.login = this.login.bind(this);
	}

	/* When the component is unmounted */
	componentWillUnmount() {
		/* Clear the inputs */
		this.setState({
			email: "",
			password: "",
		});
	}

	/* Login */
	login = async () => {

		/* Check if the email and password are valid */
		if (this.state.email.length == 0) {
			alert("Please enter your email.");
			return;
		}else if (this.state.password.length == 0) {
			alert("Please enter your password.");
			return;
		}

		/* Show that the request is being processed */
		this.setState({ loading: true });

		/* Send the request to the backend */
		let response = await fetch(URL + "login", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"ContentType": "application/json",
				email: this.state.email,
				password: this.state.password,
			},
		});

		/* Check if the request was successful */
		if (response.status == 200) {
			/* Get the response */
			let responseJson = await response.json();

			console.log(responseJson)
			/* The request can be 200 but the response code might be 400, becuase password / email was incorrect */
			if(responseJson.status == 200 ){

				/* Save all items */
				for (var key in responseJson.data) {
					console.log("saving this??");
					// await AsyncStorage.setItem(key, responseJson.data[key]);
				}

				/* Go to the home screen */
				console.log("nagivate home");
				// this.props.navigation.navigate("Home");
			}else{
				alert(responseJson.message);
			}

			/* Hide the loading indicator */
			this.setState({ loading: false });
		} else {
			/* Show the error */
			alert("Server error.");

			/* Hide the loading indicator */
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<SafeAreaView style={Styles.outer}>
				<KeyboardAvoidingView behavior="padding" style={Styles.container}>
					<View style={Styles.header}>
						<Image source={require("../../assets/facelapse-wide.png")} style={Styles.logo} />
					</View>

					{/* Dodge the builtin keyboard */}
					<View style={Styles.body}>

						{/* Email input */}
						<TextInput
							placeholder          = {"Email"}
							autoCorrect          = {false}
							keyboardType         = {"email-address"}
							onSubmitEditing      = {this.inputPasswordRef.current?.focus}
							onChangeText         = {(text) => this.setState({ email: text })}
							value                = {this.state.email}
							ref                  = {this.inputEmailRef}
							icon={require("../../assets/icons/dark/at-sign.png")}
						/>

						{/* Password input */}
						<TextInput
							placeholder          = {"Password"}
							autoCorrect          = {false}
							keyboardType         = {"default"}
							onChangeText         = {(text) => this.setState({ password: text })}
							value                = {this.state.password}
							ref                  = {this.inputPasswordRef}
							onSubmitEditing      = {Keyboard.dismiss}
							icon={require("../../assets/icons/dark/lock.png")}
							secureTextEntry      = {true}
						/>

						<TouchableHighlight style={Styles.button} onPress={this.login}>
							{
								this.state.loading
									? <ActivityIndicator />
									: <Text style={Styles.buttonText}>Login</Text>
							}
						</TouchableHighlight>
					</View>
					
					<StatusBar style="auto" />
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}



/* Imports */
import React, { RefObject } from "react";
import { StatusBar } from "expo-status-bar";
import { View, TextInput as TInput, KeyboardAvoidingView, Image, ActivityIndicator, TouchableHighlight, Text, SafeAreaView } from "react-native";
import TextInput from "../../components/input/TextInput";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {
    username: string,
    displayname: string,
    email: string,
    password: string,
    confirmPassword: string,

    loading: boolean,
}

/* Main */
export default class SignUp extends React.PureComponent<Props, State> {
    inputNameRef: RefObject<TextInput>;
    inputDisplaynameRef: RefObject<TextInput>;
    inputEmailRef: RefObject<TextInput>;
    inputPasswordRef: RefObject<TextInput>;
    inputConfirmPasswordRef: RefObject<TextInput>;

	/*- Construct the component -*/
	constructor(props: Props) {
		super(props);

		/*- States, just like useState() -*/
		this.state = {
			username: "",
			displayname: "",
			email: "",
			password: "",
			confirmPassword: "",

			loading: false,
		};

		/*- Refs for the inputs - useful for auto-selecting the next one in queue -*/
		this.inputNameRef = React.createRef();
		this.inputDisplaynameRef = React.createRef();
		this.inputEmailRef = React.createRef();
		this.inputPasswordRef = React.createRef();
		this.inputConfirmPasswordRef = React.createRef();


		/*- Bind the functions -*/
		this.signup = this.signup.bind(this);
	}

	/*- signup -*/
	signup = async () => {

		/*- Check if the inputs contain something -*/
		if (this.state.username.length == 0) { return alert("Please enter your username."); }
		if (this.state.displayname.length == 0) { return alert("Please enter your displayname."); }
		if (this.state.email.length == 0) { return alert("Please enter your email."); }
		if (this.state.password.length == 0) { return alert("Please enter your password."); }
		if (this.state.confirmPassword != this.state.password) { return alert("Your passwords do not match."); }

		/*- Show that the request is being processed -*/
		this.setState({ loading: true });

		/*- Send the request to the backend -*/
		let response = await fetch(URL + "create-account", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				username: this.state.username,
				displayname: this.state.displayname,
				email: this.state.email,
				password: this.state.password,
			},
		});


		/*- Check if the request was successful -*/
		if (response.status == 200) {
			/*- Get the response -*/
			let responseJson = await response.json();

			/*- Check if the request was successful -*/
			if (responseJson.success) {
				/*- Save all items -*/
				for (var key in responseJson.data) {
					console.log("saving?");
				}

				/*- Hide the loading indicator -*/
				this.setState({ loading: false });

				/*- Navigate to the home screen -*/
				console.log("navigate home!");
			}else{
				/*- Show the error message -*/
				alert(responseJson.message);

				/*- Hide the loading indicator -*/
				this.setState({ loading: false });
			}
		}
		
	}

	render() {
		return (
            <SafeAreaView style={Styles.outer}>
                <KeyboardAvoidingView behavior="padding" style={Styles.container}>
                    <View style={Styles.header}>
                        <Image source={require("../../assets/facelapse-wide.png")} style={Styles.logo} />
                    </View>

                    {/*- Dodge the built-in keyboard -*/}
                    <View style={Styles.body}>
                        {/*- Username input -*/}
                        <TextInput
                            placeholder          = {"@username..."}
                            autoCorrect          = {false}
                            keyboardType         = {"default"}
                            onSubmitEditing      = {this.inputDisplaynameRef.current?.focus}
                            onChangeText         = {(text) => this.setState({ username: text })}
                            value                = {this.state.username}
                            ref                  = {this.inputNameRef}
                            icon                 = {require("../../assets/icons/dark/at-sign.png")}
                        />

                        {/*- Displayname input -*/}
                        <TextInput
                            placeholder          = {"Displayname..."}
                            autoCorrect          = {false}
                            keyboardType         = {"default"}
                            onSubmitEditing      = {this.inputEmailRef.current?.focus}
                            onChangeText         = {(text) => this.setState({ displayname: text })}
                            value                = {this.state.displayname}
                            ref                  = {this.inputDisplaynameRef}
                            icon                 = {require("../../assets/icons/dark/tag.png")}
                        />
                        
                        {/*- Email input -*/}
                        <TextInput
                            placeholder          = {"Email..."}
                            autoCorrect          = {false}
                            keyboardType         = {"email-address"}
                            onSubmitEditing      = {this.inputPasswordRef.current?.focus}
                            onChangeText         = {(text) => this.setState({ email: text })}
                            value                = {this.state.email}
                            ref                  = {this.inputEmailRef}
                            icon                 = {require("../../assets/icons/dark/mail.png")}
                        />

                        {/*- Password input -*/}
                        <TextInput
                            placeholder          = {"Password..."}
                            autoCorrect          = {false}
                            keyboardType         = {"default"}
                            secureTextEntry      = {true}
                            onChangeText         = {(text) => this.setState({ password: text })}
                            value                = {this.state.password}
                            ref                  = {this.inputPasswordRef}
                            icon                 = {require("../../assets/icons/dark/lock.png")}
                            onSubmitEditing      = {() => {}}
                        />

                        {/*- Confirm password input -*/}
                        <TextInput
                            placeholder          = {"Confirm password..."}
                            autoCorrect          = {false}
                            keyboardType         = {"default"}
                            secureTextEntry      = {true}
                            onChangeText         = {(text) => this.setState({ confirmPassword: text })}
                            value                = {this.state.confirmPassword}
                            ref                  = {this.inputConfirmPasswordRef}
                            icon                 = {require("../../assets/icons/dark/redo.png")}
                            onSubmitEditing      = {() => {}}
                        />

                        <TouchableHighlight style={Styles.button} onPress={() => console.log("navigate Login")}>
                            {
                                this.state.loading
                                    ? <ActivityIndicator />
                                    : <Text style={Styles.buttonText}>Sign up</Text>
                            }
                        </TouchableHighlight>
                    </View>
                    
                    <StatusBar style="auto" />
                </KeyboardAvoidingView>
            </SafeAreaView>
		);
	}
}

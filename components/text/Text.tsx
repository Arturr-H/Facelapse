/* Imports */
import React from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {
    children: string | JSX.Element | JSX.Element[]
}
interface State {}

/* Main */
export class Header1 extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    /* Render */
    render() {
        return (
            <Text style={Styles.header1}>
                {this.props.children}
            </Text>
        )
    }
}

/* Paragraph */
export class P extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    /* Render */
    render() {
        return (
            <Text style={Styles.paragraph}>
                {this.props.children}
            </Text>
        )
    }
}

/* Space */
export class Br extends React.PureComponent<{ height?: number }, State> {
    constructor(props: { height?: number }) {
        super(props);
    }

    /* Render */
    render() {
        return (
            <View style={{ height: this.props.height || 5 }} />
        )
    }
}
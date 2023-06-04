/* File to quickly use the Animate.timing function */

/* Imports */
import { Animated, Easing } from "react-native";

/* Functions */
export const animate = (
    value: Animated.Value | Animated.ValueXY,
    toValue:
      | number
      | { x: number; y: number },
      duration: number | undefined,
    nativeDriver: boolean,
    easing?: ((value: number) => number) | undefined,
    delay?: number | undefined,
) => {
    const duration_ = duration ? duration : 100;
    const easing_ = easing ? easing : Easing.inOut(Easing.ease);
    const delay_ = delay ? delay : 0;

    Animated.timing(value, {
        toValue,
        duration: duration_,
        easing: easing_,
        delay: delay_,
        useNativeDriver: nativeDriver,
    }).start();
}
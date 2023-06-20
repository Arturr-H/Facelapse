import { Dimensions } from "react-native"

/* Convert some screen coordinate to percentage of width / height */
export function percentage(dim: "width" | "height", from: number): number {
    if (dim === "height") {
        return from / Dimensions.get("window").height
    }else {
        return from / Dimensions.get("window").width
    }
}

/* Remove div by 0 */
export function antiZero(number: number): number {
    return number === 0 ? 0.0001 : number
}


/* Calculate hypotenuse of two points ({ x: number, y: number }) */
export function hypotenuse(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.hypot(dy, dx)
}

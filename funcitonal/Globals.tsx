/* Useful functions */
export function dbg(any?: any, any2?: any, any3?: any, any4?: any): void {
    let map_log = [any, any2, any3, any4].map((e, index) => e === undefined ? "" : e + ", ").join("");
    if (vars.debug) console.log("[DBG]: ", map_log);
}

/* Global variables */
let vars = {
    backendUrl: "http://192.168.68.106:8080/",
    debug: true,
};

export default vars;
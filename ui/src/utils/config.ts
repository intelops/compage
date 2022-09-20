export const getConfig = (typeId: string) => {
    switch (typeId) {
        case "node-type-circle":
            console.log("It is a node-type-circle.");
            return "circle"
        case "node-type-rectangle":
            console.log("It is a node-type-rectangle.");
            return "rectangle"
        case "node-type-rectangle-top-bottom":
            console.log("It is a node-type-rectangle-top-bottom.");
            return ""
        case "node-type-start":
            console.log("It is a node-type-start.");
            return ""
        case "node-type-end":
            console.log("It is a node-type-end.");
            return ""
        case "node-type-dead":
            console.log("It is a node-type-dead.");
            return ""
        default:
            console.log("No such type exists!");
            return ""
    }
};
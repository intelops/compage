interface Config {
    classNames: string[];
    icon: string;
}

export const getConfig = (typeId: string): Config => {
    switch (typeId) {
        case "node-type-circle":
            // console.log("It is a node-type-circle.");
            return {classNames: ["circle"], icon: ""};
        case "node-type-rectangle":
            // console.log("It is a node-type-rectangle.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-rectangle-top-bottom":
            // console.log("It is a node-type-rectangle-top-bottom.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-start":
            // console.log("It is a node-type-start.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-end":
            // console.log("It is a node-type-end.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-start-top-bottom":
            // console.log("It is a node-type-start-top-bottom.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-end-top-bottom":
            // console.log("It is a node-type-end-top-bottom.");
            return {classNames: ["rectangle"], icon: ""};
        case "node-type-dead":
            // console.log("It is a node-type-dead.");
            return {classNames: ["rectangle"], icon: ""};
        default:
            console.log("No such type exists!");
            return {classNames: ["rectangle"], icon: ""};
    }
};
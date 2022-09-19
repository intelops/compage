export const getConfig = (typeId: string) => {
    switch (typeId) {
        case "testId-centered":
            console.log("It is a testId-centered.");
            return "circle"
        case "testId-normal":
            console.log("It is a testId-normal.");
            return "rectangle"
        case "testId-topBottom":
            console.log("It is a testId-topBottom.");
            return ""
        case "testId-start":
            console.log("It is a testId-start.");
            return ""
        case "testId-end":
            console.log("It is a testId-end.");
            return ""
        case "testId-dead":
            console.log("It is a testId-dead.");
            return ""
        default:
            console.log("No such type exists!");
            return ""
    }
};
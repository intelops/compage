import { IconBaseProps, IconContext, IconType } from "react-icons";
import MD, { MdContentCopy } from "react-icons/md";
import { SquareButtonProps } from "./SquareButton.types";
const COLORS = {
  someShadeOfBlue: "#005dff",
  lightBlue: "#1d88fe",
};
// on Hover we need to set the lightBlue to the background
function SquareButton(props: SquareButtonProps) {
  console.log(props);

  return (
    <button
      style={{
        width: 62,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.someShadeOfBlue,
        padding: 10,
        border: `1px solid ${COLORS.someShadeOfBlue}`,
      }}
    >
      {!!props.icon &&
        (
          <IconContext.Provider value={props.iconStyle || {}}>
            <props.icon />
          </IconContext.Provider>
        )}
      {
        <span
          style={{
            fontSize: 10,
            textAlign: "center",
            color: "white",
            textOverflow: "ellipsis",
            marginTop: 5,
          }}
        >
          {props.text}
        </span>
      }
    </button>
  );
}

export default SquareButton;

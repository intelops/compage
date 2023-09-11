import { IconContext, IconType } from "react-icons";

export type SquareButtonWithIcons = {
  icon: IconType;
  iconStyle?: IconContext;
  text: string;
};
export type SquareButtonWithText = {
  text: string;
};
export type SquareButtonProps = SquareButtonWithIcons & SquareButtonWithText;

import { UseFormRegisterReturn } from "react-hook-form";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  variant?: "default" | "secondary" | "tertiary";
  register?: UseFormRegisterReturn;
}

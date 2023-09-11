import { UseFormRegisterReturn } from "react-hook-form";

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  id: string;
  errorMessage?: string;
  label: string;
  register: UseFormRegisterReturn;
}

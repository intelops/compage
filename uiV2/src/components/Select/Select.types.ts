import { UseFormRegisterReturn } from "react-hook-form";

export type LanguageDataItem = {
  id: string;
  label: string;
  [key: string]: any; // allows for other fields
};
export type SelectData = {
  id: string;
  label: string;
  [key: string]: any; // allows for other fields
};
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register: UseFormRegisterReturn;
  data: SelectData[];
  placeholderText?: string;
  selectFirstItemAsDefault?: boolean;
}

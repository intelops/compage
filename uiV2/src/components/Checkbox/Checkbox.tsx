import React, { ChangeEvent, useState } from "react";
import clsx from "clsx";
import { CheckboxProps } from "./Checkbox.types";

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  variant = "default",
  checked: defaultChecked,
  onChange: onChangeProp,
  id,
  register,
  ...otherProps
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(!!defaultChecked);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onChangeProp && onChangeProp(event);
  };

  const inputBaseClasses = clsx(
    "w-4",
    "h-4",
    "text-blue-600",
    "bg-gray-100",
    "border-gray-300",
    "rounded",
    "focus:ring-blue-500",
    "dark:focus:ring-blue-600",
    "dark:ring-offset-gray-800",
    "focus:ring-2",
    "dark:bg-gray-700",
    "dark:border-gray-600",
  );

  const labelBaseClasses = clsx(
    "ml-2",
    "text-sm",
    "font-medium",
    "text-gray-900",
    "dark:text-gray-300",
  );

  const variantClasses = {
    default: "",
    secondary: "", // Add secondary classes if we have any for the checkbox
    tertiary: "", // Add tertiary classes if we have any for the checkbox
  };

  if (register) {
    // NOTE:
    //    here the input is controlled by the react-hook-form
    //    that is the reason we do not use the local state to track the changes
    return (
      <div className="flex items-center mb-4">
        <input
          id={id}
          type="checkbox"
          className={clsx(inputBaseClasses, variantClasses[variant])}
          {...otherProps}
          {...register}
        />
        <label
          htmlFor={id}
          className={labelBaseClasses}
        >
          {label}
        </label>
      </div>
    );
  }
  return (
    <div className="flex items-center mb-4">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={clsx(inputBaseClasses, variantClasses[variant])}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={labelBaseClasses}
      >
        {label}
      </label>
    </div>
  );
};

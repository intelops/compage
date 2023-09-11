import { SelectProps } from "./Select.types";
import "./Select.styles.scss";

const Select = (
  { register, data, placeholderText = "", selectFirstItemAsDefault = false }:
    SelectProps,
) => (
  <select
    {...register}
    className="custom-select"
    defaultValue={selectFirstItemAsDefault ? data[0].id : ""}
  >
    {!selectFirstItemAsDefault &&
      (
        <option label="" value={""} disabled hidden>
          {placeholderText}
        </option>
      )}
    {data.map((item) => (
      <option key={item.id} value={item.id}>
        {item.label}
      </option>
    ))}
  </select>
);

export default Select;

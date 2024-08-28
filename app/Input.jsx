import { createElement } from "../myReact";
export const Input = ({ value, onInput, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onInput={onInput}
      placeholder={placeholder}
    />
  );
};
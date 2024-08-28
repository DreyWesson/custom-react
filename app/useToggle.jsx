import { createElement, useState } from "../myReact.js";
export const useToggle = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  return [value, toggle];
};
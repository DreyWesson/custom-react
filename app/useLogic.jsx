import { useEffect, useState } from "../myReact.js";
import { useToggle } from "./useToggle.jsx";

export const useLogic = () => {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("dodgerblue");
  const [inputValue, setInputValue] = useState("");

  const [user, setUser] = useState({ name: "John", age: 25 });
  const [showMessage, toggleMessage] = useToggle(false);
  const [isActive, toggleIsActive] = useToggle(false);

  const toggleColor = (e) => {
    e.preventDefault();
    setColor((prevColor) =>
      prevColor === "dodgerblue" ? "#569e56" : "dodgerblue"
    );
  };
  console.log(color)

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted with: ${inputValue}`);
  };

  const updateAge = () => setUser({ ...user, age: user.age + 1 });

  const handleComplexEvent = () => {
    setCount(count + 5);
    setColor((prevColor) =>
      prevColor === "dodgerblue" ? "#569e56" : "dodgerblue"
    );
  };
  
  return {
    count,
    color,
    inputValue,
    user,
    showMessage,
    isActive,
    setCount,
    setColor,
    setInputValue,
    setUser,
    toggleMessage,
    toggleIsActive,
    toggleColor,
    handleInputChange,
    handleSubmit,
    updateAge,
    handleComplexEvent,
  };
};

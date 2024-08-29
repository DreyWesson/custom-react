// // useLogic.jsx
// import { useContext, useState } from "./myReact";
// import { ColorContext } from "./context"; // Import your context

// // Define your logic using useContext
// export const useLogic = () => {
//   const color = useContext(ColorContext); // Retrieve context value

//   // Ensure the context value is correctly provided
//   if (!color) {
//     throw new Error("useContext must be inside a corresponding Provider");
//   }

//   const [count, setCount] = useState(0);
//   const [showMessage, setShowMessage] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [isActive, setIsActive] = useState(false);
//   const [user, setUser] = useState({ name: "John", age: 30 });

//   const toggleColor = () => setUser({ ...user, color: color === "blue" ? "green" : "blue" });
//   const toggleMessage = () => setShowMessage((prev) => !prev);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Submitted: ${inputValue}`);
//   };
//   const handleInputChange = (e) => setInputValue(e.target.value);
//   const toggleIsActive = () => setIsActive((prev) => !prev);
//   const updateAge = () => setUser({ ...user, age: user.age + 1 });

//   return {
//     color,
//     count,
//     setCount,
//     toggleColor,
//     toggleMessage,
//     showMessage,
//     handleSubmit,
//     inputValue,
//     handleInputChange,
//     isActive,
//     toggleIsActive,
//     user,
//     updateAge,
//   };
// };

// useLogic.jsx
import { useContext, useState } from "./myReact"; // Import hooks from custom library
import { ColorContext } from "./context"; // Import the context

export const useLogic = () => {
  // Access the context value using useContext
  const color = useContext(ColorContext); // Throws an error if the provider is not present
  console.log("useLogic called, color from context:", color);
  
  // Validate that the context has a value (optional but helpful)
  if (color === undefined) {
    throw new Error("useContext must be inside a corresponding Provider");
  }

  // Component state and logic
  const [count, setCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState({ name: "John", age: 30 });

  const toggleColor = () => setUser({ ...user, color: color === "blue" ? "green" : "blue" });
  const toggleMessage = () => setShowMessage((prev) => !prev);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted: ${inputValue}`);
  };
  const handleInputChange = (e) => setInputValue(e.target.value);
  const toggleIsActive = () => setIsActive((prev) => !prev);
  const updateAge = () => setUser({ ...user, age: user.age + 1 });

  return {
    color,
    count,
    setCount,
    toggleColor,
    toggleMessage,
    showMessage,
    handleSubmit,
    inputValue,
    handleInputChange,
    isActive,
    toggleIsActive,
    user,
    updateAge,
  };
};


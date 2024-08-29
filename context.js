// // context.js
// import { createContext } from "./myReact";

// // Create a context with a default value
// export const ColorContext = createContext(); 
// context.js
import { createContext } from "./myReact";

// Creating the context with an optional default value
export const ColorContext = createContext("default-color"); // Make sure it’s exported

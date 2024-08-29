// import { App } from "./App.jsx";
// import { createElement, render } from "./myReact.js";
// import { ColorContext } from "./context.js";

// render(() => (
//     <ColorContext.Provider value="green"> {/* Context value set to 'green' */}
//       <App />
//     </ColorContext.Provider>
//   ), document.getElementById("#root"));
// index.js
import { render, createElement } from "./myReact"; // Custom React-like library
import { App } from "./App.jsx";
import { ColorContext } from "./context"; // Ensure correct path to the context file

// Wrap the App component with the Provider
render(<App />, document.getElementById("root"));

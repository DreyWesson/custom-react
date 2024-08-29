// import { createElement } from "./myReact";
// import { Header } from "./app/Header.jsx";
// import { Main } from "./app/Main.jsx";
// import { Footer } from "./app/Footer.jsx";
// import { useLogic } from "./app/useLogic.jsx";

// export const App = () => {
//   const {color} = useLogic();
//   return (
//     <div>
//       <Header color={color} />
//       <Main />
//       <Footer />
//     </div>
//   );
// };
import { createElement, createContext, useContext, useState } from "./myReact";

const ThemeContext = createContext("light");

export const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  console.log("Rendering App with theme:", theme);

  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <h1>Custom Context API Example</h1>
        {/* <ThemedButton /> */}
        <ThemedText />
        <button onClick={toggleTheme} style={{ marginTop: "20px" }}>
          Toggle Theme
        </button>
      </div>
    </ThemeContext.Provider>
  );
};


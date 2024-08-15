import { useState, createElement} from "./myReact";

export const App = () => {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("blue");

  const toggleColor = (e) => {
    e.preventDefault();
    setColor((prevColor) => (prevColor === "blue" ? "green" : "blue"));
  };

  return createElement(
    "div",
    { style: { border: "1px solid black", padding: "10px" } },
    createElement(
      "header",
      {
        id: "main-header",
        style: { backgroundColor: color, padding: "10px", textAlign: "center" },
      },
      createElement("h1", {}, "Welcome to My Page")
    ),
    createElement(
      "nav",
      { style: { margin: "10px 0" } },
      createElement(
        "ul",
        {},
        createElement("li", {}, createElement("a", { href: "#home" }, "Home")),
        createElement("li", {}, createElement("a", { href: "#about" }, "About")),
        createElement(
          "li",
          {},
          createElement("a", { href: "#contact" }, "Contact")
        )
      )
    ),
    createElement(
      "main",
      { id: "content" },
      createElement(
        "section",
        { className: "intro" },
        createElement(
          "p",
          {},
          "This is an example of a normal HTML page rendered using MyReact."
        ),
        createElement(
          "div",
          { style: { marginTop: "10px" } },
          createElement("h1", {}, `Count: ${count}`),
          createElement(
            "button",
            {
              onClick: () => setCount(count + 1),
              style: { marginRight: "10px" },
            },
            "Increment"
          ),
          createElement(
            "button",
            { onClick: toggleColor },
            "Toggle Color"
          )
        )
      )
    ),
    createElement(
      "footer",
      { id: "main-footer", style: { marginTop: "20px", textAlign: "center" } },
      createElement("p", {}, "© 2024 My Page")
    )
  );
};


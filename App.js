import { renderApp, useState, createElement } from "./myReact";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    createElement(
      "div",
      {},
      createElement(
        "div",
        {},
        createElement(
          "div",
          {},
          createElement(
            "div",
            {},
            createElement("div", {}, createElement("p", {}, "DEEPLY NESTED"))
          )
        )
      )
    ),
    createElement(
      "div",
      {},
      createElement(
        "header",
        { id: "main-header" },
        createElement("h1", {}, "Welcome to My Page")
      ),
      createElement(
        "nav",
        {},
        createElement(
          "ul",
          {},
          createElement(
            "li",
            {},
            createElement("a", { href: "#home" }, "Home")
          ),
          createElement(
            "li",
            {},
            createElement("a", { href: "#about" }, "About")
          ),
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
            {},
            createElement("h1", {}, `Count: ${count}`),
            createElement(
              "button",
              { onClick: () => setCount(count + 1) },
              "Increment"
            )
          ),
        ),
      ),
      createElement(
        "footer",
        { id: "main-footer" },
        createElement("p", {}, "© 2024 My Page")
      )
    )
  );
};
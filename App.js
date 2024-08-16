import { createElement, useState } from "./myReact";

// Custom hook for toggling values
const useToggle = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  return [value, toggle];
};

// Reusable Button component
const Button = ({ onClick, children, style }) => {
  return createElement("button", { onClick, style }, children);
};

// Reusable Input component
const Input = ({ value, onInput, placeholder }) => {
  return createElement("input", {
    type: "text",
    value,
    onInput,
    placeholder,
  });
};

// Header component
const Header = ({ color }) => {
  return createElement(
    "header",
    {
      id: "main-header",
      style: { backgroundColor: color, padding: "10px", textAlign: "center" },
    },
    createElement("h1", {}, "Welcome to My React Page")
  );
};

// Footer component
const Footer = () => {
  return createElement(
    "footer",
    { id: "main-footer", style: { marginTop: "20px", textAlign: "center" } },
    createElement("p", {}, "© 2024 My Page")
  );
};

// Main App component
export const App = () => {
  // State hooks
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("blue");
  const [inputValue, setInputValue] = useState("");
  const [showMessage, toggleMessage] = useToggle(false);
  const [isActive, toggleIsActive] = useToggle(false);
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [user, setUser] = useState({ name: "John", age: 25 });

  // Event handlers
  const toggleColor = (e) => {
    e.preventDefault();
    setColor((prevColor) => (prevColor === "blue" ? "green" : "blue"));
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted with: ${inputValue}`);
  };

  const updateAge = () => setUser({ ...user, age: user.age + 1 });

  const handleComplexEvent = () => {
    setCount(count + 5);
    setColor("red");
  };

  return createElement(
    "div",
    { style: { border: "1px solid black", padding: "10px" } },
    // Header with dynamic color
    createElement(Header, { color }),

    // Navigation
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

    // Main content
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
            Button,
            {
              onClick: () => setCount(count + 1),
              style: { marginRight: "10px" },
            },
            "Increment"
          ),
          createElement(Button, { onClick: toggleColor }, "Toggle Color"),
          createElement(
            Button,
            { onClick: handleComplexEvent, style: { marginLeft: "10px" } },
            "Increment by 5 and change color to red"
          )
        ),
        // Display dynamic list with keys
        createElement(
          "ul",
          {},
          items.map((item, index) =>
            createElement("li", { key: index }, item)
          )
        ),
        // Toggle message visibility
        createElement(
          "div",
          { style: { marginTop: "20px" } },
          createElement(
            Button,
            { onClick: toggleMessage, style: { marginRight: "10px" } },
            "Toggle Message"
          ),
          showMessage &&
            createElement("p", {}, "This is a conditional message!")
        ),
        // Form handling
        createElement(
          "form",
          { onSubmit: handleSubmit, style: { marginTop: "20px" } },
          createElement(Input, {
            value: inputValue,
            onInput: handleInputChange,
            placeholder: "Enter text...",
          }),
          createElement("button", { type: "submit" }, "Submit")
        ),
        // Conditional class management
        createElement(
          "div",
          { className: isActive ? "active" : "inactive", style: { marginTop: "20px" } },
          createElement(
            Button,
            { onClick: toggleIsActive },
            isActive ? "Active" : "Inactive"
          )
        ),
        // Complex state management example
        createElement(
          "div",
          { style: { marginTop: "20px" } },
          createElement("p", {}, `Name: ${user.name}`),
          createElement("p", {}, `Age: ${user.age}`),
          createElement(Button, { onClick: updateAge }, "Increment Age")
        )
      )
    ),

    // Footer
    createElement(Footer)
  );
};

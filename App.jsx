import { createElement, useState } from "./myReact";

// Custom hook for toggling values
const useToggle = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  return [value, toggle];
};

// Reusable Button component
const Button = ({ onClick, children, style }) => {
  return (
    <button onClick={onClick} style={style}>
      {children}
    </button>
  );
};

// Reusable Input component
const Input = ({ value, onInput, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onInput={onInput}
      placeholder={placeholder}
    />
  );
};

// Header component
const Header = ({ color }) => {
  return (
    <header
      id="main-header"
      style={{ backgroundColor: color, padding: "10px", textAlign: "center" }}
    >
      <h1>Welcome to My React Page</h1>
    </header>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer id="main-footer" style={{ marginTop: "20px", textAlign: "center" }}>
      <p>© 2024 My Page</p>
    </footer>
  );
};

// Main App component
export const App = () => {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("blue");
  const [inputValue, setInputValue] = useState("");
  const [items] = useState(["Home", "About", "Contact"]);
  const [user, setUser] = useState({ name: "John", age: 25 });
  const [showMessage, toggleMessage] = useToggle(false);
  const [isActive, toggleIsActive] = useToggle(false);

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
    setColor((prevColor) => (prevColor === "blue" ? "green" : "blue"));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "10% auto",
        border: "1px solid black",
        padding: "10px",
      }}
    >
      <Header color={color} />
      <nav style={{ margin: "10px 0" }}>
        <ul>
          {items &&
            items.map((item, idx) => (
              <li key={idx}>
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
        </ul>
      </nav>
      <main id="content">
        <section className="intro">
          <p>
            This is an example of a normal HTML page rendered using MyReact.
          </p>
          <div style={{ marginTop: "10px" }}>
            <h1>Count: {count}</h1>
            <Button
              onClick={() => setCount(count + 1)}
              style={{ marginRight: "10px" }}
            >
              Increment
            </Button>
            <Button onClick={toggleColor}>Toggle Color</Button>
            <Button onClick={handleComplexEvent} style={{ marginLeft: "10px" }}>
              Increment by 5 and toggle color
            </Button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Button onClick={toggleMessage} style={{ marginRight: "10px" }}>
              Toggle Message
            </Button>
            {showMessage && <p>This is a conditional message!</p>}
          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <Input
              value={inputValue}
              onInput={handleInputChange}
              placeholder="Enter text..."
            />
            <button type="submit">Submit</button>
          </form>
          <div
            className={isActive ? "active" : "inactive"}
            style={{ marginTop: "20px" }}
          >
            <Button onClick={toggleIsActive}>
              {isActive ? "Active" : "Inactive"}
            </Button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <Button onClick={updateAge}>Increment Age</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

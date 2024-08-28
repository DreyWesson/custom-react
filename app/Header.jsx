import { createElement, useState } from "../myReact.js";
import { useLogic } from "./useLogic.jsx";

export const Header = (prop) => {
  const [items] = useState(["Home", "About", "Contact"]);
  const {color} = useLogic();
  return (
    <header
      id="main-header"
      style={{ backgroundColor: color, padding: "10px", textAlign: "center" }}
    >
      <h1>Welcome to My React Page</h1>
      <nav style={{ margin: "0" }}>
        <h3>Testing list</h3>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "150px",
            margin: "0 auto",
            padding: "0",
          }}
        >
          {items &&
            items.map((item, idx) => (
              <li key={idx} style={{ listStyle: "none" }}>
                <a
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  );
};
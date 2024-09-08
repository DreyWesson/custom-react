import { createElement } from "./myReact";
import { Header } from "./app/Header.jsx";
import { Main } from "./app/Main.jsx";
import { Footer } from "./app/Footer.jsx";
import { useLogic } from "./app/useLogic.jsx";

export const App = () => {
  const { color } = useLogic();
  return (
    <div style={{ border: "1px solid black", maxWidth: "750px", margin: "0 auto", padding: "20px" }}>
      <Header color={color} />
      <Main />
      <Footer />
    </div>
  );
};

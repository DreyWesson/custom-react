import { createElement, Link, Route, Switch } from "./myReact";
// import { Header } from "./app/Header.jsx";
// import { Main } from "./app/Main.jsx";
// import { Footer } from "./app/Footer.jsx";
// import { useLogic } from "./app/useLogic.jsx";

// export const App = () => {
//   const { color } = useLogic();
//   return (
//     <div style={{ border: "1px solid black", maxWidth: "750px", margin: "0 auto", padding: "20px" }}>
//       <Header color={color} />
//       <Main />
//       <Footer />
//     </div>
//   );
// };



const Home = () => createElement('div', {}, 'Home Page');
const About = () => createElement('div', {}, 'About Page');
const NotFound = () => createElement('div', {}, '404 Not Found');

export const App = () => {
  return createElement('div', {},
    createElement(Link, { to: '/' }, 'Home'),
    createElement(Link, { to: '/about' }, 'About'),
    createElement(Switch, {}, 
      createElement(Route, { path: '/', exact: true, component: Home }),
      createElement(Route, { path: '/about', component: About }),
      createElement(Route, { path: '*', component: NotFound })
    )
  );
};



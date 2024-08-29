import { App } from "./App.jsx";
import { createRealDOM, diff } from "./helper/domHelpers";

class MyReact {
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.effects = [];
    this.effectIdx = 0;
    this.isRendering = false;
    this.oldVDOM = null;
    this.container = null;
    this.isUpdateScheduled = false;
  }

  useState = (initialValue) => {
    const idx = this.stateIdx;

    if (!this.isRendering) {
      throw new Error("useState can only be called during rendering");
    }

    if (this.state[idx] === undefined) {
      this.state[idx] = initialValue;
    }

    const setState = (newValue) => {
      const newState =
        typeof newValue === "function" ? newValue(this.state[idx]) : newValue;
      this.state[idx] = newState;
      this.processUpdate();
    };

    this.stateIdx++;
    return [this.state[idx], setState];
  };

  useEffect = (callback, dependencies = []) => {
    const idx = this.effectIdx;

    if (!this.isRendering) {
      throw new Error("useEffect can only be called during rendering");
    }

    const previousEffect = this.effects[idx];
    const depsChanged = previousEffect
      ? dependencies.some((dep, i) => !Object.is(dep, previousEffect.deps[i]))
      : true;

    if (depsChanged) {
      if (previousEffect?.cleanup) {
        previousEffect.cleanup();
      }

      const cleanup = callback();
      this.effects[idx] = {
        deps: dependencies,
        cleanup: typeof cleanup === "function" ? cleanup : undefined,
      };
    }

    this.effectIdx++;
  };

  runEffects = () => {
    this.effects.forEach((effect) => {
      if (effect && effect.depsChanged) {
        if (effect.cleanup) effect.cleanup();
        effect.cleanup = effect.callback();
      }
    });
  };

  processUpdate = () => {
    if (!this.isUpdateScheduled) {
      this.isUpdateScheduled = true;
      requestAnimationFrame(() => {
        this.isUpdateScheduled = false;
        this.render();
      });
    }
  };

  render = (app = App, container) => {
    this.isRendering = true;
    this.stateIdx = 0;
    this.effectIdx = 0;

    container = container || this.container || document.getElementById("root");
    this.renderToDOM(app(), container);

    this.isRendering = false;
    this.runEffects();
  };

  renderToDOM = (newVDOM, root) => {
    this.container = root;
    console.log("New Virtual DOM:", newVDOM);

    if (!this.oldVDOM) root.appendChild(createRealDOM(newVDOM));
    else diff(root, this.oldVDOM, newVDOM);

    this.oldVDOM = newVDOM;
  };

  // createElement = (type, props = {}, ...children) => {
  //   props = props || {};
  //   const { key = null, ...restProps } = props;
    
  //   const normalizedChildren = children.flat().map((child, index) => {
  //     if (typeof child === "object" && child !== null && !child.key) {
  //       child.key = index;
  //     }
  //     return child;
  //   });
  
  //   if (typeof type === "function") {
  //     return type({ ...restProps, children: normalizedChildren });
  //   }
  
  //   return {
  //     type,
  //     props: { ...restProps, children: normalizedChildren },
  //     key,
  //   };
  // };
  createElement = (type, props = {}, ...children) => {
    props = props || {};
    const { key = null, ...restProps } = props;
  
    console.log("Creating element:", { type, props, children });
  
    const normalizedChildren = children.flat().map((child, index) => {
      if (typeof child === "object" && child !== null && !child.key) {
        child.key = index;
      }
      return child;
    });
  
    return typeof type === "function"
      ? type({ ...restProps, children: normalizedChildren })
      : {
          type,
          props: { ...restProps, children: normalizedChildren },
          key,
        };
  };
  

  // createElement = (type, props = {}, ...children) => {
  //   props = props || {};
  //   const { key = null, ...restProps } = props;
  //   console.log("children", children);

  //   const normalizedChildren = children.flat().map((child, index) => {
  //     if (typeof child === "object" && child !== null && !child.key) {
  //       child.key = index;
  //     }
  //     return child;
  //   });

  //   return typeof type === "function"
  //     ? type({ ...restProps, children: normalizedChildren })
  //     : {
  //       type,
  //       props: { ...restProps, children: normalizedChildren },
  //       key,
  //     };
  // };

  createContext = (defaultValue) => {
    const context = {
      value: defaultValue,
      listeners: new Set(),
      Provider: ({ value, children }) => {
        context.value = value;
        // Notify all components that are consuming this context
        context.listeners.forEach((listener) => listener(value));
        return children;
      },
      Consumer: ({ children }) => {
        if (typeof children === "function") {
          return children(context.value);
        }
        return children;  // Return as is if it's not a function
      },
    };
    return context;
  };

  // useContext = (context) => {
  //   if (!this.isRendering) {
  //     throw new Error("useContext can only be called during rendering");
  //   }
  
  //   const [state, setState] = this.useState(context.value);
  
  //   console.log("Context value:", context.value, "Current state:", state);
  
  //   if (state !== context.value && !context.listeners.has(setState)) {
  //     console.log("Context value changed, updating state...");
  //     context.listeners.add((newValue) => {
  //       setState(newValue);
  //     });
  //   }
  
  //   return state;
  // };
  useContext = (context) => {
    if (!this.isRendering) {
      throw new Error("useContext can only be called during rendering");
    }
  
    const [state, setState] = this.useState(context.value);
  
    if (!context.listeners.has(setState)) {
      context.listeners.add(setState);
    }
  
    console.log("Context value:", context.value);
    console.log("Current state:", state);
  
    return state;
  };
  
  
}

const myReactInstance = new MyReact();

export const createElement = myReactInstance.createElement;
export const useState = myReactInstance.useState;
export const render = myReactInstance.render;
export const useEffect = myReactInstance.useEffect;
export const createContext = myReactInstance.createContext;
export const useContext = myReactInstance.useContext;
export default myReactInstance;

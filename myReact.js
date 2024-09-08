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
    this.contexts = new Map();
  }

  useMemo = (fn, dependencies) => {
    const memoIdx = this.stateIdx; // Use current index for memo storage
    
    if (!this.isRendering) {
      throw new Error("useMemo can only be called during rendering");
    }
    
    // Check if the value has been computed before
    const prevMemo = this.state[memoIdx];
  
    // If this is the first time or dependencies have changed, compute new value
    if (!prevMemo) {
      const computedValue = fn(); // Compute value for the first time
      this.state[memoIdx] = { value: computedValue, dependencies };
      this.stateIdx++; // Move to the next index in state
      return computedValue;
    }
  
    // Check if dependencies have changed
    const depsChanged = dependencies.some((dep, i) => !Object.is(dep, prevMemo.dependencies[i]));
    
    if (depsChanged) {
      const computedValue = fn(); // Recompute the memoized value
      this.state[memoIdx] = { value: computedValue, dependencies }; // Update memo value and dependencies
      this.stateIdx++; // Move to next index
      return computedValue;
    }
    
    // If dependencies haven't changed, return memoized value
    this.stateIdx++;
    return prevMemo.value;
  };

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

    if (!this.oldVDOM) root.appendChild(createRealDOM(newVDOM));
    else diff(root, this.oldVDOM, newVDOM);

    this.oldVDOM = newVDOM;
  };

  createElement = (type, props = {}, ...children) => {
    props = props || {};
    const { key = null, ...restProps } = props;

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
  createContext = (defaultValue) => {
    const context = {
      value: defaultValue,
      subscribers: new Set(),
    };

    context.Provider = ({ value, children }) => {
      context.value = value;
      context.subscribers.forEach((subscriber) => subscriber());
      return this.createElement('div', {}, ...children);
    };

    return context;
  };

  // useContext = (context) => {
  //   if (!this.isRendering) {
  //     throw new Error("useContext can only be called during rendering");
  //   }

  //   const contextInstance = this.contexts.get(context) || context;
    
  //   const subscriber = () => {
  //     if (contextInstance.value !== context.value) {  // Check if context value has changed
  //       this.processUpdate();
  //     }
  //   };

  //   contextInstance.subscribers.add(subscriber);

  //   this.useEffect(() => {
  //     return () => contextInstance.subscribers.delete(subscriber);
  //   }, []);

  //   return contextInstance.value;
  // };
  useContext = (context) => {
    if (!this.isRendering) {
      throw new Error("useContext can only be called during rendering");
    }
  
    const contextInstance = this.contexts.get(context) || context;

    const currentValue = contextInstance.value;

    const subscriber = () => {
      if (contextInstance.value !== currentValue) {
        console.log("Context value changed, re-rendering...");
        this.processUpdate();
      }
    };
  
    contextInstance.subscribers.add(subscriber);

    this.useEffect(() => {
      return () => {
        console.log("Cleaning up subscriber...");
        contextInstance.subscribers.delete(subscriber);
      };
    }, [contextInstance]);
  
    return contextInstance.value;
  };
  
}

const myReactInstance = new MyReact();
export const {createContext, createElement, useContext, useEffect, useMemo, useState, render} = myReactInstance

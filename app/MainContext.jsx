import { createElement, useContext, useMemo } from "../myReact";
import { Button } from "./Button";
import { LogicContext, PostContext } from "./context";
import { Input } from "./Input";
import { Sectioning, vDOM } from "./Main";
import { Posts } from "./Posts";
import { useFetchData } from "./useFetchData";


export const MainContent = () => {
      const {
    color,
    count,
    toggleColor,
    handleComplexEvent,
    toggleMessage,
    showMessage,
    handleSubmit,
    inputValue,
    handleInputChange,
    isActive,
    toggleIsActive,
    user,
    updateAge,
    setCount,
  } = useContext(LogicContext);

    const { posts, userId, setUserId } = useFetchData();
  

  return (
    <main id="content">
      <PostContext.Provider value={{ posts, userId, setUserId }}>
        <Posts />
      </PostContext.Provider>
      <Sectioning />
      {vDOM}
      <Sectioning />
      <section className="intro">
        <hr />
        <h3>
          This is an example of a normal HTML page rendered using MyReact.
        </h3>
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
        <Sectioning />
        <div style={{ marginTop: "20px" }}>
          <Button onClick={toggleMessage} style={{ marginRight: "10px" }}>
            Toggle Message
          </Button>
          {showMessage && <p>This is a conditional message!</p>}
        </div>
        <Sectioning />
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <Input
            value={inputValue}
            onInput={handleInputChange}
            placeholder="Enter text..."
          />
          <button type="submit">Submit</button>
        </form>
        <Sectioning />
        <div
          className={isActive ? "active" : "inactive"}
          style={{ marginTop: "20px" }}
        >
          <Button onClick={toggleIsActive}>
            {isActive ? "Active" : "Inactive"}
          </Button>
        </div>
        <Sectioning />
        <div style={{ marginTop: "20px" }}>
          <p>Name: {user?.name}</p>
          <p>Age: {user?.age}</p>
          <Button onClick={updateAge}>Increment Age</Button>
        </div>
      </section>
    </main>
  )
}

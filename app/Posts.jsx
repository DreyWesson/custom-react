import { Button } from "./Button.jsx";
import { createElement, useContext } from "../myReact.js";
import { useFetchData } from "./useFetchData.jsx";
import { PostContext } from "./context.jsx";

export const Posts = () => {
  const { posts, userId, setUserId } = useContext(PostContext); 
console.log({ posts, userId, setUserId })
  return (
      <section style={{ margin: "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <h2>Latest Posts</h2>
          <span>
            useID:{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>{userId}</span>
          </span>
        </div>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0",
            padding: "0",
          }}
        >
          {posts && posts.map((item) => (
            <li key={item.id} style={{ listStyle: "none", marginBottom: "10px" }}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
          <Button onClick={() => setUserId((id) => id + 1)}>
            Load Next User's Posts
          </Button>
        </ul>
      </section>


  );
};

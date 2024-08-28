import { Button } from "./Button.jsx";
import { createElement, useEffect, useState } from "../myReact.js";

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
          { signal }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setPosts(data.slice(0, 5));
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Failed to fetch items");
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [userId]);

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
          useID: <span style={{ color: "red", fontWeight: "bold" }}>{userId}</span>
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
        {posts.map((item) => (
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

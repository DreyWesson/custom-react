import { useEffect, useState } from '../myReact'

export const useFetchData = () => {
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
        if (error instanceof Error) {

            if (error.name !== "AbortError") {
              setError("Failed to fetch items");
            }
        } else {
            setError("Unknown error")
        }
      } finally {
        
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { posts,  error, userId, setUserId };
};
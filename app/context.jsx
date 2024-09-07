import { createContext } from "../myReact";

export const PostContext = createContext({
    posts: [],
    userId: 1,
    setUserId: () => {},
  });
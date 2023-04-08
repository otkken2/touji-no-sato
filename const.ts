export const API_URL = (() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "staging") {
      return "https://toujinosato.herokuapp.com";
    } else if (process.env.NODE_ENV === "production") {
      return "https://toujinosato.com";
    } else if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      return "http://localhost:1337";
    } else {
      throw new Error("Unknown NODE_ENV");
    }
  })();
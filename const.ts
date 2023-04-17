export const API_URL = (() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "staging") {
      return "https://toujinosato.herokuapp.com";
        // return 'https://toujinosato-dev.s3.us-west-1.amazonaws.com'
    } else if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      return "https://toujinosato.com";
    } else if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      return "http://localhost:1337";
    } else {
      throw new Error("Unknown NODE_ENV");
    }
  })();

  export const MEDIA_BASE_URL = (() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "staging") {
      return "https://toujinosato-dev.s3.us-west-1.amazonaws.com";
    } else if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
      // 本番環境用のS3エンドポイントを設定
    } else if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      // 開発環境用のS3エンドポイントを設定
      return "http://localhost:1337";
    } else {
      throw new Error("Unknown NODE_ENV");
    }
  })();
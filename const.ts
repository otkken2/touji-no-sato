export const IS_STAGING_ENV     = process.env.NEXT_PUBLIC_NODE_ENV === "staging";
export const IS_PRODUCTION_ENV  = process.env.NEXT_PUBLIC_NODE_ENV === "production";
export const IS_DEVELOPMENT_ENV = process.env.NEXT_PUBLIC_NODE_ENV === "development";

export const API_URL = (() => {
    if (IS_STAGING_ENV) {
      return "https://toujinosato.herokuapp.com";
        // return 'https://toujinosato-dev.s3.us-west-1.amazonaws.com'
    } else if (IS_PRODUCTION_ENV) {
      return "https://toujinosato.com";
    } else if (IS_DEVELOPMENT_ENV) {
      return "http://localhost:1337";
    } else {
      throw new Error("Unknown NODE_ENV");
    }
})();

export const MEDIA_BASE_URL = (() => {
  if (IS_STAGING_ENV) {
    return "https://toujinosato-dev.s3.us-west-1.amazonaws.com";
  } else if (IS_PRODUCTION_ENV) {
    // 本番環境用のS3エンドポイントを設定
  } else if (IS_DEVELOPMENT_ENV) {
    // 開発環境用のS3エンドポイントを設定
    return "http://localhost:1337";
  } else {
    throw new Error("Unknown NODE_ENV");
  }
})();

export const FRONT_END_URL = (()=>{
  if(IS_DEVELOPMENT_ENV){
    return 'http://localhost:3000'
  }else if (IS_STAGING_ENV){
    return 'https://touji-no-sato-git-develop-otkken2.vercel.app'
  }else if (IS_PRODUCTION_ENV){
    // TODO 本番環境用のFRONT_END_URLを用意
  }
})();

export const TIME_LIMIT_FOR_MOVIE = 600000;
export const TIME_LIMIT_OF_INFO_BALLOON = 3000;


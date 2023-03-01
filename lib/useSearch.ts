import axios from "axios";
import { API_URL } from "const";

const useSearch = () => {
  const search = async(searchWord: string) => {
    const searchResultsOfPosts = await axios.get(
      `${API_URL}/api/posts?populate=*
      &filters[$or][0][description][$contains]=${searchWord}&filters[$or][1][ryokan][$contains]=${searchWord}
      `
    ).then(res => res.data);

    console.log(searchResultsOfPosts);
  };
  return {search}
};

export default useSearch;

import { PostData } from "@/Interface/interfaces";
import axios from "axios";
import { API_URL } from "const";
import { useState } from "react";

const useSearch = () => {
  const [ searchResults, setSearchResults ] = useState<PostData[]>([]);
  const search = async(searchWord: string) => {
    const searchResultsOfPosts = await axios.get(
      `${API_URL}/api/posts?populate=*&filters[$or][0][description][$contains]=${searchWord}&filters[$or][1][ryokan][$contains]=${searchWord}
      `
    ).then(res => res.data.data);

    setSearchResults(searchResultsOfPosts);
  };
  return {search,searchResults}
};

export default useSearch;

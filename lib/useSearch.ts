import axios from "axios";
import { API_URL } from "const";
// &filters[$or][0][ryokan][$contains]=${searchWord}
// &filters[$or][1][description][$contains]=${searchWord}`

const useSearch = () => {
  const search = async(searchWord: string) => {
    const searchResult = await axios.get(
      `${API_URL}/api/posts?populate=*
        &filters[$or][0][ryokan][$contains]=${searchWord}`
    ).then(res => res.data);

    console.log(searchResult);
  };
  return {search}
};

export default useSearch;

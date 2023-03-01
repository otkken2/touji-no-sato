import { Post } from "@/components/Post/Post";
import { Button, TextField } from "@mui/material";
import useSearch from "lib/useSearch";
import { useState } from "react";
const Search = ()=>{
  const [searchWord, setSearchWord] = useState('')
  const {search, searchResults} = useSearch();
  const handleSubmit = (e:any) => {
    // alert(searchWord);
    e.preventDefault();
    search(searchWord);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <TextField variant="filled" label='検索ワードを入力してください' onChange={(e)=> setSearchWord(e.target.value)}/>
          <Button variant="contained" type="submit">検索</Button>
        </div>
      </form>
      {searchResults.length > 0 &&
        searchResults.map((searchResult,index)=>{
          return (
            <Post key={index} post={searchResult} index={index}/>
          );
        })
      }
    </>
  );
};

export default Search;

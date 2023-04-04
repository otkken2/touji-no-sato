import { Post } from "@/components/Post/Post";
import { Button, TextField } from "@mui/material";
import useSearch from "lib/useSearch";
import Head from "next/head";
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
      <Head>
        <title>湯治の郷 検索</title>
      </Head>
      <div className="max-w-[600px] mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col w-[95%] mx-auto my-5 relative">
            {/* <TextField variant="filled" label='検索ワードを入力してください' onChange={(e)=> setSearchWord(e.target.value)}/> */}
            <input type='text' className='bg-background-secondary text-white h-[56px] mb-5 rounded-full pl-5' placeholder='検索ワードを入力してください' onChange={(e)=> setSearchWord(e.target.value)}/>
            <button className='rounded-full bg-primary text-white h-10 hidden' type="submit">検索</button>
            <img src="/search.svg" alt="" className="w-8 absolute right-4 top-3 opacity-50"/>
          </div>
        </form>
        {searchResults.length > 0 &&
          searchResults.map((searchResult,index)=>{
            return (
              <Post key={index} post={searchResult} index={index}/>
              );
            })
          }
      </div>
    </>
  );
};

export default Search;

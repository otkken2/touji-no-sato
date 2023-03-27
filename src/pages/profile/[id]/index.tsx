/* eslint-disable @next/next/no-img-element */
import { userAtom } from "@/atoms/atoms";
import { TextField } from "@mui/material";
import axios from "axios";
import { API_URL } from "const";
import { useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import router from "next/router";
import { Post } from "@/components/Post/Post";
import { PostData } from "@/Interface/interfaces";
import MyOnsenCollection from "./MyOnsenCollection";
import Cookies from "js-cookie";
import { useAuth } from "lib/useAuth";

type ShowMode = "ALL_MY_POSTS" | "ONSEN_COLLECTION";

export const Profile = () => {
  const token = Cookies.get('token');
  const user = useAtomValue(userAtom);
  const {fetchUser} = useAuth();
  const {id} = router.query;
  const [data, setData] = useState<PostData[]>([]);
  const [showMode, setShowMode] = useState<ShowMode>('ONSEN_COLLECTION');
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [selfIntroduction, setSelfIntroduction] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string>('');
  const [profileIcon, setProfileIcon] = useState<File[] | null>(null);
  const [userIconUrl, setUserIconUrl] = useState<string>('');

  const uploadProfileIcon = async (profileIcon: File[]) => {
    const formData = new FormData();
    formData.append('files',profileIcon[0], profileIcon[0].name);
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const uploadedFile = await response.json();
    return uploadedFile;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    let profileIconUrl = null;
    if(profileIcon){
      const uploadedFile = await uploadProfileIcon(profileIcon);
      if(uploadedFile){
        profileIconUrl = uploadedFile[0].url;
      }
    }

    const data = {
      username: username,
      selfIntroduction: selfIntroduction,
      profileIcon: profileIconUrl,
    };
    await fetch(`${API_URL}/api/users-permissions/users/me`,{
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => {
      if(res.status !== 200)return;
      if(!id)return;
      fetchUser(Number(id));
      setIsEditProfile(false);
    });
  }

  const onFileInputChange = (e :ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files");
    console.log(e.target.files);
    if(!e.target.files)return;
    setProfileIcon(Array.from(e.target.files));
    const iconUrl = URL.createObjectURL(e.target.files[0]);
    setIconPreviewUrl(iconUrl);
  };

  useEffect(()=>{
    const fetchUserInfo = async () => {
      return await axios.get(`${API_URL}/api/users?populate=*&filters[id][$eq]=${id}`)
        .then(res => {
          console.log('fetchUserInfo↓');
          console.log(res.data);
          setUserIconUrl(res.data[0]?.profileIcon);
          setUsername(res.data[0]?.username);
          setSelfIntroduction(res.data[0]?.selfIntroduction);
        });
    };
    fetchUserInfo();
  },[id,user]);

  useEffect(()=>{
    const fetchMyPosts = async () => {
      if(!router.isReady)return;
      return await axios.get(`${API_URL}/api/posts?populate[user][populate]=*&populate=Image&filters[user][id][$eq]=${id}&sort=createdAt%3Adesc`)
        .then(res =>{
          console.log('myPosts↓');
          console.log(res.data.data);
          setData(res.data.data);
        });
    }
    fetchMyPosts();
  },[id,user]);

  useEffect(()=>{
    if(!user?.username)return;
    if(!user?.selfIntroduction)return;
    setUsername(user?.username);
    setSelfIntroduction(user?.selfIntroduction);
  },[user,user?.username, user?.selfIntroduction,id, router.isReady]);

  return (
    <main className='text-white'>
      <h1 className="text-center">マイページ</h1>
      <div className='flex justify-around border-b border-solid border-primary'>
        <div
          className={`${ showMode === 'ONSEN_COLLECTION' && 'border-b-4 border-solid border-primary'} w-1/2 text-center cursor-pointer`}
          onClick={()=>setShowMode('ONSEN_COLLECTION')}
        >
          温泉コレクション
        </div>
        <div
          className={`${ showMode === 'ALL_MY_POSTS' && 'border-b-4 border-solid border-primary'} w-1/2 text-center cursor-pointer`}
          onClick={()=> setShowMode('ALL_MY_POSTS')}
        >
          投稿一覧
        </div>
      </div>
      <div>
        {
          showMode === 'ALL_MY_POSTS' ?
          <div className='pt-2'>
            {isEditProfile ?
              <>
              {/* 編集モードON */}
                <form onSubmit={handleSubmit}>
                  <div className='flex flex-col mx-[16px] mb-8'>
                    <div className='flex justify-between h-[27px] mb-5'>
                      <p className='mb-3 cursor-pointer' onClick={()=> setIsEditProfile(false)}>キャンセル</p>
                      <button type="submit" className='border border-white rounded-full px-3 h-full cursor-pointer'>保存</button>
                    </div>
                      <label className=' mb-5'>
                        <input type="file" id="file" className='hidden' onChange={onFileInputChange}/>
                          {iconPreviewUrl
                            ?
                            <div className='w-[50px] h-[50px] rounded-full bg-red-300 overflow-hidden'>
                              <img src={iconPreviewUrl} alt="" className="h-full w-full"/>
                            </div>
                            :
                            <img src='/mypage.svg' alt="" />
                          }
                      </label>
                    <TextField
                      label='ユーザー名'
                      id="username"
                      placeholder='例)温泉太郎'
                      inputProps={{
                        style: {
                          color: 'white',
                        }
                      }}
                      InputLabelProps={{
                        style: {
                          color: 'white'
                        }
                      }}
                      className="bg-background-secondary text-white w-full rounded-lg "
                      onChange={e => setUsername(e.target.value)}
                      value={username}
                    />
                    <TextField
                      multiline
                      id="selfIntroduction"
                      label='自己紹介'
                      rows={4}
                      inputProps={{
                        style: {
                          color: 'white'
                        }
                      }}
                      InputLabelProps={{
                        style: {
                          color: 'white'
                        }
                      }}
                      placeholder='例)鄙びた公共浴場が好きな40代です！好きな温泉地は○○○○○です!'
                      className="bg-background-secondary text-white w-full rounded-lg mb-8"
                      onChange={(e)=> setSelfIntroduction(e.target.value)}
                      value={selfIntroduction}
                    />
                  </div>
                </form>
              </>
              :
              // 編集モードOFF
              <div className='profile-container mx-[16px] mb-5'>
                <div className='profile-header flex items-center mb-5 justify-between'>
                  <div className='header-icon-username flex items-center'>
                    <img src={userIconUrl ? `${API_URL}${userIconUrl}` : '/mypage.svg'} alt="" className="rounded-full w-10 h-10 mr-2"/>
                    <p className='font-bold text-md whitespace-nowrap overflow-hidden'>{username}</p>
                  </div>
                  <div className='flex justify-between'>
                    {/* <div className="profile-posts-length">
                      <span className='font-bold'>{data.length}</span>投稿
                    </div> */}
                    {Number(id) === user?.id &&
                      <p className='border border-white rounded-full px-3' onClick={() => setIsEditProfile(true)}>編集</p>
                    }
                  </div>
                </div>
                <div className='profile-text '>
                  {selfIntroduction ?
                    selfIntroduction
                    :
                    'まだ自己紹介文が作成されていません。'
                  }
                </div>
              </div>
            }
            <hr className="mb-5 opacity-50"/>
            {/* 投稿一覧 */}
            {data?.map((eachdata: PostData,index)=>{
              return (
                <Post key={index} post={eachdata} postId={String(eachdata.id)}/>
              )
            })}
          </div>
          :
          <MyOnsenCollection/>
        }
      </div>
    </main>
  );
}

export default Profile;

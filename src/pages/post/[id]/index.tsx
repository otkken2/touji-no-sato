/* eslint-disable @next/next/no-img-element */
import axios, { AxiosResponse } from "axios";
import { API_URL } from "const";
import { ImageAttributes, PostData, Post as PostInterface} from "@/Interface/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { descriptionAtom, filesAtom, infoBalloonAtom, isErrorAtom, previewsAtom, showReplyFormAtom, userAtom } from "@/atoms/atoms";
import Cookies from "js-cookie";
import { Post } from "@/components/Post/Post";
import { Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { FileInput } from "@/components/Post/FileInput";
import { SetStateAction } from "jotai/vanilla";
import Header from "@/components/Header/Header";
import { usePosts } from "lib/usePosts";

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<PostData>();
  const setFiles = useSetAtom(filesAtom);
  const token = Cookies.get('token');
  const [replies, setReplies] = useState<PostData[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  // const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyFiles, setReplyFiles] = useAtom(filesAtom);
  const user = useAtomValue(userAtom);
  const [hasPostedReply, setHasPostedReply] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previews, setPreviews] = useAtom(previewsAtom);
  const [showReplyForm, setShowReplyForm] = useAtom(showReplyFormAtom);
  const {uploadMediaFile} = usePosts();
  const setBalloonText = useSetAtom(infoBalloonAtom);
  const setIsError = useSetAtom(isErrorAtom);

  useEffect(()=>{
    const getPostDetail = async() => {
      if(!router.isReady)return;
      return await axios.get(`${API_URL}/api/posts/${id}?populate=*`).then(
        (res): void => {
          setData(res.data.data);
        }
      ).catch(error=> {
        if(error.response.status === 404)router.push('/')
      })
    };
    getPostDetail();
  },[id,router]);

  useEffect(()=>{
    if(!router.isReady)return;
    const getReplies = async() => {
      const res = await axios.get(`${API_URL}/api/posts?populate=*&filters[parentPostId][$eq]=${id}`);
      console.log('ReplyData[]');
      console.log(res.data?.data);
      if(res.data === undefined)return;
      setReplies(res.data.data);
    };
    getReplies()
  },[id, router, hasPostedReply, previews]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
  
    let flattenedUploadedFiles: ImageAttributes[] = [];
  
    if (replyFiles) {
      console.log("画像ファイルあるよ");
      const uploadedFilesPromises = replyFiles.map((file) => uploadMediaFile(file));
      const allUploadedFiles: ImageAttributes[][] = await Promise.all(uploadedFilesPromises);
      flattenedUploadedFiles = allUploadedFiles.flat();
    }
  
    const textData = {
      // ryokan: selectedPlace,
      description: replyText,
      user: user?.id,
      parentPostId: id,
      // lat: lat,
      // lng: lng,
      // bathingDay: bathingDay,
    };
    formData.append("data", JSON.stringify(textData));
    await fetch(`${API_URL}/api/posts`, {
      method: "post",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      const post: PostInterface = await res.json();
      if (!post) return;
      const postId = post.data?.id;
      if (!flattenedUploadedFiles) return;
      console.log("flattenedUploadedFilesあるよ");
      console.log("flattenedUploadedFiles↓");
      console.log(flattenedUploadedFiles);
      for (const eachFile of flattenedUploadedFiles) {
        const data = {
          postId: postId,
          mediaAssetId: eachFile.id,
          url: eachFile.url,
        };
        console.log("media-urls-of-postsエンドポイントに渡すdata↓");
        console.log(data);
        await axios
          .post(
            `${API_URL}/api/media-urls-of-posts`,
            {
              data: data,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("mediaUrlsOfPostsの投稿に成功しました")
            setHasPostedReply(true);
            setIsUploading(false);
            setPreviews([]);
            setReplyText('');
            setShowReplyForm(false);
          })
          .catch((err) => console.log(err));
      }
      setBalloonText("リプライの投稿に成功しました。");
      // setUploadedFiles([]);
      setFiles([]);
      // router.push("/");
    }).catch(err => {
      setIsError(true);
      setBalloonText('リプライの投稿に失敗しました。')
    });
  };

  return (
    <div className='max-w-[600px] mx-auto relative' >
      <Header/>
      {
        router.isReady &&
        <div className="">
          <Post post={data} isDetailPage={true} postId={String(id)} replyCount={replies.length}/>
        </div>
      }
      {/* リプライ作成フォーム */}
      {showReplyForm && 
      <div className="fixed bg-background border-t border-x max-w-[600px] rounded-t-lg w-[100%] pt-8 bottom-[50px] md:bottom-[60px] h-[40vh] overflow-scroll z-10">
        <form onSubmit={handleSubmit} className='w-[90%] flex flex-col mx-auto text-white '>
          <div className="mb-5">
            <TextField
              required
              multiline
              placeholder="返信を入力"
              name='text'
              variant="filled"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              inputProps={{
                style: {
                  color: 'white'
                }
              }}
              className="bg-background-secondary text-white w-full rounded-lg "
              InputLabelProps={{
                style: {
                  color: 'white'
                }
              }}
            />
          </div>
          <div className="mx-auto w-full">
            <FileInput onFileInputChange={(e)=> setReplyFiles(e as SetStateAction<File[]>)}/>
          </div>
          <button type="submit" className="bg-primary h-10 w-full mx-auto rounded-lg mb-5">返信</button>
        </form>
        <div className="text-white text-center mx-auto flex justify-center h-7 bg-background-secondary w-[100px] rounded-full" onClick={()=> setShowReplyForm(false)}>
          <img src="/arrow_bottom.png" alt="" className='w-5'/>
        </div>
      </div>
      }
      {isUploading && <p className="text-white font-bold">アップロード中です。しばらくお待ちください。。。</p>}
      {/* リプライ一覧 */}
      <div className={`mb-20 text-white mt-5 ${showReplyForm ? 'mb-[47vh]' : ''}`}>
        {replies.length > 0 &&
          replies.map(eachReply => {
            if(eachReply.attributes?.user?.data?.attributes?.username &&
               eachReply.attributes?.createdAt &&
               eachReply.attributes?.description
            ){
              return (
                <Post post={eachReply} key={eachReply.id} isReply={true}/>
              );
            }
          })
        }
      </div>
    </div>
  );
};

export default ShowPostDetail;

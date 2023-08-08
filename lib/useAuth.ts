import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { API_URL } from "const";
import { useAtom, useSetAtom } from "jotai";
import { infoBalloonAtom, isErrorAtom, userAtom } from "@/atoms/atoms";

export const useAuth = () => {
  const setBalloonText = useSetAtom(infoBalloonAtom);
  const setIsError = useSetAtom(isErrorAtom);
  const [user,setUser] = useAtom(userAtom);
  const  router  = useRouter();

  const fetchUser = async(userId :number) => {
    const res = await axios.get(`${API_URL}/api/users/${userId}?populate=*`)
    setUser(res.data)
  }

  const login = async (identifier: string, password: string) => {
    if(!identifier){
      setBalloonText('Eメールを入力してください');
      setIsError(true);
      return;
    }
    if(!password){
      setBalloonText('パスワードを入力してください');
      setIsError(true);
      return;
    }
    return await axios.
      post(`${API_URL}/api/auth/local`,{
        identifier,
        password,
      }).then(res => {
        Cookies.set('token', res.data.jwt, {expires: 60});
        fetchUser(res.data.user.id);
        router.push('/');
        setBalloonText('ログインに成功しました');
      }).catch(err => {
        setBalloonText('Eメールかパスワードが間違っています');
        setIsError(true);
      });
  }

  const registUser = async (username: string, email: string, password: string) => {
    if(!username){
      setBalloonText('ユーザー名を入力してください');
      setIsError(true);
      return;
    }
    if(username.length < 3){
      setBalloonText('ユーザー名は3文字以上にしてください');
      setIsError(true);
      return;
    }
    if(!email){
      setBalloonText('Eメールを入力してください');
      setIsError(true);
      return;
    }
    if(email.length < 6){
      setBalloonText('Eメールは6文字以上にしてください');
      setIsError(true);
      return;
    }
    if(!password){
      setBalloonText('パスワードを入力してください');
      setIsError(true);
      return;
    }
    if(password.length < 6){
      setBalloonText('パスワードは6文字以上にしてください');
      setIsError(true);
      return;
    }
    await axios.
      post(`${API_URL}/api/auth/local/register`,{
        username,
        email,
        password,
      }).then(res => {
        Cookies.set('token', res.data.jwt, {expires: 60});
        setUser(res.data.user)
        router.push('/');
        setBalloonText('会員登録に成功しました！')
      }).catch(err => {
        setBalloonText('会員登録に失敗しました');
        setIsError(true);
      });
  }
  const logout = () => {
    Cookies.remove('token')
    setUser(undefined)
    router.push('/')
    setBalloonText('ログアウトしました');
  }
  return {login, registUser, logout, fetchUser};
}

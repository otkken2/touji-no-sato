import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { API_URL } from "const";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atoms/atoms";

export const useAuth = () => {
  const setUser = useSetAtom(userAtom);
  const  router  = useRouter();

  const fetchUser = async(userId :number) => {
    // const res = await axios.get(`${API_URL}/api/users/${userId}?populate[posts][populate]=*`)
    const res = await axios.get(`${API_URL}/api/users/${userId}?populate=*`)
    // const res = await axios.get(`${API_URL}/api/users/${userId}&populate=*&populate[posts][populate]=*`)
    // const res = await axios.get(`${API_URL}/api/users?populate=*&filters[id][$eq]=${userId}`)
    console.log(res.data)
    setUser(res.data)
  }

  const login = async (identifier: string, password: string) => {
    return await axios.
      post(`${API_URL}/api/auth/local`,{
        identifier,
        password,
      }).then(res => {
        Cookies.set('token', res.data.jwt, {expires: 60});
        // console.log(res.data.user)
        // setUser(res.data.user)
        fetchUser(res.data.user.id)
        router.push('/')
      }).catch(err => {
        console.log('失敗？')
        console.log(err);
      });
  }

  const registUser = async (username: string, email: string, password: string) => {
    await axios.
      post(`${API_URL}/api/auth/local/register`,{
        username,
        email,
        password,
      }).then(res => {
        Cookies.set('token', res.data.jwt, {expires: 60});
        setUser(res.data.user)
        router.push('/');
      }).catch(err => {
        console.log('会員登録に失敗しました')
        console.log(err);
      });
  }
  const logout = () => {
    alert('ログアウトしますか？')
    Cookies.remove('token')
    setUser(undefined)
    router.push('/')
  }
  return {login, registUser, logout, fetchUser};
}

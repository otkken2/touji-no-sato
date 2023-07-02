import { infoBalloonAtom, isErrorAtom, userAtom } from "@/atoms/atoms";
import { TextField } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ResetPasswordInterface{
  password: string,
  confirm: string,
}

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const setBalloonText = useSetAtom(infoBalloonAtom);
  const setIsError = useSetAtom(isErrorAtom);
  const user = useAtomValue(userAtom);
  const { register, handleSubmit, watch, formState: { errors }, control} = useForm<ResetPasswordInterface>({
    defaultValues: {
      password: '',
      confirm: '',
    }
  });
  const handleResetPassword = () => {
    setBalloonText('パスワードがリセットされました!');
  };
  const router = useRouter();
  const onSubmit = async (e:any) => {
    e.preventDefault();
    if(password !== confirm){
      setBalloonText('新しいパスワードと確認用の値が一致しません');
      setIsError(true);
      return;
    }
    handleResetPassword();
    router.push('/Login')
  };

  if(user)router.push('/')
  return (
    <div className=" h-[100vh] flex items-center">
      <div className="h-[50vh] w-[100vw]">
        <h1 className='mb-5 flex justify-center text-white'>
          <img src="logo.svg" alt="" />
        </h1>
        <h2 className="text-white text-center mb-3">パスワード再設定</h2>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col w-11/12 max-w-[500px] m-auto">
            <div className="mb-5">
              <TextField
                type="password"
                variant="filled"
                label="新しいパスワード"
                value={password}
                onChange={(e)=> {
                  setPassword(e.target.value)
                }}
                InputLabelProps={{
                  style: {
                    color: 'white'
                  }
                }}
                inputProps={{
                  style: {
                    color: 'white',
                  }
                }}
                className='mb-10 bg-background-secondary w-full rounded-lg'
              />
            </div>
            <div className="mb-5">
              <TextField
                type="password"
                variant="filled"
                label="新しいパスワード(確認用)"
                value={confirm}
                onChange={(e)=> {
                  setConfirm(e.target.value)
                }}
                InputLabelProps={{
                  style: {
                    color: 'white'
                  }
                }}
                inputProps={{
                  style: {
                    color: 'white',
                  }
                }}
                className='mb-10 bg-background-secondary w-full rounded-lg'
              />
            </div>
            <button className='bg-primary rounded-md h-[56px] text-white' type="submit">パスワード再設定</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword
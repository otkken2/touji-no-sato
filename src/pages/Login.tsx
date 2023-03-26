import { userAtom } from "@/atoms/atoms";
import { Button, Input, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { isIdentifier } from "typescript";
import { useAuth } from '../../lib/useAuth';

interface LoginInfoInterface{
  identifier: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors }, control} = useForm<LoginInfoInterface>({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  const onSubmit = async (e:any) => {
    e.preventDefault();
    await login(email,password);
  };

  if(user)router.push('/')
  return (
    !user &&
    <div className=" h-[100vh] flex items-center">
      <div className="h-[50vh] w-[100vw]">
        <h1 className='mb-5 flex justify-center text-white'>
          <img src="logo.svg" alt="" />
        </h1>
        <h2 className="text-white text-center mb-3">ログイン</h2>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col w-11/12 max-w-[500px] m-auto">
            <div className="mb-5">
              <TextField
                // type="email"
                variant="filled"
                label="Eメール"
                value={email}
                onChange={(e)=> {
                  setEmail(e.target.value)
                  console.log(e.target.value)
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
                label="パスワード"
                value={password}
                onChange={(e)=> {
                  setPassword(e.target.value)
                  console.log(e.target.value)
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
            <button className='bg-primary rounded-md h-[56px] text-white' type="submit">ログインする</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

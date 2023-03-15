import { Button, Input, TextField } from "@mui/material";
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
  const { register, handleSubmit, watch, formState: { errors }, control} = useForm<LoginInfoInterface>({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  const onSubmit: SubmitHandler<LoginInfoInterface> = async (data) => {
    await login(data.identifier,data.password)
  };

  return (
    <>
      <h1 className='mb-10 text-2xl text-center mt-10 text-white'>ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-11/12 m-auto">
          <Controller
            name="identifier"
            control={control}
            render={( {field} ) =>
              <TextField
                type="email"
                variant="filled"
                label="Eメール"
                className='mb-10 bg-white rounded-lg'
                {...field}
              />
            }
          />
          <Controller
            name="password"
            control={control}
            render={( {field} ) =>
              <TextField
                type="password"
                variant="filled"
                label="パスワード"
                className='mb-10 bg-white rounded-lg'
                {...field}
              />
            }
          />
          <Button className='bg-sky-400 rounded-lg' variant="contained" type="submit">ログインする</Button>
        </div>
      </form>
    </>
  );
}

export default Login;

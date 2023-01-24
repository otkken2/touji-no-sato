import { Button, Input, TextField } from "@mui/material";
import { AppContext } from "context/AppContext";
import { useContext, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from '../../lib/useAuth';

interface SignupInfoInterface{
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const { registUser } = useAuth()
  const { register, handleSubmit, watch, formState: { errors }, control} = useForm<SignupInfoInterface>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });
  const onSubmit: SubmitHandler<SignupInfoInterface> = async (data) => {
     await registUser(data.username,data.email,data.password)
  };

  return (
    <>
      <h1 className='mb-10 text-2xl text-center mt-10 text-white'>新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-11/12 m-auto">
          <Controller 
            name="username"
            control={control}
            render={( {field} ) =>
              <TextField
                className='mb-10 bg-white rounded-lg'
                type="text"
                variant="filled"
                label="ユーザー名"
                {...field}
              />
            }
          />
          <Controller 
            name="email"
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
          <Button className='bg-sky-400 rounded-lg' variant="contained" type="submit">会員登録する</Button>
        </div>
      </form>
    </>
  );
}

export default Register;
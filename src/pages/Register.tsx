import { userAtom } from "@/atoms/atoms";
import { Button, Input, TextField } from "@mui/material";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAuth } from '../../lib/useAuth';

interface SignupInfoInterface{
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const user = useAtomValue(userAtom);
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

  if(user)router.push('/');
  return (
    !user &&
    <div className="flex items-center h-[100vh]">
      <div className="h-[50vh] w-[100vw] my-auto">
        <h1 className='mb-5 flex justify-center text-white'>
          <img src="logo.svg" alt="" />
        </h1>
        <h2 className="text-white text-center mb-3">新規登録</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-11/12 m-auto max-w-[500px]">
            <div className="mb-5">
              <Controller
                name="username"
                control={control}
                render={( {field} ) =>
                  <TextField
                    className='mb-10 bg-background-secondary w-full rounded-lg'
                    type="text"
                    variant="filled"
                    label="ユーザー名"
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
                    {...field}
                  />
                }
              />
            </div>
            <div className="mb-5">
              <Controller 
                name="email"
                control={control}
                render={( {field} ) =>
                  <TextField
                    type="email"
                    variant="filled"
                    label="Eメール"
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
                    className='mb-10 w-full bg-background-secondary rounded-lg'
                    {...field}
                  />
                }
              />
            </div>
            <div className="mb-5">
              <Controller 
                name="password"
                control={control}
                render={( {field} ) =>
                  <TextField
                    type="password"
                    variant="filled"
                    label="パスワード"
                    className='mb-10 w-full bg-background-secondary rounded-lg'
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
                    {...field}
                  />
                }
              />
            </div>
            <button className='bg-primary rounded-lg h-[56px] text-white' type="submit">会員登録する</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
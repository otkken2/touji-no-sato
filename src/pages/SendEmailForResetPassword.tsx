import { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import { useSetAtom } from 'jotai';
import { infoBalloonAtom, isErrorAtom } from '@/atoms/atoms';
import { API_URL, FRONT_END_URL } from 'const';
import { UserInterface } from '@/Interface/interfaces';

const SendEmailForResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const setBalloonText = useSetAtom(infoBalloonAtom);
  const setIsError = useSetAtom(isErrorAtom);

  const handleInputChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSendSendEmailForResetPasswordLink = async (event: any) => {
    event.preventDefault();
    const userByEmail: UserInterface = await axios.get(`${API_URL}/api/users?filters[email][$eq]=${email}`).then(res => res.data[0]);

    if(!userByEmail){
      setBalloonText('そのメールアドレスは存在しません');
      setIsError(true);
      return;
    }
    const response = await axios.post(`${API_URL}/api/email`, {
        to: email,
        from: 'kaitekinakurashi.goudou@gmail.com',
        subject: '「湯治の郷」パスワード再設定用URL',
        text: `
          ${userByEmail.username} 様
          「湯治の郷」パスワード再設定用URLをお知らせいたします。
          
          下記のURLから、パスワードの再設定手続きをお願いいたします。
          : ${FRONT_END_URL}/ResetPassword`,
      //   text: `Click the following link to reset your password: ${resetPasswordLink}`,
      //   html: `Click the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a>`
    })
    if (response.status === 200) {
      setIsEmailSent(true);
      setBalloonText('パスワード再設定用リンクを送信しました。')
    } else {
      setBalloonText('Failed to send reset password link');
      setIsError(true);
    }
  };

  return (
    <div className='h-screen text-white flex items-center'>
      <div className='h-[50vh] mx-auto w-[100vw]'>
        <h1 className='mb-5 flex justify-center text-white'>
          <img src="logo.svg" alt="" />
        </h1>
        <h2 className="text-white text-center mb-20"></h2>
        {isEmailSent ? (
          <p className='w-11/12 mx-auto leading-8 text-center'>パスワード再設定用のメールを送信しました。<br /> メールに記載のURLを開いて再設定の手続きを行なってください。</p>
        ) : (
          <form onSubmit={handleSendSendEmailForResetPasswordLink} className='flex flex-col w-11/12 max-w-[500px] m-auto'>
            <label className='text-center flex flex-col'>
              <div className='mb-5'>
                <TextField
                    // type="email"
                    variant="filled"
                    label="登録時にご利用のEメールを入力してください"
                    value={email}
                    onChange={(e)=> {
                      setEmail(e.target.value)
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
            </label>
            {/* <button type="submit" className='bg-primary max-w-lg mx-auto px-5 rounded-full '>Send Reset Password Link</button> */}
            <button className='bg-primary rounded-md h-[56px] text-white' type="submit">パスワード再設定メールを送信</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendEmailForResetPassword;

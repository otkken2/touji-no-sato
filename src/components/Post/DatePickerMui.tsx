import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import moment from 'moment';
import { useAtom } from 'jotai';
import { bathingDayAtom } from '@/atoms/atoms';
import dayjs from 'dayjs';
export default function BasicDatePicker() {
  const [bathingDay, setBathingDay] = useAtom(bathingDayAtom)
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  
  const handleChangeDate = (date: any) => {
    const formattedDate = moment(date.$d).format('YYYY-MM-DD');
    setBathingDay(formattedDate);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <div className='flex flex-col w-full'>
            <p className=''>入湯日</p>
            {/* <DatePicker value={bathingDay !== undefined ? dayjs(bathingDay) : undefined} className='text-white w-full' label="Basic date picker" onChange={(e:any) => handleChangeDate(e)}/> */}
            <DatePicker className='text-white w-full' label="Basic date picker" onChange={(e:any) => handleChangeDate(e)}/>
          </div>
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
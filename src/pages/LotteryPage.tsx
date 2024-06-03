import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import '../style/LotteryPage.css';
import { Icon } from '@mui/material';

const LotteryPage = () => {
  const [ UserName, setUserName] = useState('');
  const [ MailAddress, setMailAddress] = useState('');
  const [ PhoneNumber, setPhoneNumber] = useState('');
  const [ Old, setOld] = useState('');
  const [ SchoolName, setSchoolName] = useState('');
  const [ Grade, setGrade] = useState('');

  const handleUserNameChange = ( event ) =>{
    setUserName(event.target.value)
  }

const  handleMailAddressChange= ( event ) =>{
    setMailAddress(event.target.value)
  }

  const  handlePhoneNumberChange= ( event ) =>{
    setPhoneNumber(event.target.value)
  }

  const  handleOldChange= ( event ) =>{
    setOld(event.target.value)
  }

  const  handleSchoolNameChange= ( event ) =>{
    setSchoolName(event.target.value)
  }

  const  handleGradeChange= ( event ) =>{
    setGrade(event.target.value)
  }

  return <div>
  
  <div id='LotteryEntry'>
  抽選応募
  <br/>
  </div>
    
    <div id='UserName'>
      ユーザー名(必須)
      <br/>
    <input value={UserName} onChange={handleUserNameChange} required />
    </div>

    <div id='MailAddress'>
      メールアドレス(必須)
      <br/>
      <input value={MailAddress} onChange={handleMailAddressChange} required />
    </div>

    <div id='PhoneNumber'>
      電話番号(任意)
      <br/>
      <input value={PhoneNumber} onChange={handlePhoneNumberChange} />
    </div>

      <div id='Old'>
      年齢(任意)
      <br/>
      <input value={Old} onChange={handleOldChange} />
    </div>

    <div id='SchoolName'>
      学校名(任意)
      <br/>
      <input value={SchoolName} onChange={handleSchoolNameChange} />
    </div>

    <div id='Grade'>
      学年(任意)
      <br/>
      <input value={Grade} onChange={handleGradeChange} />
    </div>

  <input type='submit' value='応募' id='SubmitButton'/>
  </div>
};

  
export default LotteryPage;
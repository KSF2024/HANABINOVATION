import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { FormControl } from '@mui/material';
import '../style/LotteryPage.css';
import { Icon } from '@mui/material';

const LotteryPage = () => {
  const [ UserName, setUserName] = useState('');
  const [ MailAddress, setMailAddress] = useState('');
  const [ PhoneNumber, setPhoneNumber] = useState('');
  const [ Old, setOld] = useState('');
  const [ SchoolName, setSchoolName] = useState('');
  const [ Grade, setGrade] = useState('');
  const [ Submited, setSubmited] = useState(false);

  function SubmitDialog(){
    return <div id='Submitlog'>応募受付が完了しました。<div/>当選者の呼び出しはユーザー名と受付番号で行われます。</div>
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmited(true);
  };

  return <div>
  <form onSubmit={handleSubmit}>
  <div id='LotteryEntry'>
  抽選応募
  </div>
    
    <div id='UserName'>
      ユーザー名(必須)
      <div/>
    <input value={UserName} size={32} onChange={( event ) =>{
    setUserName(event.target.value)
  }} required />
    </div>

    <div id='MailAddress'>
      メールアドレス(必須)
      <div/>
      <input value={MailAddress} size={32} onChange={ ( event ) =>{
    setMailAddress(event.target.value)
  }} required />;
    </div>

    <div id='PhoneNumber'>
      電話番号(任意)
      <div/>
      <input value={PhoneNumber} size={32} onChange={( event ) =>{
    setPhoneNumber(event.target.value)
  }} />;
    </div>

      <div id='Old'>
      年齢(任意)
      <div/>
      <input value={Old} size={32} onChange={( event ) =>{
    setOld(event.target.value)
  }} />;
    </div>

    <div id='SchoolName'>
      学校名(任意)
      <div/>
      <input value={SchoolName} size={32} onChange={( event ) =>{
    setSchoolName(event.target.value)
  }} />
    </div>

    <div id='Grade'>
      学年(任意)
      <div/>
      <input value={Grade} size={32} onChange={( event ) =>{
    setGrade(event.target.value)
  }} />;
    </div>

  <input type='submit' value='応募' id='SubmitButton' onChange={(event) => {
    event.preventDefault();
    setSubmited(true);
  }}/>
  </form>
  {Submited && <SubmitDialog />};
  </div>
};

export default LotteryPage;
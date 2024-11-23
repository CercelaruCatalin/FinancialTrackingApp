
"use client"
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import LoginImage from '../../public/interface-control-svgrepo-com.svg';
import Image from 'next/image';
import styles from './page.module.css';
import { Dosis } from 'next/font/google';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import router, { useRouter } from 'next/router';
import { NextApiRequest, NextApiResponse } from 'next';


const dosis = Dosis({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});



const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful');
        localStorage.setItem('email', data.email);
        localStorage.setItem('f_name', data.first_name);
        localStorage.setItem('l_name', data.last_name);
        localStorage.setItem('id', data.id);

        console.log('User First Name:', localStorage.getItem('f_name'));
        console.log('User Last Name:', localStorage.getItem('l_name'));
        console.log('User email:', localStorage.getItem('email'));

        location.href='/budget';
      } else {
        alert('Incorect email or password');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  return (
    <div className={`${styles.bgColor} h-screen py-5 overflow-auto`}>
      <div className="container mx-auto w-full">
        <div className="flex flex-col lg:flex-row w-5/6 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div className={` lg:block w-full lg:w-1/2 flex flex-col bg-yellow-500 p-12 bg-no-repeat bg-cover bg-center`}>
            <h1 className="text-black text-3xl font-bold">Welcome to Your New Way of Life</h1>
            <div>
              <p className="text-black text-lg py-5 ml-3 font-semibold">Please enter your credentials</p>
              <Image src={LoginImage} alt="login page image w-auto h-auto" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 py-16 px-12 bg-green-500">
            <form className="flex-col gap-4 py-8 flex justify-center" onSubmit={submitHandler}>
              <div className={`${styles.input_group} bg-yellow-400`}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`${styles.input_text} bg-yellow-400`}
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiAtSymbol size={25} />
                </span>
              </div>

              <div className={`${styles.input_group} bg-yellow-400`}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input_text}
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
                <span className="icon flex items-center px-4">
                  <HiFingerPrint size={25} />
                </span>
              </div>

                <div className="input-button">
                  <button type="submit" className={`${styles.button} bg-yellow-400`}>
                    Login
                  </button>
                </div>
            </form>
            <Link href={'/register/'}>
          <p className="text-sm xl:text-lg flex justify-center">
            Don't have an account yet? <span className="text-yellow-400 hover:text-yellow-500 font-semibold px-1 text-2xl text-bold">Sign up</span>
          </p>
        </Link>
      </div>
    </div>
  </div>
</div>
  );
};

export default Login;
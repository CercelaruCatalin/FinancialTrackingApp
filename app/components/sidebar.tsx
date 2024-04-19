"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FaMoneyBill, } from "react-icons/fa";
import { GiPayMoney, GiTakeMyMoney} from "react-icons/gi";
import {TbPigMoney} from "react-icons/tb";
import {BiSolidCategory, BiSolidDoorOpen} from "react-icons/bi";

interface SideBarIconProps {
  icon: JSX.Element;
  text: string;
}


const Sidebar = () => {

  const logout = () => {
    localStorage.clear();
    console.log('User logged out');
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-20 m-0 flex flex-col bg-green-700 text-white shadow-lg z-50">
      <Link href="/budget/">
          <SideBarIcon icon={<FaMoneyBill size="28" />} text="Budget" />
      </Link>

      <Link href="/incomes/">
          <SideBarIcon icon={<GiTakeMyMoney size="28" />} text="Incomes" />
      </Link>

      <Link href="/expenses/">
          <SideBarIcon icon={<GiPayMoney size="28" />} text="Expenses" />
      </Link>

      <Link href="/savings/">
          <SideBarIcon icon={<TbPigMoney size="28" />} text="Savings" />
      </Link>

      <Link href="/categories/">
          <SideBarIcon icon={<BiSolidCategory size="28" />} text="Categories" />
      </Link>
      <Link href="/login/" onClick={logout}>
          <SideBarIcon icon={<BiSolidDoorOpen size="28" />} text="Logout" />
      </Link>
    </div>
  );
};


const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, text }) => {

  return (
    <div
      className="sidebar-icon  group">
      {icon}

      <div className="sidebar-tooltip group-hover:scale-100">
        {text}
      </div>

    </div>
  );
};

export default Sidebar;

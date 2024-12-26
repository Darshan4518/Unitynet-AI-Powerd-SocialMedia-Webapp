"use client";
import React from "react";
import { usePathname } from "next/navigation";
import NavigationSideBar from "./NavigationSideBar";

const NavigationBar = () => {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login" || pathname === "/signup";

  return <>{hideSidebar ? null : <NavigationSideBar />}</>;
};

export default NavigationBar;

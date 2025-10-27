"use client";
import { createContext, useState, useContext } from "react";

export const NavbarContext = createContext({
  title: "",
  description: "",
  setTitle: () => {},
  setDescription: () => {},
});

export const NavbarProvider = ({ children}) => {
  const [title, setTitle] = useState("Dashboard");
  const [description, setDescription] = useState("Overview of your system");

  return (
    <NavbarContext.Provider value={{ title, setTitle, description, setDescription }}>
      {children}
    </NavbarContext.Provider>
  );
};

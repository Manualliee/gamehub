// src/constants/platformIcons.ts
import React from "react";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaAndroid,
  FaLinux,
} from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";

export const platformIcons: Record<string, React.ReactElement> = {
  pc: React.createElement(FaWindows),
  playstation: React.createElement(FaPlaystation),
  playstation4: React.createElement(FaPlaystation),
  playstation5: React.createElement(FaPlaystation),
  playstation3: React.createElement(FaPlaystation),
  xbox: React.createElement(FaXbox),
  "xbox-one": React.createElement(FaXbox),
  "xbox-series-x": React.createElement(FaXbox),
  xbox360: React.createElement(FaXbox),
  "nintendo-switch": React.createElement(BsNintendoSwitch),
  mac: React.createElement(FaApple),
  android: React.createElement(FaAndroid),
  linux: React.createElement(FaLinux),
  // ...add more if need to
};

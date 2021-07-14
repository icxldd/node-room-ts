/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 17:59:33
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-14 10:38:53
 */
import './states/room-video-state';
import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from "react-router";
import { Test } from './pages/test';
import LiveVideo from './pages/live-video';

function App() {
  return (
    <Routes>
      <Route path={"/live-video/:roomId/:url"} element={<LiveVideo />} />
      <Route path={"/test"} element={<Test />} />
      <Navigate to={"/test"} />
    </Routes>
  );
}

export default App;

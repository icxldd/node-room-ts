/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 18:28:39
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-13 19:52:48
 */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useParams } from 'react-router-dom';
import { WebsocketSignal } from "../utils/websocket-signal";
import Bus from '../utils/event-bus'
import { room_status } from '../utils/room-status'
import { RoomVideo } from "../components/room-video";
import Event from "../utils/event";
export default () => {
  const { roomId, url } = useParams();
  let [_url, setUrlState]
    = useState(url);

  let [_room_status, setRoomStatusState] = useState<room_status>('等待好友');
  let [_WebsocketSignal, setWebsocketSignalState] = useState<WebsocketSignal>();
  useEffect(() => {
    setWebsocketSignalState(new WebsocketSignal(roomId, _url));
    Bus.addListener('changeUrl', (val) => {
      setUrlState(val);
      
    });
    Bus.addListener('changeRoomStatus', (val: room_status) => {
      setRoomStatusState(val);
      
    });
  }, []);

  // useEffect(() => {
  //   setIsCreatedState(_WebsocketSignal.isSelfCreate);
  // }, [_WebsocketSignal.isSelfCreate]);

  return (
    <div>
      <h1>房间状态：{_room_status}</h1>
      <RoomVideo socketSignal={_WebsocketSignal}></RoomVideo>
    </div>
  );
}
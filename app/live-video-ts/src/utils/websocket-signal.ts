/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 18:51:39
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-13 18:45:01
 */

import { randomInt } from 'crypto';
import { Socket, io } from 'socket.io-client';
import { _Response } from '../types/type';
import Event from "./event";
import Bus from '../utils/event-bus'
export class WebsocketSignal {

  roomId: string
  socket: Socket;
  url: string;
  isSelfCreate: boolean = false;
  constructor(_roomId: string, url: string) {
    this.roomId = _roomId;
    this.url = url;
    this.socket = io('wss://localhost:3016');
    this.initSocketEvent();
    this.createOrJoinRoom(this.roomId, this.url);
  }
  initSocketEvent() {
    this.socket.on('disconnect', () => {
      console.log('disconnect');
    });
    this.socket.on(Event.ServerPushEvent.PeerJoin, (data) => {
      if (data.id != this.socket.id) {
        //更新房间状态为已匹配上
        Bus.emit('changeRoomStatus', '好友已进入房间')
      }
      console.log('join', data);
      // this.request(Event.EventRequestConst.ExitRoomRequest, { roomId: this.roomId }).then(x=>{});
    })

    this.socket.on(Event.ServerPushEvent.PeerExit, (data) => {
      console.log('exit', data);
      // this.request(Event.EventRequestConst.ExitRoomRequest, { roomId: this.roomId }).then(x=>{});
    })
  }


  createOrJoinRoom(roomId: string, url: string) {
    this.request(Event.EventRequestConst.ShowRoomPeersRequest, { roomId: roomId }).then(({ data, isError }: _Response) => {
      if (isError) {
        this.isSelfCreate = true;
        this.request(Event.EventRequestConst.CreatedRoomRequest, { roomId: roomId, url: url }).then(({ data, isError }: _Response) => {
          this.request(Event.EventRequestConst.JoinRoomRequest, { roomId: roomId, name: Date().toLocaleString() }).then(({ data, isError }: _Response) => {
            console.log(data);
          }).catch(x => {
            console.log(x);
          });
        });
      } else {
        this.isSelfCreate = false;
        if (data.peers.length >= 2) {
          alert('房间人数已满');
          return;
        }
        this.url = data.url;
        Bus.emit('changeUrl', this.url);
        Bus.emit('changeRoomStatus', '好友已进入房间')
        this.request(Event.EventRequestConst.JoinRoomRequest, { roomId: roomId, name: Date().toLocaleString() }).then(({ data, isError }: _Response) => {
          console.log(data);
        }).catch(x => {
          console.log(x);
        });
      }
      console.log(data);
    });
  }

  request(event: string, data = {}) {
    return new Promise((resolve: (value: _Response) => void, reject) => {
      this.socket.emit(event, data, (data: any) => {
        if (data.status == -1) {
          resolve(<_Response>{ data: data, isError: true });
        } else {
          resolve(<_Response>{ data: data, isError: false });
        }
      })
    })
  }







}
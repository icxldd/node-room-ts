/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 16:07:54
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-13 18:07:57
 */
import { RemoteSocket, Server } from "socket.io";
import { Peer } from "./peer";
import Event from "./event";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export class Room {

  id: string;
  peers: Map<string, Peer>;
  io: Server;
  url: string;
  constructor(_roomId: string, _io: Server, url: string) {
    this.id = _roomId;
    this.io = _io;
    this.url = url;
    this.peers = new Map();
  }


  joinRoom(socketId: string, peer: Peer) {
    this.peers.set(peer.id, peer);
    this.io.in(socketId).socketsJoin(this.id);
  }
  exitRoom(socketId: string) {
    this.peers.delete(socketId);
    this.io.in(socketId).socketsLeave(this.id);
  }


  syncProgress(params: Event.EventParams.In.SynchronousProgressReqeust) {
  }



  broadCast(eventName: string, data: any, currentSocketId: string) {
    this.io.in(this.id).fetchSockets().then((x: RemoteSocket<DefaultEventsMap>[]) => {
      x.filter(x => x.id != currentSocketId).forEach(xx => {
        xx.emit(eventName, data);
      });
    });
  }


  broadAllCast(eventName: string, data: any) {
    this.io.in(this.id).fetchSockets().then((x: RemoteSocket<DefaultEventsMap>[]) => {
      x.forEach(xx => {
        xx.emit(eventName, data);
      });
    });
  }


}

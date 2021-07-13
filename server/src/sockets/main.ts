/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 15:31:40
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-13 18:21:23
 */
import { join } from "path";
import { Server } from "socket.io";
import Event from "./core/event";
import { Room } from "./core/room";
import { Message } from './core/message'
import { Peer } from "./core/peer";
export default class SocketImpl {

  httpsServer: any
  io: Server;
  rooms: Map<string, Room>;
  constructor(_httpsServer: any) {
    this.httpsServer = _httpsServer;
    this.io = new Server(this.httpsServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.initConnect();
    this.rooms = new Map();
  }

  private initConnect() {
    this.io.on("connect", (socket) => {
      let socket_room_id: any;
      console.log(`connect ${socket.id}`);
      //进度同步
      socket.on(Event.EventRequestConst.SynchronousProgressReqeust, ({ time }: Event.EventParams.In.SynchronousProgressReqeust, cb: any) => {
        console.log(`sync progress room ${socket.id}`);
        let roomId = socket_room_id;
        if (!this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间不存在'));
          return;
        }
        let room = this.rooms.get(roomId);
        let userId = socket.id;
        room?.broadCast(Event.EventResponeseConst.SynchronousProgressResponese, { time }, socket.id);
      });



      socket.on(Event.EventRequestConst.StartPlayerReqeust, ({  }: Event.EventParams.In.StartPlayerReqeust, cb: any) => {
        console.log(`sync progress room ${socket.id}`);
        let roomId = socket_room_id;
        if (!this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间不存在'));
          return;
        }
        let room = this.rooms.get(roomId);
        let userId = socket.id;
        room?.broadCast(Event.EventResponeseConst.StartPlayerResponese, {  }, socket.id);
      });
      socket.on(Event.EventRequestConst.CreatedRoomRequest, ({ roomId, url }: Event.EventParams.In.CreatedRoomRequest, cb: any) => {
        console.log(`created room ${socket.id}`);
        if (this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间已存在'));
          return;
        } else {
          this.rooms.set(roomId, new Room(roomId, this.io, url));
          cb(Message.BuilderSucceedMsg('房间创建成功'));
        }
      });

      socket.on(Event.EventRequestConst.ShowRoomPeersRequest, ({ roomId }: Event.EventParams.In.ShowRoomPeersRequest, cb: any) => {
        console.log(`show room ${socket.id}`);
        if (!this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间不存在'));
          return;
        } else {
          let room = <Room>this.rooms.get(roomId);
          cb({ peers: [...room.peers.values()], url: room.url });
        }
      });
      socket.on(Event.EventRequestConst.JoinRoomRequest, ({ roomId, name }: Event.EventParams.In.JoinRoomRequest, cb: any) => {
        console.log(`join room ${socket.id}`);
        if (!this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间不存在'));
          return;
        }
        let room = this.rooms.get(roomId);
        let userId = socket.id;
        if (room?.peers.get(userId)) {
          cb(Message.BuilderErrorMsg('房间已存在'));
          return;
        } else {
          let newPeer = new Peer(userId, name);
          room?.joinRoom(userId, newPeer);
          room?.broadAllCast(Event.ServerPushEvent.PeerJoin, newPeer);
          socket_room_id = roomId;
          cb(Message.BuilderSucceedMsg('加入房间成功'));
        }
      });
      socket.on(Event.EventRequestConst.ExitRoomRequest, ({ roomId }: Event.EventParams.In.ExitRoomRequest, cb: any) => {
        console.log(`exit room ${socket.id}`);
        if (!this.rooms.has(roomId)) {
          cb(Message.BuilderErrorMsg('房间不存在'));
          return;
        }
        let room = this.rooms.get(roomId);
        let userId = socket.id;
        room?.broadCast(Event.ServerPushEvent.PeerExit, room?.peers.get(socket.id), socket.id);
        room?.exitRoom(userId);
        if (room?.peers.size == 0) {
          this.rooms.delete(room.id);
        }
        socket_room_id = null;
        cb(Message.BuilderSucceedMsg('退出房间成功'));
      });
      socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
        // console.log(`exit room ${socket.id}`);
        if (!this.rooms.has(socket_room_id)) {
          return;
        }
        let room = this.rooms.get(socket_room_id);
        let userId = socket.id;
        room?.broadCast(Event.ServerPushEvent.PeerExit, room?.peers.get(socket.id), socket.id);
        room?.exitRoom(userId);
        if (room?.peers.size == 0) {
          this.rooms.delete(room.id);
        }
        socket_room_id = null;
      });
    });
  }
}

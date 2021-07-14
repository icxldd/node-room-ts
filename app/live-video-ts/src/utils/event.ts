/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 15:53:27
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-14 15:07:33
 */
namespace Event {
  export namespace EventParams {
    export namespace In {
      export interface SynchronousProgressReqeust {
        time: number
      }
      export interface StartPlayerReqeust {
        time: number
      }
      export interface StopVideoReqeust{

      }
      export interface JoinRoomRequest {
        roomId: string;
        name: string;
      }

      export interface ExitRoomRequest {
        roomId: string;
      }
      export interface CreatedRoomRequest {
        roomId: string;
        url: string;
      }

      export interface ShowRoomPeersRequest {
        roomId: string;
      }

    }

    export namespace Out {

    }


  }


  export const EventRequestConst = {
    SynchronousProgressReqeust: 'SynchronousProgressReqeust',
    StopVideoReqeust: 'StopVideoReqeust',
    StartPlayerReqeust: 'StartPlayerReqeust',
    CreatedRoomRequest: 'CreatedRoomRequest',
    JoinRoomRequest: 'JoinRoomRequest',
    ExitRoomRequest: 'exitRoomRequest',
    ConnectRequest: 'connectRequest',
    DisconnectRequest: 'disconnectRequest',
    ShowRoomPeersRequest: 'ShowRoomPeersRequest'
  }


  export const EventResponeseConst = {
    SynchronousProgressResponese: 'SynchronousProgressResponese',
    StopVideoResponese: 'StopVideoResponese',
    StartPlayerResponese: 'StartPlayerResponese',
    CreatedRoomResponese: 'CreatedRoomResponese',
    JoinRoomResponese: 'JoinRoomResponese',
    ExitRoomResponese: 'exitRoomResponese',
    ConnectResponese: 'connectResponese',
    DisconnectResponese: 'disconnectResponese',
    ShowRoomPeersResponese: 'ShowRoomPeersResponese'
  }


  //服务器主动推送事件
  export const ServerPushEvent = {
    PeerJoin: 'PeerJoin',//用户加入
    PeerExit: 'PeerExit',//用户退出
  };



}


export default Event




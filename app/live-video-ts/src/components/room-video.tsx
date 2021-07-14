/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-13 17:07:56
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-14 15:47:02
 */
import React, { useEffect, useState } from "react";
import DPlayer from "dplayer";
import { DPlayerEvents } from 'dplayer';
import { WebsocketSignal } from "../utils/websocket-signal";
import Event from "../utils/event";
import Bus from '../utils/event-bus'
import { room_status } from "../utils/room-status";
import { useConcent } from "concent";
import { VideoState } from '../types/type'
import { useDebounce } from 'react-use';
import { useParams } from "react-router";
export interface RoomVideoPorps {
}


const justMp4 = (url: string) => {
  if (url.indexOf('.mp4') != -1) {
    return true;
  } else {
    return false;
  }
}

export const RoomVideo = ({ }: RoomVideoPorps) => {
  // let url = 'https://n1.szjal.cn/20210708/aBI7IbCm/index.m3u8';
  let [roomJoin, setRoomJoin] = useState(false);
  const { state, setState } = useConcent('roomState');


  const { roomId, url } = useParams();



  useEffect(() => {

    setState({ websocket: new WebsocketSignal(roomId, url) });
    let socketSignal = state.websocket as WebsocketSignal;


    setTimeout(() => {
      const dp = new DPlayer({
        container: document.getElementById('video'),
        video: {
          url: url,
          type: 'auto',
        },
        // live: !state.roomCreated
      });
      setState({ player: dp });
      dp.on('canplay' as DPlayerEvents.canplay, () => {

        setState({ videoState: VideoState.canPlayer });

        console.log('canplay ');
      });

      //接收端更新时间
      socketSignal?.socket.on(Event.EventResponeseConst.SynchronousProgressResponese, ({ time }) => {
        dp.video.currentTime = time;


        setTimeout(() => {
          state.websocket.request(Event.EventRequestConst.StartPlayerReqeust, {
            time: state.player.video.currentTime
          }).then((x: any) => { });
        }, 500);

      });

      socketSignal?.socket.on(Event.EventResponeseConst.StartPlayerResponese, ({ time }) => {
        dp.video.currentTime = time;
        dp.play();
      });



      socketSignal?.socket.on(Event.EventResponeseConst.StopVideoResponese, ({ }) => {
        dp.pause();
      });

      Bus.addListener('changeRoomStatus', (val: room_status) => {
        if (val == '好友已进入房间') {
          setRoomJoin(true);
        }
        else if (val == '等待好友') {
          setRoomJoin(false);
        }
      });


      setInterval(() => {
        console.log(state.videoState);
        console.log(state.roomCreated);
      }, 3000);

      dp.on('waiting' as DPlayerEvents.waiting, () => {

        setState({ videoState: VideoState.InBuffer });
        console.log('waiting ');
      });

      dp.on('pause' as DPlayerEvents.pause, () => {
        setState({ videoState: VideoState.canPlayer });


        state.websocket.request(Event.EventRequestConst.StopVideoReqeust, {
        }).then((x: any) => { });
        console.log('pause ');
      });
      dp.on('play' as DPlayerEvents.play, () => {
        setState({ videoState: VideoState.canPlayer });
        if (state.roomCreated) {
          let time = dp.video.currentTime == 0 ? 1 : dp.video.currentTime;
          socketSignal?.request(Event.EventRequestConst.SynchronousProgressReqeust, ({ time: time })).then(x => { });
        }
        console.log('play ');
      });

    }, 1000);


  }, []);

  return (<div id="video"></div>);
}
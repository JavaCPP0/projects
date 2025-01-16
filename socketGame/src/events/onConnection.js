// 클라이언트 연결 이벤트 핸들러
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort); // 연결된 클라이언트 정보 로그

  // 소켓 객체에 buffer 속성을 추가하여 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);
  
  // 데이터, 종료, 오류 이벤트 핸들러 등록
  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
 //onEnd랑 onError의 상태를 어느정도 동기화
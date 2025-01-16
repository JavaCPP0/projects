// 에러를 처리하는 함수
import { createResponse } from '../response/createResponse.js';

export const handleError = (socket, error) => {
  let responseCode;
  let message;

  // 에러 코드가 있는 경우
  if (error.code) {
    responseCode = error.code; // 에러 코드 설정
    message = error.message; // 에러 메시지 설정
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message; // 에러 메시지 설정
    console.error(`일반 에러: ${error.message}`);
  }
  
  // 에러 응답 생성 및 전송
  const errorResponse = createResponse(-1, responseCode, { message }, null);
  socket.write(errorResponse);
};
// 초기 핸들러
import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload; // payload에서 디바이스 ID, 플레이어 ID, 레이턴시 추출

    const session = getGameSession('asd'); // 게임 세션 가져오기

    let user = await findUserByDeviceID(deviceId); // 디바이스 ID로 유저 찾기

    if (!user) {
      user = await createUser(deviceId); // 유저가 없으면 생성
    } else {
      await updateUserLogin(user.id); // 유저가 있으면 로그인 업데이트
    }

    console.log('userId initialHandler!', userId); // 유저 ID 로그
    user = addUser(userId, socket); // 유저 추가
    user.playerId = playerId; // 플레이어 ID 설정
    user.latency = latency; // 레이턴시 설정
    console.log("latency!!", latency); // 레이턴시 로그
    console.log("playerId!!", playerId); // 플레이어 ID 로그
    session.addUser(user); // 게임 세션에 유저 추가

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id }, // 응답 데이터
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse); // 응답 전송
  } catch (error) {
    handleError(socket, error); // 오류 처리
  }
};

export default initialHandler; // 핸들러 내보내기
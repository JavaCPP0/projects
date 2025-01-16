// 게임 생성 핸들러
import { addGameSession } from '../../session/game.session.js';
import { getUserById } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const createGameHandler = ({ socket, userId, payload }) => {
  try {
    const gameId = uuidv4(); // 새로운 게임 ID 생성
    const gameSession = addGameSession(gameId); // 게임 세션 추가

    const user = getUserById(userId); // 유저 정보 가져오기
    console.log("userId createGameHandler!", userId); // 유저 ID 로그
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.'); // 유저가 없을 경우 오류 처리
    }

    gameSession.addUser(user); // 게임 세션에 유저 추가

    // 게임 생성 응답 생성
    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' }, // 응답 데이터
      userId,
    );

    socket.write(createGameResponse); // 응답 전송
  } catch (e) {
    handleError(socket, e); // 오류 처리
  }
};

export default createGameHandler; // 핸들러 내보내기
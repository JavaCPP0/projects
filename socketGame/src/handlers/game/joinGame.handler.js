// 게임 참가 핸들러
import { getAllGameSessions, getGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const joinGameHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload; // payload에서 게임 ID 추출
    const gameSession = getGameSession(gameId); // 게임 세션 가져오기

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.'); // 게임 세션이 없을 경우 오류 처리
    }

    const user = getUserById(userId); // 유저 정보 가져오기
    console.log('userId joinGameHandler!', userId); // 유저 ID 로그

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.'); // 유저가 없을 경우 오류 처리
    }
    const existUser = gameSession.getUser(user.id); // 게임 세션에서 유저 확인
    if (!existUser) {
      gameSession.addUser(user); // 유저 추가
    }

    console.log(getAllGameSessions()); // 모든 게임 세션 로그

    // 게임 참가 응답 생성
    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임에 참가했습니다.' }, // 응답 데이터
      user.id,
    );
    socket.write(joinGameResponse); // 응답 전송
  } catch (error) {
    handleError(socket, error); // 오류 처리
  }
};

export default joinGameHandler; // 핸들러 내보내기
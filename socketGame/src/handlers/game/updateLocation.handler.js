// 위치 업데이트 핸들러
import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId, x, y } = payload; // payload에서 게임 ID와 좌표 추출
    const gameSession = getGameSession(gameId); // 게임 세션 가져오기

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.'); // 게임 세션이 없을 경우 오류 처리
    }

    console.log("userId updateLocationHandler!", userId); // 유저 ID 로그
    const user = gameSession.getUser(userId); // 게임 세션에서 유저 가져오기
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.'); // 유저가 없을 경우 오류 처리
    }
    user.updatePosition(x, y); // 유저 위치 업데이트
    const packet = gameSession.getAllLocation(userId); // 모든 유저 위치 정보 가져오기

    socket.write(packet); // 위치 정보 전송
  } catch (error) {
    handleError(socket, error); // 오류 처리
  }
};

export default updateLocationHandler; // 핸들러 내보내기
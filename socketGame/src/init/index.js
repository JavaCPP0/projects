// 서버 초기화 작업
import { loadProtos } from './loadProtos.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import { addGameSession } from '../session/game.session.js';

const initServer = async () => {
  try {
    await loadProtos(); // Protobuf 파일 로드
    await testAllConnections(pools); // 데이터베이스 연결 테스트
    addGameSession("asd"); // 게임 세션 추가
    // 다음 작업
  } catch (e) {
    console.error(e); // 오류 로그
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer; // 초기화 함수 내보내기
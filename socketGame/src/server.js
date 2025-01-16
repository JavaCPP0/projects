// TCP 서버 초기화 및 실행
import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

// TCP 서버 생성
const server = net.createServer(onConnection);

// 서버 초기화 및 실행
initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address()); // 서버 주소 출력
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
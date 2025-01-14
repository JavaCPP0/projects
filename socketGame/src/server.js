// TCP 서버를 초기화하고 실행하는 파일
import net from 'net'; // net 모듈을 가져옴
import initServer from './init/index.js'; // 서버 초기화 함수 가져오기
import { config } from './config/config.js'; // 설정 객체 가져오기
import { onConnection } from './events/onConnection.js'; // 연결 이벤트 핸들러 가져오기

// 클라이언트 연결을 처리하는 서버 생성
//onConnection 함수는 net.createServer에 의해 자동으로 호출될 때, 
//Node.js의 net 모듈이 소켓 객체를 첫 번째 인자로 전달하기 때문에, 별도로 소켓을 전달할 필요가 없습니다.
//net.createServer는 클라이언트가 연결될 때마다 onConnection 함수를 호출하며, 이때 연결된 소켓을 인자로 넘겨줍니다.
const server = net.createServer(onConnection);

// 서버 초기화 후 실행
initServer()
  .then(() => {
    // 서버를 지정된 포트와 호스트에서 리슨 시작
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address()); // 서버 주소 출력
    });
  })
  .catch((error) => {
    console.error(error); // 오류 발생 시 출력
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
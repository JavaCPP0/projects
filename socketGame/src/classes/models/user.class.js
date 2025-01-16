// 유저 모델 클래스
import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id; // 유저 ID
    this.socket = socket; // 소켓 연결
    this.x = 0; // x 좌표 초기화
    this.y = 0; // y 좌표 초기화
    // this.sequence = 0; // 시퀀스 초기화 (주석 처리됨)
    this.lastUpdateTime = Date.now(); // 마지막 업데이트 시간
  }

  // 위치 업데이트 메서드
  updatePosition(x, y) {
    this.x = x; // x 좌표 업데이트
    this.y = y; // y 좌표 업데이트
    this.lastUpdateTime = Date.now(); // 마지막 업데이트 시간 갱신
  }

  // Ping 메서드
  ping() {
    const now = Date.now(); // 현재 시간
    this.socket.write(createPingPacket(now)); // Ping 패킷 전송
  }

  // Pong 응답 처리 메서드
  handlePong(data) {
    const now = Date.now(); // 현재 시간
    this.latency = (now - data.timestamp) / 2; // 레이턴시 계산
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`); // Pong 수신 로그
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const speed = 1; // 속도 고정
    const distance = speed * timeDiff; // 이동 거리 계산

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance, // 추정된 x 좌표
      y: this.y, // y 좌표
    };
  }
}

export default User; // 유저 클래스 내보내기
// 게임 모델 클래스
import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 2; // 최대 플레이어 수

class Game {
  constructor(id) {
    this.id = id; // 게임 ID
    this.users = []; // 플레이어 목록
    this.intervalManager = new IntervalManager(); // 인터벌 매니저
    this.state = 'waiting'; // 게임 상태 ('waiting', 'inProgress')
  }

  // 플레이어 추가 메서드
  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full'); // 게임 세션이 가득 찼을 경우 오류 처리
    }
    this.users.push(user); // 플레이어 추가

    // 플레이어의 핑 메서드를 인터벌 매니저에 추가
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame(); // 플레이어가 모두 추가되면 게임 시작
      }, 3000);
    }
  }

  // 특정 유저 가져오기
  getUser(userId) {
    return this.users.find((user) => user.id === userId); // 유저 ID로 유저 찾기
  }

  // 특정 유저 제거하기
  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId); // 유저 목록에서 제거
    this.intervalManager.removePlayer(userId); // 인터벌 매니저에서 제거

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting'; // 플레이어 수가 줄어들면 대기 상태로 변경
    }
  }

  // 최대 레이턴시 계산
  getMaxLatency() {
    let maxLatency = 0; // 최대 레이턴시 초기화
    this.users.forEach((user) => {
      console.log(`${user.id}: ${user.latency}`); // 각 유저의 레이턴시 로그
      maxLatency = Math.max(maxLatency, user.latency); // 최대 레이턴시 갱신
    });
    return maxLatency; // 최대 레이턴시 반환
  }

  // 게임 시작 메서드
  startGame() {
    this.state = 'inProgress'; // 게임 상태 변경
    const startPacket = gameStartNotification(this.id, Date.now()); // 게임 시작 알림 패킷 생성
    console.log(`max latency: ${this.getMaxLatency()}`); // 최대 레이턴시 로그

    this.users.forEach((user) => {
      user.socket.write(startPacket); // 모든 유저에게 게임 시작 알림 전송
    });
  }

  // 모든 유저 위치 정보 가져오기
  getAllLocation() {
    const maxLatency = this.getMaxLatency(); // 최대 레이턴시 가져오기

    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency); // 유저 위치 계산
      return { id: user.id, playerId: user.playerId, x, y }; // 위치 정보 반환
    });
    return createLocationPacket(locationData); // 위치 패킷 생성 및 반환
  }
}

export default Game; // 게임 클래스 내보내기
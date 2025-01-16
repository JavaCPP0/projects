// 인터벌 관리 클래스
class IntervalManager {
  constructor() {
    this.intervals = new Map(); // 플레이어 ID와 인터벌 매핑
  }

  // 플레이어 추가 메서드
  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map()); // 새로운 플레이어 ID 추가
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval)); // 인터벌 설정
  }

  // 게임 추가 메서드
  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game'); // 게임 추가
  }

  // 위치 업데이트 인터벌 추가 메서드
  addUpdatePosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, 'updatePosition'); // 위치 업데이트 인터벌 추가
  }

  // 플레이어 제거 메서드
  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId)); // 모든 인터벌 제거
      this.intervals.delete(playerId); // 플레이어 ID 제거
    }
  }

  // 특정 타입의 인터벌 제거 메서드
  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type)); // 인터벌 제거
        userIntervals.delete(type); // 타입 제거
      }
    }
  }

  // 모든 인터벌 제거 메서드
  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId)); // 모든 인터벌 제거
    });
    this.intervals.clear(); // 모든 인터벌 맵 제거
  }
}

export default IntervalManager; // 인터벌 매니저 클래스 내보내기
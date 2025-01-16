// 에러 코드 상수 정의
export const ErrorCodes = {
  CLIENT_VERSION_MISMATCH: 10001, // 클라이언트 버전 불일치
  UNKNOWN_HANDLER_ID: 10002, // 알 수 없는 핸들러 ID
  PACKET_DECODE_ERROR: 10003, // 패킷 디코딩 오류
  PACKET_STRUCTURE_MISMATCH: 10004, // 패킷 구조 불일치
  MISSING_FIELDS: 10005, // 필수 필드 누락
  USER_NOT_FOUND: 10006, // 유저를 찾을 수 없음
  INVALID_PACKET: 10007, // 유효하지 않은 패킷
  INVALID_SEQUENCE: 10008, // 잘못된 시퀀스
  GAME_NOT_FOUND: 10009, // 게임을 찾을 수 없음
  // 추가적인 에러 코드들
};
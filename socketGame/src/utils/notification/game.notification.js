// 게임 관련 알림 패킷 생성 유틸리티
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE, TOTAL_LENGTH } from '../../constants/header.js';

// 패킷 생성 함수
const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(4);
  packetLength.writeUInt32BE(TOTAL_LENGTH + message.length + 1, 0); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(1);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

// 위치 정보 패킷 생성
export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users }; // 사용자 위치 정보
  const message = Location.create(payload); // Protobuf 메시지 생성
  const locationPacket = Location.encode(message).finish(); // 메시지 인코딩
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION); // 패킷 반환
};

// 게임 시작 알림 패킷 생성
export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp }; // 게임 ID와 타임스탬프
  const message = Start.create(payload); // Protobuf 메시지 생성
  const startPacket = Start.encode(message).finish(); // 메시지 인코딩
  return makeNotification(startPacket, PACKET_TYPE.GAME_START); // 패킷 반환
};

// Ping 패킷 생성
export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp }; // 타임스탬프
  const message = ping.create(payload); // Protobuf 메시지 생성
  const pingPacket = ping.encode(message).finish(); // 메시지 인코딩
  return makeNotification(pingPacket, PACKET_TYPE.PING); // 패킷 반환
};
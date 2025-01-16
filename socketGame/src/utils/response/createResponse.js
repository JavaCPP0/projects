// 응답 메시지를 생성하는 유틸리티
import { getProtoMessages } from '../../init/loadProtos.js';
import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
  const protoMessages = getProtoMessages(); // Protobuf 메시지 가져오기
  const Response = protoMessages.response.Response; // 응답 메시지 타입 가져오기

  // 응답 페이로드 생성
  const responsePayload = {
    handlerId, // 핸들러 ID
    responseCode, // 응답 코드
    timestamp: Date.now(), // 타임스탬프
    data: data ? Buffer.from(JSON.stringify(data)) : null, // 데이터 (JSON 문자열로 변환)
    // sequence: userId ? getNextSequence(userId) : 0, // 시퀀스 (주석 처리됨)
  };

  const buffer = Response.encode(responsePayload).finish(); // 응답 메시지 인코딩

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0, // 패킷 길이에 타입 바이트 포함
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0); // 일반 패킷 타입

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]); // 최종 패킷 반환
};
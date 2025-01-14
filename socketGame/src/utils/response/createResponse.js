import { getProtoMessages } from '../../init/loadProtos.js';
import { getNextSequence } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
    // 프로토 메시지를 가져옵니다.
    const protoMessages = getProtoMessages();
    const Response = protoMessages.response.Response;
  
    // 응답 페이로드를 생성합니다.
    const responsePayload = {
      handlerId,
      responseCode,
      timestamp: Date.now(), // 현재 타임스탬프를 추가합니다.
      data: data ? Buffer.from(JSON.stringify(data)) : null, // 데이터가 있을 경우 버퍼로 변환합니다.
      sequence: userId ? getNextSequence(userId) : 0, // 사용자 ID가 있을 경우 시퀀스를 가져옵니다.
    };
  
    // 응답 페이로드를 인코딩하여 버퍼를 생성합니다.
    const buffer = Response.encode(responsePayload).finish();
  
    // 패킷 길이 정보를 포함한 버퍼 생성
    const packetLength = Buffer.alloc(config.packet.totalLength);
    packetLength.writeUInt32BE(buffer.length + config.packet.typeLength, 0); // 패킷 길이에 타입 바이트 포함
  
    // 패킷 타입 정보를 포함한 버퍼 생성
    const packetType = Buffer.alloc(config.packet.typeLength);
    packetType.writeUInt8(PACKET_TYPE.NORMAL, 0); // 패킷 타입을 설정합니다.
  
    // 길이 정보와 메시지를 함께 전송
    return Buffer.concat([packetLength, packetType, buffer]); // 최종 패킷을 반환합니다.
  };
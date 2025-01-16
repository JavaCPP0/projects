// 패킷을 파싱하는 유틸리티
import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages(); // Protobuf 메시지 가져오기

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data); // 패킷 디코딩
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.'); // 디코딩 오류 처리
  }

  const handlerId = packet.handlerId; // 핸들러 ID
  const userId = packet.userId; // 유저 ID
  const clientVersion = packet.version; // 클라이언트 버전

  // 클라이언트 버전 검증
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.'); // 네임스페이스와 타입 이름 분리
  const PayloadType = protoMessages[namespace][typeName]; // Payload 타입 가져오기
  let payload;
  try {
    payload = PayloadType.decode(packet.payload); // Payload 디코딩
    console.log("payload", payload); // 디코딩된 payload 로그
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.'); // 구조 불일치 처리
  }

  // 필드 검증 추가
  const expectedFields = Object.keys(PayloadType.fields); // 예상 필드
  const actualFields = Object.keys(payload); // 실제 필드

  const missingFields = expectedFields.filter((field) => !actualFields.includes(field)); // 누락된 필드 확인
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload }; // 핸들러 ID, 유저 ID, payload 반환
};
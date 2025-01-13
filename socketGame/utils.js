import { TOTAL_LENGTH_SIZE, HANDLER_ID } from './constants.js';

export const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0),  // 버퍼의 처음 4바이트에서 메시지 길이를 읽어옵니다 (Big Endian 방식)
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE),// TOTAL_LENGTH_SIZE 위치에서 2바이트의 핸들러 ID를 읽어옵니다 (Big Endian 방식)
  };
};

// 메시지 길이와 핸들러 ID를 버퍼로 변환 (Big Endian)
export const writeHeader = (length, handlerId) => {
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  const buffer = Buffer.alloc(headerSize); // headerSize 는 6바이트
  buffer.writeUInt32BE(length + headerSize, 0); // 메시지 길이를 빅엔디안 방식으로 기록 (4바이트)
  buffer.writeUInt16BE(handlerId, TOTAL_LENGTH_SIZE); // 핸들러 ID를 빅엔디안 방식으로 기록 (2바이트)
  return buffer;
};

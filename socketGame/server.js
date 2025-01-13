import net from 'net';
import { writeHeader,readHeader } from './utils.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);
  socket.on('data' , (data) => {
    console.log(data);
    const { handlerId, length } = readHeader(data);
    console.log(`handlerId: ${handlerId}`);
    console.log(`length: ${length}`);
    socket.write(data); // 'data' 이벤트로 받은 data를 같은 socket에게 쓰기
  })
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
})

server.listen(PORT, () => {
  console.log(`Echo server listening on port ${PORT}`);
  console.log(server.address());
})
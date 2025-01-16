import { removeUser } from '../session/user.session.js';

export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);
  // 소켓을 세션에서 제거
  removeUser(socket);
  console.error('소켓 오류. 소켓 제거',err);
};

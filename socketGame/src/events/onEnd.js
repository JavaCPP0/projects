import { removeUser } from '../session/user.session.js';
import { updateUserCoordinates } from '../db/user/user.db.js';
import { getUserBySocket } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = getUserBySocket(socket);
  //console.log("End에 소켓이 존재할까?",user);
  if (user) {
    console.log(user.id, user.x, user.y);
    updateUserCoordinates(user.id, user.x, user.y);
  }
  removeUser(socket);
};


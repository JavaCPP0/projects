import bcrypt from "bcrypt";
import express from 'express';
import { Prisma } from "@prisma/client";
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

/** 사용자 회원가입 API **/
router.post('/sign-up', async (req, res, next) => {
  const { email, password} = req.body;

  const isExistUser = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await prisma.users.create({
    data: { email, password },
  });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});


//사용자 로그인 API
router.post("/sign-in", async (req, res, next) => {
    const { email, password } = req.body;
  
    const user = await prisma.users.findFirst({ where: { email } });
  
    if (!user)
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  
    // const token = jwt.sign({ userId: user.userId }, "custom-secret-key"); //JWT할당
    // res.cookie("authorization", `Bearer ${token}`);
  
    req.session.userId = user.userId;
  
  
    return res.status(200).json({ message: "로그인에 성공하였습니다." });
  });

  
export default router;
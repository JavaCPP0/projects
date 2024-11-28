import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();


//돈벌기 API
router.patch("/makeMoney", authMiddleware, async (req, res, next) => {
    const {charId} = req.body;
    const { userId } = req.user;
  
    try {
      await prisma.$transaction(async (prisma) => {
        // 캐릭터 찾기
        const char = await prisma.character.findFirst({
          where: {
            userId: +userId,
            charId: +charId,
          },
        });
  
        if (!char) {
          return res.status(404).json({
            error: "본인의 캐릭터가 아니거나 캐릭터를 찾을 수 없습니다.",
          });
        }
  
        // 캐릭터 잔액 증가
        const newMoney = char.money +1000;
        await prisma.character.update({
          where: { charId: +charId },
          data: {
            money: newMoney,
          },
        });
  
        res.status(200).json({ data: { money: newMoney } });
      });
    } catch (error) {
      console.error(error);
      next(error); // 오류 미들웨어로 전달
    }
  });

export default router;

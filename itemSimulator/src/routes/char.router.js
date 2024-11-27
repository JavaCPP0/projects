import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//캐릭터 생성
router.post("/characters", authMiddleware, async (req, res, next) => {
  try {
    const { nickName } = req.body;
    console.log(req.user);
    const { userId } = req.user;

    if (!nickName || typeof nickName !== "string" || nickName.trim() === "") {
      return res.status(400).json({ error: "유효한 nickName을 입력해주세요." });
    }

    const existingPost = await prisma.character.findFirst({
      where: { nickName },
    });
    if (existingPost) {
      return res.status(409).json({ error: "이미 존재하는 nickName입니다." });
    }

    const post = await prisma.character.create({
      data: {
        userId: +userId,
        nickName: nickName.trim(),
      },
    });

    return res.status(201).json({ data: post });
  } catch (error) {
    console.error(error);
    next(error); // 오류 미들웨어로 전달
  }
});

//캐릭터 삭제
router.delete("/characters/:charId", authMiddleware, async (req, res, next) => {
  try {
    const { charId } = req.params;
    console.log(req.body)
    const { password } = req.body;

    // 캐릭터 정보 조회
    const character = await prisma.character.findUnique({
      where: {
        charId: +charId,
      },
    });

    // 캐릭터가 존재하지 않으면 404 반환
    if (!character) {
      return res.status(404).json({ message: "캐릭터가 존재하지 않습니다." });
    }

    // 로그인한 사용자의 userId와 캐릭터의 userId가 다르면 403 반환
    if (character.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "자신의 캐릭터만 삭제할 수 있습니다." });
    }

    // 비밀번호 확인
    if (character.password !== password) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 캐릭터 삭제
    await prisma.character.delete({ where: { charId: +charId } });

    return res.status(200).json({ data: "캐릭터가 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//캐릭터 정보 상세 조회 API
router.get("/characters/:charId", authMiddleware, async (req, res, next) => {
  const { charId } = req.params;

  const character = await prisma.character.findUnique({
    where: {
      charId: +charId,
    },
  });
  //만약 사용자 본인이라면 모든정보 조회가능
  if (character.userId === req.user.userId) {
    const character = await prisma.character.findFirst({
      where: { charId: +charId },
      select: {
        nickName: true,
        health: true,
        power: true,
        money: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({ data: character });

  } else{ //다른사람의 캐릭터를 조회하면 일부분만 조회 가능
    const character = await prisma.character.findFirst({
        where: { charId: +charId },
        select: {
          nickName: true,
          health: true,
          power: true,
        },
      });
      return res.status(200).json({ data: character });
  }

});

export default router;

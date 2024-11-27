import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

//아이템 생성
router.post("/items", authMiddleware, async (req, res, next) => {
  try {
    const { name, health, power, price } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "유효한 name을 입력해주세요." });
    }
    //생성하려는 사용자가 admin권한인지?
    if (req.user.role === "admin") {
      const items = await prisma.items.create({
        data: {
          name: name.trim(),
          health: health,
          power: power,
          price: price,
        },
      });
      return res.status(201).json({ data: items });
    } else {
      return res
        .status(401)
        .json({ error: "아이템을 생성할 권한이 없습니다." });
    }
  } catch (error) {
    console.error(error);
    next(error); // 오류 미들웨어로 전달
  }
});

//아이템 수정 API
router.patch("/items/:itemId", authMiddleware, async (req, res, next) => {
  const { name, health, power, price } = req.body;
  const { itemId } = req.params;

  const items = await prisma.items.findFirst({
    where: { itemId: +itemId },
  });
  if (!items)
    return res.status(404).json({ message: "아이템이 존재하지 않습니다." });

  if (req.user.role === "admin") {
    const items = await prisma.items.update({
      data: {
        name: name,
        health: health,
        power: power,
        price: price,
      },
      where: {
        itemId: +itemId,
      },
    });
    return res.status(201).json({ data: items });
  } else {
    return res.status(401).json({ error: "아이템을 변경할 권한이 없습니다." });
  }
});

//아이템 목록 조회
router.get("/items", async (req, res, next) => {
  const items = await prisma.items.findMany({
    select: {
      itemId: true,
      name: true,
      health: true,
      power: true,
      price: true,
    },
  });

  return res.status(200).json({ data: items });
});

export default router;

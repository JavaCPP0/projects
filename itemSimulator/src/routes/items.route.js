import bcrypt from "bcrypt";
import express from 'express';
import jwt from 'jsonwebtoken';
import { Prisma } from "@prisma/client";
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

//아이템 생성
router.post("/items", authMiddleware, async (req, res, next) => {
    try {
      const { name,health,power} = req.body;
      

  
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "유효한 name을 입력해주세요." });
      }
      if(req.user.role === 'admin'){
        const items = await prisma.items.create({
            data: {
              name: name.trim(),
              health: health,
              power: power
            },
          });
          return res.status(201).json({ data: items });
      } else {
        return res.status(401).json({error:"아이템을 생성할 권한이 없습니다."});
      }
    } catch (error) {
      console.error(error);
      next(error); // 오류 미들웨어로 전달
    }
  });

export default router;
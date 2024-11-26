import bcrypt from "bcrypt";
import express from 'express';
import jwt from 'jsonwebtoken';
import { Prisma } from "@prisma/client";
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/characters', authMiddleware, async (req, res, next) => {
    try {
        const { nickName } = req.body;
        const { userId } = req.user;

        if (!nickName || typeof nickName !== 'string' || nickName.trim() === '') {
            return res.status(400).json({ error: '유효한 nickName을 입력해주세요.' });
        }

        const existingPost = await prisma.character.findFirst({
            where: { nickName },
        });
        if (existingPost) {
            return res.status(409).json({ error: '이미 존재하는 nickName입니다.' });
        }

        const post = await prisma.character.create({
            data: {
                userId: +userId,
                nickName: nickName.trim(),
                charInvenId:req.body.charInvenId
            },
        });

        return res.status(201).json({ data: post });
    } catch (error) {
        console.error(error);
        next(error); // 오류 미들웨어로 전달
    }
});


export default router;
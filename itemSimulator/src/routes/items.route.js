import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

//아이템 생성 API
router.post("/items", authMiddleware, async (req, res, next) => {
  try {
    const { name, health, power, price } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "유효한 name을 입력해주세요." });
    }
    //생성하려는 사용자가 admin권한인지?
    if (req.user.role === "admin") {
      const existingName = await prisma.items.findFirst({
        where: { name },
      });

      if (existingName) {
        return res.status(201).json({ message: "이미 존재하는 아이템입니다." });
      }
      //
      const items = await prisma.items.create({
        data: {
          name: name.trim(),
          health: health,
          power: power,
          price: price,
        },
      });
      return res.status(201).json({ data: items });
      //
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

//아이템 목록 조회 API
router.get("/items", async (req, res, next) => {
  const items = await prisma.items.findMany({
    select: {
      itemId: true,
      name: true,
      price: true,
    },
  });

  return res.status(200).json({ data: items });
});

//아이템 상세 조회 API
router.get("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params; //params로 전달받은 값은 string이다

  const items = await prisma.items.findFirst({
    where: {
      itemId: +itemId, //+를 붙이면 자동으로 int로 바뀜
    },
    select: {
      itemId: true,
      name: true,
      health: true,
      power: true,
      price: true,
      stack: true,
    },
  });

  return res.status(200).json({ data: items });
});

//아이템 구매 API
router.patch("/buyItems", authMiddleware, async (req, res, next) => {
  const { name, count, charId } = req.body;
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
        return res
          .status(404)
          .json({
            error: "본인의 캐릭터가 아니거나 캐릭터를 찾을 수 없습니다.",
          });
      }

      // 아이템 찾기
      const items = await prisma.items.findFirst({
        where: { name: name },
      });

      if (!items) {
        return res.status(404).json({ error: "아이템을 찾을 수 없습니다." });
      }

      const { itemId, power, health, price } = items;

      // 잔액 검사
      if (char.money < price * count) {
        return res.status(400).json({ error: "잔액이 부족합니다." });
      }

      // 기존 인벤토리 아이템 찾기
      const existingItem = await prisma.charInventory.findFirst({
        where: {
          charId: +charId,
          itemId: itemId,
          name: name,
        },
      });

      if (existingItem) {
        // 기존 아이템이 있으면 스택 증가
        await prisma.charInventory.update({
          where: { charInvenId: existingItem.charInvenId },
          data: {
            stack: existingItem.stack + count,
          },
        });
      } else {
        // 새로운 아이템 추가
        await prisma.charInventory.create({
          data: {
            charId: +charId,
            itemId: itemId,
            name: name,
            power: power,
            health: health,
            price: price,
            stack: count,
          },
        });
      }

      // 캐릭터 잔액 차감
      await prisma.character.update({
        where: { charId: +charId },
        data: {
          money: char.money - price * count,
        },
      });

      res.status(200).json({ data: { money: char.money - price * count } });
    });
  } catch (error) {
    console.error(error);
    next(error); // 오류 미들웨어로 전달
  }
});

//아이템 판매 API
router.patch("/sellItems", authMiddleware, async (req, res, next) => {
  const { name, count, charId } = req.body;
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

      // 인벤토리에서 판매할 아이템 찾기
      const existingItem = await prisma.charInventory.findFirst({
        where: {
          charId: +charId,
          name: name,
        },
      });

      if (!existingItem) {
        return res.status(404).json({ error: "아이템을 찾을 수 없습니다." });
      }

      const { charInvenId, stack, price } = existingItem;

      // 갯수 검사
      if (stack < count) {
        return res.status(400).json({ error: "보유한 아이템이 부족합니다." });
      }

      // 아이템 판매 및 스택 감소
      if (stack - count === 0) {
        // 스택이 0이 되면 인벤토리에서 삭제
        await prisma.charInventory.delete({
          where: { charInvenId },
        });
      } else {
        // 스택 감소
        await prisma.charInventory.update({
          where: { charInvenId },
          data: {
            stack: stack - count,
          },
        });
      }

      // 캐릭터 잔액 증가
      const newMoney = char.money + (price * count*0.6);
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

//인벤토리 아이템 조회 API
router.get("/invenItems/:charId", authMiddleware, async (req, res, next) => {
  const { userId } = req.user; // 인증된 사용자 ID
  const { charId } = req.params; // URL 파라미터에서 charId 추출

  try {
    // 캐릭터 소유권 확인
    const char = await prisma.character.findFirst({
      where: {
        charId: +charId,
        userId: +userId,
      },
    });

    if (!char) {
      return res.status(404).json({ error: "캐릭터를 찾을 수 없거나 소유권이 없습니다." });
    }

    // 인벤토리 아이템 조회
    const items = await prisma.charInventory.findMany({
      where: {
        charId: +charId,
      },
      select: {
        itemId: true,
        name: true,
        stack: true,
      },
    });

    // 결과 반환
    return res.status(200).json({ data: items });
  } catch (error) {
    console.error(error);
    next(error); // 오류 미들웨어로 전달
  }
});

export default router;

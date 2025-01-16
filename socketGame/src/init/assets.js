// gameAssets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 절대 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets'); // 자산 기본 경로
let gameAssets = {}; // 전역 변수로 선언

// 비동기 파일 읽기 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err); // 오류 발생 시 거부
        return;
      }
      resolve(JSON.parse(data)); // JSON 데이터 파싱 후 해결
    });
  });
};

// 게임 자산 로드 함수
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'), // 스테이지 데이터 로드
      readFileAsync('item.json'), // 아이템 데이터 로드
      readFileAsync('item_unlock.json'), // 아이템 잠금 해제 데이터 로드
    ]);
    gameAssets = { stages, items, itemUnlocks }; // 자산 저장
    return gameAssets; // 자산 반환
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message); // 오류 발생 시 예외 처리
  }
};

// 게임 자산 가져오기 함수
export const getGameAssets = () => {
  return gameAssets; // 저장된 자산 반환
};
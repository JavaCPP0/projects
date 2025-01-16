// 데이터베이스 스키마를 생성하는 스크립트
import fs from 'fs';
import path from 'path';
import pools from '../database.js';
import { fileURLToPath } from 'url';

// 현재 파일의 경로를 가져옴
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일을 실행하는 함수
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8'); // SQL 파일 읽기
  const queries = sql
    .split(';') // 쿼리 구분
    .map((query) => query.trim()) // 공백 제거
    .filter((query) => query.length > 0); // 빈 쿼리 필터링

  // 각 쿼리를 실행
  for (const query of queries) {
    await pool.query(query);
  }
};

// 스키마 생성 함수
const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql'); // SQL 파일 디렉토리
  try {
    // USER_DB SQL 파일 실행
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));
    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 중 오류가 발생했습니다:', error);
  }
};

// 스키마 생성 함수 호출
createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.'); // 마이그레이션 완료 메시지
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 중 오류가 발생했습니다:', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
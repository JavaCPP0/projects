import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

const { databases } = config;

// 데이터베이스 커넥션 풀 생성 함수
const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query;

  // 쿼리 실행시 로그
  pool.query = (sql, params) => {
    const date = new Date();
    console.log(
      `[${formatDate(date)}] Executing query: ${sql} ${
        params ? `, ${JSON.stringify(params)}` : ``
      }`,
    );
    return originalQuery.call(pool, sql, params);
  };

  return pool; // 생성된 풀 반환
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  GAME_DB: createPool(databases.GAME_DB), // 게임 DB 풀
  USER_DB: createPool(databases.USER_DB), // 유저 DB 풀
};

export default pools; // 풀 내보내기
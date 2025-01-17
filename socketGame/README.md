# Socket Game


## Feature List

- [x] 서버 가동시 게임 인스턴스 1개 만들기
- [x] 고유한 deviceId로 로그인하기
- [x] 위치 업데이트 패킷 지속적으로 서버에 전달
- [x] 클라이언트 종료시 마지막위치 DB에 저장
- [x] 같은 deviceId로 접속하면 마지막 위치에서 접속
- [ ] latency를 사용해 추측항법 적용

### File Features

#### src/init
- **assets.js**: 게임 자산을 비동기적으로 로드하고, 이를 전역 변수로 관리합니다.
- **loadProtos.js**: Protobuf 파일을 로드하고, 패킷 메시지를 초기화합니다.
- **index.js**: 서버 초기화 작업을 수행하며, Protobuf 파일 로드 및 데이터베이스 연결 테스트를 포함합니다.

#### src/classes/models
- **game.class.js**: 게임 세션을 관리하며, 플레이어 추가, 제거 및 게임 시작 기능을 제공합니다.
- **user.class.js**: 유저의 위치 업데이트 및 핑 응답 처리를 담당합니다.

#### src/protobuf/request
- **game.proto**: 게임 생성 및 참가에 필요한 Protobuf 메시지 구조를 정의합니다.
- **initial.proto**: 초기 핸들러에 필요한 Protobuf 메시지 구조를 정의합니다.

#### src/protobuf/notification
- **game.notification.proto**: 게임 관련 알림 메시지 구조를 정의합니다.

#### src/handlers/game
- **createGame.handler.js**: 게임 생성 요청을 처리하고, 유저를 게임 세션에 추가합니다.
- **joinGame.handler.js**: 유저가 게임에 참가하는 요청을 처리합니다.
- **updateLocation.handler.js**: 유저의 위치 업데이트 요청을 처리하고, 모든 유저의 위치 정보를 전송합니다.

#### src/handlers/user
- **initial.handler.js**: 유저의 초기 로그인 요청을 처리하고, 유저 정보를 데이터베이스에 저장합니다.

#### src/handlers
- **index.js**: 핸들러 ID에 따라 적절한 핸들러를 반환합니다.

#### src/utils/notification
- **game.notification.js**: 게임 관련 알림 패킷을 생성하는 유틸리티입니다.

#### src/utils/error
- **errorHandler.js**: 오류를 처리하고, 클라이언트에게 오류 응답을 전송합니다.

#### src/utils/parser
- **packetParser.js**: 수신된 패킷을 파싱하고, 핸들러 ID에 따라 적절한 payload 구조를 디코딩합니다.

#### src/session
- **game.session.js**: 게임 세션을 추가, 제거 및 검색하는 기능을 제공합니다.
- **user.session.js**: 유저 세션을 관리하고, 유저 추가 및 제거 기능을 제공합니다.

#### src/db/user
- **user.db.js**: 유저 정보를 데이터베이스에서 조회하고, 생성 및 업데이트하는 기능을 제공합니다.

#### src/db/migration
- **createSchemas.js**: 데이터베이스 스키마를 생성하는 스크립트입니다.

#### src/db
- **database.js**: 데이터베이스 커넥션 풀을 생성하고, 쿼리 실행 시 로그를 기록합니다.

#### src/events
- **onConnection.js**: 클라이언트와의 연결을 처리하는 이벤트 핸들러입니다.
- **onData.js**: 수신된 데이터를 처리하고, 패킷을 파싱하여 적절한 핸들러를 호출합니다.
- **onEnd.js**: 클라이언트 연결 종료 시 유저 정보를 업데이트하고 세션에서 제거합니다.
- **onError.js**: 소켓 오류 발생 시 유저를 세션에서 제거합니다.

#### src/constants
- **env.js**: 환경 변수를 설정하고, 데이터베이스 및 서버 설정을 관리합니다.
- **header.js**: 패킷의 헤더 정보를 정의합니다.
- **errorCodes.js**: 에러 코드 상수를 정의합니다.

#### src/protobuf/response
- **response.proto**: 공통 응답 메시지 구조를 정의합니다.

#### src/protobuf
- **packetNames.js**: Protobuf 패킷 이름을 정의합니다.

#### src/utils
- **transformCase.js**: 객체의 키를 카멜케이스로 변환하는 유틸리티입니다.
- **db/testConnection.js**: 데이터베이스 연결을 테스트하는 유틸리티입니다.

#### src/classes/managers
- **interval.manager.js**: 플레이어의 인터벌을 관리하는 클래스입니다.

#### src/session
- **sessions.js**: 유저 및 게임 세션을 저장하는 배열입니다.

#### src/server.js
- TCP 서버를 초기화하고 실행하는 스크립트입니다.

#### .gitignore
- Git에서 무시할 파일 및 디렉토리를 정의합니다.

# 어려웠던 점
패킷을 교환할때 버퍼의 길이를 상호간에 맞출때 어디가 잘못된건지 찾기가 어려웠습니다.
추측항법을 제대로 이해하지 못해서 함수들을 제대로 이해하지 못했고 구현하지 못했습니다.

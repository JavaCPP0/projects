# Socket Game


## Feature List

- [x] 서버 가동시 게임 인스턴스 1개 만들기
- [x] 고유한 deviceId로 로그인하기
- [x] 위치 업데이트 패킷 지속적으로 서버에 전달
- [x] 클라이언트 종료시 마지막위치 DB에 저장
- [x] 같은 deviceId로 접속하면 마지막 위치에서 접속
- [ ] latency를 사용해 추측항법 적용

### File Features

#### src
- **init**
  - **loadProtos.js**: Protobuf 파일을 로드하고, 패킷 메시지를 초기화합니다.
    - `loadProtos()`: 모든 Protobuf 파일을 비동기적으로 로드합니다.
    - `getAllProtoFiles(dir, fileList)`: 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수입니다.
  - **index.js**: 서버 초기화 작업을 수행하며, Protobuf 파일 로드 및 데이터베이스 연결 테스트를 수행하고 "asd"라는 게임세션을 생성합니다.
    - `initServer()`: 서버 초기화 및 설정을 수행합니다.

- **classes**
  - **models**
    - **game.class.js**: 게임 세션을 관리하며, 플레이어 추가, 제거 및 게임 시작 기능을 제공합니다.
      - `constructor(id)`: 게임 ID, 플레이어 목록, 인터벌 매니저 및 상태를 초기화합니다.
      - `addUser(user)`: 플레이어를 추가하고, 핑 메서드를 인터벌 매니저에 추가합니다.
      - `getUser(userId)`: 유저 ID로 유저를 찾습니다.
      - `removeUser(userId)`: 유저를 목록에서 제거하고, 인터벌 매니저에서 제거합니다.
      - `getMaxLatency()`: 최대 레이턴시를 계산합니다.
      - `startGame()`: 게임을 시작하고 모든 유저에게 알림을 전송합니다.
      - `getAllLocation(userId)`: 모든 유저의 위치 정보를 가져옵니다.
  - **managers**
    - **interval.manager.js**: 플레이어의 인터벌을 관리하는 클래스입니다.
      - `constructor()`: 인터벌 매핑을 초기화합니다.
      - `addPlayer(playerId, callback, interval, type)`: 플레이어를 추가하고 인터벌을 설정합니다.
      - `addGame(gameId, callback, interval)`: 게임을 추가합니다.
      - `addUpdatePosition(playerId, callback, interval)`: 위치 업데이트 인터벌을 추가합니다.
      - `removePlayer(playerId)`: 플레이어를 제거하고 관련 인터벌을 정리합니다.
      - `removeInterval(playerId, type)`: 특정 타입의 인터벌을 제거합니다.
      - `clearAll()`: 모든 인터벌을 제거합니다.

- **protobuf**
  - **request**
    - **game.proto**: 게임 생성 및 참가에 필요한 Protobuf 메시지 구조를 정의합니다.
  - **notification**
    - **game.notification.proto**: 게임 관련 알림 메시지 구조를 정의합니다.
  - **response**
    - **response.proto**: 공통 응답 메시지 구조를 정의합니다.
  - **packetNames.js**: Protobuf 패킷 이름을 정의합니다.

- **handlers**
  - **game**
    - **createGame.handler.js**: 게임 생성 요청을 처리하고, 유저를 게임 세션에 추가합니다.
      - `createGameHandler()`: 게임 생성 요청을 처리하는 핸들러 함수입니다.
  - **user**
    - **initial.handler.js**: 유저의 초기 로그인 요청을 처리하고, 유저 정보를 데이터베이스에 저장합니다.
      - `initialHandler()`: 유저의 초기 로그인 요청을 처리하는 핸들러 함수입니다.
  - **index.js**: 핸들러 ID에 따라 적절한 핸들러를 반환합니다.
    - `getHandlerById(handlerId)`: 핸들러 ID에 따라 핸들러를 반환합니다.
    - `getProtoTypeNameByHandlerId(handlerId)`: 핸들러 ID에 따라 Protobuf 타입 이름을 반환합니다.

- **utils**
  - **notification**
    - **game.notification.js**: 게임 관련 알림 패킷을 생성하는 유틸리티입니다.
      - `createLocationPacket(users)`: 유저 위치 정보를 포함한 패킷을 생성합니다.
      - `gameStartNotification(gameId, timestamp)`: 게임 시작 알림 패킷을 생성합니다.
  - **error**
    - **errorHandler.js**: 오류를 처리하고, 클라이언트에게 오류 응답을 전송합니다.
      - `handleError(socket, error)`: 오류를 처리하고 클라이언트에게 응답합니다.
    - **errorCodes.js**: 에러 코드 상수를 정의합니다.
  - **parser**
    - **packetParser.js**: 수신된 패킷을 파싱하고, 핸들러 ID에 따라 적절한 payload 구조를 디코딩합니다.
  - **transformCase.js**: 객체의 키를 카멜케이스로 변환하는 유틸리티입니다.
  - **db**
    - **testConnection.js**: 데이터베이스 연결을 테스트하는 유틸리티입니다.

- **session**
  - **game.session.js**: 게임 세션을 추가, 제거 및 검색하는 기능을 제공합니다.
  - **user.session.js**: 유저 세션을 관리하고, 유저 추가 및 제거 기능을 제공합니다.
    - `addUser(id, socket, x, y)`: 유저를 추가하고 세션에 저장합니다.
    - `removeUser(socket)`: 소켓을 통해 유저를 제거합니다.
    - `getUserById(id)`: ID로 유저를 검색합니다.
    - `getUserBySocket(socket)`: 소켓으로 유저를 검색합니다.
    - `getNextSequence(id)`: 유저의 다음 시퀀스를 가져옵니다.
  - **sessions.js**: 유저 및 게임 세션을 저장하는 배열입니다.

- **db**
  - **user**
    - **user.db.js**: 유저 정보를 데이터베이스에서 조회하고, 생성 및 업데이트하는 기능을 제공합니다.
    - **user.queries.js**: 유저 관련 SQL 쿼리를 정의하여 데이터베이스와의 상호작용을 간편하게 합니다.
  - **migration**
    - **createSchemas.js**: 데이터베이스 스키마를 생성하는 스크립트입니다.
  - **database.js**: 데이터베이스 커넥션 풀을 생성하고, 쿼리 실행 시 로그를 기록합니다.

- **config**
  - **config.js**: 서버 및 데이터베이스 설정을 관리하며, 환경 변수에서 값을 가져옵니다.

- **events**
  - **onConnection.js**: 클라이언트와의 연결을 처리하는 이벤트 핸들러입니다.
  - **onData.js**: 수신된 데이터를 처리하고, 패킷을 파싱하여 적절한 핸들러를 호출합니다.
  - **onEnd.js**: 클라이언트 연결 종료 시 유저 정보를 업데이트하고 세션에서 제거합니다.
  - **onError.js**: 소켓 오류 발생 시 유저를 세션에서 제거합니다.

- **constants**
  - **env.js**: 환경 변수를 설정하고, 데이터베이스 및 서버 설정을 관리합니다.
  - **header.js**: 패킷의 헤더 정보를 정의합니다.

- **server.js**
  - TCP 서버를 초기화하고 실행하는 스크립트입니다.


# 어려웠던 점
- 패킷을 교환할때 버퍼의 길이를 상호간에 맞출때 어디가 잘못된건지 찾기가 어려웠습니다.
- 추측항법을 제대로 이해하지 못해서 함수들을 제대로 이해하지 못했고 구현하지 못했습니다.
- 유니티에서 테스트 할 때는 onEnd가 실행되게 하는법을 아는데 빌드된 실행파일에선 onEnd가 실행되지 않아서 고전했습니다.

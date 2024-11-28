# Item Simulator


## API List
Users<br>
1.Sign In<br>
2.Sign Up<br>
3.Withdraw Id<br>

Characters<br>
1.Create Character<br>
2.Get Character<br>
3.Delete Character<br>

Items<br>
1.Create Item<br>
2.Update Item<br>
3.Get Item List<br>
4.Get item<br>
5.Purchase Item<br>
6.Sell Item<br>
7.Equip Item<br>
8.Unequip Item<br>
9.Get Inventory<br>
10.Get Equipped Items<br>

money
1.Earn Money<br>
<br>
<br>

### Sign In
사용자에게 email과 password를 전달받고 Users 테이블에서 사용자가 입력한 이메일이 존재하는지 체크 후 존재하지 않는다면 암호화된<br>
패스워드와 이메일을 Users 태이블에 저장합니다. 관리자는 "role":"admin"이라는 body를 추가하여 관리자 권한을 얻을 수 있습니다.
<br>
<br>
### Sign UP
사용자에게 email과 password를 받고 Users태이블에 있는 정보와 일치하는지 비교합니다. 비밀번호는 bycript.compare을 사용하여 비교합니다.<br>
만약 로그인에 성공한다면 userId를 바탕으로 jwt를 생성합니다. 그리고 쿠키에 Bearer토큰 형식으로 저장합니다.
<br>
<br>
### Withdraw Id
사용자에게 email과 password를 받고 Users태이블에 있는 정보와 일치하는지 비교합니다. 만약에 일치한다면 회원을 탈퇴합니다.
<br>
<br>
### Create Character
사용자에게 nickName을입력받습니다. 이미 Characters 태이블에 존재하는지 검증 후 없다면 캐릭터를 생성합니다.
<br>
<br>
### Get Charater
req.params로 charId를 받습니다. 그 아이디로 조회할 캐릭터를 찾고 만약 쿠키에 있는 정보가 캐릭터의 userId와 일치한다면(본인이라면)<br>
모든 정보를 조회합니다. 만약 본인이 아니라면 제한적인 정보만 조회합니다.
<br>
<br>
### Delete Character
req.params로 charId를 받습니다.그 아이디로 삭제할 캐릭터를 찾고 만약 쿠키에 있는 정보가 캐릭터의 userId와 일치한다면(본인이라면)<br>
캐릭터를 삭제합니다.
<br>
<br>
### Create Item
사용자로부터 아이템의 이름과 스탯,가격을 입력받습니다. 쿠키정보를 바탕으로 지금 로그인된 사용자가 admin권한인지 확인합니다.<br>
만약 admin 사용자라면 아이템을 생성합니다.
<br>
<br>
### Update Item
사용자로부터 아이템의 이름과 스탯,가격을 입력받습니다. 쿠키정보를 바탕으로 지금 로그인된 사용자가 admin권한인지 확인합니다.
만약 admin 사용자라면 아이템을 수정합니다.
<br>
<br>
### Get Item List
존재하는 아이템들의 리스트를 가져옵니다.
<br>
<br>
### Get Item
아이템의 상세정보입니다. req.params로 itemId를 받아오고 찾아서 조회합니다.
<br>
<br>
### Purchase Item
구매할 아이템의 name,charId와  count(갯수)를 입력받습니다. 쿠키를 기반으로 현재 사용자의 userId를 받습니다. charId로<br>
캐릭터를 찾습니다. userId가 일치하지 않으면 접근할 수 없습니다. 해당 캐릭터의 잔액을 조회하고 아이템구매에 필요한<br>
돈을 가지고 있는지 검증합니다. 있다면 charInventory태이블에 아이템을 생성합니다.이미 가지고있는 아이탬이라면 <br>
아이탬의 stack을 증가시킵니다. 그리고 잔액을 차감합니다.
<br>
<br>
### Sell Item
판매할 아이템의 name,charId와  count(갯수)를 입력받습니다. 쿠키를 기반으로 현재 사용자의 userId를 받습니다. charId로<br>
캐릭터를 찾습니다. userId가 일치하지 않으면 접근할 수 없습니다. charInventory태이블에서 판매할 아이탬이 존재하는지 검증합니다.<br>
존재한다면 아이탬의 갯수가 count만큼 판매가 가능한지 검증합니다. 갯수가 충분하다면 판매를 진행하는데, 아이탬의 갯수가0이라면<br>
인벤토리 태이블에서 아이템을 지웁니다. 만약 남는 아이탬이 있다면 stack을 감소시킵니다. 캐릭터의 잔액을 판매액의 60%만큼 증가시킵니다.
<br>
<br>
### Equip Item
장착할 아이템의 name,charId와 갯수count를 유저로부터 받습니다. charId로 캐릭터를 찾고 쿠키에 있는 유저정보와 비교해서 본인확인을 합니다.<br>
본인이라면 인벤토리에서 소유한 아이탬을 조회하고 아이탬 갯수가 충분하다면 charitemset(장비창)태이블로 count만큼 옮깁니다.<bR>
인밴토리에 남은 해당 아이탬의 갯수가 0개라면 태이블에서 삭제합니다.
<br>
<br>
### Unequip Item
장착할 아이템의 name,charId와 갯수count를 유저로부터 받습니다. charId로 캐릭터를 찾고 쿠키에 있는 유저정보와 비교해서 본인확인을 합니다.<br>
본인이라면 장비창에서 소유한 아이탬을 조회하고 아이탬 갯수가 충분하다면 인밴토리 태이블로 count만큼 옮깁니다.<bR>
장비창에 남은 해당 아이탬의 갯수가 0개라면 태이블에서 삭제합니다.
<br>
<br>
### Get Inventory
쿠키로부터 유저정보를,req.params로부터 charId를 받습니다. 해당 캐릭터의 소유권이 있는지 확인합니다.<br>
소유권이 있다면 charId가 일치하는 아이템들을 모두 조회합니다.(해당 캐릭터의 인벤토리)
<br>
<br>
### Get Equipped Items
쿠키로부터 유저정보를,req.params로부터 charId를 받습니다. 해당 캐릭터의 소유권이 있는지 확인합니다.<br>
소유권이 있다면 charId가 일치하는 아이템들을 모두 조회합니다.(해당 캐릭터의 장비창)
<br>
<br>
### Earn Money
사용자로부터 charId를 입력받고 쿠키의 유저정보와 비교해 캐릭터의 소유권을 인증합니다. 해당 캐릭터의 잔액을 1000만큼 증가시킵니다.

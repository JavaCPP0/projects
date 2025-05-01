using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Ironcow;
using UnityEngine.UI;

public class Tower : WorldBase<TowerDataSO>
{
    [SerializeField] private Transform beamPosition;
    private bool isAttackDelay = false;

    int level;
    public int power { get => data.power + data.powerPerLv * level; }
    public float extra { get => data.extra + data.extraPerLv * level; }

    public int towerId;
    private int towerType = 1;
    public ePlayer player;

    bool isStop = false;

    public override void Init(BaseDataSO data)
    {
        this.data = (TowerDataSO)data;
    }

    public void InitTowerType(int towerType)
    {
        this.towerType = towerType;
    }

    private void Awake()
    {
        data = DataManager.instance.GetData<TowerDataSO>("TOW00001");
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (isAttackDelay || player == ePlayer.another || isStop) return;

        switch (towerType)
        {
            case 1:
                #region Single Attack
                if (collision.gameObject.TryGetComponent(out Monster monster))
                {
                    OnAttackMonster(monster);
                }
                break;
                #endregion
            case 2:
                #region Range Attack
                // 범위 내 모든 콜라이더를 가져오기: 범위는 하드 코딩
                var monstersInRange = Physics2D.OverlapCircleAll(transform.position, 200.0f);
                foreach (var monsterCollider in monstersInRange)
                {
                    // 각 콜라이더가 Monster 컴포넌트를 가진 객체인지 확인
                    if (monsterCollider.TryGetComponent(out Monster monster1))
                    {
                        OnAttackMonster(monster1);
                    }
                }
                break;
                #endregion  
        }
    }

    public void OnAttackMonster(Monster monster)
    {
        if (monster == null) return;
        var beam = Instantiate(ResourceManager.instance.LoadAsset<BeamObject>("BeamObject"), beamPosition).SetTimer().SetTarget(monster);
        isAttackDelay = true;
        monster.SetDamage(power);
        if (player == ePlayer.me)
        {
            StartCoroutine(OnCooldown());
            // [!] towerattack packet 전송
            GamePacket packet = new GamePacket();
            packet.TowerAttackRequest = new C2STowerAttackRequest() { MonsterId = monster.monsterId, TowerId = towerId };
            SocketManager.instance.Send(packet);
        }
    }

    public IEnumerator OnCooldown()
    {
        yield return new WaitForSeconds(data.cooldown / 60);
        isAttackDelay = false;
    }

    public void StopTower()
    {
        isStop = true;
    }

    public void SetRendererColor(string color = "white")
    {
        var spriteRendererObj = this.transform.Find("spriteRenderer");
        if (spriteRendererObj != null)
        {
            var spriteRenderer = spriteRendererObj.GetComponent<SpriteRenderer>();
            if (spriteRenderer != null)
            {
                switch (color)
                {
                    case "yellow":
                        spriteRenderer.color = Color.yellow;
                        break;
                    case "white":
                        spriteRenderer.color = Color.white;
                        break;
                    case "red":
                        spriteRenderer.color = Color.red;
                        break;
                    default:
                        spriteRenderer.color = Color.white;
                        break;
                }
            }
        }
    }
}
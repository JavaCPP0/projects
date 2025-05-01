using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Ironcow;
using UnityEngine.UI;
using Ironcow.WebSocketPacket;
using Google.Protobuf;
using static GamePacket;
using Unity.VisualScripting;
using System;

public class SocketManager : TCPSocketManagerBase<SocketManager>
{
    public int level = 1;
    public void RegisterResponse(GamePacket gamePacket)
    {
        var response = gamePacket.RegisterResponse;
        Debug.Log("[func check] SocketManager.RegisterResponse");
        UIManager.Get<PopupRegister>().OnRegisterResult(response.Success);
    }

    public void LoginResponse(GamePacket gamePacket)
    {
        var response = gamePacket.LoginResponse;
        Debug.Log("[func check] SocketManager.LoginResponse");
        UIManager.Get<PopupLogin>().OnLoginResult(response.Success);
    }

    public void MatchStartNotification(GamePacket gamePacket)
    {
        var response = gamePacket.MatchStartNotification;
        Debug.Log("[func check] SocketManager.MatchStartNotification");
        UIManager.Get<UIMain>().OnMatchResult(response);
    }

    public void AddEnemyTowerNotification(GamePacket gamePacket)
    {
        var response = gamePacket.AddEnemyTowerNotification;
        Debug.Log("[func check] SocketManager.AddEnemyTowerNotification");
        GameManager.instance.AddTower(new TowerData() { TowerId = response.TowerId, X = response.X, Y = response.Y }, ePlayer.another);
    }

    public void EnemyMonsterDeathNotification(GamePacket gamePacket)
    {
        var response = gamePacket.EnemyMonsterDeathNotification;
        Debug.Log("[func check] SocketManager.EnemyMonsterDeathNotification");
        GameManager.instance.RemoveMonster(response.MonsterId);
    }

    public void EnemyTowerAttackNotification(GamePacket gamePacket)
    {
        // s2c 방향 notify로 일어나는 attack
        var response = gamePacket.EnemyTowerAttackNotification;
        GameManager.instance.OnAttackMonster(response.TowerId, response.MonsterId);
    }

    public void GameOverNotification(GamePacket gamePacket)
    {
        var response = gamePacket.GameOverNotification;
        UIManager.Get<UIGame>().SetWinner(response.IsWin);
    }

    public void SpawnEnemyMonsterNotification(GamePacket gamePacket)
    {
        var response = gamePacket.SpawnEnemyMonsterNotification;
        GameManager.instance.AddMonster(new MonsterData() { MonsterId = response.MonsterId, MonsterNumber = response.MonsterNumber, Level = GameManager.instance.level }, ePlayer.another);
    }

    public void StateSyncNotification(GamePacket gamePacket)
    {
        var response = gamePacket.StateSyncNotification;
        GameManager.instance.level = response.MonsterLevel;
        GameManager.instance.homeHp1 = response.BaseHp;
        GameManager.instance.score = response.Score;
        GameManager.instance.gold = response.UserGold;
    }

    public void UpdateBaseHpNotification(GamePacket gamePacket)
    {
        var response = gamePacket.UpdateBaseHpNotification;
        if (!response.IsOpponent)
            GameManager.instance.homeHp1 = response.BaseHp;
        else
            GameManager.instance.homeHp2 = response.BaseHp;

    }

    public void SpawnMonsterResponse(GamePacket gamePacket)
    {
        var response = gamePacket.SpawnMonsterResponse;
        GameManager.instance.AddMonster(new MonsterData() { 
            MonsterId = response.MonsterId, 
            MonsterNumber = response.MonsterNumber, 
            Level = GameManager.instance.level 
        }, ePlayer.me);
    }

    public void TowerPurchaseResponse(GamePacket gamePacket)
    {
        var response = gamePacket.TowerPurchaseResponse;
        Debug.Log("[func check] SocketManager.TowerPurchaseResponse");
        // legacy set tower
        // towerid: 10001을 예로 들면, 1xxxx에서 1은 타워 타입코드, xxxx가 실제 id
        GameManager.instance.SetTower(response.TowerId);
    }

}
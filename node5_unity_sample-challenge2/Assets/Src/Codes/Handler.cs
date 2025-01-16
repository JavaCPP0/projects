using System;
using UnityEngine;

public class Handler
{
    public static void InitialHandler(InitialResponse res) {
        try 
        {
            GameManager.instance.GameStart();
            GameManager.instance.player.UpdatePositionFromServer(res.x, res.y);
            Debug.Log($"client x:{res.x},y:{res.y}");
        } catch(Exception e)
        {
            Debug.LogError($"Error InitialHandler: {e.Message}");
        }
    }
}
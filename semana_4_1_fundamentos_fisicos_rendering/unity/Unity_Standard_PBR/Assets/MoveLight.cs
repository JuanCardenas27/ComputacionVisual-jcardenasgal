using UnityEngine;

public class MoveLight : MonoBehaviour
{
    public float amplitude = 3f;   // qué tan lejos se mueve
    public float speed = 2f;       // qué tan rápido se mueve

    private Vector3 startPos;

    void Start()
    {
        startPos = transform.position;
    }

    void Update()
    {
        float offset = Mathf.Sin(Time.time * speed) * amplitude;
        transform.position = startPos + new Vector3(offset, 0, 0);
    }
}
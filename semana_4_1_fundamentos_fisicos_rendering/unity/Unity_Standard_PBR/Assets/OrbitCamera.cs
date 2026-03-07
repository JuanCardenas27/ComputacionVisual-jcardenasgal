using UnityEngine;

public class OrbitCamera : MonoBehaviour
{
    public Transform target;
    public float distance = 6f;
    public float speed = 20f;
    public float height = 2f;

    void Update()
    {
        float angle = Time.time * speed;

        float x = Mathf.Sin(angle * Mathf.Deg2Rad) * distance;
        float z = Mathf.Cos(angle * Mathf.Deg2Rad) * distance;

        transform.position = target.position + new Vector3(x, height, z);
        transform.LookAt(target);
    }
}
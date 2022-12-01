using System.Collections;
using System.Collections.Generic;
using PE2D;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityStandardAssets.ImageEffects;

[System.Serializable]
public class RNPayload
{
    public string message;
    public string colorHex;


    public static RNPayload CreateFromJSON(string jsonString)
    {
        return JsonUtility.FromJson<RNPayload>(jsonString);
    }

    // Given JSON input:
    // {"name":"Dr Charles","lives":3,"health":0.8}
    // this example will return a PlayerInfo object with
    // name == "Dr Charles", lives == 3, and health == 0.8f.
}

public class RNInterop : MonoBehaviour
{

    public GameObject mainCamera;
    public TextMeshPro textComponent;
    public GameObject cube;
    public float speedOffset = .01f;
    public float lengthMultiplier = 40f;
    public int numToSpawn = 200;
    public WrapAroundType wrapAround;
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void MessageFromRN(string message)
    {
        RNPayload RNData = RNPayload.CreateFromJSON(message);
        Color newCol;
        ColorUtility.TryParseHtmlString(RNData.colorHex, out newCol);
        cube.GetComponent<Renderer>().material.color = newCol;
        textComponent.text = RNData.message;
    }



    public void EnhanceUnityFromRN(string message)
    {
        if (!mainCamera.GetComponent<Bloom>().enabled)
        {
            mainCamera.GetComponent<Bloom>().enabled = true;
            Vector2 position = gameObject.transform.position;
            SpawnExplosion(position);
        }
        else
        {
            mainCamera.GetComponent<Bloom>().enabled = false;
            Vector2 position = gameObject.transform.position;
            SpawnExplosion(position);
        }

    }

    private void SpawnExplosion(Vector2 position)
    {
        float hue1 = Random.Range(0, 6);
        float hue2 = (hue1 + Random.Range(0, 2)) % 6f;
        Color colour1 = StaticExtensions.Color.FromHSV(hue1, 0.5f, 1);
        Color colour2 = StaticExtensions.Color.FromHSV(hue2, 0.5f, 1);

        for (int i = 0; i < numToSpawn; i++)
        {
            float speed = (18f * (1f - 1 / Random.Range(1f, 10f))) * speedOffset;

            var state = new ParticleBuilder()
            {
                velocity = StaticExtensions.Random.RandomVector2(speed, speed),
                wrapAroundType = wrapAround,
                lengthMultiplier = lengthMultiplier,
                velocityDampModifier = 0.94f,
                removeWhenAlphaReachesThreshold = true
            };

            var colour = Color.Lerp(colour1, colour2, Random.Range(0, 1));

            float duration = 320f;
            var initialScale = new Vector2(2f, 1f);


            ParticleFactory.instance.CreateParticle(position, colour, duration, initialScale, state);
        }
    }
}

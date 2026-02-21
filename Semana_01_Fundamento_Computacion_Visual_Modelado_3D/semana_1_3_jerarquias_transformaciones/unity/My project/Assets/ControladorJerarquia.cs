using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ControladorJerarquia : MonoBehaviour
{
    [Header("Objeto Padre")]
    public Transform padre;

    [Header("Sliders de Posición")]
    public Slider sliderPosX;
    public Slider sliderPosY;
    public Slider sliderPosZ;

    [Header("Sliders de Rotación")]
    public Slider sliderRotX;
    public Slider sliderRotY;
    public Slider sliderRotZ;

    [Header("Sliders de Escala")]
    public Slider sliderEscX;
    public Slider sliderEscY;
    public Slider sliderEscZ;

    [Header("UI Info")]
    public TMP_Text textInfo;

    [Header("Bonus - Animación")]
    public Button btnAnimar;
    public Button btnReiniciar;

    private bool animando = false;
    private Vector3 posicionInicial;
    private Quaternion rotacionInicial;
    private Vector3 escalaInicial;

    void Start()
    {
        // Guardar estado inicial
        posicionInicial = padre.position;
        rotacionInicial = padre.rotation;
        escalaInicial   = padre.localScale;

        // Escuchar botones
        btnAnimar.onClick.AddListener(ToggleAnimacion);
        btnReiniciar.onClick.AddListener(Reiniciar);
    }

    void Update()
    {
        if (!animando)
        {
            // Los sliders controlan al padre
            padre.position = new Vector3(
                sliderPosX.value,
                sliderPosY.value,
                sliderPosZ.value
            );

            padre.rotation = Quaternion.Euler(
                sliderRotX.value,
                sliderRotY.value,
                sliderRotZ.value
            );

            padre.localScale = new Vector3(
                sliderEscX.value,
                sliderEscY.value,
                sliderEscZ.value
            );
        }
        else
        {
            // Rota el padre en los tres ejes
            padre.Rotate(
                50f * Time.deltaTime,  // Eje X
                50f * Time.deltaTime,  // Eje Y
                50f * Time.deltaTime   // Eje Z
            );

            // Los tres sliders de rotación se actualizan solos
            sliderRotX.value = padre.eulerAngles.x;
            sliderRotY.value = padre.eulerAngles.y;
            sliderRotZ.value = padre.eulerAngles.z;
        }

        // Mostrar valores en pantalla
        textInfo.text =
            $"Posición:  {padre.position}\n" +
            $"Rotación:  {padre.eulerAngles}\n" +
            $"Escala:    {padre.localScale}";
    }

    void ToggleAnimacion()
    {
        animando = !animando;
        btnAnimar.GetComponentInChildren<TMP_Text>().text =
            animando ? "⏸ Pausar" : "▶ Animar";
    }

    void Reiniciar()
    {
        animando = false;
        padre.position   = posicionInicial;
        padre.rotation   = rotacionInicial;
        padre.localScale = escalaInicial;

        // Resetear todos los sliders
        sliderPosX.value = 0; sliderPosY.value = 0; sliderPosZ.value = 0;
        sliderRotX.value = 0; sliderRotY.value = 0; sliderRotZ.value = 0;
        sliderEscX.value = 1; sliderEscY.value = 1; sliderEscZ.value = 1;

        btnAnimar.GetComponentInChildren<TMP_Text>().text = "▶ Animar";
    }
}
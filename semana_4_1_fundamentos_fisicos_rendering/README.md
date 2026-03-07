# Actividad S4_1 - Fundamentos Físicos del Rendering

## Nombre de los estudiantes

- Juan David Buitrago Salazar
- Juan David Cardenas Galvis
- Camilo Andrés Medina Sánchez


---

## Descripción breve

En esta actividad se trabajaron los **fundamentos físicos del rendering**, con enfoque en la **teoría de microfacetas** y el modelo de iluminación **Cook-Torrance**. El objetivo fue comprender cómo se modela la interacción de la luz con superficies rugosas a nivel microscópico, y cómo estos modelos físicamente basados (PBR) permiten obtener resultados visuales más realistas en tiempo real.

Durante la preparación se analizaron los componentes del modelo Cook-Torrance (distribución de normales, función de Fresnel y geometría de oclusión/sombra), así como su integración en el pipeline de renderizado moderno.

---

## Temas abordados

**Tema 8: Teoría de Microfacetas y Cook-Torrance**

- **Modelo de microfacetas:** representación microscópica de una superficie como un conjunto de pequeñas facetas planas perfectas (microfacetas), cuya orientación estadística determina la apariencia macroscópica del material.
- **Función de Distribución Normal (NDF):** describe la distribución estadística de las orientaciones de las microfacetas; modelos comunes incluyen GGX/Trowbridge-Reitz y Beckmann. Controla la forma y tamaño del highlight especular.
- **Función de Fresnel:** modela la proporción de luz reflejada versus refractada según el ángulo de incidencia. La aproximación de Schlick simplifica su cálculo:

$$F(\theta) \approx F_0 + (1 - F_0)(1 - \cos\theta)^5$$

- **Término de geometría (G):** modela la auto-oclusión y auto-sombra entre microfacetas. Funciones como Smith-GGX garantizan que las microfacetas no reflejen más luz de la que reciben.
- **BRDF de Cook-Torrance:** combina los tres factores anteriores en una función de reflectancia bidireccional:

$$f_r = \frac{D \cdot F \cdot G}{4\,(\mathbf{n} \cdot \mathbf{l})\,(\mathbf{n} \cdot \mathbf{v})}$$

- **PBR (Physically Based Rendering):** paradigma de renderizado que utiliza modelos físicamente correctos de interacción luz-materia para lograr consistencia visual bajo distintas condiciones de iluminación.
- **Parámetros de rugosidad y metalicidad:** valores que alimentan el modelo Cook-Torrance; la rugosidad controla la concentración del lóbulo especular y la metalicidad define si el material es conductor o dieléctrico.

---

## Implementación

### Presentación

La presentación cubre los siguientes puntos de forma progresiva:

1. Motivación: ¿por qué los modelos Phong/Blinn-Phong no son suficientes?
2. Introducción a la teoría de microfacetas.
3. Derivación de los tres componentes del modelo Cook-Torrance (NDF, Fresnel, G).
4. Ensamble de la BRDF completa.
5. Parámetros PBR: rugosidad y metalicidad.
6. Comparativa visual entre modelos de iluminación clásicos y PBR.
7. Integración en el pipeline gráfico moderno (Unity/Unreal).

El archivo de la presentación se encuentra en:

```
presentacion/
└── 8_teoria_de_microfacetas_y_cook-torrance.pdf
```

### Unity

AQUI VA EL UNITY 

---

## Prompts utilizados

Se utilizaron prompts de IA para apoyar la construcción de diapositivas y profundizar en los conceptos del modelo de iluminación físicamente basado.

### Prompts para NotebookLM (diapositivas y síntesis teórica)

- "A partir de este material, crea una estructura de diapositivas (máximo 15) que explique la teoría de microfacetas y el modelo Cook-Torrance de forma progresiva: motivación, modelo microscópico, NDF, Fresnel, geometría y BRDF completa."
- "Resume en lenguaje académico pero accesible los tres componentes del modelo Cook-Torrance: Distribución Normal, Fresnel y término de geometría. Incluye intuición física y la fórmula de cada uno."
- "Explica con una analogía la diferencia entre un material rugoso y uno pulido según la teoría de microfacetas."


### Prompts de apoyo para el shader en Unity (referencia para la implementación)

- "Explícame cómo implementar el modelo Cook-Torrance en un shader HLSL dentro de Unity URP, detallando las funciones para NDF (GGX), Fresnel (Schlick) y G (Smith-GGX)."
- "Dame un fragmento de código HLSL que calcule la BRDF de Cook-Torrance con parámetros de rugosidad y metalicidad como inputs del material."
- "¿Cómo exponer los parámetros roughness y metallic en un Shader Graph de Unity para que sean editables desde el inspector?"

---

## Aprendizajes y dificultades

### Aprendizajes

Se comprendió por qué los modelos clásicos como Phong fallan en representar superficies físicamente plausibles, y cómo la teoría de microfacetas proporciona una base matemática sólida para modelar la interacción luz-materia. También se interiorizó la importancia de la aproximación de Schlick para Fresnel y de la función Smith para el término geométrico.

### Dificultades

La parte más desafiante fue entender la derivación matemática del término de geometría y cómo se combina con NDF y Fresnel dentro del denominador de la BRDF. Se resolvió revisando fuentes académicas y comparando implementaciones de referencia.

### Mejoras futuras

Como mejora, se podría explorar la BRDF de Disney (Principled BRDF), que extiende el modelo Cook-Torrance con parámetros adicionales como subsurface scattering y clearcoat.

---

## Participación por integrante

- **Juan David Buitrago Salazar:** desarrolló el ejemplo práctico en Unity, implementando un shader PBR basado en Cook-Torrance y mostrando en escena el efecto de los parámetros de rugosidad y metalicidad.
- **Juan David Cardenas Galvis:** se encargó de la preparación de las diapositivas, organizando la estructura teórica del contenido y asegurando una presentación clara y progresiva del modelo Cook-Torrance.
- **Camilo Andrés Medina Sánchez:** realizó la búsqueda y validación de información técnica, contrastando definiciones y fórmulas en fuentes académicas para garantizar la precisión del contenido presentado.

---

## Estructura del proyecto

```
semana_4_1_fundamentos_fisicos_rendering/
├── presentacion/
│   └── 8_teoria_de_microfacetas_y_cook-torrance.pdf   # Diapositivas de la exposición
├── unity/                                              # Proyecto Unity (ver sección Unity)
└── README.md                                           # Documentación de la actividad
```

---

## Referencias

- Cook, R. L., & Torrance, K. E. (1982). *A Reflectance Model for Computer Graphics*. ACM Transactions on Graphics.
- Walter, B., et al. (2007). *Microfacet Models for Refraction through Rough Surfaces*. EGSR.
- Documentación de Unity — Physically Based Shading: https://docs.unity3d.com/Manual/shader-StandardShader.html
- Karis, B. (2013). *Real Shading in Unreal Engine 4*. SIGGRAPH Course Notes. https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
- LearnOpenGL — PBR Theory: https://learnopengl.com/PBR/Theory

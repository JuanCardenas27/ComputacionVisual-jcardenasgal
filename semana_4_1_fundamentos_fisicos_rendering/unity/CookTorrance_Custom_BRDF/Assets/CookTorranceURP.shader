Shader "Custom/CookTorranceURP_Formal"
{
    // ========================================================================
    // Propiedades del Material
    // Definición de variables expuestas al Inspector de Unity.
    // ========================================================================
    Properties
    {
        _Color ("Albedo Color", Color) = (1,1,1,1)
        _Roughness ("Roughness", Range(0.001, 1.0)) = 0.5
        _Metallic ("Metallic", Range(0.0, 1.0)) = 0.0
    }

    SubShader
    {
        // Configuración para el Universal Render Pipeline (URP)
        Tags { "RenderType"="Opaque" "RenderPipeline" = "UniversalPipeline" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            // Dependencias del Core de URP y librería de iluminación
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            // Declaración del Constant Buffer para compatibilidad con el SRP Batcher.
            // Garantiza una instanciación eficiente de los materiales.
            CBUFFER_START(UnityPerMaterial)
                float4 _Color;
                float _Roughness;
                float _Metallic;
            CBUFFER_END

            // ========================================================================
            // Estructuras de Datos del Pipeline
            // ========================================================================
            
            // Atributos de entrada del Vertex Shader.
            struct Attributes {
                float4 positionOS : POSITION; // Posición del vértice en Object Space
                float3 normalOS   : NORMAL;   // Normal del vértice en Object Space
            };

            // Datos interpolados pasados del Vertex Shader al Fragment Shader.
            struct Varyings {
                float4 positionCS : SV_POSITION; // Posición en Clip Space
                float3 positionWS : TEXCOORD0;   // Posición en World Space
                float3 normalWS   : TEXCOORD1;   // Normal en World Space
            };

            // ========================================================================
            // Funciones del BRDF (Bidirectional Reflectance Distribution Function)
            // Modelo Cook-Torrance
            // ========================================================================

            // 1. Función de Distribución de Normales (NDF) - Trowbridge-Reitz GGX
            // Modela la distribución estadística de las microfacetas alineadas con el Half-vector.
            float NDF_GGX(float NdotH, float roughness) {
                float a = roughness * roughness;
                float a2 = a * a;
                float NdotH2 = NdotH * NdotH;
                
                float num = a2;
                float denom = (NdotH2 * (a2 - 1.0) + 1.0);
                denom = PI * denom * denom;
                
                // Evita la división por cero mediante un valor mínimo (epsilon)
                return num / max(denom, 0.0000001); 
            }

            // 2. Ecuación de Fresnel - Aproximación de Schlick
            // Estima la proporción de luz reflejada frente a la refractada en función del ángulo de visión.
            float3 FresnelSchlick(float cosTheta, float3 F0) {
                return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
            }

            // 3. Función Geométrica (G) - Schlick-GGX
            // Calcula la atenuación debida al auto-sombreado (shadowing) y enmascaramiento (masking) de las microfacetas.
            float GeometrySchlickGGX(float NdotV, float roughness) {
                // Remapeo de rugosidad específico para iluminación directa
                float r = (roughness + 1.0);
                float k = (r * r) / 8.0; 
                
                float num = NdotV;
                float denom = NdotV * (1.0 - k) + k;
                return num / denom;
            }

            // Modelo geométrico de Smith: producto de la atenuación de la vista y de la luz.
            float GeometrySmith(float NdotV, float NdotL, float roughness) {
                float ggx2 = GeometrySchlickGGX(NdotV, roughness);
                float ggx1 = GeometrySchlickGGX(NdotL, roughness);
                return ggx1 * ggx2;
            }

            // ========================================================================
            // Vertex Shader
            // ========================================================================
            Varyings vert(Attributes IN) {
                Varyings OUT;
                // Transformaciones espaciales matriciales
                OUT.positionWS = TransformObjectToWorld(IN.positionOS.xyz);
                OUT.positionCS = TransformWorldToHClip(OUT.positionWS);
                OUT.normalWS = TransformObjectToWorldNormal(IN.normalOS);
                return OUT;
            }

            // ========================================================================
            // Fragment Shader
            // ========================================================================
            half4 frag(Varyings IN) : SV_Target {
                
                // --- Inicialización de Vectores ---
                float3 N = normalize(IN.normalWS); 
                float3 V = normalize(GetWorldSpaceNormalizeViewDir(IN.positionWS)); 
                
                Light mainLight = GetMainLight();
                float3 L = normalize(mainLight.direction);
                float3 H = normalize(V + L); // Half-vector de Blinn-Phong

                // --- Productos Punto ---
                // Se utiliza max() para saturar los valores por debajo de 0 (evitar contribución de luz negativa).
                float NdotV = max(dot(N, V), 0.0);
                float NdotL = max(dot(N, L), 0.0);
                float NdotH = max(dot(N, H), 0.0);
                float HdotV = max(dot(H, V), 0.0);

                // --- Reflectancia Incidente (F0) ---
                // F0 es 0.04 para materiales dieléctricos. Para metales, F0 equivale al albedo.
                float3 F0 = float3(0.04, 0.04, 0.04);
                F0 = lerp(F0, _Color.rgb, _Metallic);

                // --- Evaluación de Componentes Cook-Torrance ---
                float NDF = NDF_GGX(NdotH, _Roughness);
                float3 F  = FresnelSchlick(HdotV, F0);
                float G   = GeometrySmith(NdotV, NdotL, _Roughness);

                // --- Ecuación BRDF Especular ---
                float3 numerator = NDF * G * F;
                float denominator = 4.0 * NdotV * NdotL + 0.0001; 
                float3 specular = numerator / denominator;

                // --- Conservación de Energía (Flujo Metálico) ---
                float3 kS = F; // Coeficiente especular (relación de reflexión de Fresnel)
                float3 kD = float3(1.0, 1.0, 1.0) - kS; // Coeficiente difuso (luz refractada)
                kD *= 1.0 - _Metallic; // Anula el componente difuso en materiales puramente metálicos

                // --- Composición de Iluminación Directa ---
                // Integra el Lambertian difuso y el BRDF especular, modulado por la irradiancia incidente (NdotL)
                float3 color = (kD * _Color.rgb / PI + specular) * mainLight.color * NdotL;

                return half4(color, _Color.a);
            }
            ENDHLSL
        }
    }
}
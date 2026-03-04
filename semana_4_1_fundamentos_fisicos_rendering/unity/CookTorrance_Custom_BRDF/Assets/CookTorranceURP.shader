Shader "Custom/CookTorranceURP"
{
    Properties
    {
        _Color ("Albedo Color", Color) = (1,1,1,1)
        _Roughness ("Roughness (Rugosidad)", Range(0.001, 1.0)) = 0.5
        _Metallic ("Metallic (Metalicidad)", Range(0.0, 1.0)) = 0.0
    }

    SubShader
    {
        // Etiquetas necesarias para URP
        Tags { "RenderType"="Opaque" "RenderPipeline" = "UniversalPipeline" }

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            // Librerías de URP para obtener variables de cámara y luces
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            // Variables del material
            CBUFFER_START(UnityPerMaterial)
                float4 _Color;
                float _Roughness;
                float _Metallic;
            CBUFFER_END

            // Estructuras de datos
            struct Attributes {
                float4 positionOS : POSITION;
                float3 normalOS   : NORMAL;
            };

            struct Varyings {
                float4 positionCS : SV_POSITION;
                float3 positionWS : TEXCOORD0;
                float3 normalWS   : TEXCOORD1;
            };

            // 1. Distribución GGX (D)
            float NDF_GGX(float NdotH, float roughness) {
                float a = roughness * roughness;
                float a2 = a * a;
                float NdotH2 = NdotH * NdotH;
                float num = a2;
                float denom = (NdotH2 * (a2 - 1.0) + 1.0);
                denom = PI * denom * denom;
                return num / max(denom, 0.0000001);
            }

            // 2. Fresnel Schlick (F)
            float3 FresnelSchlick(float cosTheta, float3 F0) {
                return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
            }

            // 3. Geometría Schlick-GGX (G)
            float GeometrySchlickGGX(float NdotV, float roughness) {
                float r = (roughness + 1.0);
                float k = (r * r) / 8.0;
                float num = NdotV;
                float denom = NdotV * (1.0 - k) + k;
                return num / denom;
            }

            float GeometrySmith(float NdotV, float NdotL, float roughness) {
                float ggx2 = GeometrySchlickGGX(NdotV, roughness);
                float ggx1 = GeometrySchlickGGX(NdotL, roughness);
                return ggx1 * ggx2;
            }

            // Función Vertex (calcula posiciones espaciales)
            Varyings vert(Attributes IN) {
                Varyings OUT;
                OUT.positionWS = TransformObjectToWorld(IN.positionOS.xyz);
                OUT.positionCS = TransformWorldToHClip(OUT.positionWS);
                OUT.normalWS = TransformObjectToWorldNormal(IN.normalOS);
                return OUT;
            }

            // Función Fragment (calcula el color final por píxel)
            half4 frag(Varyings IN) : SV_Target {
                float3 N = normalize(IN.normalWS);
                float3 V = normalize(GetWorldSpaceNormalizeViewDir(IN.positionWS));
                
                // Obtener la luz principal de URP (el sol)
                Light mainLight = GetMainLight();
                float3 L = normalize(mainLight.direction);
                float3 H = normalize(V + L);

                float NdotV = max(dot(N, V), 0.0);
                float NdotL = max(dot(N, L), 0.0);
                float NdotH = max(dot(N, H), 0.0);
                float HdotV = max(dot(H, V), 0.0);

                float3 F0 = float3(0.04, 0.04, 0.04);
                F0 = lerp(F0, _Color.rgb, _Metallic);

                // Ecuación de Cook-Torrance
                float NDF = NDF_GGX(NdotH, _Roughness);
                float3 F  = FresnelSchlick(HdotV, F0);
                float G   = GeometrySmith(NdotV, NdotL, _Roughness);

                float3 numerator = NDF * G * F;
                float denominator = 4.0 * NdotV * NdotL + 0.0001;
                float3 specular = numerator / denominator;

                float3 kS = F;
                float3 kD = float3(1.0, 1.0, 1.0) - kS;
                kD *= 1.0 - _Metallic;

                // Color final: (Difuso + Especular) * Color de la luz * Ángulo de la luz
                float3 color = (kD * _Color.rgb / PI + specular) * mainLight.color * NdotL;

                return half4(color, _Color.a);
            }
            ENDHLSL
        }
    }
}
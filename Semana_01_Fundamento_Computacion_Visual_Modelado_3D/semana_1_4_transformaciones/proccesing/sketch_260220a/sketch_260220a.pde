// Variable para controlar la rotación acumulada
float angulo = 0;

void setup() {
  size(800, 600, P3D);  // Ventana 800x600 en modo 3D
  background(20);       // Fondo oscuro
}

void draw() {
  // Limpiar pantalla cada frame
  background(20, 20, 40);  // Fondo azul oscuro
  
  // Luz para que el 3D se vea con sombras
  lights();
  
  // Mover el origen al centro de la pantalla
  translate(width/2, height/2, 0);

  // ── CUBO PRINCIPAL (con todas las transformaciones) ──
  pushMatrix();
  
    // 1. TRASLACIÓN ONDULADA usando sin()
    // sin() devuelve valores entre -1 y 1, multiplicamos para ampliar el movimiento
    float ondaX = sin(millis() * 0.001) * 150;  // Se mueve en X
    float ondaY = cos(millis() * 0.001) * 80;   // Se mueve en Y
    translate(ondaX, ondaY, 0);
    
    // 2. ROTACIÓN en los tres ejes usando frameCount
    // frameCount sube 1 por cada frame, dividimos para que sea lento
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.02);
    rotateZ(frameCount * 0.005);
    
    // 3. ESCALA CÍCLICA usando sin()
    // sin() entre -1 y 1, lo convertimos a entre 0.5 y 1.5
    float escala = 1.0 + sin(millis() * 0.002) * 0.5;
    scale(escala);
    
    // Dibujar el cubo con color
    fill(100, 180, 255);   // Color azul claro
    stroke(255);            // Borde blanco
    strokeWeight(1);
    box(120);               // Cubo de 120x120x120
    
  popMatrix();
  
  // ── CUBO SATÉLITE (orbita alrededor del principal) ──
  pushMatrix();
  
    // Orbita circular usando sin y cos
    float orbitaX = sin(millis() * 0.002) * 220;
    float orbitaY = cos(millis() * 0.002) * 220;
    translate(orbitaX, orbitaY, 0);
    
    // Rotación propia del satélite
    rotateY(frameCount * 0.05);
    rotateX(frameCount * 0.03);
    
    // Escala fija más pequeña
    scale(0.4);
    
    fill(255, 150, 80);  // Color naranja
    stroke(255, 200, 100);
    box(120);
    
  popMatrix();
  
  // ── TEXTO INFO en pantalla ──
  // Reseteamos transformaciones para el texto
  pushMatrix();
    // Volver a esquina superior izquierda
    translate(-width/2 + 20, -height/2 + 30, 0);
    fill(255);
    textSize(14);
    text("Tiempo (ms): " + millis(), 0, 0);
    text("Frame: " + frameCount, 0, 20);
    text("Onda X: " + nf(ondaX, 1, 1), 0, 40);  // nf formatea el número
    text("Escala: " + nf(escala, 1, 2), 0, 60);
  popMatrix();
}
```

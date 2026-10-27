# Decisiones

26/10/2026 · Cómo se dibuja la cinta · SVG o DOM (10 piezas moviéndose, rodillos girando, la pieza cambia en 4 estaciones) · Gana SVG para la cinta y las piezas, con DOM para los botones (estaciones y casilleros) · Empataron en fluidez: 60 fps con la CPU 6 veces más lenta, y 44-50 fps con la DOM en 43-49 cuando va 20 veces más lenta. Decidió la facilidad para animar: en SVG la pieza se dibuja con formas que cambian (agujero, patas, líquido, tapa), escala sola con viewBox de notebook a celular y el dibujo queda en funciones puras que se pueden testear, como en Planta Reci.

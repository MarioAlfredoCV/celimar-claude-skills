# Plantilla de la sección "Organización" del plan

Esto es lo que la skill **inyecta** en el plan que plan-first presenta al usuario, cuando la estrategia es distinta de "ninguna". No repitas aquí el resto del plan (objetivo, supuestos, pasos): eso ya lo maneja plan-first. Rellena los siete elementos; el séptimo es obligatorio y va **por adelantado**.

## Molde

```
### Organización del trabajo (multiagente)

1. Estrategia: <ninguna | solo-asesor | solo-orquestador | combinada>
   Por qué: <1-2 frases ancladas a las señales de la tarea>

2. Agente líder: <yo / hilo principal>
   Hará: planificar, redactar los briefs, delegar, sintetizar.
   [En orquestación pura y combinada] No procesaré el material crudo.

3. Roster de modelos y esfuerzos (siempre la versión más reciente de cada familia):
   - Hilo principal (líder/ejecutor) — modelo y esfuerzo de la SESIÓN: recomendado
     <Fable, esfuerzo medio / Sonnet, esfuerzo máximo>.
     ⚠️ No puedo cambiarlos yo; correré con lo que tengas seleccionado ahora. Si no
     coincide con lo recomendado, te sugiero cambiarlo tú (en esta sesión o en otra)
     antes de aprobar. Los subagentes de abajo sí los fijo yo.
   - Subagentes (los fijo yo):
     [Combinada]
     · Workers ejecutores: Haiku · máximo (×N) — <para qué piezas>
     · Extractores-clasificadores: Haiku · medio (×N), cada uno con revisor Sonnet · máximo
     · Asesor de piezas: Fable · medio
     · Emergencia: si se agota la cuota de Fable, el asesor pasa a Opus · high (lo
       cambio yo) y te pediré pasar esta sesión a Opus · high (lo cambias tú).
     [Solo-orquestador]
     · Ejecutores: Sonnet · máximo (×N) — <para qué piezas>
     · Extractores-clasificadores: Haiku · máximo (×N), sin revisor
     [Solo-asesor]
     · Asesor: Fable · medio
     [Deja solo el bloque de la estrategia elegida.]

4. Subagentes y descomposición: <N> workers.
   - Worker 1 → <pieza / sub-tarea>
   - Extractor 1 → <qué extrae/clasifica> → entrega su archivo a Worker <k>
   - ...

5. Briefs (una línea cada uno):
   - Worker k recibe <insumo>, entrega <resultado destilado> bajo <estándar>.
   - Extractor j recibe <insumo>, guarda <archivo>; me devuelve solo ruta y conteo;
     yo paso la ruta al worker consumidor sin abrir los datos.

6. QA / asesor: <quién revisa a quién, con qué modelo y esfuerzo, en qué momento>.

7. Ronda de revisiones (por adelantado): cuando entregue la v1 y me pidas
   cambios, re-delegaré con esta misma organización; decidiré como líder si
   los cambios ameritan reactivar al asesor o basta con el worker; si un
   asesor falla, el worker me entrega igual su parte destilada, me avisa y yo
   hago una revisión crítica mayor antes de consolidar.
```

## Ejemplo rellenado (caso combinado: 8 transcripciones)

```
### Organización del trabajo (multiagente)

1. Estrategia: combinada.
   Por qué: 8 transcripciones independientes (volumen paralelizable) y cada
   par documento+presentación se beneficia de un QA fuerte antes de consolidar.

2. Agente líder: yo (hilo principal).
   Hará: planificar, redactar los briefs, delegar las 8 piezas, integrar y
   entregar. No leeré las transcripciones crudas; solo veré lo destilado.

3. Roster de modelos y esfuerzos (versión más reciente de cada familia):
   - Hilo principal (líder) — modelo de la SESIÓN: recomendado Fable, esfuerzo
     medio. ⚠️ No puedo cambiarlo yo; si esta sesión no está así, te sugiero
     cambiarlo (en esta sesión o en otra) antes de aprobar.
   - Subagentes (los fijo yo): workers Haiku · máximo (×8); asesor Fable · medio
     (QA por pieza). Sin extractores: no hay datos masivos que clasificar.
   - Emergencia: si se agota la cuota de Fable, el asesor pasa a Opus · high (lo
     cambio yo) y te pediré pasar esta sesión a Opus · high.

4. Subagentes y descomposición: 8 workers, uno por transcripción.
   - Worker 1 → transcripción 1 → Word + presentación
   - ... (2 a 8, igual)

5. Briefs:
   - Worker k recibe la transcripción k y la plantilla/estilo acordados,
     entrega el .docx y el .pptx finales + una nota destilada (decisiones
     tomadas, dudas), bajo el estándar de formato y fidelidad convenido.

6. QA / asesor: antes de entregarme su parte, cada worker comisiona a un
   asesor Fable que revisa su borrador (fidelidad a la transcripción,
   formato, coherencia). El worker incorpora y me entrega solo lo destilado;
   el detalle del QA no llega a mi contexto.

7. Ronda de revisiones (por adelantado): si tras ver la v1 pides ajustes a
   algún archivo, re-delego esa pieza a su worker; decido si el cambio amerita
   reactivar al asesor (cambios de fondo) o si basta el worker (ajustes
   menores); si el asesor falla, el worker me entrega igual lo destilado, me
   avisa, y reviso yo con mayor rigor. Vuelvo a entregarte para tu aprobación.
```

## Ejemplo rellenado (combinada con extractores: 600 facturas)

```
3. Roster de modelos y esfuerzos (versión más reciente de cada familia):
   - Hilo principal (líder) — recomendado Fable, esfuerzo medio.
   - Subagentes (los fijo yo):
     · 3 extractores Haiku · medio: cada uno lee 200 facturas y extrae proveedor,
       fecha, monto y rubro a un CSV; cada uno con su revisor Sonnet · máximo.
     · 1 worker Haiku · máximo: arma el informe de gasto por rubro y detecta
       anomalías.
     · 1 worker Haiku · máximo: genera la tabla anexa con formato fijo.
     · Asesor Fable · medio: revisa el informe y la tabla antes de la entrega.
     · Emergencia: si se agota la cuota de Fable, asesor Opus · high.

5. Briefs:
   - Extractor j recibe su lote de 200 facturas, guarda lote_j.csv, me devuelve
     solo la ruta, el conteo y cuántas quedaron dudosas. No abro los CSV: paso
     las 3 rutas al worker del informe y al de la tabla anexa.
```

El roster es fijo por estrategia. Si crees que una pieza pide otro modelo o esfuerzo, propónlo como excepción en el punto 3 y espera el visto bueno del usuario; no lo cambies por tu cuenta.

---
name: orquestador-asesor
description: >-
  Emula en Cowork o Claude Code las 2 estrategias multiagente de Anthropic: ORQUESTADOR (un líder
  planifica y sintetiza mientras subagentes más baratos hacen la lectura/proceso pesado y
  devuelven lo destilado) y ASESOR (un modelo más fuerte revisa y da QA/guía). Úsala en tareas
  SUSTANCIALES que ganen con repartir en subagentes o un QA fuerte: lotes de entregables similares
  (transcripciones, CVs, contratos, facturas, flujos), lectura/procesamiento pesado y
  paralelizable, barridos de código o datos, o una pieza larga y de alto riesgo. También si piden
  "orquestador", "asesor/advisor", "subagentes", "workers", "delegar en subagentes", "plan big
  execute small" o "QA con otro modelo". Decide la estrategia (solo-asesor, solo-orquestador,
  combinada o ninguna) y SIEMPRE presenta el plan de organización antes de ejecutar. Requiere
  subagentes: Cowork y Code, NO Chat. No la uses para preguntas informativas, orquestación de
  contenedores, delegar a personas/apps, gestión de archivos, ni tareas triviales de un paso.
---

# Orquestador–Asesor

## Qué es y por qué existe

Anthropic documenta dos patrones multiagente para su plataforma:

- **Orquestador** (cookbook *plan big, execute small*): un modelo líder planifica y sintetiza sin tocar el material crudo; subagentes más baratos leen/procesan en su propio contexto y devuelven solo hallazgos **destilados**. En las corridas del cookbook esto resultó ~2.5× más barato y ~3× más rápido con calidad equivalente.
- **Asesor** (*advisor tool*): un modelo más fuerte lee el contexto completo y devuelve un plan o una corrección de rumbo; el ejecutor continúa informado por ese consejo. Encaja en tareas largas donde la mayoría de pasos son mecánicos pero **acertar el plan es crítico**.

Ambos son features de la **plataforma** (API / Managed Agents), no del runtime de Cowork/Code. Esta skill los **emula** con la herramienta de subagentes (Agent/Task) que sí existe aquí. Qué se traslada y qué no, con honestidad:

- **Sí se traslada:** el aislamiento de contexto (la lectura pesada de los workers no contamina el contexto del líder), el paralelismo y una capa de QA con un modelo más fuerte. Esto es lo que produce el salto de calidad y velocidad.
- **No se traslada igual:** el ahorro en dólares del cookbook proviene de la facturación *por thread* de la API. En una sesión con suscripción el costo se contabiliza distinto; no prometas "2.5× más barato" como si fuera dinero.

## Requisito de entorno (verifícalo primero)

Esta skill necesita poder lanzar subagentes. **Antes de proponer cualquier estrategia**, confirma que la herramienta de subagentes (Agent/Task) está disponible en la sesión.

- Si **no** lo está (caso típico: Chat), detente y avísale al usuario en una línea: *"Esta estrategia usa subagentes, que solo están disponibles en Cowork y en Claude Code. Aquí en Chat no puedo ejecutarla."* No intentes emularla en serie tú solo: perderías el aislamiento de contexto, que es el punto.

## Composición con plan-first y prompt-six-sigma (no dupliques)

Estas dos skills ya se aplican a toda solicitud. Esta skill **se acopla** a ellas, no las repite:

- **plan-first** es dueño del *gate*: diseñar el plan, preguntar lo que falte y esperar la aprobación explícita del usuario. Tú **no** vuelves a implementar el "espera aprobación"; lo que aportas es una **sección de Organización** dentro de ese mismo plan (ver Paso 2).
- **prompt-six-sigma** cubre el control de calidad genérico del prompt (Fase 1) y la autorrevisión silenciosa de la respuesta (Fase 2). El **pase de asesor** de esta skill es distinto: es un QA *de dominio* sobre el trabajo de los subagentes, no la autorrevisión del líder. Son complementarios.

En una línea: plan-first pone el gate, six-sigma pone el QA genérico, y esta skill pone la **estrategia multiagente + la organización dentro del plan + la mecánica de ejecución + el esquema de revisiones**.

## Paso 1 — Clasificar la tarea y elegir estrategia

Decide entre cuatro salidas: **ninguna**, **solo-asesor**, **solo-orquestador** o **combinada**. Señales rápidas (el detalle y los ejemplos están en `references/matriz-decision.md`, léelo si la tarea no calza de inmediato):

- **Ninguna** — la tarea es corta o de una sola pieza, o exige juicio de modelo frontera sobre el material crudo (donde un worker barato "resumiría de más" lo importante). Aquí delegar cuesta más de lo que aporta: resuélvela directo. *No fuerces la skill.*
- **Solo-asesor** — trabajo esencialmente de una pieza (un documento, un análisis, una decisión de arquitectura), largo o de alto riesgo, donde un buen plan inicial o una revisión fuerte al final es lo que mueve la aguja. No hay volumen paralelizable que justifique varios workers.
- **Solo-orquestador** — hay **volumen paralelizable**: N piezas similares e independientes (varias transcripciones, archivos, fuentes, módulos) o lectura/procesamiento pesado. El valor está en repartir y aislar contexto.
- **Combinada** — volumen paralelizable **y** cada pieza se beneficia de un QA fuerte antes de consolidarse. Es el caso del ejemplo de referencia (8 transcripciones → un documento y una presentación por cada una, con QA por pieza).

Si tras leer la matriz sigues sin poder elegir con confianza, **pregunta al usuario** lo mínimo que te falte (volumen, si las piezas son independientes, nivel de rigor esperado) antes de proponer el plan.

## Paso 2 — Construir el Plan de Ejecución (tu aporte al plan de plan-first)

Cuando la estrategia sea distinta de "ninguna", el plan que plan-first presenta **debe** incluir una sección de **Organización** con estos elementos. Usa `references/plantilla-plan.md` como molde:

1. **Estrategia elegida y por qué** — una o dos frases ancladas a las señales del Paso 1.
2. **Agente líder** — normalmente tú (el hilo principal). Qué hará: planificar, redactar los briefs, delegar, sintetizar. En orquestación pura y combinada, el líder **no** procesa el material crudo.
3. **Roster de modelos y esfuerzos** — qué modelo y qué nivel de esfuerzo cumple cada rol, según los defaults de más abajo (ajústalos si la tarea lo pide y dilo). Distingue el **hilo principal** (corre al modelo y esfuerzo de la sesión; la skill no los cambia) de los **subagentes** (esos sí los fijas tú). El roster es fijo por estrategia: no clasifiques a los workers por nivel de criterio. Incluye aquí el **recordatorio del hilo principal** descrito en "Defaults de modelos" y, en la combinada, la **regla de emergencia** (Opus · `high` si se agota la cuota de Fable).
4. **Número de subagentes y descomposición** — cuántos workers, y qué pieza/sub-tarea toma cada uno. Si hay clasificación o extracción de datos, sepárala en workers **extractores** (rol fijo) y di a qué worker consumidor entrega cada uno. Recuerda que dividir de más tiene un costo fijo por subagente; busca el punto donde cada brief es sustancial, no atómico.
5. **Brief destilado por worker** — en una línea cada uno: qué recibe, qué entrega y bajo qué estándar. Los workers devuelven solo su resultado destilado, no todo su historial.
6. **Esquema de QA / asesor** — quién revisa a quién, con qué modelo, con qué esfuerzo y en qué momento (por pieza antes de entregar, o al final). En la combinada, los extractores tienen su propio revisor Sonnet y el asesor Fable revisa a los workers que producen piezas. En solo-orquestador no hay revisor ni asesor: el líder coordina a ejecutores y extractores según su rol.
7. **Esquema de la ronda de revisiones** *(obligatorio, va por adelantado)* — explica **desde ya** cómo abordarás los cambios cuando el usuario, tras ver la v1, pida ajustes: que re-delegarás con la misma organización, que tú como líder decides si esas correcciones ameritan reactivar a los asesores o basta con los workers, y que si un asesor falla, el worker te entrega igual su parte destilada y te avisa para que hagas una revisión crítica mayor.

Luego, plan-first hace lo suyo: espera la aprobación del usuario. No ejecutes antes.

## Paso 3 — Ejecutar (mecánica con subagentes)

Las plantillas de instrucciones para cada rol están en `references/prompts-roles.md`. Principios:

- **Delega en paralelo.** Lanza los workers independientes en el mismo turno (varias llamadas al Agent tool a la vez) para aprovechar el paralelismo. Asigna a cada subagente su `model` **y su `effort`** según el roster; esta skill pide esos niveles de forma explícita, así que pásalos siempre. No uses el tipo `fork` para estos roles: un fork hereda el modelo y el esfuerzo del hilo principal e ignora los que le pases.
- **Extracción y clasificación: del extractor al consumidor, sin pasar por el líder.** El worker extractor guarda su resultado en un archivo y al líder solo le devuelve la **ruta del archivo y un conteo** (filas, categorías, casos sin clasificar). En la **combinada**, antes de entregar, su revisor Sonnet revisa el archivo y el extractor corrige. En **solo-orquestador** no hay revisor: el extractor (Haiku · máximo) se autoverifica contra las reglas del brief antes de entregar. En ambos casos el líder pasa esa ruta en el brief del worker consumidor **sin abrir el archivo ni revisar su contenido**: el consumidor es quien usa los datos y quien anota como duda lo que no cuadre. Así el contexto del líder queda libre del volumen masivo.
- **Briefs autocontenidos.** El líder no puede ver el prompt interno de un subagente; todo lo que el worker sabe viene del brief. Descríbele la tarea, el estándar de calidad y el formato de entrega completos.
- **Entrega destilada.** Instruye a cada worker a devolver **solo** el resultado y la evidencia mínima (rutas de archivo, cifras, decisiones), no su historial de razonamiento ni el material crudo que leyó. Ese corte es lo que mantiene limpio el contexto del líder.
- **Pase de asesor.** Antes de que un worker entregue, comisiona la revisión del asesor (modelo más fuerte; `fable` · `medium`, o `opus` · `high` en emergencia, ver "Emergencia") sobre su borrador; el worker incorpora y luego entrega destilado al líder. Ver `references/prompts-roles.md` para cómo debe tratar el consejo (darle peso, pero si la evidencia empírica lo contradice, reconciliar, no cambiar en silencio).
- **Antes del QA, haz durable el entregable.** El worker escribe/guarda su archivo antes de pedir la revisión: si algo se corta, persiste el trabajo.
- **Errores de infraestructura.** Si un worker devuelve un error (timeout, límite de tasa) en vez de resultado, re-asigna esa sub-tarea a un worker nuevo; no lo trates como hallazgo.
- **Espera y sintetiza.** Reúne todas las entregas destiladas antes de consolidar. La síntesis final la hace el líder.

Sobre el **anidamiento** (worker que lanza su propio asesor, o extractor de la combinada que lanza su propio revisor): puede o no estar habilitado según el entorno. Al inicio de la ejecución, **verifícalo con una prueba mínima**. Si el anidamiento funciona, sigue el diseño worker→asesor y extractor→revisor (el QA queda invisible para el líder, como en el ejemplo de referencia). Si **no** funciona, degrada con elegancia: el **líder comisiona** el pase de revisión como subagente hermano que revisa la salida del worker antes de aceptarla. En el caso del extractor, el líder solo le pasa la ruta al revisor y recibe su veredicto (aprobado o qué se corrigió); tampoco abre los datos. La función de QA se conserva; solo cambia quién la dispara.

## Paso 4 — Ronda de revisiones

Cuando el usuario, tras ver la v1, pida cambios o mejoras, trátalos con la **misma organización** que ya anunciaste en el plan:

- Re-delega los ajustes a los workers responsables de esas piezas (con su brief actualizado).
- Usa tu **criterio de líder** para decidir si la corrección amerita reactivar a los asesores (cambios de fondo, decisiones no triviales) o si basta con el trabajo de los workers (ajustes menores). Dilo cuando lo decidas.
- Si un asesor **falla** con un worker, el worker te entrega igual su parte destilada y te avisa; en esos casos haz **tú** un esfuerzo mayor de revisión crítica antes de consolidar.
- Vuelve a entregar la versión destilada al usuario para su aprobación. Repite hasta el visto bueno.

## Defaults de modelos y esfuerzos por estrategia

**Siempre la versión más reciente de cada familia.** El parámetro `model` del Agent tool acepta alias de familia (`fable`, `sonnet`, `haiku`, `opus`) y cada alias apunta a la versión más reciente disponible de esa familia. Por eso esta skill nombra familias, no números de versión: cuando salga una versión nueva, el roster la toma sin editar nada. Al presentar el plan puedes nombrar la versión vigente si la conoces (por ejemplo "Sonnet, hoy 5.5"), pero el alias que pasas es el de la familia.

**El esfuerzo se fija por subagente.** El Agent tool tiene un parámetro `effort` (`low`, `medium`, `high`, `xhigh`, `max`). Esta skill pide niveles concretos para cada rol, así que pásalos siempre. Si el entorno rechaza el `effort` para un modelo, lanza el subagente sin él y dilo en una línea.

**Límite técnico:** la skill solo fija modelo y esfuerzo de los **subagentes** que lanza. **El hilo principal —el líder o ejecutor que eres tú— corre con el modelo y el esfuerzo que el usuario eligió para la sesión, y la skill no puede cambiarlos.** Si la sesión está en Haiku, el líder orquesta en Haiku.

| Estrategia | Hilo principal (lo elige el usuario en la sesión) | Subagentes (`model` · `effort` que fija la skill) |
|---|---|---|
| **Combinada** | Líder — siempre **Fable**, esfuerzo medio. Emergencia (cuota de Fable agotada): **Opus** · high | Workers ejecutores (todos, sin clasificar por criterio): `haiku` · `max` · Extractores-clasificadores (rol fijo): `haiku` · `medium` · Revisor de extractores: `sonnet` · `max` · Asesor de piezas: `fable` · `medium`. Emergencia (cuota de Fable agotada): asesor `opus` · `high` |
| **Solo asesor** | Diseñador/ejecutor — siempre **Sonnet**, esfuerzo máximo | Asesor: `fable` · `medium` |
| **Solo orquestador** | Líder — siempre **Fable**, esfuerzo medio | Ejecutores: `sonnet` · `max` (×N). Si hay extracción masiva: extractores `haiku` · `max`, **sin revisor**. El líder coordina el trabajo entre ejecutores y extractores según su rol |

El roster es fijo: no lo cambies por tu cuenta. Si crees que una tarea pide otro modelo o esfuerzo, propónlo en el plan como excepción y espera el visto bueno del usuario.

### Por qué estos niveles

- **Fable (líder y asesor) en esfuerzo medio.** Fable ya es el modelo más capaz; su trabajo aquí es planificar, juzgar y revisar, y en esos papeles el esfuerzo máximo suma tiempo y costo sin cambiar mucho la calidad.
- **Sonnet en esfuerzo máximo** como ejecutor del hilo principal (solo-asesor), ejecutor de solo-orquestador y revisor de extractores (combinada). El esfuerzo máximo le da el razonamiento extra que acerca su resultado al de un modelo mayor.
- **Combinada: todos los workers en Haiku · máximo.** No se distingue entre criterio alto y bajo. La red de calidad es el asesor Fable, que revisa cada pieza antes de que llegue al líder; por eso el brief de cada worker debe ser más explícito (reglas, estándar, ejemplos) y el pase de asesor no se omite.
- **Combinada: extractores en Haiku · medio con revisor Sonnet · máximo.** Son tareas masivas y repetitivas donde el volumen pesa más que el juicio; el revisor Sonnet atrapa los errores que se escapen. Revisar extracciones no necesita un modelo frontera.
- **Solo-orquestador: ejecutores Sonnet · máximo y extractores Haiku · máximo sin revisor.** Sin capa de asesor ni de revisor, cada subagente debe ser sólido por sí mismo: el extractor sube a esfuerzo máximo y se autoverifica, y el ejecutor Sonnet que consume sus datos anota como duda lo que no cuadre.
- **Opus solo en emergencia y nunca por encima de `high`.** Es el relevo de Fable cuando su cuota se agota, no una opción del roster normal.

### Emergencia: cuota de Fable agotada (solo combinada)

Si durante una combinada se alcanza el límite de uso de Fable, entra **Opus, versión más reciente (alias `opus`), con esfuerzo `high`** — nunca `xhigh` ni `max`:

- **Asesor (subagente, lo cambias tú).** Si al lanzar el asesor `fable` el entorno devuelve un error de límite de uso o de cuota, relanza ese mismo pase con `model: opus` · `effort: high` y avisa al usuario en una línea. Si el anidamiento está activo y es el worker quien lanza a su asesor, pon esta regla en el brief del worker. Un error transitorio (timeout, límite de tasa momentáneo) **no** es emergencia: reintenta con Fable.
- **Líder (hilo principal, lo cambia el usuario).** La skill no puede cambiar el modelo de la sesión. Si la sesión deja de poder correr en Fable, pídele al usuario que la pase a **Opus · high** y continúa con la misma organización, sin rehacer el plan.
- **Vuelta a la normalidad.** Cuando Fable vuelva a estar disponible, los pases de asesor siguientes regresan a `fable` · `medium`. No rehagas los pases que ya hizo Opus.
- **Dilo en la entrega.** Indica qué piezas revisó Opus en lugar de Fable.

Esta regla aplica solo a la combinada. En solo-asesor y solo-orquestador, si Fable se agota, detente y consulta al usuario.

### Recordatorio del hilo principal (obligatorio en el plan)

Siempre que la estrategia recomiende un modelo para el hilo principal (combinada, solo-orquestador y solo-asesor), incluye en el plan una nota como esta, porque el cambio no está en tus manos:

> Nota de modelo: la estrategia sugiere que el hilo líder/ejecutor (yo) corra en **\<Fable / Sonnet\>, versión más reciente, con esfuerzo \<medio / máximo\>**. No puedo cambiar el modelo ni el esfuerzo de esta sesión por mí mismo; me ejecutaré con lo que tengas seleccionado ahora \<nómbralo si lo conoces\>. Si no coincide, te recomiendo cambiarlo tú —en esta sesión o abriendo otra— antes de aprobar. Los modelos y esfuerzos de los subagentes sí los fijo yo. \[Solo en la combinada\] Si se agota la cuota de Fable, el relevo es Opus con esfuerzo high: el del asesor lo hago yo; el de esta sesión tendrías que hacerlo tú.

Si conoces el modelo de la sesión y ya coincide con el recomendado, dilo y ahórrate el aviso. En "ninguna" no aplica.

## Cuándo NO delegar (guardarraíles honestos del cookbook)

- **Preguntas estrechas:** si hay poca lectura/procesamiento que repartir, un solo agente es mejor; delegar solo suma el costo fijo de arrancar subagentes.
- **Juicio frontera sobre el material crudo:** si la tarea exige análisis sutil del contenido mismo (no fact-finding ni transformación mecánica), un worker barato puede "resumir de más" justo lo que importaba.
- **El estándar solo cubre lo que especificas:** los workers verifican/procesan según el brief; si un criterio no está en el brief, no ocurre. Sé explícito.

Si detectas cualquiera de estos casos, la salida correcta del Paso 1 es **ninguna**: resuélvelo directo y dilo, en vez de montar una orquesta que no aporta.

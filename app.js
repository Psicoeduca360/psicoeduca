// --- Sistema de Usuarios, Registro y Persistencia por Clave en LocalStorage ---
const getUsersDB = () => {
    return JSON.parse(localStorage.getItem('psicoeduca_users_db')) || {};
};

const saveUsersDB = (db) => {
    localStorage.setItem('psicoeduca_users_db', JSON.stringify(db));
};

const getAccessLogs = () => {
    return JSON.parse(localStorage.getItem('psicoeduca_access_logs')) || [];
};

const addAccessLog = (userName, userKey) => {
    const logs = getAccessLogs();
    const nowStr = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    logs.unshift({
        userName: userName,
        userKey: userKey,
        date: nowStr,
        timestamp: Date.now()
    });
    if (logs.length > 100) logs.pop();
    localStorage.setItem('psicoeduca_access_logs', JSON.stringify(logs));
};

const defaultState = {
    userName: "Docente",
    xp: 0,
    testsCompleted: 0,
    videosWatched: 0,
    level: "Docente Novato",
    notificationsRead: false,
    diagnosticResults: [],
    firstLogin: null,
    lastLogin: null
};

let activeUserKey = localStorage.getItem('psicoeduca_active_user') || 'docente';
let usersDB = getUsersDB();
if (!usersDB[activeUserKey]) {
    usersDB[activeUserKey] = {
        ...defaultState,
        userName: "Docente",
        firstLogin: Date.now(),
        lastLogin: Date.now()
    };
    saveUsersDB(usersDB);
}
let gameState = usersDB[activeUserKey];

const saveGameState = () => {
    if (activeUserKey) {
        usersDB = getUsersDB();
        usersDB[activeUserKey] = gameState;
        saveUsersDB(usersDB);
    }
    localStorage.setItem('psicoeduca_save', JSON.stringify(gameState));
};

const now = new Date().getTime();
let motivationalMessage = "¡Bienvenido a Psicoeduca Academy!";
let motivationalSubtitle = "Estás a punto de dar el primer paso hacia la excelencia educativa.";

const updateMotivation = () => {
    if (!gameState.firstLogin) {
        gameState.firstLogin = now;
        gameState.lastLogin = now;
        motivationalMessage = `¡Bienvenido a Psicoeduca Academy, ${gameState.userName}!`;
        motivationalSubtitle = "Estás a punto de dar el primer paso hacia la excelencia educativa. Comienza explorando los Micro-Cursos.";
        saveGameState();
    } else {
        const daysSinceLastLogin = Math.floor((now - (gameState.lastLogin || now)) / (1000 * 60 * 60 * 24));
        gameState.lastLogin = now;
        saveGameState();

        if (daysSinceLastLogin === 0) {
            motivationalMessage = `¡Qué bueno verte de nuevo hoy, ${gameState.userName}!`;
            motivationalSubtitle = "Tu constancia diaria está forjando a un educador extraordinario. ¡Sigue así, no pierdas el ritmo!";
        } else if (daysSinceLastLogin < 7) {
            motivationalMessage = `¡Hola ${gameState.userName}! De vuelta a la acción.`;
            motivationalSubtitle = `Han pasado ${daysSinceLastLogin} días desde tu última sesión. Tienes notificaciones nuevas y recursos por explorar.`;
        } else {
            motivationalMessage = `¡Te hemos extrañado muchísimo, ${gameState.userName}!`;
            motivationalSubtitle = `Han pasado ${daysSinceLastLogin} días sin verte. El mundo de la pedagogía ha avanzado, descubre todo lo nuevo que tenemos para ti.`;
        }
    }
};

updateMotivation();

window.simulateDaysPassed = (days) => {
    gameState.lastLogin = now - (days * 24 * 60 * 60 * 1000);
    saveGameState();
    location.reload();
};

// --- Sistema de Niveles (20 Ranks) ---
const levelsData = [
    { name: "Docente Novato", xp: 0, seed: "T1", animal: "ant", desc: "Tus primeros pasos en el aula interactiva." },
    { name: "Docente Aprendiz", xp: 500, seed: "T2", animal: "turtle", desc: "Comienzas a entender las dinámicas de grupo modernas." },
    { name: "Docente Entusiasta", xp: 1000, seed: "T3", animal: "mouse", desc: "La pasión por enseñar florece con fuerza en ti." },
    { name: "Docente Explorador", xp: 1500, seed: "T4", animal: "rabbit", desc: "Buscas nuevas herramientas tecnológicas constantemente." },
    { name: "Educador Competente", xp: 2000, seed: "E1", animal: "cat", desc: "Manejas la clase con soltura, empatía y seguridad." },
    { name: "Educador Ágil", xp: 2500, seed: "E2", animal: "dog", desc: "Te adaptas rápido a los cambios del entorno educativo." },
    { name: "Educador Dinámico", xp: 3000, seed: "E3", animal: "monkey", desc: "Tus clases están siempre llenas de energía y movimiento." },
    { name: "Educador Creativo", xp: 3500, seed: "E4", animal: "fox", desc: "Inventas soluciones únicas para problemas didácticos complejos." },
    { name: "Estratega Educativo", xp: 4000, seed: "M1", animal: "wolf", desc: "Planificas el aprendizaje profundo a largo plazo." },
    { name: "Analista de Aprendizaje", xp: 4500, seed: "M2", animal: "bear", desc: "Usas la evaluación y los datos para mejorar tus intervenciones." },
    { name: "Diseñador Instruccional", xp: 5000, seed: "M3", animal: "panther", desc: "Estructuras los contenidos y lecciones como un arquitecto." },
    { name: "Maestro Innovador", xp: 5500, seed: "M4", animal: "tiger", desc: "Rompes los moldes tradicionales de la enseñanza frontal." },
    { name: "Maestro Inspirador", xp: 6000, seed: "M5", animal: "lion", desc: "Tus alumnos te ven como un verdadero modelo a seguir." },
    { name: "Maestro Visionario", xp: 7000, seed: "M6", animal: "eagle", desc: "Ves el enorme potencial oculto dentro de cada estudiante." },
    { name: "Experto en Didáctica", xp: 8000, seed: "L1", animal: "elephant", desc: "Dominas casi todas las técnicas de enseñanza posibles." },
    { name: "Especialista LXD", xp: 9000, seed: "L2", animal: "rhino", desc: "Diseñas grandes experiencias memorables, no solo clases." },
    { name: "Arquitecto Cognitivo", xp: 10000, seed: "L3", animal: "gorilla", desc: "Ayudas a moldear la forma en la que piensan tus alumnos." },
    { name: "Gurú de la Pedagogía", xp: 12000, seed: "L4", animal: "whale", desc: "Una autoridad absoluta en la ciencia y el arte de enseñar." },
    { name: "Mentor Épico", xp: 15000, seed: "L5", animal: "orca", desc: "Formas no solo a alumnos, sino también a otros maestros." },
    { name: "Titán de la Educación", xp: 20000, seed: "Titan", animal: "shark", desc: "Has alcanzado la cúspide evolutiva del docente moderno." }
];

// --- Sistema de Audio (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (type) => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type.startsWith('nav-')) {
        let freq = 600;
        if(type === 'nav-history') freq = 400;
        else if(type === 'nav-courses') freq = 500;
        else if(type === 'nav-tests') freq = 700;
        else if(type === 'nav-gamification') freq = 800;
        else if(type === 'nav-community') freq = 900;
        else if(type === 'nav-profile') freq = 1000;
        else if(type === 'nav-news') freq = 1100;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq/2, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'applause') {
        // Acorde triunfal
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0, audioCtx.currentTime);
            g.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1 + (i*0.1));
            g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 1.5);
        });

        // Simulación de aplausos (ruido blanco filtrado y modulado)
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.2);
        for(let j=0.2; j<1.8; j+=0.05) { noiseGain.gain.linearRampToValueAtTime(0.1 + Math.random()*0.15, audioCtx.currentTime + j); }
        noiseGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noise.start(audioCtx.currentTime);
    }
};

// --- Mock Data ---
const coursesData = {
    lxd: {
        id: 'lxd',
        title: "Diseño de Experiencias de Aprendizaje (LXD)",
        desc: "Aprende a centrar tu enseñanza en la experiencia del estudiante usando metodologías de diseño y empatía.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80",
        progress: 0,
        modules: [
            { id: 1, title: "1. Fundamentos de LXD y Carga Cognitiva", videoUrl: "https://www.youtube-nocookie.com/embed/f20-u7mP-g0", content: "<b>El Diseño de Experiencias de Aprendizaje (LXD)</b> va más allá del diseño instruccional tradicional. Integra principios de la Experiencia de Usuario (UX) con la neurociencia del aprendizaje.", completed: false },
            { id: 2, title: "2. Mapeo del Viaje del Estudiante", videoUrl: "https://www.youtube-nocookie.com/embed/b-60jY9_cK8", content: "Antes de diseñar la primera diapositiva de tu clase, debes entender el 'Learner Journey' (El viaje del aprendiz).", completed: false },
            { id: 3, title: "3. Diseño de Interacciones Significativas", videoUrl: "https://www.youtube-nocookie.com/embed/Hz3p5sYt3eE", content: "La pasividad es el enemigo del aprendizaje moderno. El LXD exige que el alumno sea un agente activo.", completed: false },
            { id: 4, title: "4. Prototipado Rápido en el Aula", videoUrl: "", content: "Tomando inspiración de las metodologías ágiles (Agile), los educadores modernos no esperan al final del semestre para saber si su método funciona.", completed: false },
            { id: 5, title: "5. Evaluación Iterativa (Data-Driven)", videoUrl: "", content: "El LXD no termina cuando se entrega la clase. Debes medir el impacto real de la experiencia que diseñaste.", completed: false }
        ]
    },
    canva: {
        id: 'canva',
        title: "Creación de Contenido con Canva",
        desc: "Aprende a diseñar presentaciones e infografías de altísima calidad usando Canva para cautivar a tus alumnos.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80",
        progress: 0,
        modules: [
            { id: 1, title: "1. Psicología del Color y Tipografía", videoUrl: "", content: "Antes de arrastrar plantillas en Canva, debes entender cómo los colores afectan el estado de ánimo de la clase.", completed: false },
            { id: 2, title: "2. Jerarquía Visual en Presentaciones", videoUrl: "", content: "Tus alumnos no leen las diapositivas de forma lineal, las escanean.", completed: false },
            { id: 3, title: "3. Creación de Infografías", videoUrl: "", content: "El texto plano aburre. Usa los elementos gráficos de Canva para transformar resúmenes de historia.", completed: false }
        ]
    },
    dua: {
        id: 'dua',
        title: "Masterclass: Diseño Universal para el Aprendizaje (DUA)",
        desc: "Transforma tu aula en un entorno 100% inclusivo. Aprende a derribar barreras, aplicar neuroeducación y crear experiencias donde TODOS aprendan.",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80",
        progress: 0,
        modules: [
            { id: 1, title: "1. Introducción al DUA y el Mito del Promedio", videoUrl: "", content: "<b>No existe el estudiante 'promedio'.</b> Descubre las bases neuroeducativas del DUA (Redes de Reconocimiento, Estratégicas y Afectivas) y cómo el diseño arquitectónico universal inspiró la revolución en el aprendizaje.", completed: false },
            { id: 2, title: "2. Principio 1: Compromiso (Engagement)", videoUrl: "", content: "<b>El 'Por qué' del aprendizaje.</b> Diseña estrategias que capten el interés, mantengan el esfuerzo y promuevan la autorregulación ofreciendo autonomía y relevancia.<br><br><div id='dua-interactive-1' style='background: var(--bg-surface); padding: 20px; border-radius: 12px; border-left: 4px solid var(--accent); margin-top: 20px;'><b>Escenario de Aula interactivo:</b> Un estudiante está totalmente desconectado de la lección magistral. ¿Qué haces?<br><div style='display:flex; gap:10px; margin-top:15px;'><button class='hero-btn' style='font-size:12px; padding:8px 12px;' onclick='alert(\"Enfoque Tradicional: El engagement baja porque usas el miedo y limitas la autonomía.\")'>1. Llamarle la atención frente a todos</button><button class='hero-btn' style='font-size:12px; padding:8px 12px; background:var(--success);' onclick='alert(\"Enfoque DUA: Al darle opciones y relevancia a sus intereses, activas su Red Afectiva. ¡Excelente!\")'>2. Acercarte y preguntarle cómo conectar el tema con sus intereses</button></div></div>", completed: false },
            { id: 3, title: "3. Principio 2: Representación", videoUrl: "", content: "<b>El 'Qué' del aprendizaje.</b> Proveer alternativas para la información auditiva y visual. Clarificar el vocabulario y usar múltiples medios interactivos garantiza que la información sea accesible para cualquier red de reconocimiento.", completed: false },
            { id: 4, title: "4. Principio 3: Acción y Expresión", videoUrl: "", content: "<b>El 'Cómo' del aprendizaje.</b> Proveer opciones para la interacción física y la expresión. En lugar de un examen estandarizado único, permite a tus alumnos grabar audios, hacer presentaciones visuales o construir maquetas.", completed: false },
            { id: 5, title: "5. Evaluación Auténtica e Implementación", videoUrl: "https://www.youtube-nocookie.com/embed/f20-u7mP-g0", content: "Aprende a diferenciar el DUA de las adaptaciones curriculares tardías. Evalúa el desempeño práctico minimizando amenazas. Aquí llevamos la teoría a tu propia aula real.", completed: false }
        ]
    },
    miniserie: {
        id: 'miniserie',
        title: "Guía: TikTok y el Microaprendizaje",
        desc: "Descubre el potencial pedagógico de TikTok. Aprende sobre neuroeducación, alfabetización digital y consumo crítico sin necesidad de grabar videos.",
        image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80",
        progress: 0,
        isExternal: true,
        url: "modules/miniserie_tiktok_educacion.html",
        modules: []
    }
};

const testsData = {
    formativa: { title: "Evaluación Formativa", icon: "ph-pencil-line", desc: "Domina las técnicas de evaluación continua.", locked: false, questions: [ { q: "¿Cuál es el propósito principal de la evaluación formativa?", options: ["Clasificar alumnos", "Mejorar el aprendizaje durante el proceso", "Asignar nota", "Castigar errores"], answer: 1 } ] },
    pedagogia: { title: "Fundamentos de Pedagogía", icon: "ph-books", desc: "Principios básicos del proceso educativo.", locked: false, questions: [ { q: "¿Quién es considerado el padre de la pedagogía moderna?", options: ["Dewey", "Piaget", "Jan Amos Comenius", "Vygotsky"], answer: 2 } ] },
    andragogia: { title: "Andragogía Avanzada", icon: "ph-users-four", desc: "Estrategias para la educación de adultos.", locked: false, questions: [ { q: "Los adultos aprenden mejor cuando...", options: ["Se les impone", "El aprendizaje tiene relevancia inmediata", "Hay repetición", "Están aislados"], answer: 1 } ] },
    didactica: { title: "Didáctica Práctica", icon: "ph-presentation-chart", desc: "El arte de enseñar: métodos y técnicas.", locked: false, questions: [ { q: "¿Qué es la transposición didáctica?", options: ["Evaluación", "Adaptar el saber académico al saber enseñado", "Castigo", "Copiar texto"], answer: 1 } ] }
};

// --- Test Diagnósticos ---
const constructivistData = [
    { q: "Al iniciar un nuevo módulo de formación, ¿qué acción priorizas?", options: [ { text: "Explicar el temario y los objetivos detalladamente.", points: 0 }, { text: "Hacer algunas preguntas generales para ver si conocen el tema.", points: 1 }, { text: "Hacer una encuesta rápida o lluvia de ideas guiada.", points: 2 }, { text: "Presentar un caso o problema de la vida real y pedir que intenten resolverlo.", points: 3 } ] },
    { q: "Tus estudiantes no logran comprender un concepto complejo. ¿Cómo reaccionas?", options: [ { text: "Repito la explicación más despacio y con otras palabras.", points: 0 }, { text: "Les pido que me digan qué parte no entendieron para explicarla de nuevo.", points: 1 }, { text: "Busco un video, analogía o ejemplo visual distinto para ilustrarlo.", points: 2 }, { text: "Les proporciono un problema similar en parejas para que debatan y descubran el error.", points: 3 } ] },
    { q: "Durante un caso práctico, un grupo comete un error grave de razonamiento.", options: [ { text: "Les indico el error inmediatamente y les doy la respuesta correcta.", points: 0 }, { text: "Les marco que están equivocados y les pido que lo revisen.", points: 1 }, { text: "Espero al final de la actividad para mostrar la solución correcta a todos.", points: 2 }, { text: "Les hago preguntas orientadoras (Socráticas) para que ellos mismos descubran la contradicción.", points: 3 } ] },
    { q: "Al diseñar la evaluación final del curso, prefieres...", options: [ { text: "Crear un examen de selección múltiple sobre los conceptos teóricos.", points: 0 }, { text: "Combinar un examen teórico con algunas preguntas abiertas.", points: 1 }, { text: "Pedirles que expongan un tema teórico libre frente a la clase.", points: 2 }, { text: "Diseñar un proyecto donde deban aplicar lo aprendido para resolver un problema de su entorno laboral.", points: 3 } ] },
    { q: "Respecto a la interacción entre los alumnos durante la clase:", options: [ { text: "Prefiero que trabajen solos para asegurar la asimilación individual.", points: 0 }, { text: "Permito que compartan respuestas solo al final de una tarea individual.", points: 1 }, { text: "Organizo grupos de trabajo para que discutan y entreguen un informe escrito conjunto.", points: 2 }, { text: "Diseño retos que requieren la interdependencia y negociación activa entre los miembros del equipo.", points: 3 } ] },
    { q: "A la hora de estructurar el contenido a enseñar:", options: [ { text: "Sigo estrictamente el manual o temario establecido sin alteraciones.", points: 0 }, { text: "Sigo el temario oficial pero le añado mis propios ejemplos.", points: 1 }, { text: "Doy el contenido base y ofrezco muchas lecturas complementarias opcionales.", points: 2 }, { text: "Adapto el orden y la profundidad del contenido de forma flexible según los intereses de los estudiantes.", points: 3 } ] },
    { q: "Cuando un alumno propone una idea que se desvía del tema central planificado:", options: [ { text: "Le pido amablemente que volvamos al tema que nos toca hoy.", points: 0 }, { text: "Escucho brevemente por cortesía y retomo mi explicación.", points: 1 }, { text: "Anoto su idea en la pizarra para que él la investigue al final de la clase.", points: 2 }, { text: "Aprovecho su idea, la valido, y exploro si podemos conectarla colaborativamente con el objetivo del día.", points: 3 } ] },
    { q: "¿Qué indicador define el éxito final de tus sesiones de formación?", options: [ { text: "Que todos hayan memorizado, asimilado el temario y aprobado el test.", points: 0 }, { text: "Que los estudiantes hayan participado respondiendo correctamente mis preguntas.", points: 1 }, { text: "Que los estudiantes hayan completado los ejercicios prácticos sin muchos errores.", points: 2 }, { text: "Que los estudiantes demuestren capacidad de transferir lo aprendido para analizar y resolver problemas inéditos.", points: 3 } ] }
];

const pedagogicalData = [
    { dimension: "Facilitación del aprendizaje", q: "Inicias un tema complejo y notas que el grupo está confundido. ¿Cuál es tu primera acción?", options: [ { text: "Repetir la explicación tal cual, hablando más pausado.", points: 0 }, { text: "Preguntar al grupo qué parte exacta no entendieron.", points: 1 }, { text: "Buscar un ejemplo cotidiano para hacer una analogía visual.", points: 2 }, { text: "Dividirlos en pares para que comparen sus notas e identifiquen la duda central juntos.", points: 3 } ] },
    { dimension: "Evaluación del aprendizaje", q: "Al finalizar un módulo de formación de un mes, ¿cómo mides el éxito real del grupo?", options: [ { text: "Con un examen escrito estandarizado de opción múltiple.", points: 0 }, { text: "Con un examen escrito más algunas preguntas abiertas de análisis.", points: 1 }, { text: "Pidiendo a los alumnos que realicen una presentación oral sobre la teoría.", points: 2 }, { text: "Mediante la resolución de un caso práctico basado en un problema real de su contexto.", points: 3 } ] },
    { dimension: "Interacción y participación", q: "En un debate grupal, siempre participan las mismas 3 personas. ¿Qué estrategia aplicas?", options: [ { text: "Felicito a los que participan activamente y continúo la clase.", points: 0 }, { text: "Le pido directamente a los alumnos callados que hablen, llamándolos por su nombre.", points: 1 }, { text: "Hago una pregunta abierta y digo que hoy quiero escuchar a alguien diferente.", points: 2 }, { text: "Utilizo la técnica 'Piensa-Compara-Comparte' (Think-Pair-Share) para que todos hablen primero en privado.", points: 3 } ] },
    { dimension: "Gestión del aula", q: "Varios estudiantes están distraídos usando el celular durante tu explicación teórica central.", options: [ { text: "Los regaño frente a todos y les exijo guardar el teléfono inmediatamente.", points: 0 }, { text: "Ignoro la situación mientras no interrumpan el silencio del resto de la clase.", points: 1 }, { text: "Pauso la clase, hago un chiste o anécdota para recuperar su atención y continúo.", points: 2 }, { text: "Cambio la dinámica rápidamente a una actividad donde tengan que usar el celular para investigar.", points: 3 } ] },
    { dimension: "Comunicación educativa", q: "Un estudiante te hace una pregunta excelente que definitivamente no sabes responder. ¿Qué dices?", options: [ { text: "Invento una respuesta que suene muy lógica para no perder autoridad.", points: 0 }, { text: "Digo que ese dato no es tan relevante para el tema central de hoy y sigo adelante.", points: 1 }, { text: "Admito que no lo sé y prometo investigarlo para traerles la respuesta en la próxima clase.", points: 2 }, { text: "Digo: 'Excelente pregunta, no tengo el dato exacto. ¿Quién del grupo nos ayuda a buscarlo ahora mismo en su móvil?'", points: 3 } ] },
    { dimension: "Motivación del estudiante", q: "Debes impartir un tema que sabes que es árido, denso y aburrido por naturaleza.", options: [ { text: "Les digo firmemente que presten atención porque eso saldrá en la evaluación obligatoria.", points: 0 }, { text: "Intento usar muchas diapositivas coloridas y hablar más fuerte de lo normal.", points: 1 }, { text: "Les muestro un video introductorio entretenido antes de iniciar la carga teórica.", points: 2 }, { text: "Planteo un misterio o un 'Reto Imposible' al inicio que solo podrán resolver si dominan el tema aburrido.", points: 3 } ] },
    { dimension: "Adaptabilidad pedagógica", q: "Planificaste una clase interactiva usando el proyector, pero hay un corte repentino de energía eléctrica.", options: [ { text: "Cancelo la sesión o les doy tiempo libre porque es imposible seguir el plan trazado.", points: 0 }, { text: "Saco mis notas impresas y dicto la información para que la copien en sus cuadernos.", points: 1 }, { text: "Hago la clase de forma magistral improvisando frente a ellos hablando claro.", points: 2 }, { text: "Organizo un círculo de sillas, adapto la actividad a un debate oral o juego de roles.", points: 3 } ] },
    { dimension: "Desarrollo del pensamiento crítico", q: "Un estudiante entrega un análisis donde concluye algo completamente erróneo y contradictorio.", options: [ { text: "Le marco una gran 'X' roja, le pongo un cero y le escribo la respuesta que esperaba.", points: 0 }, { text: "Le doy medio punto por el esfuerzo de escribir y le explico verbalmente el porqué de su error.", points: 1 }, { text: "Le pido que rehaga el trabajo prestándole más atención a la página 45 de sus apuntes.", points: 2 }, { text: "Le hago dos preguntas estratégicas escritas al margen para guiarlo a que él mismo descubra su falla lógica.", points: 3 } ] }
];

const innovationData = [
    { dimension: "Diseño de experiencias de aprendizaje", q: "Al estructurar una nueva unidad de capacitación, tu enfoque principal es:", options: [ { text: "Definir los temas a transmitir y preparar las diapositivas de contenido.", points: 0 }, { text: "Organizar el contenido y añadir algunas actividades prácticas al final.", points: 1 }, { text: "Diseñar retos donde los alumnos descubran el contenido mediante la acción.", points: 2 }, { text: "Co-crear el camino de aprendizaje con los alumnos basándome en sus intereses reales.", points: 3 } ] },
    { dimension: "Uso de metodologías activas", q: "¿Con qué frecuencia utilizas enfoques como el Aprendizaje Basado en Proyectos (ABP) o Gamificación?", options: [ { text: "Casi nunca. Prefiero la instrucción directa para garantizar que cubro el temario.", points: 0 }, { text: "Esporádicamente, como una actividad de cierre divertida o proyecto final.", points: 1 }, { text: "Frecuentemente. Mis módulos están diseñados en torno a retos prácticos.", points: 2 }, { text: "Siempre. Mi curso completo está gamificado o basado en resolver un gran desafío transversal.", points: 3 } ] },
    { dimension: "Rol del docente", q: "Durante una sesión típica, la mayor parte del tiempo actúas como:", options: [ { text: "El experto que explica y transmite la información de forma clara frontalmente.", points: 0 }, { text: "El instructor que explica la teoría y luego supervisa los ejercicios.", points: 1 }, { text: "El guía que plantea problemas y hace preguntas para que ellos piensen.", points: 2 }, { text: "Un mentor que facilita recursos mientras los equipos lideran su propio proceso.", points: 3 } ] },
    { dimension: "Rol del estudiante", q: "¿Cuál de estas descripciones se ajusta más a lo que hacen tus estudiantes en clase?", options: [ { text: "Escuchan, toman apuntes y hacen preguntas ocasionales.", points: 0 }, { text: "Escuchan la explicación y luego participan en dinámicas controladas.", points: 1 }, { text: "Investigan, debaten, proponen soluciones y presentan sus ideas constantemente.", points: 2 }, { text: "Toman decisiones sobre su aprendizaje, evalúan a sus pares y crean productos reales.", points: 3 } ] },
    { dimension: "Evaluación", q: "Tu principal instrumento para evaluar si hubo aprendizaje real es:", options: [ { text: "El examen final teórico y objetivo (opción múltiple o preguntas cerradas).", points: 0 }, { text: "Una mezcla entre exámenes teóricos y algunas entregas de trabajos prácticos.", points: 1 }, { text: "Rúbricas aplicadas a proyectos, portafolios de evidencias o simulaciones.", points: 2 }, { text: "Evaluación formativa continua 360 (auto, co y hetero-evaluación) sobre productos.", points: 3 } ] },
    { dimension: "Uso de tecnología educativa", q: "¿Cómo integras las herramientas digitales en tu práctica?", options: [ { text: "Uso el proyector para mostrar presentaciones y el correo para enviar archivos.", points: 0 }, { text: "Uso plataformas LMS (ej. Moodle) como repositorios de PDF y para recibir tareas.", points: 1 }, { text: "Uso apps interactivas (Kahoot, Miro, Padlet) para dinamizar las sesiones.", points: 2 }, { text: "La tecnología es invisible; los alumnos la usan para crear, investigar o simular la realidad.", points: 3 } ] },
    { dimension: "Nivel de contextualización", q: "Respecto a los problemas o ejemplos que usas en clase:", options: [ { text: "Uso los ejemplos clásicos que vienen en los manuales o libros estándar.", points: 0 }, { text: "Intento traer ejemplos de noticias recientes para ilustrar la teoría.", points: 1 }, { text: "Planteo escenarios simulados complejos o casos de estudio de empresas reales.", points: 2 }, { text: "Los estudiantes trabajan con problemas reales de su propia comunidad aportando soluciones.", points: 3 } ] },
    { dimension: "Nivel de experimentación e innovación", q: "Cuando descubres una nueva herramienta o enfoque pedagógico:", options: [ { text: "Rara vez la aplico; prefiero lo que ya me ha funcionado por años.", points: 0 }, { text: "Espero a que mi institución me capacite y me pida usarla oficialmente.", points: 1 }, { text: "La pruebo ocasionalmente en una clase piloto a ver qué tal reaccionan.", points: 2 }, { text: "Itero constantemente mi diseño instruccional, prototipando y midiendo impacto.", points: 3 } ] },
    { dimension: "Manejo del error", q: "Cuando un estudiante se equivoca al aplicar un concepto en una práctica:", options: [ { text: "Le marco el error y le doy la respuesta correcta para que no se confunda.", points: 0 }, { text: "Le explico por qué está mal y le pido que repita el ejercicio exactamente.", points: 1 }, { text: "Le hago preguntas guía para que él mismo descubra dónde falló lógicamente.", points: 2 }, { text: "Celebro el error y le pido al grupo que analice qué podemos aprender de ese fallo iterativo.", points: 3 } ] },
    { dimension: "Diseño del espacio", q: "¿Cómo está distribuido o cómo manejas el espacio físico o virtual de tu clase?", options: [ { text: "Sillas en filas hacia mí / Cámaras apagadas en Zoom mientras comparto pantalla.", points: 0 }, { text: "Sillas en 'U' a veces / Salas virtuales (Breakout rooms) al final de la clase.", points: 1 }, { text: "Mesas de trabajo colaborativo / Plataformas (Mural/Miro) como centro de sesión.", points: 2 }, { text: "El aula es solo un punto; el aprendizaje ocurre explorando la calle, la empresa o simuladores.", points: 3 } ] }
];

const whiteboardSteps = [
    { id: 1, text: "1. Activar conocimientos previos" },
    { id: 2, text: "2. Presentar el objetivo" },
    { id: 3, text: "3. Desarrollo del contenido" },
    { id: 4, text: "4. Práctica guiada" },
    { id: 5, text: "5. Cierre y feedback" }
];

// --- App Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateUI = () => {
        let currentLevelObj = levelsData[0];
        for(let i=0; i<levelsData.length; i++) {
            if(gameState.xp >= levelsData[i].xp) currentLevelObj = levelsData[i];
        }
        gameState.level = currentLevelObj.name;
        saveGameState();

        document.getElementById('sidebar-xp').innerText = `XP: ${gameState.xp}`;
        document.getElementById('topbar-level').innerHTML = `<i class="ph-fill ph-star"></i> ${gameState.level}`;
        const nameDisplay = document.getElementById('user-name-display');
        if(nameDisplay) nameDisplay.innerText = gameState.userName;

        const avatarImg = document.getElementById('user-avatar');
        const profileContainer = document.getElementById('user-profile-container');
        const sidebarLevel = document.getElementById('sidebar-level');
        if (sidebarLevel) sidebarLevel.innerText = gameState.level;

        if(avatarImg && profileContainer) {
            profileContainer.classList.remove('legend-glow');
            if (gameState.xp >= 15000) { profileContainer.classList.add('legend-glow'); }
            avatarImg.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentLevelObj.seed}`;
        }

        // Notification Badges
        const notiBadge = document.querySelector('.notification-badge');
        const navBadge = document.querySelector('.nav-badge');
        if (gameState.notificationsRead) {
            if (notiBadge) notiBadge.style.display = 'none';
            if (navBadge) navBadge.style.display = 'none';
        } else {
            if (notiBadge) notiBadge.style.display = 'block';
            if (navBadge) navBadge.style.display = 'block';
        }
    };

    window.app = {
        toggleThemeMenu: () => {
            playSound('click');
            const menu = document.getElementById('theme-menu');
            if(menu.style.display === 'none' || !menu.style.display) menu.style.display = 'block'; 
            else menu.style.display = 'none';
        },
        changeTheme: (theme) => {
            playSound('success');
            document.body.className = '';
            if(theme !== 'default') document.body.classList.add(`theme-${theme}`);
            document.getElementById('theme-menu').style.display = 'none';
        },
        resetProgress: () => {
            if(confirm("¿Estás seguro de que deseas reiniciar TODO tu progreso? Se borrarán tus XP, resultados y datos guardados de forma permanente.")) {
                playSound('click');
                localStorage.removeItem('psicoeduca_save');
                location.reload(); // Recargar para limpiar todo
            }
        },
        searchApp: (query) => {
            query = query.toLowerCase().trim();
            const resultsContainer = document.getElementById('search-results');
            if (!query) { resultsContainer.style.display = 'none'; return; }
            
            let resultsHtml = '';
            const addResult = (icon, title, subtitle, target) => {
                resultsHtml += `<div class="search-item" onclick="app.navigate('${target}'); document.getElementById('search-results').style.display='none'; document.querySelector('.search-bar input').value=''">
                    <i class="ph ${icon}"></i><div><strong>${title}</strong><br><small style="color:var(--text-secondary)">${subtitle}</small></div>
                </div>`;
            };

            // Menú general
            if("inicio dashboard estadisticas perfil".includes(query)) addResult('ph-squares-four', 'Dashboard & Estadísticas', 'Inicio', 'home');
            if("comunidad foro whatsapp sugerencias".includes(query)) addResult('ph-users-three', 'Comunidad y Redes', 'Comunidad', 'community');
            if("gamificacion juegos pizarra avatares niveles aprende jugando".includes(query)) addResult('ph-game-controller', 'Aprende Jugando', 'Juegos Educativos', 'gamification');
            if("historia grecia roma industrial digital".includes(query)) addResult('ph-scroll', 'Línea de Tiempo Histórica', 'Historia', 'history');
            
            // Cursos y sus módulos (búsqueda profunda)
            Object.values(coursesData).forEach(c => {
                if(c.title.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query)) {
                    addResult('ph-books', c.title, 'Curso Completo', 'courses');
                } else {
                    const matchedModule = c.modules.find(m => m.title.toLowerCase().includes(query) || m.content.toLowerCase().includes(query));
                    if(matchedModule) addResult('ph-book-open', matchedModule.title, `Módulo en: ${c.title}`, 'courses');
                }
            });
            // Tests y simuladores
            Object.keys(testsData).forEach(key => {
                const t = testsData[key];
                if(t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)) {
                    addResult(t.icon, t.title, 'Test/Evaluación', 'tests');
                }
            });
            if("constructivista diagnostico situacional".includes(query)) addResult('ph-brain', 'Perfil Constructivista', 'Diagnóstico', 'tests');
            if("innovacion educativa scanner disruptivo".includes(query)) addResult('ph-scan', 'Scanner de Innovación', 'Diagnóstico Avanzado', 'tests');
            if("pedagogico pedagogia habilidades".includes(query)) addResult('ph-chalkboard-teacher', 'Habilidades Pedagógicas', 'Diagnóstico Avanzado', 'tests');

            if(resultsHtml) { resultsContainer.innerHTML = resultsHtml; resultsContainer.style.display = 'block'; } 
            else { resultsContainer.innerHTML = `<div style="padding: 15px; color: var(--text-secondary); text-align: center;">No se encontraron resultados para "${query}"</div>`; resultsContainer.style.display = 'block'; }
        },
        toggleChatbot: () => {
            playSound('click');
            const cw = document.getElementById('chatbot-window');
            cw.style.display = cw.style.display === 'none' ? 'flex' : 'none';
        },
        sendChatMessage: () => {
            const input = document.getElementById('chatbot-input');
            const text = input.value.trim();
            if(!text) return;
            
            playSound('click');
            const msgContainer = document.getElementById('chatbot-messages');
            msgContainer.innerHTML += `<div class="chat-msg user-msg">${text}</div>`;
            input.value = '';
            msgContainer.scrollTop = msgContainer.scrollHeight;

            const loadingId = "loading-" + Date.now();
            msgContainer.innerHTML += `<div id="${loadingId}" class="chat-msg bot-msg">Elprofe está consultando la base de conocimientos... <i class="ph-bold ph-spinner ph-spin"></i></div>`;
            msgContainer.scrollTop = msgContainer.scrollHeight;

            setTimeout(() => {
                const loadingEl = document.getElementById(loadingId);
                if(loadingEl) loadingEl.remove();
                
                playSound('nav-news');
                const replyHtml = app.getElProfeInternalResponse(text);
                msgContainer.innerHTML += `<div class="chat-msg bot-msg">${replyHtml}</div>`;
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, 350);
        },
        getElProfeInternalResponse: (userText) => {
            const q = userText.toLowerCase().trim();

            if (q.includes('dua') || q.includes('universal') || q.includes('inclus') || q.includes('barrera') || q.includes('promedio')) {
                return `<strong>Elprofe Responde sobre DUA:</strong><br><br>
El <strong>Diseño Universal para el Aprendizaje (DUA)</strong> busca eliminar las barreras de aprendizaje desde la planificación:<br>
1. <strong>Redes Afectivas (El ¿Por qué?):</strong> Proporciona múltiples formas de <em>compromiso y motivación</em>.<br>
2. <strong>Redes de Reconocimiento (El ¿Qué?):</strong> Ofrece múltiples formas de <em>representar la información</em> (audio, visual, esquemas).<br>
3. <strong>Redes Estratégicas (El ¿Cómo?):</strong> Entrega opciones variadas para la <em>acción y expresión</em> (exposición, proyectos, infografías).<br><br>
💡 <em>Consejo de Aula:</em> Recuerda que <strong>no existe el estudiante promedio</strong>. Puedes explorar nuestra Masterclass de DUA en el menú de Cursos.`;
            }

            if (q.includes('constructivis') || q.includes('piaget') || q.includes('vygotsky') || q.includes('socrates') || q.includes('dewey') || q.includes('montessori')) {
                return `<strong>Elprofe Responde sobre Constructivismo:</strong><br><br>
En el enfoque <strong>Constructivista</strong>, el estudiante es el <strong>protagonista activo</strong> que construye su propio saber:<br>
• <strong>Método Socrático:</strong> Guiar con preguntas reflexivas en lugar de dictar verdades absolutas.<br>
• <strong>Zona de Desarrollo Próximo (Vygotsky):</strong> Fomentar el aprendizaje colaborativo con andamiaje pedagógico.<br>
• <strong>Aprender Haciendo (Dewey/Montessori):</strong> Experimentar problemas reales antes de la teoría.<br><br>
💡 Realiza el <strong>Diagnóstico de Perfil Constructivista</strong> en la sección Evaluaciones para medir tu práctica.`;
            }

            if (q.includes('mito') || q.includes('neuro') || q.includes('cerebro') || q.includes('10%') || q.includes('mozart') || q.includes('estilo') || q.includes('multitasking')) {
                return `<strong>Elprofe Responde sobre Neuromitos:</strong><br><br>
La ciencia cognitiva ha desmentido mitos comunes:<br>
1. ❌ <em>"Solo usamos el 10% del cerebro":</em> Falso. Usamos el 100% de nuestras áreas cerebrales a lo largo del día.<br>
2. ❌ <em>"Estilos VAK (Visual, Auditivo, Kinestésico)":</em> No hay evidencia científica de que adaptar la clase al "estilo individual" mejore la retención. Presentar la información en multiformato beneficia a <strong>todos</strong>.<br>
3. ❌ <em>"Multitasking en clase":</em> El cerebro realiza alternancia rápida de atención (task-switching), aumentando la fatiga cognitiva.<br><br>
🎮 Pon a prueba tus conocimientos en el juego <strong>Cazador de Neuromitos</strong> en la pestaña <em>Aprende Jugando</em>.`;
            }

            if (q.includes('distra') || q.includes('celular') || q.includes('aburr') || q.includes('motiv') || q.includes('disciplin') || q.includes('conducta') || q.includes('atencion')) {
                return `<strong>Estrategia de Gestión de Aula de Elprofe:</strong><br><br>
Cuando encuentres desinterés o distracciones con la tecnología:<br>
1. <strong>Cambio de Rol:</strong> Invita a usar el dispositivo para investigar datos concretos en tiempo real.<br>
2. <strong>Técnica Piensa-Compara-Comparte:</strong> Haz una pausa activa y pide discutir una duda en parejas durante 2 minutos.<br>
3. <strong>Ganchos Cognitivos:</strong> Inicia la clase con un enigma o reto práctico antes de exponer contenido abstracto.`;
            }

            if (q.includes('evalua') || q.includes('examen') || q.includes('nota') || q.includes('rubrica') || q.includes('formativ') || q.includes('calific')) {
                return `<strong>Orientación sobre Evaluación Formativa:</strong><br><br>
La evaluación efectiva debe ser <strong>continua y transparente</strong>:<br>
• <strong>Criterios Claros:</strong> Presenta la rúbrica antes de empezar el trabajo.<br>
• <strong>Retroalimentación Constructiva:</strong> Realiza preguntas orientadoras sobre los errores en vez de solo colocar una nota numérica.<br>
• <strong>Evaluación Auténtica:</strong> Mide desempeños prácticos en escenarios reales.`;
            }

            if (q.includes('curso') || q.includes('lxd') || q.includes('canva') || q.includes('tiktok') || q.includes('microaprendizaje') || q.includes('aprender')) {
                return `<strong>Guía de Micro-Cursos Psicoeduca:</strong><br><br>
Explora nuestros 4 programas principales:<br>
1. <strong>LXD (Diseño de Experiencias):</strong> Mapa del viaje del aprendiz.<br>
2. <strong>Masterclass DUA:</strong> Neuroeducación y aulas inclusivas.<br>
3. <strong>Canva para Docentes:</strong> Presentaciones e infografías efectivas.<br>
4. <strong>TikTok y Microaprendizaje:</strong> Uso didáctico de formatos breves.<br><br>
Ingresa a la sección <strong>Cursos</strong> para acceder a los contenidos completos.`;
            }

            if (q.includes('test') || q.includes('scanner') || q.includes('diagnostico') || q.includes('evaluarme') || q.includes('nivel')) {
                return `<strong>Diagnósticos y Tests Disponibles:</strong><br><br>
En la sección de <strong>Tests</strong> puedes medir tu desarrollo:<br>
1. <strong>Scanner de Innovación Educativa:</strong> Mide si tu práctica es Tradicional o Disruptiva.<br>
2. <strong>Diagnóstico de Habilidades Pedagógicas:</strong> Evalúa 8 dimensiones de facilitación.<br>
3. <strong>Diagnóstico de Perfil Constructivista:</strong> Mide la aplicación situacional del aprendizaje activo.`;
            }

            if (q.includes('hola') || q.includes('buenas') || q.includes('quien eres') || q.includes('ayuda') || q.includes('gracias')) {
                return `¡Hola, colega! 👋 Soy <strong>Elprofe</strong>, tu asesor pedagógico virtual.<br><br>
Estoy capacitado para orientarte en:<br>
• <strong>Diseño Universal para el Aprendizaje (DUA)</strong>.<br>
• Estrategias <strong>Constructivistas</strong> y gestión de aula.<br>
• Neuroeducación y <strong>Neuromitos</strong>.<br>
• Recomendaciones de <strong>Cursos</strong> y <strong>Evaluaciones</strong>.<br><br>
¿Qué reto pedagógico deseas resolver hoy?`;
            }

            return `<strong>Elprofe Recomienda:</strong><br><br>
Para abordar <em>"${userText}"</em> desde la innovación educativa:<br>
1. <strong>Contextualiza:</strong> Conecta el tema con casos de la vida real.<br>
2. <strong>Aplica Multimodalidad:</strong> Alterna explicaciones breves con dinámicas en equipo.<br>
3. <strong>Evalúa el Proceso:</strong> Formula preguntas socráticas para verificar la comprensión.<br><br>
💡 Explora las pestañas <strong>Cursos</strong> y <strong>Aprende Jugando</strong> en la barra lateral para aplicar estas metodologías.`;
        },
        handleLoginSubmit: (event) => {
            if (event) event.preventDefault();
            const userInput = document.getElementById('login-username')?.value.trim() || "Docente";
            const passInput = document.getElementById('login-password')?.value.trim() || "";
            const errorEl = document.getElementById('login-error');

            const userKey = userInput.toLowerCase().replace(/\s+/g, '_');
            let db = getUsersDB();

            if (!db[userKey]) {
                db[userKey] = {
                    ...defaultState,
                    userName: userInput,
                    password: passInput,
                    firstLogin: Date.now(),
                    lastLogin: Date.now()
                };
                saveUsersDB(db);
            } else if (passInput && db[userKey].password && db[userKey].password !== passInput) {
                if (errorEl) {
                    errorEl.innerText = "Contraseña incorrecta para este usuario registrado.";
                    errorEl.style.display = 'block';
                }
                return;
            }

            activeUserKey = userKey;
            localStorage.setItem('psicoeduca_active_user', userKey);
            gameState = db[userKey];
            addAccessLog(userInput, userKey);

            if (errorEl) errorEl.style.display = 'none';
            const modal = document.getElementById('login-modal');
            if (modal) modal.style.display = 'none';

            updateUI();
            saveGameState();
            playSound('success');
            app.navigate('home');
        },
        logoutUser: () => {
            playSound('click');
            saveGameState();
            const modal = document.getElementById('login-modal');
            if (modal) {
                const userInp = document.getElementById('login-username');
                if (userInp) userInp.value = gameState.userName || '';
                const errEl = document.getElementById('login-error');
                if (errEl) errEl.style.display = 'none';
                modal.style.display = 'flex';
            }
        },
        renderVideoPlayer: (videoUrl, title = "Video Formativo", posterImg = "assets/educator.png") => {
            if (!videoUrl) return '';
            const isLocalFile = window.location.protocol === 'file:';
            const videoId = videoUrl.includes('embed/') ? videoUrl.split('embed/')[1].split('?')[0] : '';
            const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : videoUrl;

            if (isLocalFile) {
                return `
                    <div class="custom-video-card" style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)), url('${posterImg}') center/cover; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); padding: 35px 25px; margin-bottom: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: #FF0000; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(255,0,0,0.4); cursor: pointer;" onclick="window.open('${watchUrl}', '_blank')">
                            <i class="ph-fill ph-play" style="font-size: 32px; color: white; margin-left: 4px;"></i>
                        </div>
                        <h3 style="color: white; font-size: 20px; margin-bottom: 10px;">${title}</h3>
                        <p style="color: var(--text-secondary); font-size: 14px; max-width: 500px; margin: 0 auto 20px; line-height: 1.5;">
                            Estás ejecutando la aplicación localmente (protocolo <code>file://</code>). Los navegadores bloquean reproductores embebidos de YouTube en archivos locales por seguridad. Al desplegar en <strong>GitHub Pages</strong> se reproducirá automáticamente.
                        </p>
                        <a href="${watchUrl}" target="_blank" class="hero-btn" style="background: #FF0000; color: white; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px;">
                            <i class="ph-bold ph-youtube-logo" style="font-size: 22px;"></i> Abrir Video en YouTube.com
                        </a>
                    </div>
                `;
            }

            return `
                <div style="position: relative; width: 100%; max-width: 680px; aspect-ratio: 16/9; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin: 0 auto 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                            src="${videoUrl}?rel=0&modestbranding=1" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerpolicy="strict-origin-when-cross-origin" 
                            allowfullscreen></iframe>
                </div>
                <div style="margin-bottom: 25px; text-align: center;">
                    <a href="${watchUrl}" target="_blank" style="font-size: 13px; color: var(--primary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="ph-bold ph-youtube-logo" style="color: #FF0000; font-size: 18px;"></i> Abrir este video directamente en YouTube.com
                    </a>
                </div>
            `;
        },
        showCertificate: (courseId) => {
            playSound('success');
            const c = coursesData[courseId];
            const modal = document.getElementById('certificate-modal');
            modal.innerHTML = `
                <div class="certificate-box">
                    <div class="cert-title">Certificado de Excelencia</div>
                    <div class="cert-subtitle">Otorgado a</div>
                    <div class="cert-name">${gameState.userName}</div>
                    <div class="cert-subtitle">por haber completado exitosamente el programa educativo:</div>
                    <div class="cert-course">${c.title}</div>
                    <div class="cert-footer">
                        <div class="cert-seal"><i class="ph-bold ph-certificate"></i></div>
                        <div class="cert-sign">
                            <span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 18px; color: var(--primary);">Psicoeduca Academy</span><br>
                            <span style="font-size:12px; color:#999;">Expedido el ${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="cert-actions" data-html2canvas-ignore>
                        <button class="hero-btn" onclick="window.print()"><i class="ph-bold ph-printer"></i> Imprimir / PDF</button>
                        <button class="hero-btn" style="background:var(--error);" onclick="document.getElementById('certificate-modal').style.display='none'"><i class="ph-bold ph-x"></i> Cerrar</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
        },
        updateName: (newName) => { gameState.userName = newName || "Docente"; updateUI(); saveGameState(); },
        sendSuggestion: () => {
            playSound('click');
            const text = document.getElementById('suggestion-box').value;
            if(!text) return alert("Por favor escribe una sugerencia primero.");
            const email = "tucorreo@ejemplo.com"; 
            const subject = "Sugerencia para Psicoeduca Academy";
            const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
            window.location.href = mailto;
            document.getElementById('suggestion-box').value = '';
        },
        navigate: (viewName) => {
            playSound('nav-' + viewName);
            
            if (viewName === 'news') { gameState.notificationsRead = true; saveGameState(); }

            if (views[viewName]) {
                contentArea.innerHTML = views[viewName]();
                updateUI();
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`[data-target="${viewName}"]`);
                if(activeLink) activeLink.classList.add('active');
            }
        },
        startCourse: (courseId) => { 
            playSound('click'); 
            window.app.currentCourse = coursesData[courseId]; 
            if (window.app.currentCourse.isExternal) {
                window.app.openExternalModule(window.app.currentCourse.url);
            } else {
                window.app.renderCourseModule(window.app.currentCourse.modules[0].id); 
            }
        },
        openExternalModule: (url) => {
            contentArea.innerHTML = `
                <div class="view-animate" style="height: calc(100vh - 80px); display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-shrink: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 12px;" onclick="app.navigate('home')">
                            <i class="ph-bold ph-arrow-left"></i> Cerrar Módulo Externo
                        </div>
                    </div>
                    <div style="flex: 1; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative;">
                        <iframe src="${url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: #fff;"></iframe>
                    </div>
                </div>
            `;
        },
        renderCourseModule: (moduleId) => {
            const course = window.app.currentCourse;
            const currentModule = course.modules.find(m => m.id === moduleId);
            
            const sidebarHTML = course.modules.map(m => `
                <div class="module-item ${m.id === moduleId ? 'active' : ''} ${m.completed ? 'completed' : ''}" onclick="playSound('click'); app.renderCourseModule(${m.id})">
                    <div><div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${m.title}</div>${m.completed ? '<div style="font-size: 12px;">Completado</div>' : ''}</div>
                    ${m.completed ? '<i class="ph-fill ph-check-circle"></i>' : '<i class="ph ph-play-circle"></i>'}
                </div>
            `).join('');

            const modulePoints = currentModule.videoUrl ? 300 : 100;
            const actionBtn = currentModule.completed 
                ? `<button class="hero-btn" style="background: var(--success); cursor: default;">Módulo Completado <i class="ph-bold ph-check"></i></button>`
                : `<button class="hero-btn" onclick="app.completeModule('${course.id}', ${moduleId})">Marcar como Completado (+${modulePoints} XP)</button>`;

            const videoElement = currentModule.videoUrl ? window.app.renderVideoPlayer(currentModule.videoUrl, currentModule.title, course.image) : '';

            // Especial DUA UX: Multirrepresentación simulada
            let duaUxElements = '';
            if (course.id === 'dua') {
                duaUxElements = `
                    <div style="display:flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                        <span style="font-size: 11px; background: var(--primary); color: var(--bg-dark); padding: 4px 8px; border-radius: 8px; font-weight: bold; text-transform: uppercase;"><i class="ph-bold ph-magic-wand"></i> UX Inclusiva Activa</span>
                        <button class="hero-btn" style="font-size: 13px; padding: 8px 15px; background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.1);" onclick="playSound('click'); alert('Simulación DUA: Leyendo en voz alta el contenido con síntesis de voz natural para facilitar la percepción auditiva.')"><i class="ph-bold ph-speaker-high"></i> Escuchar Lección</button>
                        <button class="hero-btn" style="font-size: 13px; padding: 8px 15px; background: rgba(255,255,255,0.05); color: var(--text-primary); border: 1px solid rgba(255,255,255,0.1);" onclick="playSound('click'); alert('Simulación DUA: Descargando Infografía / Mapa Mental visual de esta lección.')"><i class="ph-bold ph-download-simple"></i> Infografía Visual</button>
                    </div>
                `;
            }

            contentArea.innerHTML = `
                <div class="view-animate">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; cursor: pointer; color: var(--text-secondary);" onclick="app.navigate('courses')"><i class="ph-bold ph-arrow-left"></i> Volver al catálogo</div>
                    <div class="course-player-container">
                        <div class="course-content-area">
                            <h2 style="font-size: 28px; margin-bottom: 15px;">${currentModule.title}</h2>
                            ${duaUxElements}
                            ${videoElement}
                            <div style="font-size: 18px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 40px;">${currentModule.content}</div>
                            ${actionBtn}
                            ${course.progress === 100 ? `<button class="hero-btn" style="background: #FBBF24; color: #111; margin-top: 20px;" onclick="app.showCertificate('${course.id}')"><i class="ph-bold ph-certificate"></i> Descargar Certificado Oficial</button>` : ''}
                        </div>
                        <div class="course-sidebar"><h3 style="margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">Contenido del Curso</h3>${sidebarHTML}</div>
                    </div>
                </div>
            `;
        },
        completeModule: (courseId, moduleId) => {
            const course = window.app.currentCourse;
            const module = course.modules.find(m => m.id === moduleId);
            if (!module.completed) {
                module.completed = true;
                const points = module.videoUrl ? 300 : 100;
                gameState.xp += points;
                
                const completedCount = course.modules.filter(m => m.completed).length;
                course.progress = Math.round((completedCount / course.modules.length) * 100);
                
                if (course.progress === 100) {
                    playSound('applause');
                } else {
                    playSound('success');
                }
                
                updateUI();
                saveGameState();
                const nextModule = course.modules.find(m => m.id === (moduleId + 1));
                if (nextModule) window.app.renderCourseModule(nextModule.id); else window.app.renderCourseModule(moduleId); 
            }
        },
        
        // --- Motor de Diagnóstico ---
        startDiagnosticTest: (type) => {
            playSound('click');
            let currentQ = 0; let totalScore = 0;
            let dataToUse, testName;

            if (type === 'pedagogical') { dataToUse = pedagogicalData; testName = 'Habilidades Pedagógicas'; }
            else if (type === 'innovation') { dataToUse = innovationData; testName = 'Scanner de Innovación Educativa'; }
            else { dataToUse = constructivistData; testName = 'Perfil Constructivista'; }
            
            const renderDiagnosticQuestion = () => {
                if (currentQ >= dataToUse.length) {
                    gameState.xp += 1000; gameState.testsCompleted++;
                    playSound('success');
                    
                    let nivel = ""; let diag = ""; let recomendacion = "";
                    let isInnovation = type === 'innovation';
                    let interpretacion = ""; let metodologias = "";

                    if (type === 'constructivist') {
                        if (totalScore <= 8) { nivel = "Facilitador Tradicional"; diag = "Tu estilo se centra fuertemente en la transmisión directa de conocimientos. Confías en la estructura y en tu rol como experto para garantizar el aprendizaje."; recomendacion = "1. Intenta ceder un poco el control.<br>2. Antes de explicar un concepto, lanza un problema abierto y deja que los alumnos intenten deducir la respuesta.<br>3. Fomenta el debate antes de dar la respuesta oficial."; } 
                        else if (totalScore <= 14) { nivel = "Facilitador en Transición"; diag = "Combinas métodos tradicionales con estrategias interactivas. Permites la participación, pero en los momentos de dificultad aún recaes rápidamente en la explicación directa de la solución."; recomendacion = "1. Profundiza en el aprendizaje basado en problemas.<br>2. Usa los errores de los alumnos como puntos de partida para la discusión socrática grupal.<br>3. Evita responder las preguntas de los alumnos de inmediato."; } 
                        else if (totalScore <= 20) { nivel = "Facilitador Constructivista"; diag = "Entiendes que el alumno debe construir su propio conocimiento. Diseñas buenas experiencias interactivas y actúas como un guía que facilita el proceso de descubrimiento colaborativo."; recomendacion = "1. Perfecciona tus evaluaciones.<br>2. Atrévete a reemplazar los exámenes estándar por proyectos situacionales reales.<br>3. Diseña rúbricas de co-evaluación para que los alumnos se evalúen entre sí."; } 
                        else { nivel = "Arquitecto de Aprendizaje"; diag = "Tu práctica refleja un dominio total del constructivismo. Transformas el aula en un laboratorio de experiencias. El centro de tu clase no es lo que dices, sino las decisiones de tus estudiantes."; recomendacion = "1. Comparte tus dinámicas con otros docentes.<br>2. Explora metodologías de frontera como el Design Thinking o el Diseño de Experiencias de Aprendizaje (LXD).<br>3. Empieza a crear tu propio material didáctico inmersivo."; }
                    } else if (type === 'pedagogical') {
                        if (totalScore <= 10) {
                            nivel = "Nivel Básico (Tradicional)";
                            diag = "Tu enfoque se centra principalmente en la exposición de contenidos y el mantenimiento del orden. Tiendes a tomar decisiones unidireccionales para resolver problemas en el aula.";
                            recomendacion = "1. Permite más espacios de silencio de 3 a 5 segundos después de hacer una pregunta para que los alumnos piensen.<br>2. Sustituye parte de tu explicación teórica por breves trabajos de discusión en parejas.<br>3. Acostúmbrate a admitir el desconocimiento frente a una pregunta difícil como una oportunidad de investigación grupal.";
                        } else if (totalScore <= 18) {
                            nivel = "Nivel Intermedio (Práctico)";
                            diag = "Utilizas estrategias de participación activa e intentas diversificar la clase. Sin embargo, en situaciones de presión recaes en la resolución directa del conflicto en lugar de empoderar al alumno para que lo resuelva.";
                            recomendacion = "1. Utiliza la técnica 'Piensa-Compara-Comparte' rutinariamente para aumentar la participación de los tímidos.<br>2. Antes de responder a una duda, pregúntale al grupo si alguien más tiene la respuesta o una pista.<br>3. Incorpora evaluación formativa basada en mini-proyectos y no solo en exámenes.";
                        } else if (totalScore <= 22) {
                            nivel = "Nivel Avanzado (Facilitador Activo)";
                            diag = "Eres un formador ágil que sabe leer la energía del grupo. Utilizas problemas, analogías y debates eficazmente. Sabes cómo ceder el control del aprendizaje a los alumnos manteniendo los objetivos del curso claros.";
                            recomendacion = "1. Empieza a usar explícitamente los errores de los alumnos como parte del material de clase (el análisis del error como método).<br>2. Deja que los alumnos decidan parte de las normas de convivencia o los porcentajes de evaluación.<br>3. Integra la co-evaluación estructurada sistemáticamente.";
                        } else {
                            nivel = "Nivel Experto (Arquitecto Pedagógico)";
                            diag = "Dominas el arte profundo de la mediación educativa. Usas preguntas socráticas instintivamente, adaptas el entorno rápidamente y conviertes las distracciones o fallas técnicas en oportunidades brillantes e inesperadas de aprendizaje.";
                            recomendacion = "1. Documenta tus estrategias exitosas de manejo de aula y lidera talleres de formación para tus colegas.<br>2. Experimenta profundamente con diseños de aula invertida (Flipped Classroom) en tus módulos más teóricos.<br>3. Involucra a los estudiantes veteranos en el diseño del syllabus inicial del próximo semestre.";
                        }
                    } else if (type === 'innovation') {
                        if (totalScore <= 10) { 
                            nivel = "Docente Tradicional"; 
                            diag = "Tu enfoque prioriza la transmisión directa de conocimientos. Te apoyas en la exposición teórica y en el control del aula para asegurar que se cubra el temario estructurado."; 
                            interpretacion = "Este nivel significa que ves el aprendizaje como un proceso de recepción de información. Confías en métodos probados pero corres el riesgo de generar pasividad en los estudiantes modernos.";
                            recomendacion = "1. Transforma el 20% de tu tiempo de exposición en actividades de discusión.<br>2. Reemplaza algunas preguntas cerradas por preguntas abiertas de análisis.<br>3. Pide a los alumnos que resuman la clase en lugar de hacerlo tú.";
                            metodologias = "Aprendizaje activo básico, uso sistemático de preguntas socráticas, debates cortos guiados.";
                        } else if (totalScore <= 18) { 
                            nivel = "Docente en Transición"; 
                            diag = "Has comenzado a integrar dinámicas interactivas y tecnología, pero en el fondo sigues dirigiendo fuertemente el proceso y las decisiones importantes del curso."; 
                            interpretacion = "Estás en un punto de evolución consciente. Sabes que la clase frontal no es suficiente e intentas variar, aunque las metodologías activas aún las usas como 'adornos' y no como el eje central de tu diseño instruccional.";
                            recomendacion = "1. Intenta que los proyectos o casos sean el hilo conductor de tu clase, no solo el trabajo final.<br>2. Fomenta el trabajo colaborativo donde ellos deban investigar antes de que tú expliques.<br>3. Introduce herramientas digitales no solo para mostrar, sino para que ellos creen productos.";
                            metodologias = "Flipped Classroom (Aula Invertida), Trabajo Colaborativo (Jigsaw), Estudios de Caso estructurados.";
                        } else if (totalScore <= 26) { 
                            nivel = "Facilitador Innovador"; 
                            diag = "Diseñas verdaderas experiencias de aprendizaje. Entiendes que el estudiante debe ser protagonista, utilizas la tecnología de forma significativa y evalúas mediante el desempeño práctico."; 
                            interpretacion = "Significa que actúas como un guía y arquitecto del entorno. Tus alumnos están comprometidos porque los involucras en la resolución de problemas en lugar de solo escuchar y memorizar teoría.";
                            recomendacion = "1. Atrévete a gamificar un módulo completo, incluyendo narrativas y sistemas de recompensas.<br>2. Incluye problemas reales del contexto local donde los alumnos deban entrevistar a terceros.<br>3. Implementa rúbricas de co-evaluación para que los alumnos aprendan a dar feedback constructivo a sus pares.";
                            metodologias = "Aprendizaje Basado en Proyectos (ABP), Gamificación educativa, Design Thinking aplicado a la educación.";
                        } else { 
                            nivel = "Diseñador de Experiencias Disruptivas"; 
                            diag = "Tu práctica rompe con los paradigmas clásicos. El aula es un laboratorio de co-creación donde los alumnos lideran su aprendizaje resolviendo retos de alta complejidad del mundo real."; 
                            interpretacion = "Has difuminado la línea entre el aula y la realidad. No dictas clases, orquestas ecosistemas de aprendizaje donde el error es celebrado, la tecnología es invisible y el impacto trasciende las cuatro paredes de la institución.";
                            recomendacion = "1. Involucra a tus alumnos en el diseño del plan de estudios y en la creación de los criterios de evaluación.<br>2. Conecta tus retos con empresas u ONGs reales para que el producto de los alumnos tenga impacto social directo.<br>3. Convierte tu práctica en investigación y publica tus métodos de innovación disruptiva en foros o blogs docentes.";
                            metodologias = "Aprendizaje Basado en Retos (CBL), Co-creación de currículo, Aprendizaje Inmersivo y Experiencial avanzado.";
                        }
                    }

                    // Guardar el resultado en el historial
                    gameState.diagnosticResults.unshift({
                        testName: testName,
                        nivel: nivel,
                        score: totalScore,
                        date: new Date().toLocaleDateString(),
                        diag: diag
                    });
                    
                    updateUI();
                    saveGameState();

                    let reporteHTML = '';
                    if (isInnovation) {
                        reporteHTML = `
                            <div style="background: var(--bg-card); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; margin: 30px 0; text-align: left;">
                                <h2 style="color: #EC4899; font-size: 28px; margin-bottom: 5px; text-align: center;">${nivel}</h2>
                                <h3 style="margin-bottom: 25px; color: var(--text-primary); text-align: center; font-weight: 500;">Puntuación de Innovación: ${totalScore} / 30</h3>
                                
                                <h3 style="margin-bottom: 10px; color: var(--primary);"><i class="ph-bold ph-scan"></i> Diagnóstico:</h3>
                                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid var(--primary);">
                                    <p style="color: var(--text-secondary); line-height: 1.6; font-size: 15px;">${diag}</p>
                                </div>

                                <h3 style="margin-bottom: 10px; color: var(--accent);"><i class="ph-bold ph-translate"></i> Interpretación:</h3>
                                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid var(--accent);">
                                    <p style="color: var(--text-secondary); line-height: 1.6; font-size: 15px;">${interpretacion}</p>
                                </div>

                                <h3 style="margin-bottom: 15px; color: var(--success);"><i class="ph-bold ph-rocket-launch"></i> Recomendaciones Prácticas:</h3>
                                <div style="color: var(--text-primary); line-height: 1.8; font-size: 15px; margin-bottom: 25px;">
                                    ${recomendacion}
                                </div>

                                <h3 style="margin-bottom: 10px; color: var(--warning);"><i class="ph-bold ph-toolbox"></i> Metodologías Sugeridas para tu Nivel:</h3>
                                <div style="background: var(--warning-bg); border: 1px solid rgba(251, 191, 36, 0.3); padding: 15px; border-radius: 12px;">
                                    <p style="color: var(--warning); line-height: 1.6; font-size: 16px; font-weight: 600;">${metodologias}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        reporteHTML = `
                            <div style="background: var(--bg-card); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; margin: 30px 0; text-align: left;">
                                <h2 style="color: var(--primary); font-size: 28px; margin-bottom: 20px; text-align: center;">${nivel}</h2>
                                <h3 style="margin-bottom: 15px; color: var(--text-primary); text-align: center;">Tu Puntuación: ${totalScore} / 24</h3>
                                <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                                    <p style="color: var(--text-secondary); line-height: 1.6; font-size: 16px;"><strong>Diagnóstico:</strong><br>${diag}</p>
                                </div>
                                <h3 style="margin-bottom: 15px; color: var(--success);"><i class="ph-bold ph-lightbulb"></i> Recomendaciones Prácticas:</h3>
                                <div style="color: var(--text-secondary); line-height: 1.8; font-size: 16px;">
                                    ${recomendacion}
                                </div>
                            </div>
                        `;
                    }

                    contentArea.innerHTML = `
                        <div class="view-animate" style="max-width: 800px; margin: 0 auto; text-align: center; padding: 20px 0;">
                            <i class="ph-fill ph-check-circle" style="font-size: 80px; color: var(--success); margin-bottom: 20px;"></i>
                            <h1 class="view-title">Reporte de Diagnóstico</h1>
                            ${reporteHTML}
                            <p style="font-size: 20px; color: var(--warning); margin-bottom: 30px; font-weight: bold;">¡Has ganado +1000 XP por tu evaluación profesional!</p>
                            <button class="hero-btn" onclick="app.navigate('home')">Ir al Dashboard</button>
                        </div>`;
                    return;
                }
                const qObj = dataToUse[currentQ];
                
                let dimensionHtml = '';
                if(qObj.dimension) {
                    dimensionHtml = `<div style="background: var(--success-bg); color: var(--success); padding: 6px 15px; border-radius: 20px; display: inline-block; font-size: 13px; font-weight: bold; margin-bottom: 20px; border: 1px solid rgba(52, 211, 153, 0.3);">Dimensión: ${qObj.dimension}</div>`;
                }

                let optsHtml = qObj.options.map((opt) => `<div class="quiz-option" onclick="app.handleDiagAnswer(${opt.points})" style="margin-bottom: 16px; font-size: 16px; align-items: flex-start; padding: 24px;"><span>${opt.text}</span><i class="ph ph-circle"></i></div>`).join('');
                const progPct = ((currentQ) / dataToUse.length) * 100;
                contentArea.innerHTML = `
                    <div class="view-animate quiz-container">
                        <div class="view-header" style="text-align:center; margin-bottom: 30px;">
                            <h2 style="color: var(--primary); margin-bottom:10px;">Evaluación en Curso</h2>
                            <p class="view-subtitle">Pregunta ${currentQ + 1} de ${dataToUse.length}</p>
                            <div class="progress-bar-bg" style="width: 100%; max-width: 400px; margin: 15px auto 0; height: 10px;"><div class="progress-bar-fill" style="width: ${progPct}%;"></div></div>
                        </div>
                        <div style="text-align: center;">${dimensionHtml}</div>
                        <h2 class="quiz-question" style="text-align: center; max-width: 750px; margin: 0 auto 40px; font-size: 24px;">${qObj.q}</h2>
                        <div class="quiz-options">${optsHtml}</div>
                    </div>`;
            };
            window.app.handleDiagAnswer = (pts) => { playSound('click'); totalScore += pts; currentQ++; renderDiagnosticQuestion(); };
            renderDiagnosticQuestion();
        },

        startQuiz: (quizId) => { playSound('click'); const data = testsData[quizId]; let currentQ = 0; let score = 0;
            const renderQuestion = () => {
                if (currentQ >= data.questions.length) { gameState.xp += (score * 50); gameState.testsCompleted++; playSound('success'); contentArea.innerHTML = `<div class="view-animate" style="text-align: center; padding: 60px 0;"><i class="ph-fill ph-check-circle" style="font-size: 80px; color: var(--success); margin-bottom: 20px;"></i><h1 class="view-title">Test Completado</h1><p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 30px;">Ganaste ${score * 50} XP.</p><button class="hero-btn" onclick="app.navigate('tests')">Volver</button></div>`; updateUI(); saveGameState(); return; }
                const q = data.questions[currentQ];
                let optsHtml = q.options.map((opt, i) => `<div class="quiz-option" onclick="app.handleQuizAnswer(${i}, ${q.answer})">${opt} <i class="ph ph-circle"></i></div>`).join('');
                contentArea.innerHTML = `<div class="view-animate quiz-container"><div class="quiz-progress"><span>Pregunta ${currentQ + 1}/${data.questions.length}</span><span class="quiz-score">XP: ${score * 50}</span></div><h2 class="quiz-question">${q.q}</h2><div class="quiz-options">${optsHtml}</div><div class="quiz-feedback" id="quiz-feedback"></div><button class="btn-next" id="btn-next" onclick="app.nextQuestion()">Siguiente <i class="ph-bold ph-arrow-right"></i></button></div>`;
            };
            window.app.handleQuizAnswer = (sel, cor) => {
                const opts = document.querySelectorAll('.quiz-option'); if (opts[0].classList.contains('correct') || opts[0].classList.contains('incorrect')) return;
                playSound('click'); opts.forEach((o, i) => { o.style.pointerEvents = 'none'; if(i===cor) o.classList.add('correct'); else if(i===sel) o.classList.add('incorrect'); });
                const fb = document.getElementById('quiz-feedback'); fb.style.display = 'block';
                if(sel===cor) { score++; fb.style.color = 'var(--success)'; fb.innerText = "¡Correcto!"; } else { fb.style.color = 'var(--error)'; fb.innerText = "Incorrecto."; }
                document.getElementById('btn-next').style.display = 'block';
            };
            window.app.nextQuestion = () => { playSound('click'); currentQ++; renderQuestion(); };
            renderQuestion();
        },
        startWhiteboardGame: () => { playSound('click'); let selectedOrder = []; let shuffled = [...whiteboardSteps].sort(() => Math.random() - 0.5);
            window.app.renderWb = () => {
                let slotsHtml = whiteboardSteps.map((_, i) => { let val = selectedOrder[i] ? selectedOrder[i].text : `Paso ${i+1} vacío`; let color = selectedOrder[i] ? '#fff' : 'var(--text-secondary)'; return `<div class="wb-slot" style="color:${color}">${val}</div>`; }).join('');
                let optionsHtml = shuffled.map(step => { let isSelected = selectedOrder.find(s => s.id === step.id); if(isSelected) return ''; return `<div class="wb-step" onclick="app.selectWbStep(${step.id})">${step.text}</div>`; }).join('');
                if(selectedOrder.length === whiteboardSteps.length) {
                    let isWin = selectedOrder.every((s, i) => s.id === (i + 1));
                    if(isWin) { gameState.xp += 200; updateUI(); saveGameState(); playSound('success'); optionsHtml = `<h2 style="color: var(--success); margin: 30px 0;">¡Excelente Didáctica! Estructura Perfecta (+200 XP)</h2><button class="hero-btn" onclick="app.navigate('gamification')">Finalizar Pizarra</button>`; } 
                    else { optionsHtml = `<h2 style="color: var(--error); margin: 30px 0;">Hay un error en la secuencia pedagógica.</h2><button class="hero-btn" onclick="app.startWhiteboardGame()" style="background:var(--error);">Reintentar</button>`; }
                }
                contentArea.innerHTML = `<div class="view-animate whiteboard-container"><div class="wb-overlay"></div><div class="wb-content"><h2 style="font-size: 32px; margin-bottom: 10px; color: var(--primary);">Pizarra Dinámica</h2><p style="margin-bottom: 40px;">Haz clic en los bloques para ordenarlos lógicamente en la pizarra.</p><div class="wb-slots">${slotsHtml}</div><div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px;">${optionsHtml}</div></div></div>`;
            };
            window.app.selectWbStep = (id) => { playSound('click'); let step = whiteboardSteps.find(s => s.id === id); selectedOrder.push(step); window.app.renderWb(); };
            window.app.renderWb();
        },
        startMythGame: () => {
            playSound('click');
            
            // Catálogo de neuromitos y verdades pedagógicas
            const mythData = [
                { statement: "Usamos solo el 10% de nuestro cerebro.", isMyth: true, exp: "Este es uno de los neuromitos más famosos. Las neuroimágenes demuestran que usamos el 100% de nuestro cerebro a lo largo del día, incluso mientras dormimos." },
                { statement: "Los estudiantes aprenden mejor si se les enseña en su estilo de aprendizaje (visual, auditivo, kinestésico).", isMyth: true, exp: "Mito arraigado. La evidencia científica no respalda que adaptar la enseñanza al 'estilo' mejore el aprendizaje. Presentar la información en múltiples formatos (DUA) beneficia a todos por igual." },
                { statement: "La plasticidad cerebral permite aprender a lo largo de toda la vida.", isMyth: false, exp: "¡Verdad! Aunque la infancia es un período crítico, el cerebro sigue creando nuevas conexiones sinápticas (neuroplasticidad) en la adultez y la vejez." },
                { statement: "El elogio al esfuerzo es más efectivo que el elogio a la inteligencia.", isMyth: false, exp: "¡Verdad! Las investigaciones de Carol Dweck muestran que alabar el esfuerzo fomenta una 'mentalidad de crecimiento', mientras que alabar la inteligencia genera frustración ante el fracaso." },
                { statement: "Escuchar música clásica de bebé te hace más inteligente (Efecto Mozart).", isMyth: true, exp: "Mito. Escuchar a Mozart puede causar un bienestar temporal, pero no aumenta el coeficiente intelectual ni el desarrollo cognitivo a largo plazo." },
                { statement: "Hacer múltiples tareas a la vez (Multitasking) es eficiente y no afecta la calidad.", isMyth: true, exp: "Mito total. El cerebro no hace tareas simultáneas, cambia rápidamente de una a otra (Task-Switching). Esto agota los recursos cognitivos y reduce drásticamente la concentración y retención." },
                { statement: "Las emociones juegan un papel fundamental en el aprendizaje y la memoria.", isMyth: false, exp: "¡Verdad! La amígdala (emociones) y el hipocampo (memoria) están íntimamente conectados. El aprendizaje con un tono emocional positivo se consolida mejor a largo plazo." },
                { statement: "La letra con sangre entra (el castigo es mejor que el refuerzo positivo).", isMyth: true, exp: "Mito dañino. El miedo activa el cortisol, bloqueando la corteza prefrontal y la capacidad de pensar lógicamente. El refuerzo positivo es mucho más efectivo para moldear conductas." },
                { statement: "Aprender algo antes de dormir ayuda a recordarlo mejor.", isMyth: false, exp: "¡Verdad! Durante el sueño se produce la 'consolidación de la memoria', donde la información a corto plazo se transfiere a la memoria a largo plazo." },
                { statement: "El cerebro izquierdo es lógico y el derecho es creativo.", isMyth: true, exp: "Mito. Aunque hay especialización (ej. el lenguaje suele estar a la izquierda), las tareas complejas como el pensamiento lógico o creativo requieren la colaboración de ambos hemisferios simultáneamente." }
            ];

            let currentMythIndex = 0;
            let mythScore = 0;
            
            // Función para renderizar la tarjeta
            window.app.renderMythQuestion = () => {
                if (currentMythIndex >= mythData.length) {
                    // Fin del juego
                    gameState.xp += mythScore;
                    updateUI();
                    saveGameState();
                    if(mythScore > 500) playSound('success'); else playSound('click');
                    
                    document.getElementById('content-area').innerHTML = `
                        <div class="view-animate myth-container" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
                            <i class="ph-bold ph-trophy myth-result-icon" style="color:var(--primary); font-size: 80px;"></i>
                            <h2 style="font-size: 32px; color:var(--text-primary); margin-bottom: 20px;">¡Juego Terminado!</h2>
                            <p style="font-size: 20px; color:var(--text-secondary); margin-bottom: 10px;">Has acertado ${mythScore/100} de ${mythData.length} afirmaciones.</p>
                            <p style="font-size: 24px; color:var(--success); font-weight: bold; margin-bottom: 40px;">+${mythScore} XP Ganados</p>
                            <button class="hero-btn" onclick="app.navigate('gamification')">Volver al Dashboard</button>
                        </div>
                    `;
                    return;
                }
                
                const q = mythData[currentMythIndex];
                document.getElementById('content-area').innerHTML = `
                    <div class="view-animate myth-container">
                        <div style="text-align:center; margin-bottom: 30px;">
                            <h2 style="font-size: 32px; color: var(--primary);">Cazador de Mitos</h2>
                            <p style="color: var(--text-secondary);">Pregunta ${currentMythIndex + 1} de ${mythData.length}</p>
                        </div>
                        <div class="myth-card" id="myth-card-elem">
                            <div class="myth-card-face myth-card-front">
                                <h3 class="myth-statement">"${q.statement}"</h3>
                                <div class="myth-actions">
                                    <button class="myth-btn myth-btn-myth" onclick="app.handleMythAnswer(true)">
                                        <i class="ph-bold ph-x"></i> Es un Mito
                                    </button>
                                    <button class="myth-btn myth-btn-truth" onclick="app.handleMythAnswer(false)">
                                        <i class="ph-bold ph-check"></i> Es Verdad
                                    </button>
                                </div>
                            </div>
                            <div class="myth-card-face myth-card-back">
                                <i class="ph-bold ph-lightbulb myth-result-icon" id="myth-res-icon"></i>
                                <h3 style="font-size: 24px; margin-bottom: 15px;" id="myth-res-title"></h3>
                                <p class="myth-explanation">${q.exp}</p>
                                <button class="hero-btn" style="margin-top: 30px; padding: 12px 30px;" onclick="app.nextMyth()">Siguiente</button>
                            </div>
                        </div>
                    </div>
                `;
            };

            // Función para manejar la respuesta
            window.app.handleMythAnswer = (userSaidMyth) => {
                const q = mythData[currentMythIndex];
                const card = document.getElementById('myth-card-elem');
                const title = document.getElementById('myth-res-title');
                const icon = document.getElementById('myth-res-icon');
                
                const isCorrect = userSaidMyth === q.isMyth;
                
                if (isCorrect) {
                    playSound('success');
                    mythScore += 100;
                    title.innerText = "¡Correcto!";
                    title.style.color = "var(--success)";
                    icon.className = "ph-fill ph-check-circle myth-result-icon";
                    icon.style.color = "var(--success)";
                } else {
                    playSound('click'); // idealmente un sonido de error, pero click sirve
                    title.innerText = "Incorrecto";
                    title.style.color = "var(--error)";
                    icon.className = "ph-fill ph-x-circle myth-result-icon";
                    icon.style.color = "var(--error)";
                }
                
                // Girar la tarjeta
                card.classList.add('flipped');
            };

            window.app.nextMyth = () => {
                playSound('click');
                currentMythIndex++;
                window.app.renderMythQuestion();
            };

            // Iniciar el juego
            window.app.renderMythQuestion();
        },
        openHistoryModal: (index) => {
            playSound('click');
            const historyExtendedData = [
                {
                    title: "Antigüedad Clásica",
                    quote: "Solo sé que no sé nada. - Sócrates",
                    text: "La educación en la Antigua Grecia no buscaba memorizar datos, sino formar al 'buen ciudadano'. El método Socrático fue el primer gran enfoque constructivista: mediante la ironía y la mayéutica (hacer preguntas estratégicas), Sócrates obligaba a sus alumnos a encontrar las contradicciones en sus propios argumentos y dar a luz al conocimiento que ya residía en ellos.<br><br>Platón luego fundó La Academia, formalizando el diálogo como método de aprendizaje, mientras que los romanos adaptaron esto a la retórica, enfocándose en la persuasión y la oratoria política.",
                    img: "assets/history_greece.png"
                },
                {
                    title: "La Escolástica Medieval",
                    quote: "La fe busca entender. - San Anselmo",
                    text: "Con la caída de Roma, la preservación del conocimiento quedó recluida en monasterios oscuros. La educación se volvió un acto de copiado literal (el scriptorium).<br><br>Sin embargo, en el siglo XII, surgieron las primeras Universidades (Bolonia, París, Oxford). Aquí nació la 'Escolástica', un método de aprendizaje basado en el debate riguroso (la Disputatio), donde el profesor planteaba una pregunta, se leían textos opuestos, y se debía resolver el conflicto usando pura lógica aristotélica.",
                    img: "assets/history_medieval.png"
                },
                {
                    title: "Revolución Industrial",
                    quote: "Las escuelas fueron diseñadas para crear obreros dóciles, no pensadores creativos.",
                    text: "En el siglo XIX todo cambió. Las fábricas necesitaban obreros puntuales que supieran acatar órdenes repetitivas. Así nació el 'Modelo Prusiano' de educación.<br><br>Se introdujeron los timbres (para simular los turnos de fábrica), los pupitres alineados mirando hacia adelante (para escuchar al capataz/profesor), y la estandarización por edades (como lotes de producción). Este es el sistema tradicional que, irónicamente, seguimos utilizando hoy en día para educar a la generación del siglo XXI.",
                    img: "assets/history_industrial.png"
                },
                {
                    title: "La Escuela Nueva (Constructivismo)",
                    quote: "El niño no es una botella que hay que llenar, sino un fuego que es preciso encender.",
                    text: "A principios del siglo XX, pensadores como Maria Montessori, John Dewey, Jean Piaget y Lev Vygotsky revolucionaron la forma de entender el aprendizaje.<br><br>Nace el paradigma Constructivista: se demostró científicamente que el alumno no es un receptor pasivo, sino que 'construye' activamente su conocimiento a través de la experiencia, el juego y la interacción social. El profesor deja de ser el dictador del aula para convertirse en un 'facilitador' o guía del aprendizaje.",
                    img: "assets/myth.png" 
                },
                {
                    title: "Era Digital e Inteligencia Artificial",
                    quote: "Cualquier profesor que pueda ser reemplazado por una máquina, debería serlo. - Arthur C. Clarke",
                    text: "El siglo XXI trajo internet y la democratización de la información. El conocimiento dejó de ser el monopolio del profesor; ahora está a un clic de distancia en el bolsillo de cada alumno.<br><br>Hoy, con la Inteligencia Artificial (ChatGPT, Gemini, etc.), la educación enfrenta su mayor disrupción. Ya no tiene sentido evaluar la memorización de datos. La pedagogía actual exige Diseño de Experiencias (LXD), aprendizaje basado en retos reales, y formar humanos críticos capaces de hacerle buenas preguntas a las máquinas.",
                    img: "assets/whiteboard.png"
                }
            ];

            const data = historyExtendedData[index];
            const modalHTML = `
                <div class="history-modal-overlay" id="history-modal" onclick="app.closeHistoryModal(event)">
                    <div class="history-modal-container">
                        <div class="history-modal-card">
                            <div class="history-modal-face history-modal-front" style="background-image: url('${data.img}');"></div>
                            <div class="history-modal-face history-modal-back">
                                <button class="history-modal-close" onclick="app.closeHistoryModal(event)"><i class="ph-bold ph-x"></i></button>
                                <h2 class="history-extended-title">${data.title}</h2>
                                <div class="history-extended-quote">${data.quote}</div>
                                <div class="history-extended-text">${data.text}</div>
                                <div style="margin-top: auto;">
                                    <button class="hero-btn" style="width: 100%;" onclick="app.closeHistoryModal(event)">Entendido</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },
        closeHistoryModal: (event) => {
            if(event) event.stopPropagation();
            const modal = document.getElementById('history-modal');
            if (modal && (event.target === modal || event.currentTarget.tagName === 'BUTTON' || event.currentTarget.classList.contains('hero-btn'))) {
                playSound('click');
                modal.remove();
            }
        }
    };

    const renderHome = () => {
        
        let resultsHtml = '';
        if(gameState.diagnosticResults && gameState.diagnosticResults.length > 0) {
            resultsHtml = `
            <div class="view-header" style="margin-top: 50px;"><h2 class="view-title" style="font-size: 24px;">Tus Diagnósticos Recientes</h2></div>
            <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px;">
                ${gameState.diagnosticResults.map(res => `
                    <div class="card avatar-card" style="display: flex; gap: 20px; align-items: flex-start;">
                        <div class="card-icon-wrapper" style="margin: 0; background: var(--success-bg); color: var(--success); flex-shrink: 0;"><i class="ph-bold ph-medal"></i></div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <h3 style="color: var(--primary); font-size: 18px;">${res.testName}</h3>
                                <span style="font-size: 12px; color: var(--text-secondary);">${res.date}</span>
                            </div>
                            <h4 style="font-size: 20px; margin-bottom: 10px;">Nivel Alcanzado: ${res.nivel}</h4>
                            <p style="color: var(--text-secondary); line-height: 1.5; font-size: 14px;">${res.diag}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            `;
        } else {
            resultsHtml = `
            <div class="view-header" style="margin-top: 50px;"><h2 class="view-title" style="font-size: 24px;">Tus Diagnósticos Recientes</h2></div>
            <div class="card avatar-card" style="text-align: center; padding: 40px;">
                <i class="ph-bold ph-clipboard-text" style="font-size: 40px; color: var(--text-secondary); margin-bottom: 15px;"></i>
                <p style="color: var(--text-secondary);">Aún no has completado ningún diagnóstico avanzado.</p>
                <button class="hero-btn" style="margin-top: 20px;" onclick="app.navigate('tests')">Ir a Evaluaciones</button>
            </div>
            `;
        }

        return `
        <div class="view-animate">
            <div class="hero-banner">
                <div class="hero-content">
                    <h2 style="font-size: 32px;">${motivationalMessage}</h2>
                    <p style="font-size: 16px; margin-bottom: 20px; opacity: 0.9;">${motivationalSubtitle}</p>
                    <div style="display: flex; gap: 15px; margin-top: 15px;">
                        <button class="hero-btn" onclick="app.navigate('news')">Ver Novedades</button>
                        <button class="hero-btn" style="background: rgba(255,255,255,0.1); color: white;" onclick="app.navigate('courses')">Catálogo de Cursos</button>
                    </div>
                </div>
                <div class="hero-image" style="background-image: url('assets/educator.png');"></div>
            </div>

            <div class="view-header"><h1 class="view-title">Tu Progreso Global</h1></div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px;">
                <div class="card" style="display: flex; align-items: center; gap: 20px;">
                    <div class="card-icon-wrapper" style="margin: 0;"><i class="ph ph-exam"></i></div>
                    <div><p style="color: var(--text-secondary); font-size: 14px;">Tests</p><h3 style="font-size: 24px;">${gameState.testsCompleted} Completados</h3></div>
                </div>
                <div class="card" style="display: flex; align-items: center; gap: 20px;">
                    <div class="card-icon-wrapper" style="margin: 0; color: var(--warning); background: var(--warning-bg);"><i class="ph ph-lightning"></i></div>
                    <div><p style="color: var(--text-secondary); font-size: 14px;">Experiencia</p><h3 style="font-size: 24px;">${gameState.xp} XP</h3></div>
                </div>
            </div>
            
            ${resultsHtml}

            <div class="view-header" style="margin-top: 50px;"><h2 class="view-title" style="font-size: 24px;">Panel Analítico de Rendimiento</h2></div>
            <div style="background: var(--bg-card); border-radius: 20px; padding: 30px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 40px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                    <div>
                        <h4 style="margin-bottom: 15px; color: var(--text-secondary);">Progreso Formativo (Cursos)</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Avance Global</span> <span>${Math.round(Object.values(coursesData).reduce((a,c)=>a+c.progress,0)/Object.keys(coursesData).length || 0)}%</span></div>
                        <div class="stat-bar-container"><div class="stat-bar-fill" style="width: ${Object.values(coursesData).reduce((a,c)=>a+c.progress,0)/Object.keys(coursesData).length || 0}%; background: var(--primary);"></div></div>
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; margin-top: 20px;"><span>Cursos Completados</span> <span>${Object.values(coursesData).filter(c=>c.progress===100).length} de ${Object.keys(coursesData).length}</span></div>
                        <div class="stat-bar-container"><div class="stat-bar-fill" style="width: ${(Object.values(coursesData).filter(c=>c.progress===100).length/Object.keys(coursesData).length)*100}%; background: var(--accent);"></div></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 15px; color: var(--text-secondary);">Métricas de Diagnóstico</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Nivel Diagnóstico General</span> <span>${Math.min(100, gameState.diagnosticResults.length * 25)}%</span></div>
                        <div class="stat-bar-container"><div class="stat-bar-fill" style="width: ${Math.min(100, gameState.diagnosticResults.length * 25)}%; background: #EC4899;"></div></div>
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; margin-top: 20px;"><span>Evaluaciones Realizadas</span> <span>${gameState.testsCompleted}</span></div>
                        <div class="stat-bar-container"><div class="stat-bar-fill" style="width: ${Math.min(100, gameState.testsCompleted * 10)}%; background: var(--success);"></div></div>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 50px; opacity: 0.2; flex-wrap: wrap;">
                <p style="width: 100%; font-size: 12px; color: var(--text-secondary);">Herramientas de Test (Simular Retención):</p>
                <button onclick="window.simulateDaysPassed(0)" style="font-size: 10px; padding: 5px;">Simular Hoy</button>
                <button onclick="window.simulateDaysPassed(3)" style="font-size: 10px; padding: 5px;">Simular 3 días</button>
                <button onclick="window.simulateDaysPassed(10)" style="font-size: 10px; padding: 5px;">Simular 10 días ausente</button>
            </div>
        </div>
    `};

    const renderNews = () => `
        <div class="view-animate">
            <div class="view-header">
                <h1 class="view-title">Novedades y Notificaciones</h1>
                <p class="view-subtitle">Mantente al tanto de las últimas incorporaciones a Psicoeduca Academy.</p>
            </div>
            
            <div class="news-card premium" onclick="app.navigate('courses')" style="border-color: var(--success); box-shadow: 0 0 15px rgba(52, 211, 153, 0.1);">
                <div class="news-icon-wrapper" style="background: var(--success-bg); color: var(--success);"><i class="ph-bold ph-video"></i></div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span style="background: var(--success); color: var(--bg-dark); padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase;">¡Nuevo Masterclass!</span>
                        <span style="color: var(--text-secondary); font-size: 13px;">Hoy</span>
                    </div>
                    <h3 style="font-size: 22px; color: var(--success); margin-bottom: 8px;">Curso Premium: Diseño Universal para el Aprendizaje (DUA)</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">Hemos lanzado el ecosistema formativo definitivo sobre DUA. Explora 5 módulos que te enseñarán neuroeducación aplicada para aulas 100% inclusivas. La interfaz del curso predica con el ejemplo aplicando multirrepresentación.</p>
                </div>
            </div>

            <div class="news-card premium" onclick="app.navigate('tests')" style="border-color: #EC4899; box-shadow: 0 0 15px rgba(236,72,153,0.2);">
                <div class="news-icon-wrapper" style="background: rgba(236,72,153,0.1); color: #EC4899;"><i class="ph-bold ph-scan"></i></div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span style="background: #EC4899; color: white; padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase;">¡Nuevo Diagnóstico!</span>
                        <span style="color: var(--text-secondary); font-size: 13px;">Reciente</span>
                    </div>
                    <h3 style="font-size: 22px; color: #EC4899; margin-bottom: 8px;">Scanner de Innovación Educativa</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">Descubre tu nivel real de innovación (Tradicional a Disruptivo) con el instrumento de diagnóstico más avanzado de la plataforma. Evalúa metodologías activas, tecnología y contextualización. ¡Gana +1000 XP!</p>
                </div>
            </div>

            <div class="news-card" onclick="app.navigate('tests')">
                <div class="news-icon-wrapper"><i class="ph-bold ph-brain"></i></div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span style="background: var(--primary); color: white; padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Test</span>
                        <span style="color: var(--text-secondary); font-size: 13px;">Hace 2 días</span>
                    </div>
                    <h3 style="font-size: 22px; color: var(--primary); margin-bottom: 8px;">Diagnóstico de Habilidades Pedagógicas</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">Evalúa tus capacidades en 8 dimensiones clave (Facilitación, Evaluación, Gestión del Aula, etc.). Haz clic aquí para evaluarte y ganar XP.</p>
                </div>
            </div>

            <div class="news-card" onclick="app.navigate('courses')">
                <div class="news-icon-wrapper"><i class="ph-bold ph-video"></i></div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span style="background: var(--success); color: var(--bg-dark); padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase;">¡Nuevo Video!</span>
                        <span style="color: var(--text-secondary); font-size: 13px;">Ayer</span>
                    </div>
                    <h3 style="font-size: 22px; margin-bottom: 8px;">Módulo 1 Agregado al Curso LXD</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">El primer video introductorio para el "Diseño de Experiencias de Aprendizaje" ya está disponible en tu catálogo. Míralo y suma +300 XP al instante.</p>
                </div>
            </div>

            <div class="news-card" onclick="app.navigate('community')">
                <div class="news-icon-wrapper" style="background: rgba(59,130,246,0.1); color: var(--primary);"><i class="ph-bold ph-users-three"></i></div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span style="background: var(--primary); color: var(--bg-dark); padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Comunidad</span>
                        <span style="color: var(--text-secondary); font-size: 13px;">Esta semana</span>
                    </div>
                    <h3 style="font-size: 22px; margin-bottom: 8px;">Nuevo Canal de WhatsApp</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">Hemos activado un enlace directo para unirte a nuestro canal oficial de WhatsApp y poder estar en contacto directo con otros educadores.</p>
                </div>
            </div>
        </div>
    `;

    const renderProfile = () => {
        let currentLevelObj = levelsData[0];
        for(let i=0; i<levelsData.length; i++) { if(gameState.xp >= levelsData[i].xp) currentLevelObj = levelsData[i]; }

        const allUsers = getUsersDB();
        const userKeys = Object.keys(allUsers);
        const usersTableHtml = userKeys.length > 0 ? userKeys.map(k => {
            const u = allUsers[k];
            const isCurrent = k === activeUserKey;
            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); ${isCurrent ? 'background: rgba(13,138,188,0.1); font-weight: bold;' : ''}">
                    <td style="padding: 12px 15px; color: white; display: flex; align-items: center; gap: 10px;">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${u.level ? u.level.substring(0,3) : 'Nov'}" style="width: 30px; height: 30px; border-radius: 50%;">
                        ${u.userName || 'Docente'} ${isCurrent ? '<span style="background: var(--primary); color: black; font-size: 10px; padding: 2px 6px; border-radius: 6px; margin-left: 6px;">Actual</span>' : ''}
                    </td>
                    <td style="padding: 12px 15px; color: var(--text-secondary);">${u.level || 'Docente Novato'}</td>
                    <td style="padding: 12px 15px; color: var(--warning); font-weight: bold;">${u.xp || 0} XP</td>
                    <td style="padding: 12px 15px; color: var(--text-secondary);">${u.testsCompleted || 0} completados</td>
                    <td style="padding: 12px 15px; color: var(--text-secondary); font-size: 12px;">${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-ES') : 'Reciente'}</td>
                </tr>
            `;
        }).join('') : `<tr><td colspan="5" style="padding: 15px; text-align: center; color: var(--text-secondary);">No hay usuarios registrados aún.</td></tr>`;

        const logs = getAccessLogs().slice(0, 10);
        const logsHtml = logs.length > 0 ? logs.map(l => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px;">
                <span style="color: white; font-weight: 600;"><i class="ph ph-user-check" style="color: var(--success);"></i> ${l.userName}</span>
                <span style="color: var(--text-secondary); font-size: 12px;">${l.date}</span>
            </div>
        `).join('') : `<p style="color: var(--text-secondary); font-size: 13px;">Sin accesos recientes.</p>`;

        return `
        <div class="view-animate">
            <div class="view-header" style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div><h1 class="view-title">Mi Perfil</h1><p class="view-subtitle">Personaliza tu identidad, monitorea tu crecimiento y consulta los usuarios registrados.</p></div>
                <div style="display: flex; gap: 10px;">
                    <button class="hero-btn" onclick="app.logoutUser()" style="background: rgba(255,255,255,0.1); color: white; padding: 12px 20px; font-size: 14px;"><i class="ph-bold ph-sign-out"></i> Cambiar Usuario</button>
                    <button class="hero-btn" onclick="app.resetProgress()" style="background: var(--error); color: white; padding: 12px 20px; font-size: 14px; box-shadow: 0 10px 20px rgba(248,113,113,0.3);"><i class="ph-bold ph-warning"></i> Reiniciar Progreso</button>
                </div>
            </div>
            
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); padding: 30px; margin-bottom: 40px; display: flex; align-items: center; gap: 40px;">
                <div style="width: 140px; height: 140px; border-radius: 50%; background: var(--primary); padding: 4px; box-shadow: 0 0 30px rgba(13, 138, 188, 0.4);">
                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${currentLevelObj.seed}" style="width: 100%; height: 100%; border-radius: 50%;">
                </div>
                <div style="flex: 1;">
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Nivel Alcanzado</p>
                    <h2 style="font-size: 36px; color: var(--primary); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;"><i class="ph-fill ph-star"></i> ${currentLevelObj.name}</h2>
                    <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase;">Identidad del Docente Activo:</label>
                    <input type="text" value="${gameState.userName}" onchange="app.updateName(this.value)" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px 20px; border-radius: 8px; font-size: 18px; width: 300px; font-family: 'Outfit', sans-serif;">
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 48px; color: var(--warning); font-weight: bold;">${gameState.xp}</div>
                    <div style="color: var(--text-secondary); font-size: 14px; text-transform: uppercase;">Puntos XP Totales</div>
                </div>
            </div>

            <!-- Registro de Usuarios y Accesos -->
            <div class="view-header"><h2 class="view-title" style="font-size: 24px;">Registro de Usuarios y Registro de Accesos (LocalStorage)</h2></div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 40px;">
                <div style="background: var(--bg-card); border-radius: 20px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); overflow-x: auto;">
                    <h3 style="font-size: 16px; margin-bottom: 15px; color: var(--primary); display: flex; align-items: center; gap: 8px;"><i class="ph-bold ph-users"></i> Docentes Registrados (${userKeys.length})</h3>
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">
                                <th style="padding: 10px 15px;">Nombre / Usuario</th>
                                <th style="padding: 10px 15px;">Nivel</th>
                                <th style="padding: 10px 15px;">Experiencia</th>
                                <th style="padding: 10px 15px;">Tests</th>
                                <th style="padding: 10px 15px;">Último Acceso</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usersTableHtml}
                        </tbody>
                    </table>
                </div>
                <div style="background: var(--bg-card); border-radius: 20px; padding: 24px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="font-size: 16px; margin-bottom: 15px; color: var(--success); display: flex; align-items: center; gap: 8px;"><i class="ph-bold ph-clock-counter-clockwise"></i> Historial de Accesos</h3>
                    <div style="display: flex; flex-direction: column;">
                        ${logsHtml}
                    </div>
                </div>
            </div>

            <div class="view-header"><h2 class="view-title" style="font-size: 24px;">Galería de 20 Avatares Evolutivos</h2></div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
                ${levelsData.map(lvl => {
                    const isUnlocked = gameState.xp >= lvl.xp;
                    return `
                    <div class="card avatar-card" style="text-align: center; padding: 25px 20px; opacity: ${isUnlocked ? 1 : 0.4}; filter: ${isUnlocked ? 'none' : 'grayscale(1)'};">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${lvl.seed}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px;">
                        <h4 style="font-size: 15px; margin-bottom: 8px;">${lvl.name}</h4>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 15px; line-height: 1.4; height: 34px; overflow: hidden;">${lvl.desc}</p>
                        <p style="font-size: 12px; color: var(--text-secondary); font-weight: bold;">${isUnlocked ? '<i class="ph-bold ph-check" style="color:var(--success);"></i> Desbloqueado' : `<i class="ph-bold ph-lock-key"></i> Req: ${lvl.xp} XP`}</p>
                    </div>`
                }).join('')}
            </div>
        </div>
    `};

    const renderCommunity = () => `
        <div class="view-animate">
            <div class="view-header"><h1 class="view-title">Comunidad Psicoeduca</h1><p class="view-subtitle">Conecta con otros educadores y déjanos tus sugerencias.</p></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div class="card avatar-card" style="text-align: center; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="ph-bold ph-whatsapp-logo" style="font-size: 40px; color: white;"></i>
                    </div>
                    <h2 style="font-size: 24px; margin-bottom: 15px;">Únete al Canal Oficial</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 30px; line-height: 1.6;">Intercambia recursos didácticos y mantente al día con Psicoeduca en WhatsApp.</p>
                    <a href="https://whatsapp.com/channel/0029Va3u8fDEwEjz8YnMbp2R" target="_blank" style="text-decoration: none;">
                        <button class="hero-btn" style="background: #25D366; color: white; width: 100%;">Unirme al Canal</button>
                    </a>
                </div>
                <div class="card avatar-card" style="padding: 40px;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(59,130,246,0.1); display: flex; align-items: center; justify-content: center;"><i class="ph-bold ph-envelope-simple" style="font-size: 24px; color: var(--primary);"></i></div>
                        <h2 style="font-size: 24px;">Buzón de Sugerencias</h2>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 25px;">¿Qué te gustaría ver en Psicoeduca Academy?</p>
                    <textarea id="suggestion-box" placeholder="Escribe tu recomendación..." style="width: 100%; height: 120px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 15px; border-radius: 8px; font-family: 'Outfit', sans-serif; resize: none; margin-bottom: 20px;"></textarea>
                    <button class="hero-btn" onclick="app.sendSuggestion()" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px;"><i class="ph-bold ph-paper-plane-right"></i> Enviar a mi Correo</button>
                </div>
            </div>
        </div>
    `;

    const renderHistory = () => `
        <div class="view-animate">
            <div class="view-header"><h1 class="view-title">Historia de la Educación</h1><p class="view-subtitle">Un viaje inmersivo por la evolución del aprendizaje.</p></div>
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); padding: 40px; margin-bottom: 60px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <h2 style="font-size: 28px; color: var(--primary); margin-bottom: 12px;">Evolución e Historia de la Educación</h2>
                <p style="color: var(--text-secondary); max-width: 600px; margin-bottom: 25px; line-height: 1.5;">Explora las grandes transformaciones pedagógicas a lo largo de la historia en este video introductorio.</p>
                <div style="width: 100%; max-width: 680px;">
                    ${window.app.renderVideoPlayer('https://www.youtube-nocookie.com/embed/Hz3p5sYt3eE', 'Evolución e Historia de la Educación', 'assets/history_greece.png')}
                </div>
            </div>
            <div class="history-timeline">
                <div class="history-card avatar-card" onclick="app.openHistoryModal(0)"><div class="history-img-wrapper"><div class="history-img" style="background-image: url('assets/history_greece.png');"></div></div><div class="history-overlay"><h2>Antigüedad Clásica</h2><p>En la Antigua Grecia y Roma, filósofos como Sócrates y Platón sentaron las bases del pensamiento crítico.</p></div></div>
                <div class="history-card avatar-card" onclick="app.openHistoryModal(1)"><div class="history-img-wrapper"><div class="history-img" style="background-image: url('assets/history_medieval.png'); animation-direction: alternate-reverse;"></div></div><div class="history-overlay"><h2>Edad Media y Monasterios</h2><p>El conocimiento se preservó casi exclusivamente en los monasterios bajo el método escolástico.</p></div></div>
                <div class="history-card avatar-card" onclick="app.openHistoryModal(2)"><div class="history-img-wrapper"><div class="history-img" style="background-image: url('assets/history_industrial.png');"></div></div><div class="history-overlay"><h2>Revolución Industrial</h2><p>Surgieron las aulas estandarizadas y la enseñanza simultánea.</p></div></div>
                <div class="history-card avatar-card" onclick="app.openHistoryModal(3)"><div class="history-img-wrapper"><div class="history-img" style="background-image: url('assets/myth.png'); animation-direction: alternate-reverse;"></div></div><div class="history-overlay"><h2>Escuela Nueva (Constructivismo)</h2><p>El alumno se convierte en el centro activo de su propio aprendizaje.</p></div></div>
                <div class="history-card avatar-card" onclick="app.openHistoryModal(4)"><div class="history-img-wrapper"><div class="history-img" style="background-image: url('assets/whiteboard.png');"></div></div><div class="history-overlay"><h2>Era Digital e IA</h2><p>La información es libre y el profesor se transforma en diseñador de experiencias.</p></div></div>
            </div>
        </div>
    `;

    const renderTests = () => {
        let testsHTML = Object.keys(testsData).map(key => {
            const t = testsData[key];
            return `<div class="card avatar-card" onclick="app.startQuiz('${key}')"><div class="card-icon-wrapper"><i class="ph ${t.icon}"></i></div><h3 class="card-title">${t.title}</h3><p class="card-desc">${t.desc}</p><div class="card-action" style="margin-top: 15px; color: var(--primary); font-weight: bold;">Iniciar Test <i class="ph ph-arrow-right"></i></div></div>`;
        }).join('');

        const featuredTest3 = `
            <div class="card avatar-card" onclick="app.startDiagnosticTest('innovation')" style="grid-column: span 1; background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.25)); border-color: #EC4899; box-shadow: 0 0 20px rgba(236, 72, 153, 0.1);">
                <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-start;">
                    <div class="card-icon-wrapper" style="margin:0; background: #DB2777; color: white; width: 60px; height: 60px;"><i class="ph-bold ph-scan" style="font-size: 30px;"></i></div>
                    <div style="flex: 1;">
                        <h3 class="card-title" style="color: #FBCFE8; font-size: 20px;">Scanner de Innovación Educativa</h3>
                        <p class="card-desc" style="font-size: 14px;">El instrumento definitivo. Evalúa tus metodologías, rol docente, uso de tecnología y diseño de experiencias para obtener recomendaciones disruptivas.</p>
                    </div>
                    <button class="hero-btn" style="background: #DB2777; font-size: 13px; padding: 10px 15px;">Iniciar Scanner <i class="ph-bold ph-arrow-right"></i></button>
                </div>
            </div>
        `;

        const featuredTest2 = `
            <div class="card avatar-card" onclick="app.startDiagnosticTest('pedagogical')" style="grid-column: span 1; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.2)); border-color: #A855F7;">
                <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-start;">
                    <div class="card-icon-wrapper" style="margin:0; background: #9333EA; color: white; width: 60px; height: 60px;"><i class="ph-bold ph-strategy" style="font-size: 30px;"></i></div>
                    <div style="flex: 1;">
                        <h3 class="card-title" style="color: #C084FC; font-size: 20px;">Diagnóstico de Habilidades Pedagógicas</h3>
                        <p class="card-desc" style="font-size: 14px;">Mide tu capacidad de gestión de aula, evaluación, facilitación e interacción en tiempo real.</p>
                    </div>
                    <button class="hero-btn" style="background: #9333EA; font-size: 13px; padding: 10px 15px;">Iniciar Prueba <i class="ph-bold ph-arrow-right"></i></button>
                </div>
            </div>
        `;

        const featuredTest1 = `
            <div class="card avatar-card" onclick="app.startDiagnosticTest('constructivist')" style="grid-column: span 1; background: linear-gradient(135deg, rgba(147, 197, 253, 0.1), rgba(59, 130, 246, 0.2)); border-color: var(--primary);">
                <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-start;">
                    <div class="card-icon-wrapper" style="margin:0; background: var(--primary); color: var(--bg-dark); width: 60px; height: 60px;"><i class="ph-bold ph-brain" style="font-size: 30px;"></i></div>
                    <div style="flex: 1;">
                        <h3 class="card-title" style="color: var(--primary); font-size: 20px;">Diagnóstico de Perfil Constructivista</h3>
                        <p class="card-desc" style="font-size: 14px;">Evaluación situacional premium. Mide científicamente tu capacidad de aplicar enfoques constructivistas.</p>
                    </div>
                    <button class="hero-btn" style="font-size: 13px; padding: 10px 15px;">Iniciar Prueba <i class="ph-bold ph-arrow-right"></i></button>
                </div>
            </div>
        `;

        return `
            <div class="view-animate">
                <div class="view-header"><h1 class="view-title">Biblioteca de Tests y Evaluaciones</h1></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
                    ${featuredTest3}
                    ${featuredTest2}
                    ${featuredTest1}
                </div>
                <div class="view-header"><h2 class="view-title" style="font-size: 24px;">Tests Básicos de Opción Múltiple</h2></div>
                <div class="grid-container">${testsHTML}</div>
            </div>
        `;
    };

    const renderCoursesCatalog = () => {
        let html = Object.values(coursesData).map(c => `
            <div class="card avatar-card" onclick="app.startCourse('${c.id}')" style="padding: 0;">
                <div style="height: 180px; background: url('${c.image}') center/cover; position: relative;"></div>
                <div style="padding: 24px;">
                    <h3 class="card-title">${c.title}</h3>
                    <p class="card-desc" style="margin-bottom: 16px;">${c.desc}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); font-weight: 600;"><span>PROGRESO</span><span>${c.progress}%</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${c.progress}%;"></div></div>
                </div>
            </div>`).join('');
        return `<div class="view-animate"><div class="view-header"><h1 class="view-title">Micro-Cursos</h1></div><div class="grid-container">${html}</div></div>`;
    };

    const renderGamification = () => `
        <div class="view-animate">
            <div class="view-header"><h1 class="view-title">Aprende Jugando</h1></div>
            <div class="grid-container">
                <div class="hero-banner avatar-card" style="background: url('assets/myth.png') center/cover; padding: 0; flex-direction: column; height: 280px;">
                    <div style="background: rgba(15,23,42,0.8); width: 100%; height: 100%; position: absolute; z-index: 1;"></div>
                    <div class="hero-content" style="z-index: 2; padding: 30px;"><h2 style="color: var(--error);">Verdadero o Falso</h2><p style="color: #fff; margin-bottom: 15px; opacity: 0.9; font-size: 14px;">Pon a prueba tus conocimientos sobre mitos en la educación.</p><button class="hero-btn" style="background: var(--error); color: #fff;" onclick="app.startMythGame()">Jugar</button></div>
                </div>
                <div class="hero-banner avatar-card" style="background: url('assets/whiteboard.png') center/cover; padding: 0; flex-direction: column; height: 280px;">
                    <div style="background: rgba(15,23,42,0.8); width: 100%; height: 100%; position: absolute; z-index: 1;"></div>
                    <div class="hero-content" style="z-index: 2; padding: 30px;"><h2 style="color: var(--primary);">Rompecabezas de Clase</h2><p style="color: #fff; margin-bottom: 15px; opacity: 0.9; font-size: 14px;">Ordena los pasos para crear una lección perfecta.</p><button class="hero-btn" onclick="app.startWhiteboardGame()">Ir a la Pizarra</button></div>
                </div>

                <div class="hero-banner avatar-card" style="background: linear-gradient(135deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.9)); padding: 0; flex-direction: column; height: 280px;">
                    <div class="hero-content" style="z-index: 2; padding: 30px;">
                        <h2 style="color: #fff; font-size: 24px; margin-bottom: 5px;">Simulador de Ventas</h2>
                        <p style="color: #fff; margin-bottom: 15px; opacity: 0.9; font-size: 14px;">Practica tu empatía y enfoque en casos reales.</p>
                        <button class="hero-btn" style="background: #fff; color: #FF6B6B;" onclick="app.openExternalModule('modules/sales_360_game.html')">Iniciar Reto</button>
                    </div>
                </div>

                <div class="hero-banner avatar-card" style="background: linear-gradient(135deg, rgba(74, 144, 226, 0.9), rgba(144, 19, 254, 0.9)); padding: 0; flex-direction: column; height: 280px;">
                    <div class="hero-content" style="z-index: 2; padding: 30px;">
                        <h2 style="color: #fff; font-size: 24px; margin-bottom: 5px;">Memoria y Trivia</h2>
                        <p style="color: #fff; margin-bottom: 15px; opacity: 0.9; font-size: 14px;">Diviértete con juegos clásicos para memorizar conceptos.</p>
                        <button class="hero-btn" style="background: #fff; color: #4A90E2;" onclick="app.openExternalModule('modules/sales_experience.html')">Explorar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const views = { home: renderHome, history: renderHistory, tests: renderTests, gamification: renderGamification, courses: renderCoursesCatalog, profile: renderProfile, community: renderCommunity, news: renderNews };

    app.navigate('home');
    navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); app.navigate(e.currentTarget.getAttribute('data-target')); }); });

    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }

    document.addEventListener('click', (e) => {
        const themeMenu = document.getElementById('theme-menu');
        const gearBtn = document.querySelector('.ph-gear')?.parentElement;
        if(themeMenu && themeMenu.style.display === 'block' && !themeMenu.contains(e.target) && gearBtn && !gearBtn.contains(e.target)) {
            themeMenu.style.display = 'none';
        }
    });
});

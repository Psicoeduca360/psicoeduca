# 🎓 Psicoeduca Academy - Plataforma Formativa para Docentes

**Psicoeduca Academy** es una plataforma web interactiva diseñada para la capacitación, evaluación y gamificación del desarrollo pedagógico docente. Explora metodologías activas, **Diseño Universal para el Aprendizaje (DUA)**, **Constructivismo**, **Neuroeducación** y **Microaprendizaje**.

---

## 🚀 Características Principales

- **🔐 Autenticación y Registro de Usuarios Local**: Sistema de Login/Registro con nombre de usuario y contraseña persistido en `localStorage`. Incluye un registro histórico completo de todos los educadores que han ingresado a la aplicación.
- **🤖 Asistente Pedagogíco Virtual 'Elprofe' (Autónomo sin API Externa)**: Chatbot integrado que responde consultas didácticas, metodológicas y operativas usando la base de conocimiento interna del repositorio.
- **📚 Micro-Cursos Interactivos**: Cursos avanzados sobre LXD (Diseño de Experiencias de Aprendizaje), Canva para educación y DUA con escenarios interactivos de aula.
- **🏆 Evaluaciones y Diagnósticos**:
  - Scanner de Innovación Educativa (Niveles Tradicional a Disruptivo).
  - Diagnóstico de Habilidades Pedagógicas (8 dimensiones evaluadas).
  - Diagnóstico de Perfil Constructivista.
  - Tests básicos de opción múltiple.
- **🎮 Zona de Gamificación (Aprende Jugando)**:
  - *Cazador de Neuromitos*: Juego interactivo Verdadero/Falso de 10 neuromitos educativos.
  - *Pizarra Dinámica*: Rompecabezas interactivo para ordenar secuencias pedagógicas de clase.
  - *Simuladores de Caso y Juegos de Memoria*.
- **📜 Galería de Avatares y Niveles**: Sistema de progresión de 20 rangos evolutivos (de *Docente Novato* a *Titán de la Educación*) basados en puntos XP acumulados.
- **🏛️ Historia de la Educación Inmersiva**: Línea de tiempo interactiva desde la Antigüedad Clásica hasta la Era Digital e Inteligencia Artificial, con modales informativos y video explicativo.

---

## 💻 Instalación y Uso Local

La plataforma está construida con **HTML5, Vanilla CSS3 y JavaScript moderno (ES6+)**, por lo que no requiere ningún proceso de compilación previo.

### Pasos para ejecutar localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/educator-app.git
   cd educator-app
   ```

2. **Iniciar un servidor estático local:**
   - Usando `npm` / `npx`:
     ```bash
     npm start
     ```
   - O abriendo directamente `index.html` en tu navegador preferido.

---

## 📦 Despliegue en GitHub Pages

Este repositorio cuenta con un flujo de trabajo de **GitHub Actions** automatizado en `.github/workflows/deploy.yml`.

### Instrucciones para activar el despliegue automático:

1. Ve a tu repositorio en **GitHub**.
2. Dirígete a **Settings** > **Pages** (en la barra lateral izquierda).
3. En la sección **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. Cada vez que realices un `push` a la rama `main` o `master`, la aplicación se desplegará automáticamente en:
   `https://<tu-usuario>.github.io/<nombre-repositorio>/`

---

## 🛠️ Estructura del Proyecto

```text
educator-app/
├── index.html                   # Documento principal y estructura del layout
├── css/
│   └── style.css                # Sistema de diseño, tokens CSS, componentes y animaciones
├── js/
│   └── app.js                   # Lógica global, estado, autenticación, chatbot interno y vistas
├── modules/                     # Módulos y experiencias interactivas independientes (iframes)
│   ├── miniserie_tiktok_educacion.html
│   ├── sales_360_game.html
│   └── sales_experience.html
├── assets/                      # Imágenes de avatares, historia e interfaz
├── .github/
│   └── workflows/
│       └── deploy.yml           # Workflow de despliegue automático en GitHub Pages
├── package.json                 # Metadatos del proyecto y scripts locales
├── .gitignore                   # Archivos excluidos del control de versiones
└── README.md                    # Documentación del proyecto
```

---

## 🔒 Privacidad y Almacenamiento

Toda la información del usuario, progreso (XP), diagnósticos y claves de acceso se almacenan localmente en el navegador (`localStorage`), garantizando que la aplicación sea 100% estática, rápida, segura y privada.

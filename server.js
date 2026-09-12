import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Verificar que la clave exista
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: No se encontró la GEMINI_API_KEY en el archivo .env");
    process.exit(1);
}

// Inicializar la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // Inicializar el modelo con instrucciones de sistema
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Eres 'Elprofe', el chatbot oficial y experto en pedagogía, DUA (Diseño Universal para el Aprendizaje), gamificación, constructivismo y neuroeducación de la plataforma Psicoeduca Academy. Tu objetivo es asesorar a docentes para resolver problemas de aula con estrategias prácticas, empáticas y muy didácticas. Nunca te salgas del personaje."
        });

        // Generar la respuesta
        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();
        
        // Devolver al frontend
        res.json({ reply: responseText });

    } catch (error) {
        console.error("Error al procesar la IA:", error);
        res.status(500).json({ error: 'Hubo un error de comunicación con la IA de Google.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Elprofe IA corriendo exitosamente en http://localhost:${PORT}`);
});

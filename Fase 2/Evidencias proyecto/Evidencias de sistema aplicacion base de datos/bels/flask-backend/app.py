from flask import Flask, request, jsonify
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from flask_cors import CORS
import os
import pandas as pd  # Para procesar el archivo CSV o TXT
from dotenv import load_dotenv

# Cargar las variables de entorno desde .env
load_dotenv()

# Definir el modelo fine-tuned usando ChatOpenAI
api_key = os.getenv('OPENAI_API_KEY')
model_id = "ft:gpt-4o-2024-08-06:personal:myexperimentsimplified:AGatb20a"
llm = ChatOpenAI(openai_api_key=api_key, model_name=model_id, max_tokens=150)

app = Flask(__name__)
CORS(app)

# Función para cargar el archivo CSV como un DataFrame
def cargar_preguntas(file_path):
    # Leer el archivo CSV separado por ";"
    df = pd.read_csv(file_path, sep=';', encoding='utf-8')
    return df

@app.route('/api/generar-respuestas', methods=['POST'])
def generar_respuestas():
    try:
        # Obtener los datos enviados desde el frontend
        data = request.json
        pais = data.get('pais')  # Tomar directamente lo enviado por el frontend
        ciudad = data.get('ciudad')

        puntajes = data.get('puntajes', {})  # Obtener los puntajes enviados

        # Log para verificar que los datos se reciben correctamente
        app.logger.info(f"Datos recibidos: Pais: {pais}, Ciudad: {ciudad}, Puntajes: {puntajes}")

        # Cargar el archivo de preguntas
        file_path = r'C:\Users\luisa\OneDrive\Escritorio\TestBelsLimpio.csv'  # Cambia la ruta del archivo según tu configuración
        preguntas_df = cargar_preguntas(file_path)

        # Verificar que se cargue correctamente el archivo CSV
        app.logger.info(f"Contenido del DataFrame de preguntas:\n{preguntas_df.head()}")

        respuestas = []
        contador_pregunta = 1

        # Asociar los puntajes manuales con las preguntas correctas basadas en el número de pregunta
        for grupo, puntajes_grupo in puntajes.items():
            app.logger.info(f"Procesando grupo: {grupo} con puntajes: {puntajes_grupo}")
            preguntas_grupo = preguntas_df[preguntas_df['Grupo'] == grupo]  # Filtrar por grupo
            app.logger.info(f"Preguntas para el grupo {grupo}:\n{preguntas_grupo.head()}")
            preguntas_ordenadas = preguntas_grupo[['Pregunta', 'TextoPregunta']].drop_duplicates(subset='Pregunta').sort_values(by='Pregunta')  # Ordenar y evitar duplicados

            # Iterar sobre las preguntas del grupo y los puntajes
            for i, (idx, pregunta) in enumerate(preguntas_ordenadas.iterrows()):
                texto_pregunta = pregunta['TextoPregunta']
                puntaje = puntajes_grupo[i] if i < len(puntajes_grupo) else 0
                app.logger.info(f"Procesando pregunta N° {contador_pregunta}: {texto_pregunta} con puntaje {puntaje}")

                # Generar el texto de las alternativas asociadas a la pregunta
                alternativas = preguntas_grupo[preguntas_grupo['Pregunta'] == pregunta['Pregunta']][['TextoAlternativa', 'PuntajeAlternativa']].drop_duplicates().to_dict(orient='records')
                texto_alternativas = ""
                for alt in alternativas:
                    texto_alternativas += f"Alternativa: {alt['TextoAlternativa']} (Puntaje: {alt['PuntajeAlternativa']})\n"

                app.logger.info(f"Texto de alternativas para la pregunta N° {contador_pregunta}:\n{texto_alternativas}")

                # Generar el prompt con ciudad, país y puntajes
                prompt = f"""
                Pregunta N° {contador_pregunta}: {texto_pregunta}
                Puntaje otorgado: {puntaje}.
                Aquí tienes algunas alternativas y su puntaje asociado:
                {texto_alternativas}
                
                Proporciona una sugerencia, práctica y altamente efectiva para mejorar esta habilidad. En tu respuesta usa ejemplos, recursos y lugares ubicados en {ciudad}, {pais}. La sugerencia debe ser de máximo dos líneas. Si el puntaje es igual a 4, dí "Haz alcanzado el puntaje máximo en este ítem. ¡Sigue así!". Mientras el puntaje sea más bajo la recomendación debe ser más impactante.
                """

                # Enviar el prompt al modelo una sola vez por pregunta
                messages = [
                    SystemMessage(content="Eres un psicólogo experto en habilidades diarias. Proporciona recomendaciones prácticas para mejorar las áreas más débiles."),
                    HumanMessage(content=prompt)
                ]
                app.logger.info(f"Enviando prompt al modelo:\n{prompt}")
                response = llm(messages)
                respuesta_ia = response.content.strip()

                # Incluir el puntaje en la respuesta antes del contenido de la IA
                # Convertir el texto a HTML en lugar de usar **negritas**
                respuesta_formateada = f"Puntaje obtenido: {puntaje}<br><strong>Respuesta IA:</strong> {respuesta_ia.replace('**', '<strong>').replace('**', '</strong>')}"


                # Log para verificar la respuesta de la IA
                app.logger.info(f"Respuesta de la IA: {respuesta_formateada}")

                # Almacenar la pregunta, el número y la respuesta generada por la IA
                respuestas.append({
                    "pregunta": f"Pregunta N° {contador_pregunta}: {texto_pregunta}",
                    "respuesta": respuesta_formateada
                })

                contador_pregunta += 1

        return jsonify({"preguntas_respuestas": respuestas})

    except Exception as e:
        app.logger.error(f"Error en la generación de respuestas: {str(e)}")
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

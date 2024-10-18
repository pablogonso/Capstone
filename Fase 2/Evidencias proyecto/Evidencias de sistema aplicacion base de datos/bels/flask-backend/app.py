from flask import Flask, request, jsonify
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from flask_cors import CORS
import os
import pandas as pd
from dotenv import load_dotenv

# Cargar las variables de entorno desde .env
load_dotenv()

# Configuración del modelo de IA con OpenAI
api_key = os.getenv('OPENAI_API_KEY')
model_id = "ft:gpt-4o-2024-08-06:personal:myexperimentsimplified:AGatb20a"
llm = ChatOpenAI(openai_api_key=api_key, model_name=model_id, max_tokens=150)

app = Flask(__name__)
CORS(app)

# Función para cargar el archivo CSV como DataFrame
def cargar_preguntas(file_path):
    df = pd.read_csv(file_path, sep=';', encoding='utf-8')
    return df

# Función para limpiar y acortar el texto
def limpiar_texto(texto, limite=300):
    """Elimina asteriscos, repeticiones y acorta el texto si excede el límite."""
    # Eliminar asteriscos
    texto_limpio = texto.replace('*', '')

    # Eliminar redundancias como "Recomendación:"
    texto_limpio = texto_limpio.replace('Recomendación:', '').strip()

    # Acortar el texto si excede el límite
    if len(texto_limpio) > limite:
        texto_limpio = texto_limpio[:limite] + '...'

    return texto_limpio

@app.route('/api/generar-respuestas', methods=['POST'])
def generar_respuestas():
    try:
        # Obtener los datos enviados desde el frontend
        data = request.json
        pais = data.get('pais')
        ciudad = data.get('ciudad')
        puntajes = data.get('puntajes', {})

        # Cargar el archivo de preguntas
        file_path = r'C:\Users\luisa\OneDrive\Escritorio\TestBelsLimpio.csv'
        preguntas_df = cargar_preguntas(file_path)

        respuestas = []

        # Iterar sobre los grupos de preguntas
        for grupo, puntajes_grupo in puntajes.items():
            preguntas_grupo = preguntas_df[preguntas_df['Grupo'] == grupo]
            puntaje_total = sum(puntajes_grupo)

            # Prompt claro para la IA
            prompt = f"""
            Grupo: {grupo}
            Puntaje total de sus preguntas: {puntaje_total}/{len(puntajes_grupo) * 4}.
            Proporciona una recomendación breve, práctica y directa.
            No uses la palabra 'Recomendación' y no repitas el nombre del grupo.
            Usa ejemplos de recursos específicos en {ciudad}, {pais}.
            """

            messages = [
                SystemMessage(content="Eres un psicólogo experto en habilidades diarias."),
                HumanMessage(content=prompt)
            ]

            response = llm(messages)
            respuesta_ia = response.content.strip()

            # Limpiar y acortar la respuesta
            respuesta_formateada = limpiar_texto(respuesta_ia)

            # Almacenar la recomendación
            respuestas.append({
                "grupo": grupo,
                "puntaje_total": puntaje_total,
                "recomendacion": respuesta_formateada
            })

        # Devolver las recomendaciones agrupadas por grupo
        return jsonify({"recomendaciones": respuestas})

    except Exception as e:
        app.logger.error(f"Error en la generación de respuestas: {str(e)}")
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500

# Ejecutar la aplicación Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from langchain_community.chat_models.openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from flask_cors import CORS
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Cargar las variables de entorno desde .env
load_dotenv()

# Configuración del modelo de IA con OpenAI
api_key = os.getenv('OPENAI_API_KEY')
model_id = "ft:gpt-4o-2024-08-06:personal:myexperimentsimplified:AGatb20a"
llm = ChatOpenAI(openai_api_key=api_key, model_name=model_id, max_tokens=150)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])

# Configurar Firebase
cred = credentials.Certificate(r"/home/jose/Capstone/Fase 2/Evidencias proyecto/Evidencias de sistema aplicacion base de datos/bels/src/proyecto-bels-firebase-adminsdk-pfhrt-aaddb5520b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.route('/api/generar-respuestas', methods=['POST'])
def generar_respuestas():
    try:
        # Obtener los datos enviados desde el frontend
        data = request.json
        pais = data.get('pais')
        ciudad = data.get('ciudad')
        documento_id = data.get('documentoId')
        grupo_activo = data.get('grupoActivo', "Autocuidado")  # Obtener el grupo activo, por defecto "Autocuidado"

        if not documento_id:
            return jsonify({"error": "No se proporcionó la ID del documento"}), 400

        # Intentar obtener el documento específico desde la colección "Respuestas"
        try:
            doc_ref = db.collection('Respuestas').document(documento_id)
            doc = doc_ref.get()

            if not doc.exists:
                return jsonify({"error": "Documento no encontrado"}), 404

            # Obtener los datos del documento
            respuestas_firebase = doc.to_dict().get('respuestas', [])
            app.logger.info(f"Respuestas obtenidas de Firebase: {respuestas_firebase}")

            # Filtrar las respuestas por el grupo activo
            respuestas_filtradas = [resp for resp in respuestas_firebase if resp.get('grupo') == grupo_activo]
            app.logger.info(f"Respuestas filtradas para el grupo activo ({grupo_activo}): {respuestas_filtradas}")

        except Exception as e:
            return jsonify({"error": f"Error al obtener el documento desde Firebase: {str(e)}"}), 500

        # Devolver la ID recibida y las respuestas filtradas
        return jsonify({"documentoId": documento_id, "respuestas": respuestas_filtradas})

    except Exception as e:
        app.logger.error(f"Error en la generación de respuestas: {str(e)}")
        return jsonify({"error": f"Ha ocurrido un error: {str(e)}"}), 500


# Ruta para manejar las solicitudes de predicción
@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        # Manejo de la solicitud OPTIONS
        response = app.make_response('')
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        # Procesar la solicitud POST para realizar la predicción
        data = request.json
        respuestas = data.get('respuestas', [])
        ciudad = data.get('ciudad')
        pais = data.get('pais')

        # Log para verificar la estructura de los datos recibidos
        app.logger.info(f"Datos recibidos para predicción: {data}")

        # Verificación para asegurar que las respuestas no estén vacías
        if not respuestas:
            app.logger.error("Las respuestas están vacías o no fueron proporcionadas.")
            return jsonify({"error": "Las respuestas no fueron proporcionadas."}), 400

        # Crear un prompt específico para cada pregunta y obtener recomendaciones
        recomendaciones = []
        for respuesta in respuestas:
            grupo = respuesta.get('grupo')
            pregunta = respuesta.get('pregunta')
            valor = respuesta.get('valor', 0)

            # Crear el prompt para cada pregunta
            prompt = (
                f"Eres un psicólogo experto en coaching motivacional y conducta humana. "
                f"La siguiente pregunta pertenece al grupo '{grupo}'. "
                f"La pregunta es: '{pregunta}' y el puntaje obtenido es {valor} de un máximo de 4. "
                f"Un puntaje de 1 significa total imposibilidad de realizar la actividad. Un puntaje de 4 significa total posibilidad para realizar la actividad "
                f"Proporciona una única recomendación concisa y específica para mejorar esta área que incluya una y solo una hora específica para esa recomendación. La hora debe estar en formato hh:mm:ss (formato de 24 horas). "
                f"La recomendación debe ser una acción práctica que la persona pueda marcar como 'completada' al final del día. "
                f"Evita recomendaciones generales o abstractas. Si el puntaje es igual a 4, responde: '¡Felicitaciones! Has alcanzado el puntaje máximo, sigue así.' "
                f"No incluyas la palabra 'Recomendación' al inicio de la recomendación."
                f"Mientras más bajo sea el puntaje, la recomendación debe ser de más impacto. Mientras más alto sea el puntaje, la recomendación puede ser más relajada"
                )

            # Configurar el mensaje para el modelo de lenguaje
            messages = [
                SystemMessage(content="Eres un psicólogo experto en coaching motivacional y conducta humana."),
                HumanMessage(content=prompt)
            ]

            # Obtener la respuesta del modelo para la pregunta actual
            response_llm = llm(messages)
            recomendacion = response_llm.content.strip()

            # Agregar la recomendación a la lista de resultados
            recomendaciones.append({
                "grupo": grupo,
                "pregunta": pregunta,
                "valor": valor,
                "recomendacion": recomendacion
            })

        # Responder con las recomendaciones generadas por el modelo
        return jsonify({"prediccion": recomendaciones}), 200

    except Exception as e:
        app.logger.error(f"Error en la predicción: {str(e)}")
        return jsonify({"error": f"Error en la predicción: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

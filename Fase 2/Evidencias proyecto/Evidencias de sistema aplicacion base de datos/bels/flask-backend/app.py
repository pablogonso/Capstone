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
cred = credentials.Certificate(r"C:\Capstone\Fase 2\Evidencias proyecto\Evidencias de sistema aplicacion base de datos\bels\src\proyecto-bels-firebase-adminsdk-pfhrt-092bf431c1.json")
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

        if not documento_id:
            return jsonify({"error": "No se proporcionó la ID del documento"}), 400

        # Intentar obtener el documento específico desde la colección "Respuestas"
        try:
            doc_ref = db.collection('Respuestas').document(documento_id)
            doc = doc_ref.get()

            if not doc.exists:
                return jsonify({"error": "Documento no encontrado"}), 404

            # Obtener los datos del documento
            respuestas_firebase = doc.to_dict()
            app.logger.info(f"Respuestas obtenidas de Firebase: {respuestas_firebase}")

        except Exception as e:
            return jsonify({"error": f"Error al obtener el documento desde Firebase: {str(e)}"}), 500

        # Registro adicional para ver la estructura de la respuesta antes de devolverla
        app.logger.info(f"Estructura de la respuesta que se devolverá: {respuestas_firebase}")

        # Devolver las recomendaciones o el contenido que necesites
        return jsonify({"respuestas": respuestas_firebase.get('respuestas', [])})

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
        puntajes_por_grupo = data.get('puntajes', {})
        ciudad = data.get('ciudad')
        pais = data.get('pais')

        # Verificación para asegurar que los puntajes no estén vacíos
        if not puntajes_por_grupo:
            app.logger.error("Los puntajes están vacíos o no fueron proporcionados.")
            return jsonify({"error": "Los puntajes no fueron proporcionados."}), 400

        # Sumar los puntajes por grupo
        suma_puntajes_por_grupo = {grupo: sum(puntajes) for grupo, puntajes in puntajes_por_grupo.items()}

        # Crear un prompt específico para cada grupo y obtener recomendaciones para cada uno
        recomendaciones = []
        for grupo, puntaje_total in suma_puntajes_por_grupo.items():
            # Crear el prompt para cada grupo
            prompt = (
                f"Eres un psicólogo experto en coaching motivacional y conducta humana. "
                f"El grupo '{grupo}' tiene un puntaje total de {puntaje_total}. "
                f"El grupo Autocuidado tiene 40 puntos máximo. Si el puntaje es menor a 35 puntos, ve realizando recomendaciones más efectivas e impactantes a medida que el puntaje baje"
                f"El grupo Habilidades Domésticas tiene 28 puntos máximo. Si el puntaje es menor a 22 puntos, ve realizando recomendaciones más efectivas e impactantes a medida que el puntaje baje"
                f"El grupo Habilidades Comunitarias tiene 16 puntos máximo. Si el puntaje es menor a 12 puntos, ve realizando recomendaciones más efectivas e impactantes a medida que el puntaje baje"
                f"El grupo Relaciones Sociales tiene 20 puntos máximo. Si el puntaje es menor a 16 puntos, ve realizando recomendaciones más efectivas e impactantes a medida que el puntaje baje"
                f"Grupo: {grupo}, Puntaje Total: {puntaje_total}\n"
            )


            # Configurar el mensaje para el modelo de lenguaje
            messages = [
                SystemMessage(content="Eres un psicólogo experto en coaching motivacional y conducta humana."),
                HumanMessage(content=prompt)
            ]

            # Obtener la respuesta del modelo para el grupo actual
            response_llm = llm(messages)
            recomendacion = response_llm.content.strip()

            # Log para verificar la respuesta del modelo para cada grupo
            app.logger.info(f"Recomendación para el grupo {grupo}: {recomendacion}")

            # Agregar la recomendación a la lista de resultados
            recomendaciones.append({
                "grupo": grupo,
                "puntaje_total": puntaje_total,
                "recomendacion": recomendacion
            })

        # Log para verificar todas las recomendaciones generadas
        app.logger.info(f"Recomendaciones generadas: {recomendaciones}")

        # Responder con las recomendaciones generadas por el modelo
        return jsonify({"prediccion": recomendaciones}), 200

    except Exception as e:
        app.logger.error(f"Error en la predicción: {str(e)}")
        return jsonify({"error": f"Error en la predicción: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
from flask import Flask, request, jsonify
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from flask_cors import CORS  # Importar la extensión CORS
import os
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv()

# Definir el modelo LLM usando ChatOpenAI
api_key = os.getenv('OPENAI_API_KEY')
llm = ChatOpenAI(
    openai_api_key=api_key,
    model_name="gpt-3.5-turbo",
    max_tokens=200
)

app = Flask(__name__)

# Habilitar CORS para todas las rutas
CORS(app)

@app.route('/api/model', methods=['POST'])
def call_llm():
    data = request.json
    input_text = data.get('input_text')

    # Crear un objeto HumanMessage con el contenido del input_text
    messages = [HumanMessage(content=input_text)]

    # Llama al modelo LLM con la lista de mensajes
    response = llm(messages)

    # Obtener el contenido de la respuesta del modelo
    return jsonify({"response": response.content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

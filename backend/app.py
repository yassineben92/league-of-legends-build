from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.services.riot_service import riot_service
from backend.services.ai_service import ai_service
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "patch": riot_service.get_version()})

@app.route('/api/champions', methods=['GET'])
def get_champions():
    try:
        champions = riot_service.get_all_champions()
        return jsonify(champions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_champion():
    data = request.json
    champion_id = data.get('champion_id')
    user_api_key = data.get('api_key')

    if not champion_id:
        return jsonify({"error": "Champion ID is required"}), 400

    try:
        # 1. Get Champion Data
        champ_details = riot_service.get_champion_details(champion_id)

        # 2. Get Patch Context
        patch_context = riot_service.get_context_data()

        # 3. Analyze
        result = ai_service.analyze_champion(
            champion_name=champ_details['name'],
            champion_data=champ_details,
            patch_context=patch_context,
            api_key=user_api_key
        )

        return jsonify(result)

    except Exception as e:
        logging.error(f"Analysis failed: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

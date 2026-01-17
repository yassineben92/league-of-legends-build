from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Dict
import os
import json
import logging

# Define Pydantic models for structured output
class BuildAnalysis(BaseModel):
    champion_name: str = Field(description="The name of the champion.")
    role: str = Field(description="The best role for this build (e.g., Top, Mid).")
    summary: str = Field(description="A short, high-level strategy summary for this build.")

    starting_items: List[str] = Field(description="List of item names to buy at spawn.")
    core_items: List[str] = Field(description="The crucial 3 items that define the build.")
    full_build_order: List[str] = Field(description="The complete list of items to buy in order (6 items + boots).")

    primary_rune_tree: str = Field(description="Name of the primary rune tree (e.g., Precision).")
    keystone_rune: str = Field(description="Name of the keystone rune.")
    primary_runes: List[str] = Field(description="List of the 3 other primary runes.")
    secondary_rune_tree: str = Field(description="Name of the secondary rune tree.")
    secondary_runes: List[str] = Field(description="List of the 2 secondary runes.")
    stat_shards: List[str] = Field(description="List of the 3 stat shards.")

    skill_order: List[str] = Field(description="The first 18 levels of skill upgrades (e.g., ['Q', 'E', 'W', 'Q', ...]).")
    gameplay_tips: List[str] = Field(description="3-5 detailed tips on how to play this build.")

class AIService:
    def __init__(self):
        pass

    def analyze_champion(self, champion_name: str, champion_data: dict, patch_context: dict, api_key: str = None) -> dict:
        """
        Analyzes a champion and returns a build using Gemini 3 Pro Preview.
        """

        # 1. Check for API Key (Env var or passed arg)
        key = api_key or os.environ.get("GOOGLE_API_KEY")

        if not key:
            logging.warning("No API Key provided. Returning Mock Data.")
            return self._get_mock_data(champion_name)

        try:
            client = genai.Client(api_key=key)

            # 2. Construct Prompt
            # We strictly instruct it to use the provided patch context.
            prompt = f"""
            You are the world's best League of Legends analyst.
            The current patch is {patch_context['patch']}.

            Analyze the champion: {champion_name}.

            Champion Details:
            {json.dumps(champion_data['stats'])}
            {json.dumps(champion_data.get('spells', []))}

            Available Items (Current Patch Data):
            {json.dumps(patch_context['items'])}

            Available Runes:
            {json.dumps(patch_context['runes'])}

            Task:
            Create the ABSOLUTE BEST build for {champion_name} on the current patch.
            You must ONLY use items and runes that exist in the provided JSON data.
            Do not hallucinate items that were removed (like Mythics if this patch is post-Mythic).
            Explain your reasoning deeply but return the final output as strictly structured JSON.
            """

            # 3. Call Gemini 3 Pro Preview
            response = client.models.generate_content(
                model="gemini-3-pro-preview",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=BuildAnalysis,
                    thinking_config=types.ThinkingConfig(thinking_level="high")
                )
            )

            # 4. Parse Response
            # The SDK handles the parsing into the Pydantic model if response_schema is used,
            # but response.text returns the JSON string.
            # actually response.parsed might work if available in this sdk version,
            # but let's stick to parsing text to be safe with the new library.
            try:
                # With structured output, response.text should be valid JSON
                return json.loads(response.text)
            except Exception as parse_error:
                 # Fallback if the SDK returns an object we need to handle differently
                logging.error(f"JSON Parse Error: {parse_error}. Response: {response.text}")
                return self._get_mock_data(champion_name)

        except Exception as e:
            logging.error(f"Gemini API Error: {e}")
            # Fallback to mock data so the app doesn't crash for the user
            return self._get_mock_data(champion_name)

    def _get_mock_data(self, champion_name):
        """
        Returns a high-quality mock response for testing/demo purposes.
        """
        return {
            "champion_name": champion_name,
            "role": "Mid",
            "summary": f"A dominant mock build for {champion_name} focusing on burst damage and sustainability. (Mocked Data - Set API Key for Real AI)",
            "starting_items": ["Doran's Ring", "Health Potion", "Health Potion"],
            "core_items": ["Luden's Companion", "Stormsurge", "Shadowflame"],
            "full_build_order": [
                "Doran's Ring", "Sorcerer's Shoes", "Luden's Companion",
                "Stormsurge", "Rabadon's Deathcap", "Void Staff", "Zhonya's Hourglass"
            ],
            "primary_rune_tree": "Domination",
            "keystone_rune": "Electrocute",
            "primary_runes": ["Taste of Blood", "Eyeball Collection", "Ultimate Hunter"],
            "secondary_rune_tree": "Sorcery",
            "secondary_runes": ["Manaflow Band", "Transcendence"],
            "stat_shards": ["Adaptive Force", "Adaptive Force", "Health Scaling"],
            "skill_order": ["Q", "E", "W", "Q", "Q", "R", "Q", "E", "Q", "E", "R", "E", "E", "W", "W", "R", "W", "W"],
            "gameplay_tips": [
                "Focus on trading with your Q early game.",
                "Roam bot lane after hitting level 6.",
                "Use your W defensively to escape ganks."
            ]
        }

ai_service = AIService()

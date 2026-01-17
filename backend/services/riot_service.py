import requests
import logging

class RiotService:
    def __init__(self):
        self.version = None
        self.champions = {}
        self.items = {}
        self.runes = []
        self.base_url = "https://ddragon.leagueoflegends.com"
        self.refresh_data()

    def refresh_data(self):
        try:
            # 1. Get Version
            versions = requests.get(f"{self.base_url}/api/versions.json").json()
            self.version = versions[0]
            logging.info(f"Current Patch: {self.version}")

            # 2. Get Champions
            champ_data = requests.get(f"{self.base_url}/cdn/{self.version}/data/en_US/champion.json").json()
            self.champions = champ_data['data']

            # 3. Get Items
            item_data = requests.get(f"{self.base_url}/cdn/{self.version}/data/en_US/item.json").json()
            # Filter for Summoner's Rift (Map 11) and purchasing
            self.items = {
                k: v for k, v in item_data['data'].items()
                if v.get('gold', {}).get('purchasable', False)
                and (not v.get('maps') or v.get('maps', {}).get('11', True))
            }

            # 4. Get Runes
            self.runes = requests.get(f"{self.base_url}/cdn/{self.version}/data/en_US/runesReforged.json").json()

            logging.info(f"Loaded {len(self.champions)} champions, {len(self.items)} items, and rune trees.")

        except Exception as e:
            logging.error(f"Error fetching Riot data: {e}")
            raise e

    def get_version(self):
        return self.version

    def get_all_champions(self):
        # Return a simplified list for the selector
        return [
            {
                "id": k,
                "name": v['name'],
                "title": v['title'],
                "image": f"{self.base_url}/cdn/{self.version}/img/champion/{v['image']['full']}",
                "splash": f"{self.base_url}/cdn/img/champion/loading/{k}_0.jpg"
            }
            for k, v in self.champions.items()
        ]

    def get_champion_details(self, champion_id):
        # Get detailed data for a specific champion (stats, spells)
        try:
            # Detailed endpoint is often champion specific
            detail = requests.get(f"{self.base_url}/cdn/{self.version}/data/en_US/champion/{champion_id}.json").json()
            return detail['data'][champion_id]
        except:
            # Fallback to the general list if detailed fetch fails
            return self.champions.get(champion_id)

    def get_context_data(self):
        # Returns a condensed dictionary of items and runes for the AI context
        # We strip description HTML to save tokens
        clean_items = {}
        for k, v in self.items.items():
            clean_items[v['name']] = {
                "stats": v.get('stats', {}),
                "gold": v.get('gold', {}).get('total', 0),
                "plaintext": v.get('plaintext', '')
            }

        return {
            "patch": self.version,
            "items": clean_items,
            "runes": self.runes
        }

riot_service = RiotService()

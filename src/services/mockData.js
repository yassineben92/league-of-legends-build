export const mockBuildData = {
    champion_name: "Aatrox",
    role: "Top",
    summary: "A dominant drain-tank build focusing on maximizing healing and sustain damage. (Offline/Demo Mode)",
    starting_items: ["Doran's Shield", "Health Potion"],
    core_items: ["Eclipse", "Sundered Sky", "Sterak's Gage"],
    full_build_order: [
        "Doran's Shield", "Plated Steelcaps", "Eclipse",
        "Sundered Sky", "Sterak's Gage", "Spirit Visage", "Death's Dance"
    ],
    primary_rune_tree: "Precision",
    keystone_rune: "Conqueror",
    primary_runes: ["Triumph", "Legend: Haste", "Last Stand"],
    secondary_rune_tree: "Resolve",
    secondary_runes: ["Revitalize", "Second Wind"],
    stat_shards: ["Adaptive Force", "Adaptive Force", "Health Scaling"],
    skill_order: ["Q", "E", "W", "Q", "Q", "R", "Q", "E", "Q", "E", "R", "E", "E", "W", "W", "R", "W", "W"],
    gameplay_tips: [
        "Land the sweet spots of your Q for maximum damage and knockups.",
        "Use your passive auto-attack on champions for a burst of healing.",
        "Ult (R) when engaging to increase your healing amplification."
    ]
};

export const getMockData = (championName) => {
    return {
        ...mockBuildData,
        champion_name: championName,
        summary: `A dominant build for ${championName} optimized for the current meta. (Offline/Demo Mode)`
    };
};

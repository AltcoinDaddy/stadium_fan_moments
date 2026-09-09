export const CATEGORY_ICON: Record<string, string> = {
  GOAL: "sports_soccer",
  SAVE: "sports_handball",
  CELEBRATION: "celebration",
  CROWD: "groups",
  TENSION: "bolt",
};

export const CATEGORY_PASTEL: Record<string, string> = {
  GOAL: "#263d26",
  SAVE: "#19314f",
  CELEBRATION: "#4a2444",
  CROWD: "#2d2759",
  TENSION: "#4a2732",
};

const PASTELS = ["#263d26", "#4a2444", "#2d2759", "#19314f", "#4a2732"] as const;

export function pastelFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash += key.charCodeAt(i);
  return PASTELS[hash % PASTELS.length];
}

export function categoryIcon(category: string) {
  return CATEGORY_ICON[category] || "photo_camera";
}

export function categoryPastel(category: string) {
  return CATEGORY_PASTEL[category] || pastelFor(category);
}

export const getGenericPlatformKey = (slug?: string) => {
  if (!slug) return undefined;
  if (slug.startsWith("playstation")) return "playstation";
  if (slug.startsWith("xbox")) return "xbox";
  if (slug === "nintendo-switch") return "nintendo-switch";
  if (slug === "pc") return "pc";
  if (slug === "mac") return "mac";
  if (slug === "linux") return "linux";
  if (slug === "android") return "android";
  if (slug === "ios") return "iOS";
  if (slug === "macos") return "macOS";
  if (slug === "nintendo-3ds") return "Nintendo 3DS";
  if (slug === "nintendo-ds") return "Nintendo DS";
  if (slug === "nintendo-dsi") return "Nintendo DSI";
  if (slug === "wii") return "Wii";
  if (slug === "wii-u") return "Wii U";
  if (slug === "ps-vita") return "PS Vita";
  if (slug === "psp") return "PSP";
  if (slug === "dreamcast") return "Dreamcast";
  if (slug === "gamecube") return "GameCube";
  if (slug === "neogeo") return "Neo Geo";
  if (slug === "macintosh") return "Macintosh";
  return slug;
};

// Helper to get a clean list of unique platform keys from the API response
export const getUniquePlatformKeys = (platforms?: { platform: { slug?: string } }[]) => {
  if (!platforms) return [];
  const uniqueKeys = new Set<string>();
  const result: string[] = [];

  platforms.forEach(({ platform }) => {
    const key = getGenericPlatformKey(platform.slug);
    if (key && !uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      result.push(key);
    }
  });

  return result;
};
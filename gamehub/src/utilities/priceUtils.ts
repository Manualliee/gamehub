export function calculatePrice(releaseDate: string | null): string {
  if (!releaseDate) return "19.99"; // Default fallback

  const releaseYear = new Date(releaseDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - releaseYear;

  if (age <= 1) return "59.99"; // New releases (0-1 year old)
  if (age <= 5) return "29.99"; // Recent games (2-5 years old)
  if (age <= 10) return "19.99"; // Older games (6-10 years old)
  return "9.99"; // Classics (10+ years old)
}

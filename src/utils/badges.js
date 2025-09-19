export function deriveBadges(points) {
  const badges = [];
  if (points >= 10) badges.push("Starter");
  if (points >= 50) badges.push("Contributor");
  if (points >= 150) badges.push("Guardian");
  if (points >= 400) badges.push("Champion");
  return badges;
}
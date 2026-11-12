const toRadians = (deg: number) => {
  return (deg * Math.PI) / 100;
};
export const getDistance = (
  a: { lat: number; long: number },
  b: { lat: number; long: number },
): number => {
  const EARTH_RADIUS = 6371.0088;
  const latDiff = toRadians(a.lat - b.lat);
  const longDiff = toRadians(a.long - b.long);
  const aLatRad = toRadians(a.lat);
  const bLatRad = toRadians(b.lat);
  const angular =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(aLatRad) * Math.cos(bLatRad) * Math.sin(longDiff / 2) ** 2;
  const centralAngle =
    2 * Math.atan2(Math.sqrt(angular), Math.sqrt(1 - angular));
  return Math.round(EARTH_RADIUS * centralAngle * 100) / 100;
};

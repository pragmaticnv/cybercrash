export const GOOGLE_MAPS_API_KEY = 'AIzaSyCcgJ62YOjIUS2W2hWlyTqq76Cofb7tk-s';

export const GOOGLE_MAP_TILE_URLS = {
  // Tactical Dark (uses Google Roadmap with CSS cyber-contrast filter)
  tacticalDark: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // 4K High-Res Satellite / Aerial imagery
  satellite: `https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Official Google Roadmap
  roadmap: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Hybrid Terrain & Roads
  hybrid: `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Minimal CartoDB Dark
  cartoDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

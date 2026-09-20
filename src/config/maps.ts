export const GOOGLE_MAPS_API_KEY = 'AIzaSyCcgJ62YOjIUS2W2hWlyTqq76Cofb7tk-s';

export const GOOGLE_MAP_TILE_URLS = {
  // Tactical Dark (CartoDB Dark with cyber contrast filter)
  tacticalDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  
  // 4K High-Res Satellite / Aerial imagery (Esri World Imagery)
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  
  // Official Roadmap (OpenStreetMap HD)
  roadmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  
  // Hybrid Terrain & Roads (Esri World Topographic)
  hybrid: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  
  // Minimal CartoDB Dark
  cartoDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

export const GOOGLE_MAPS_API_KEY = 'AIzaSyCcgJ62YOjIUS2W2hWlyTqq76Cofb7tk-s';

export const GOOGLE_MAP_TILE_URLS = {
  // Tactical Dark (Google Maps Roadmap inverted with cyber dark filter - zero watermark)
  tacticalDark: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // 4K High-Res Google Satellite with crisp street and locality hybrid labels
  satellite: `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Official Clean Google Roadmap HD
  roadmap: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Google Terrain HD
  hybrid: `https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
  
  // Minimal Cyber Dark Canvas (Esri World Dark Gray Base - 100% watermark-free dark map)
  cartoDark: 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
};


import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Only run this code on the client side
if (typeof window !== 'undefined') {
  // Fix leaflet icon paths
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  });
}
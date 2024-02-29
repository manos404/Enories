import L from "leaflet";
import iconUrl from "./church.png";

const {
  iconAnchor,
  popupAnchor,
  tooltipAnchor,
} = L.Marker.prototype.options.icon.options;

export const churchIcon = L.icon({
  iconUrl,

  iconSize: [35, 35],
  iconAnchor,
  popupAnchor,
  tooltipAnchor,
});

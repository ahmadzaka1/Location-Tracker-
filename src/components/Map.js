import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "./map.css";

const Map = ({ locations, onUpdateLocation, onDeleteLocation, onEditLocation }) => {

  //This Hook will adjust the map to move and zoom to the added location marker
  const CenterMap = ({ centerLat, centerLng }) => {
    const map = useMap();
    useEffect(() => {
      if (centerLat && centerLng) {
        map.flyTo([centerLat, centerLng], map.getZoom(), {
          animate: true,
          duration: 1.5, // Adjusting the duration of the flyTo animation when new location is added
        });
      }
    }, [centerLat, centerLng, map]);
    return null;
  };

  // Updating the coordinates from moving the marker
  const handleMarkerDragEnd = (id, event) => {
    const newPosition = event.target.getLatLng();
    onUpdateLocation(id, newPosition);
  };

  // Changing the marker icon
  const markerIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer className='map-container' center={[51.505, -0.09]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
       
      {/* Add CenterMap component that will update map center */}
      {locations.length > 0 && (
        <CenterMap
          centerLat={locations[locations.length - 1].lat}
          centerLng={locations[locations.length - 1].lng}
        />
      )}

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          draggable={true}
          icon={markerIcon}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(loc.id, e),
          }}
        >
          {/* A popup will appear when clicking on marker to show the coordinates and to edit or delete the added location */}
          <Popup>
            <div>
              <h3>Location ID: {loc.id}</h3>
              <p>Latitude: {loc.lat}</p>
              <p>Longitude: {loc.lng}</p>
              <button className='delete-button' onClick={() => onDeleteLocation(loc.id)}>Delete</button>
              <button className='edit-button' onClick={() => onEditLocation(loc)}>Edit</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

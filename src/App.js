import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import Form from "./components/Form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() { 
  // State to hold the list of locations
  const [locations, setLocations] = useState([]);

  // State to track the location currently being edited
  const [editingLocation, setEditingLocation] = useState(null);

  // useEffect hook to load locations from localStorage when the app is loaded
  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    setLocations(storedLocations);
  }, []);

  // useEffect hook to save locations to localStorage whenever locations state changes
  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(locations));
  }, [locations]);

  // Handler to add a new location by generating a unique ID for the new location using the current timestamp
  const handleAddLocation = (newLocation) => {
    const id = new Date().getTime().toString(); // Unique ID
    setLocations([...locations, { ...newLocation, id }]);
    toast.success("Location added successfully!");
  };

  // Handler to update an existing location's position by updating the location in the state based on its ID, changing its coordinates
  const handleUpdateLocation = (id, newPosition) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, lat: newPosition.lat, lng: newPosition.lng } : loc
    );
    setLocations(updatedLocations);
    toast.info("Location updated successfully!");
  };

  // Handler to delete a location by filtering out the location with the given ID from the locations array
  const handleDeleteLocation = (id) => {
    const filteredLocations = locations.filter((loc) => loc.id !== id);
    setLocations(filteredLocations);
    toast.error("Location deleted successfully!");
  };

  // Handler to start editing a location
  const handleEditLocation = (loc) => {
    setEditingLocation(loc);
  };

    // Handler to cancel the edit mode and reset the editing state
  const handleCancelEdit = () => {
    setEditingLocation(null);
  };
  return (
    <div className='app'>
      <h1 className='heading'>Location Tracker</h1>
      <h2 className='sub-heading'>Enter The Coordinates to Add Location:</h2>

      {/* Display the Form component for adding or editing locations */}
      {!editingLocation ? (
        <Form onAddLocation={handleAddLocation} />
      ) : (
        <div>

           {/* If editing, pass the existing location's coordinates and handlers to update or cancel */}
          <Form
            initialLat={editingLocation.lat}
            initialLng={editingLocation.lng}
            onAddLocation={(newLocation) => {
              handleUpdateLocation(editingLocation.id, newLocation);
              handleCancelEdit();
            }}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}

       {/* Map component to display the locations and handle user interactions */}
      <Map
        locations={locations}
        onUpdateLocation={handleUpdateLocation}
        onDeleteLocation={handleDeleteLocation}
        onEditLocation={handleEditLocation}
      />

       {/* ToastContainer to show success/error notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;

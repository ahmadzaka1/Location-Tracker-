import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './form.css';

const Form = ({ onAddLocation, initialLat = '', initialLng = '', onCancelEdit }) => {
  // State to hold the latitude, longitude, and loading state for fetching location
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [loading, setLoading] = useState(false);

  // UseEffect hook to update the latitude and longitude if initial values are passed
  useEffect(() => {
    setLat(initialLat);
    setLng(initialLng);
  }, [initialLat, initialLng]);

  // Function to validate the latitude and longitude input within valid ranges
  const validateCoordinates = (latitude, longitude) => {
    // Check if latitude is within valid range
    if (latitude < -90 || latitude > 90) {
      return 'Latitude must be between -90 and 90.';
    }
    // Check if longitude is within valid range
    if (longitude < -180 || longitude > 180) {
      return 'Longitude must be between -180 and 180.';
    }
    return ''; 
  };

  // Handler for form submission to add a new location
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate coordinates before submitting
    const validationError = validateCoordinates(parseFloat(lat), parseFloat(lng));
    if (validationError) {
      // If invalid, show error message using toast
      toast.error(validationError);
      return;
    }

    // If valid, call the onAddLocation function passed as prop and reset form fields
    onAddLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    setLat(''); 
    setLng(''); 
    toast.success('Location added successfully!'); 
  };

  // Handler to use the current geolocation of the user
  const handleUseCurrentLocation = () => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true); // Set loading to true while fetching the location

    // Get the current position from the geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;

        // Validate the fetched coordinates
        const validationError = validateCoordinates(currentLat, currentLng);
        if (validationError) {
          // If invalid, show error message and stop loading
          toast.error(validationError);
          setLoading(false);
          return;
        }

        // If valid, update the form fields with the current coordinates
        setLat(currentLat);
        setLng(currentLng);
        toast.success('Current location fetched successfully!'); 
        setLoading(false);
      },
      (error) => {
        // In case of an error while fetching location, show error message
        toast.error('Unable to fetch location. Please try again.');
        setLoading(false); 
      }
    );
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      {/* Latitude input field */}
      <div className='latitude-container'>
        <label className='latitude-heading'>Latitude:</label>
        <input
          className='input'
          type='number'
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        />
      </div>
      {/* Longitude input field */}
      <div className='longitude-container'>
        <label className='longitude-heading'>Longitude:</label>
        <input
          className='input'
          type='number'
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
        />
      </div>
      {/* Submit button for adding or updating location */}
      <button className='form-button' type='submit'>
        {initialLat ? 'Update Location' : 'Add Location'}
      </button>
      
      {/* Cancel button, appears when editing an existing location */}
      {initialLat && onCancelEdit && (
        <button className='form-button' type='button' onClick={onCancelEdit}>
          Cancel
        </button>
      )}

      {/* Button to use current geolocation */}
      <button
        className='form-button'
        type='button'
        onClick={handleUseCurrentLocation}
        disabled={loading} // Disable the button when loading
      >
        {loading ? 'Fetching Location...' : 'Use Current Location'}
      </button>
    </form>
  );
};

export default Form;

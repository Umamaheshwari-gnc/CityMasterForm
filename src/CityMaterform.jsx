import React, { useState, useEffect } from 'react';
import AreaModal from './AreaModal';
import StateModal from './StateModal';
import CountryModal from './CountryModal';
import ConfirmationModal from './ConfirmationModal';
import MessagePopup from './MessagePopup';

const CityMasterForm = () => {

  const [locationData, setLocationData] = useState({
    "India": {
      "Tamilnadu": ["Chennai", "Coimbatore", "Madurai"],
      "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
      "Karnataka": ["Bangalore", "Mysore", "Hubli"],
      "Andhra Pradesh": ["Hyderabad", "Vishakhapatnam", "Vijayawada"]
    },
    "USA": {
      "California": ["Los Angeles", "San Francisco", "San Diego"],
      "Texas": ["Houston", "Dallas", "Austin"],
      "New York": ["New York City", "Buffalo", "Rochester"],
      "Florida": ["Miami", "Orlando", "Tampa"]
    }
  });

  
  const [formData, setFormData] = useState({
    city1: '',
    country1: '',
    state1: '',
    lan: '',
    lon: '',
    status: 'Active'
  });


  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  
  const [formMessage, setFormMessage] = useState({ show: false, message: '', isError: false });
  const [confirmationData, setConfirmationData] = useState({ message: '', callback: null });

  
  const [availableStates, setAvailableStates] = useState([]);

  
  useEffect(() => {
    if (formData.country1 && locationData[formData.country1]) {
      const states = Object.keys(locationData[formData.country1]);
      setAvailableStates(states);
    } else {
      setAvailableStates([]);
      setFormData(prev => ({ ...prev, state1: '' }));
    }
  }, [formData.country1, locationData]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const validateTextInput = (value) => {
    return /^[A-Za-z\s]*$/.test(value);
  };

  const handleTextInput = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    setFormData(prev => ({ ...prev, [name]: filteredValue }));
  }

  const validateCoordinate = (value, min, max) => {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (value === '' || (!isNaN(numValue) && 
        ((name === 'lan' && numValue >= -90 && numValue <= 90) || 
         (name === 'lon' && numValue >= -180 && numValue <= 180)))) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = () => {
    const valid = 
      validateTextInput(formData.city1) && formData.city1.trim() &&
      formData.country1 && formData.state1 &&
      validateCoordinate(formData.lan, -90, 90) &&
      validateCoordinate(formData.lon, -180, 180) &&
      formData.status;

    if (!valid) {
      showFormMessage("Please fill all the required fields correctly.", true);
      return;
    }

    showConfirmation("Are you sure you want to submit the form?", () => {
      showFormMessage("City details submitted successfully!");
      setFormData({
        city1: '',
        country1: '',
        state1: '',
        lan: '',
        lon: '',
        status: 'Active'
      });
    });
  };


  const handleClear = () => {
    showConfirmation("Are you sure you want to clear all form data?", () => {
      setFormData({
        city1: '',
        country1: '',
        state1: '',
        lan: '',
        lon: '',
        status: 'Active'
      });
      showFormMessage("Form cleared successfully!");
    });
  };

  
  const showFormMessage = (message, isError = false) => {
    setFormMessage({ show: true, message, isError });
    setTimeout(() => {
      setFormMessage(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const showConfirmation = (message, callback) => {
    setConfirmationData({ message, callback });
    setShowConfirmationModal(true);
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(false);
    if (confirmationData.callback) {
      confirmationData.callback();
    }
  };


  const addNewCountry = (countryName) => {
    if (!locationData[countryName]) {
      const newLocationData = { ...locationData, [countryName]: {} };
      setLocationData(newLocationData);
      return true;
    }
    return false;
  };

  
  const addNewState = (stateName, countryName) => {
    if (!locationData[countryName]) {
      const newLocationData = { ...locationData, [countryName]: { [stateName]: [] } };
      setLocationData(newLocationData);
    } else if (!locationData[countryName][stateName]) {
      const newLocationData = {
        ...locationData,
        [countryName]: {
          ...locationData[countryName],
          [stateName]: []
        }
      };
      setLocationData(newLocationData);
      return true;
    }
    return false;
  };

  return (
    <>
      <form id="cityForm" className="container shadow-lg p-4 rounded-4 bg-gradient">
        <h1 className="mb-3">City Master Form</h1>
        <h2 className="mb-4">City Details</h2>

        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="city1" className="form-label required-field">City Name</label>
            <input 
              type="text" 
              id="city1" 
              name="city1" 
              required 
              className="form-control form-control-lg border-primary shadow-sm"
              value={formData.city1}
              onChange={handleTextInput}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="country1" className="form-label required-field">Country</label>
            <select 
              id="country1" 
              name="country1" 
              required 
              className="form-select form-select-lg border-info shadow-sm"
              value={formData.country1}
              onChange={handleInputChange}
            >
              <option value="">--Select--</option>
              {Object.keys(locationData).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="state1" className="form-label required-field">State</label>
            <select 
              id="state1" 
              name="state1" 
              required 
              disabled={!formData.country1}
              className="form-select form-select-lg border-info shadow-sm"
              value={formData.state1}
              onChange={handleInputChange}
            >
              <option value="">--Select--</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="lan" className="form-label">Latitude</label>
            <input 
              type="number" 
              id="lan" 
              name="lan" 
              step="any" 
              placeholder="e.g., 12.96" 
              className="form-control form-control-lg border-success shadow-sm"
              value={formData.lan}
              onChange={handleCoordinateChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="lon" className="form-label">Longitude</label>
            <input 
              type="number" 
              id="lon" 
              name="lon" 
              step="any" 
              placeholder="e.g., 77.58" 
              className="form-control form-control-lg border-success shadow-sm"
              value={formData.lon}
              onChange={handleCoordinateChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="status" className="form-label required-field">Status</label>
            <select 
              id="status" 
              name="status" 
              required 
              className="form-select form-select-lg border-warning shadow-sm"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-12 text-center">
            <button 
              type="button" 
              className="btn btn-primary btn-lg m-1 px-4 shadow"
              onClick={() => setShowAreaModal(true)}
            >
              <i className="fas fa-plus-circle me-1"></i>Add Area
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-lg m-1 px-4 shadow"
              onClick={() => setShowStateModal(true)}
            >
              <i className="fas fa-plus-circle me-1"></i>Add State
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-lg m-1 px-4 shadow"
              onClick={() => setShowCountryModal(true)}
            >
              <i className="fas fa-plus-circle me-1"></i>Add Country
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button 
            type="button" 
            className="btn btn-primary btn-lg m-1 px-5 shadow"
            onClick={handleSubmit}
          >
            <i className="fas fa-paper-plane me-1"></i>Submit
          </button>
          <button 
            type="button" 
            className="btn btn-danger btn-lg m-1 px-5 shadow"
            onClick={handleClear}
          >
            <i className="fas fa-eraser me-1"></i>Clear
          </button>
        </div>
      </form>

      {/* Modals */}
      <AreaModal 
        show={showAreaModal} 
        onHide={() => setShowAreaModal(false)}
        locationData={locationData}
      />

      <StateModal 
        show={showStateModal} 
        onHide={() => setShowStateModal(false)}
        locationData={locationData}
        onAddState={addNewState}
      />

      <CountryModal 
        show={showCountryModal} 
        onHide={() => setShowCountryModal(false)}
        onAddCountry={addNewCountry}
      />

      <ConfirmationModal 
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmation}
        message={confirmationData.message}
      />

      <MessagePopup 
        show={formMessage.show}
        message={formMessage.message}
        isError={formMessage.isError}
        onClose={() => setFormMessage(prev => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default CityMasterForm;





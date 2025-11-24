import React, { useState, useEffect } from 'react';

const AreaModal = ({ show, onHide, locationData }) => {
  const [formData, setFormData] = useState({
    areaName: '',
    country: '',
    state: '',
    city: '',
    pinCode: ''
  });

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [message, setMessage] = useState({ show: false, text: '', isError: false });

  useEffect(() => {
    if (formData.country && locationData[formData.country]) {
      setAvailableStates(Object.keys(locationData[formData.country]));
    } else {
      setAvailableStates([]);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    }
  }, [formData.country, locationData]);

  useEffect(() => {
    if (formData.country && formData.state && locationData[formData.country]?.[formData.state]) {
      setAvailableCities(locationData[formData.country][formData.state]);
    } else {
      setAvailableCities([]);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.country, formData.state, locationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextInput = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    setFormData(prev => ({ ...prev, [name]: filteredValue }));
  };

  const handlePinInput = (e) => {
    const { value } = e.target;
    const filteredValue = value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pinCode: filteredValue }));
  };

  const showMessage = (text, isError = false) => {
    setMessage({ show: true, text, isError });
    setTimeout(() => setMessage(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSave = () => {
    if (!formData.areaName.trim() || !formData.country || !formData.state || 
        !formData.city || formData.pinCode.length !== 6) {
      showMessage("Please fill all required fields correctly", true);
      return;
    }

    showMessage("Area saved successfully!");
    setTimeout(() => {
      resetForm();
      onHide();
    }, 1000);
  };

  const handleClear = () => {
    resetForm();
    showMessage("Area form cleared!");
  };

  const resetForm = () => {
    setFormData({
      areaName: '',
      country: '',
      state: '',
      city: '',
      pinCode: ''
    });
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fas fa-map-marker-alt me-2"></i>Add New Area</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {message.show && (
              <div className={`modal-message ${message.isError ? 'error' : ''}`}>
                <button className="close-btn" onClick={() => setMessage(prev => ({ ...prev, show: false }))}>&times;</button>
                <div>{message.text}</div>
              </div>
            )}
            
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="newAreaInput" className="form-label required-field">Area Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="newAreaInput" 
                  placeholder="Enter area name"
                  value={formData.areaName}
                  onChange={handleTextInput}
                  name="areaName"
                />
                <div className="form-text">Only letters and spaces allowed</div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="areaModalCountry" className="form-label required-field">Country</label>
                <select 
                  className="form-select" 
                  id="areaModalCountry"
                  value={formData.country}
                  onChange={handleInputChange}
                  name="country"
                >
                  <option value="">--Select Country--</option>
                  {Object.keys(locationData).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="areaModalState" className="form-label required-field">State</label>
                <select 
                  className="form-select" 
                  id="areaModalState"
                  value={formData.state}
                  onChange={handleInputChange}
                  name="state"
                  disabled={!formData.country}
                >
                  <option value="">--Select State--</option>
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="areaModalCity" className="form-label required-field">City</label>
                <select 
                  className="form-select" 
                  id="areaModalCity"
                  value={formData.city}
                  onChange={handleInputChange}
                  name="city"
                  disabled={!formData.state}
                >
                  <option value="">--Select City--</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="areaModalPin" className="form-label required-field">Pin Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="areaModalPin" 
                  placeholder="Enter 6-digit pin" 
                  maxLength="6"
                  value={formData.pinCode}
                  onChange={handlePinInput}
                />
                <div className="form-text">Must be exactly 6 digits</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleClear}>Clear</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              <i className="fas fa-save me-1"></i>Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaModal;


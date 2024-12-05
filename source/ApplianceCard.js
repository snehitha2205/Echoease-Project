import React from 'react';
import './ApplianceCard.css';

const ApplianceCard = ({ appliance, onToggle }) => {
  return (
    <div className="col-md-6 col-md-12 mb-3"> {/* Added margin-bottom for spacing */}
      <div className="card position-relative">
        <img src={appliance.image} className="card-img-top" alt={appliance.name} />
        
        {/* Switch for toggling appliance */}
        <div className="form-check form-switch m-3"> {/* Added margin for spacing */}
          <input
            className="form-check-input"
            type="checkbox"
            id={`${appliance.name.replace(/\s+/g, '')}Switch`}
            checked={appliance.status === 'ON'} // Switch is on if status is 'ON'
            onChange={() => onToggle(appliance.id, appliance.status === 'ON')} // Pass current status as boolean
          />
          <label className="form-check-label" htmlFor={`${appliance.name.replace(/\s+/g, '')}Switch`}>
            Turn ON/OFF
          </label>
        </div>

        <div className="card-body">
          <h5 className="card-title">{appliance.name}</h5>
          
          <p className="card-text">
            Status: 
            <span className="status-badge">
              <span className={`badge ${appliance.status === 'ON' ? 'bg-success' : 'bg-danger'}`}>
                {appliance.status === 'ON' ? 'On' : 'Off'}
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplianceCard;

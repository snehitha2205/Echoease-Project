import React from 'react';
import './PowerConsumption.css'; // Import styles for the Power Consumption component

const PowerConsumption = ({ appliances }) => {  
    const totalConsumption = appliances.reduce((total, appliance) => {
      return total + (appliance.status ? appliance.powerUsage : 0);
    }, 0);
  
    return (
      <div className="power-consumption">
        <h2>Power Consumption</h2>
        <p>Total Power Consumption: <strong>{totalConsumption} W</strong></p>
        <h3>Appliance Breakdown:</h3>
        <ul>
          {appliances.map(appliance => (
            <li key={appliance.id}>
              <span className="appliance-name">{appliance.name}:</span>
              <span className="appliance-power">{appliance.status ? appliance.powerUsage : 0} W</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

export default PowerConsumption;

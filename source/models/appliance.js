const mongoose = require('mongoose');

const applianceStatusSchema = new mongoose.Schema({
  id: { type:Number, ref: 'Appliance', required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('ApplianceStatus', applianceStatusSchema);

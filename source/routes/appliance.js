const express = require('express');
const router = express.Router();
const ApplianceStatus = require('../models/appliance');

// POST route to create or update appliance status
router.post('/', async (req, res) => {
  const appliances = req.body; // Expecting an array of objects

  if (!Array.isArray(appliances) || appliances.length === 0) {
    return res.status(400).json({ error: 'Request body must be a non-empty array of appliances.' });
  }

  try {
    const results = [];

    for (const appliance of appliances) {
      const { id, status } = appliance;

      if (typeof id !== 'number' || !['ON', 'OFF'].includes(status)) {
        return res.status(400).json({ error: 'Each appliance must have a numeric ID and a valid status ("ON" or "OFF").' });
      }

      // Check if the appliance status already exists
      let applianceStatus = await ApplianceStatus.findOne({ id });

      if (applianceStatus) {
        // Update the status
        applianceStatus.status = status;
        await applianceStatus.save();
        results.push({ id, status: 'updated' });
      } else {
        // Create a new record
        applianceStatus = new ApplianceStatus({ id, status });
        await applianceStatus.save();
        results.push({ id, status: 'created' });
      }
    }

    res.status(201).json({ message: 'Appliance statuses processed successfully.', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const applianceStatuses = await ApplianceStatus.find();
    res.status(200).json(applianceStatuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// DELETE route to delete all appliance statuses
// DELETE route to delete all appliance statuses
router.delete('/a', async (req, res) => {
  try {
    // Deletes all documents in the ApplianceStatus collection
    const result = await ApplianceStatus.deleteMany({});

    // Respond with how many documents were deleted
    res.status(200).json({
      message: 'All appliance statuses deleted successfully.',
      deletedCount: result.deletedCount, // Shows the number of deleted documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







module.exports = router;
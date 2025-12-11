const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data store
let cows = [];
let yieldData = [];
let farmSettings = null;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

const initializeData = () => {
  cows = [
    {
      id: 'COW001',
      name: 'Lakshmi',
      rfidTag: 'RFID001',
      earTagId: 'TN-MAS-001',
      breed: 'Sahiwal',
      dob: '2020-03-15',
      weight: 450,
      lactationStage: 'Peak',
      healthScore: 85,
      currentYield: 12,
      temperature: 38.5,
      activityScore: 75,
      ruminationScore: 80,
      zone: 'Milking Area',
      lat: 11.0168,
      lng: 76.9558,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'COW002',
      name: 'Kamala',
      rfidTag: 'RFID002',
      earTagId: 'TN-MAS-002',
      breed: 'Gir',
      dob: '2019-06-20',
      weight: 400,
      lactationStage: 'Mid',
      healthScore: 92,
      currentYield: 10,
      temperature: 38.3,
      activityScore: 85,
      ruminationScore: 88,
      zone: 'Feeding Area',
      lat: 11.0172,
      lng: 76.9562,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'COW003',
      name: 'Parvathi',
      rfidTag: 'RFID003',
      earTagId: 'TN-MAS-003',
      breed: 'Sahiwal',
      dob: '2021-01-10',
      weight: 420,
      lactationStage: 'Early',
      healthScore: 78,
      currentYield: 8,
      temperature: 39.1,
      activityScore: 60,
      ruminationScore: 65,
      zone: 'Rest Area',
      lat: 11.0165,
      lng: 76.9555,
      lastUpdated: new Date().toISOString()
    }
  ];

  // Generate sample yield data
  for (const cow of cows) {
    const yieldAmount = cow.id === 'COW001' ? 12 : cow.id === 'COW002' ? 10 : 8;
    for (let i = 0; i < 30; i++) {
      yieldData.push({
        cowId: cow.id,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        yield: yieldAmount - 1 + Math.random() * 2
      });
    }
  }

  farmSettings = {
    farmName: 'Smart Dairy Farm',
    location: 'Coimbatore, Tamil Nadu',
    centerLat: 11.0168,
    centerLng: 76.9558,
    milkPricePerLiter: 45,
    currency: 'INR'
  };

  console.log('Sample data initialized');
};

const calculateFeedRequirements = (cow) => {
  const baseRequirement = cow.weight * 0.025;
  const yieldMultiplier = 1 + (cow.currentYield / 50);
  const greenFodder = (baseRequirement * yieldMultiplier * 0.5).toFixed(2);
  const dryFodder = (baseRequirement * yieldMultiplier * 0.3).toFixed(2);
  const concentrate = (cow.currentYield * 0.4).toFixed(2);
  const minerals = 0.15;

  const feedCost = (greenFodder * 5 + dryFodder * 8 + concentrate * 25 + minerals * 50).toFixed(2);
  const milkRevenue = (cow.currentYield * 45).toFixed(2);
  const profit = (milkRevenue - feedCost).toFixed(2);

  return {
    greenFodder: parseFloat(greenFodder),
    dryFodder: parseFloat(dryFodder),
    concentrate: parseFloat(concentrate),
    minerals,
    totalFeedCost: parseFloat(feedCost),
    expectedMilkRevenue: parseFloat(milkRevenue),
    dailyProfit: parseFloat(profit)
  };
};

const calculateHealthScore = (cow) => {
  let score = 100;
  
  if (cow.temperature > 39.5 || cow.temperature < 38) score -= 20;
  else if (cow.temperature > 39 || cow.temperature < 38.2) score -= 10;
  
  if (cow.activityScore < 60) score -= 15;
  else if (cow.activityScore < 70) score -= 8;
  
  if (cow.ruminationScore < 65) score -= 15;
  else if (cow.ruminationScore < 75) score -= 8;
  
  if (cow.currentYield < 5) score -= 10;
  
  return Math.max(0, score);
};

app.get('/api/cows', (req, res) => {
  try {
    const cowsWithDetails = cows.map(cow => ({
      ...cow,
      healthScore: calculateHealthScore(cow),
      age: new Date().getFullYear() - new Date(cow.dob).getFullYear(),
      feedRequirements: calculateFeedRequirements(cow),
      status: calculateHealthScore(cow) >= 80 ? 'healthy' : calculateHealthScore(cow) >= 60 ? 'warning' : 'alert'
    }));
    res.json(cowsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cows/:id', (req, res) => {
  try {
    const cow = cows.find(c => c.id === req.params.id);
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    const cowWithDetails = {
      ...cow,
      healthScore: calculateHealthScore(cow),
      age: new Date().getFullYear() - new Date(cow.dob).getFullYear(),
      feedRequirements: calculateFeedRequirements(cow),
      status: calculateHealthScore(cow) >= 80 ? 'healthy' : calculateHealthScore(cow) >= 60 ? 'warning' : 'alert'
    };
    res.json(cowWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cows', (req, res) => {
  try {
    const newCow = {
      ...req.body,
      id: `COW${String(cows.length + 1).padStart(3, '0')}`,
      lastUpdated: new Date().toISOString()
    };
    cows.push(newCow);
    
    // Generate yield data for new cow
    const yieldAmount = req.body.currentYield || 8;
    for (let i = 0; i < 30; i++) {
      yieldData.push({
        cowId: newCow.id,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        yield: yieldAmount - 1 + Math.random() * 2
      });
    }
    
    res.status(201).json(newCow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cows/:id', (req, res) => {
  try {
    const index = cows.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    cows[index] = { ...cows[index], ...req.body, lastUpdated: new Date().toISOString() };
    res.json(cows[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cows/:id', (req, res) => {
  try {
    const index = cows.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    const deleted = cows.splice(index, 1)[0];
    yieldData = yieldData.filter(y => y.cowId !== req.params.id);
    res.json({ message: 'Cow deleted successfully', cow: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const cowsWithDetails = cows.map(cow => ({
      ...cow,
      healthScore: calculateHealthScore(cow),
      feedRequirements: calculateFeedRequirements(cow)
    }));

    const totalCows = cows.length;
    const lactatingCows = cows.filter(c => c.lactationStage !== 'Dry').length;
    const totalMilkYield = cows.reduce((sum, c) => sum + c.currentYield, 0);
    const totalFeedRequired = cowsWithDetails.reduce((sum, c) => 
      sum + c.feedRequirements.greenFodder + c.feedRequirements.dryFodder + c.feedRequirements.concentrate, 0
    );
    const healthAlerts = cows.filter(c => calculateHealthScore(c) < 60).length;
    const totalProfit = cowsWithDetails.reduce((sum, c) => sum + c.feedRequirements.dailyProfit, 0);

    res.json({
      totalCows,
      lactatingCows,
      totalMilkYield: totalMilkYield.toFixed(2),
      totalFeedRequired: totalFeedRequired.toFixed(2),
      healthAlerts,
      estimatedDailyProfit: totalProfit.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/yield/:id', (req, res) => {
  try {
    const cowYieldData = yieldData.filter(y => y.cowId === req.params.id);
    res.json(cowYieldData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/yield/:id', (req, res) => {
  try {
    const newEntry = {
      cowId: req.params.id,
      date: new Date().toISOString().split('T')[0],
      yield: req.body.yield,
      ...req.body
    };
    yieldData.push(newEntry);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feed/:id', (req, res) => {
  try {
    const cow = cows.find(c => c.id === req.params.id);
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    const feedRequirements = calculateFeedRequirements(cow);
    res.json(feedRequirements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health/:id', (req, res) => {
  try {
    const cow = cows.find(c => c.id === req.params.id);
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    const healthScore = calculateHealthScore(cow);
    const alerts = [];
    
    if (cow.temperature > 39.5) alerts.push('High fever detected');
    if (cow.temperature < 38) alerts.push('Low temperature');
    if (cow.activityScore < 60) alerts.push('Low activity');
    if (cow.ruminationScore < 65) alerts.push('Poor rumination');
    if (cow.currentYield < 5) alerts.push('Low milk yield');
    
    res.json({
      healthScore,
      temperature: cow.temperature,
      activityScore: cow.activityScore,
      ruminationScore: cow.ruminationScore,
      alerts,
      status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'alert'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/farm/settings', (req, res) => {
  try {
    res.json(farmSettings || {
      farmName: 'Smart Dairy Farm',
      location: 'Coimbatore, Tamil Nadu',
      centerLat: 11.0168,
      centerLng: 76.9558,
      milkPricePerLiter: 45,
      currency: 'INR'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/farm/settings', (req, res) => {
  try {
    farmSettings = { ...farmSettings, ...req.body };
    res.json(farmSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cows/:id/location', (req, res) => {
  try {
    const index = cows.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    cows[index] = { 
      ...cows[index], 
      lat: req.body.lat, 
      lng: req.body.lng, 
      lastUpdated: new Date().toISOString() 
    };
    res.json(cows[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data and start server
initializeData();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});

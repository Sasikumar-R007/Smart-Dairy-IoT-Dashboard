const express = require('express');
const cors = require('cors');
const Database = require('@replit/database');

const app = express();
const db = new Database();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const initializeData = async () => {
  const cows = await db.get('cows');
  if (!cows || cows.length === 0) {
    const sampleCows = [
      {
        id: 'COW001',
        rfidTag: 'RFID001',
        breed: 'Holstein',
        dob: '2020-03-15',
        weight: 600,
        lactationStage: 'Peak',
        healthScore: 85,
        currentYield: 28,
        temperature: 38.5,
        activityScore: 75,
        ruminationScore: 80,
        zone: 'Milking Area'
      },
      {
        id: 'COW002',
        rfidTag: 'RFID002',
        breed: 'Jersey',
        dob: '2019-06-20',
        weight: 450,
        lactationStage: 'Mid',
        healthScore: 92,
        currentYield: 22,
        temperature: 38.3,
        activityScore: 85,
        ruminationScore: 88,
        zone: 'Feeding Area'
      },
      {
        id: 'COW003',
        rfidTag: 'RFID003',
        breed: 'Holstein',
        dob: '2021-01-10',
        weight: 580,
        lactationStage: 'Early',
        healthScore: 78,
        currentYield: 25,
        temperature: 39.1,
        activityScore: 60,
        ruminationScore: 65,
        zone: 'Rest Area'
      }
    ];
    await db.set('cows', sampleCows);
  }
  
  const cowIds = ['COW001', 'COW002', 'COW003'];
  for (const cowId of cowIds) {
    const existingYield = await db.get(`yield_${cowId}`);
    if (!existingYield || existingYield.length === 0) {
      const yieldAmount = cowId === 'COW001' ? 28 : cowId === 'COW002' ? 22 : 25;
      const sampleYield = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        yield: yieldAmount - 2 + Math.random() * 4
      }));
      await db.set(`yield_${cowId}`, sampleYield);
    }
  }
};

const calculateFeedRequirements = (cow) => {
  const baseRequirement = cow.weight * 0.025;
  const yieldMultiplier = 1 + (cow.currentYield / 50);
  const greenFodder = (baseRequirement * yieldMultiplier * 0.5).toFixed(2);
  const dryFodder = (baseRequirement * yieldMultiplier * 0.3).toFixed(2);
  const concentrate = (cow.currentYield * 0.4).toFixed(2);
  const minerals = 0.15;

  const feedCost = (greenFodder * 0.5 + dryFodder * 1.2 + concentrate * 2 + minerals * 10).toFixed(2);
  const milkRevenue = (cow.currentYield * 1.5).toFixed(2);
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
  
  if (cow.currentYield < 15) score -= 10;
  
  return Math.max(0, score);
};

app.get('/api/cows', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
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

app.get('/api/cows/:id', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
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

app.post('/api/cows', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
    const newCow = req.body;
    cows.push(newCow);
    await db.set('cows', cows);
    res.status(201).json(newCow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cows/:id', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
    const index = cows.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    cows[index] = { ...cows[index], ...req.body };
    await db.set('cows', cows);
    res.json(cows[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
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

app.get('/api/yield/:id', async (req, res) => {
  try {
    const yieldData = await db.get(`yield_${req.params.id}`) || [];
    res.json(yieldData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/yield/:id', async (req, res) => {
  try {
    const yieldData = await db.get(`yield_${req.params.id}`) || [];
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      yield: req.body.yield,
      ...req.body
    };
    yieldData.push(newEntry);
    await db.set(`yield_${req.params.id}`, yieldData);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feed/:id', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
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

app.get('/api/health/:id', async (req, res) => {
  try {
    const cows = await db.get('cows') || [];
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
    if (cow.currentYield < 15) alerts.push('Low milk yield');
    
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

initializeData().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
});

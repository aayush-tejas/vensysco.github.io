const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const DataCenterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectName: { type: String, required: true },
    type: { type: String, enum: ['modular', 'traditional'], required: true },
    rackCount: { type: Number, required: true },
    powerUsage: { type: Number, required: true },
    cooling: { type: String, required: true },
    redundancy: { type: String, required: true },
    security: { type: String, required: true },
    remoteMonitoring: { type: Boolean, default: false },
    onSiteSupport: { type: Boolean, default: false },
    notes: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const DataCenter = mongoose.model('DataCenter', DataCenterSchema);

// Routes
app.post('/api/datacenters', async (req, res) => {
    try {
        const datacenter = new DataCenter(req.body);
        await datacenter.save();
        res.status(201).json(datacenter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/datacenters/:userId', async (req, res) => {
    try {
        const datacenters = await DataCenter.find({ userId: req.params.userId });
        res.json(datacenters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
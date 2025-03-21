import mongoose from 'mongoose';

const AdminRevenueSchema = new mongoose.Schema({
    totalRevenue: { 
        type: Number, 
        default: 0,
        min: 0 // Ensure revenue never goes negative
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    transactionHistory: [{
        amount: Number,
        date: { type: Date, default: Date.now },
        description: String
    }]
});

// Update lastUpdated when totalRevenue changes
AdminRevenueSchema.pre('save', function(next) {
    if (this.isModified('totalRevenue')) {
        this.lastUpdated = new Date();
    }
    next();
});

const AdminRevenueModel = mongoose.model('AdminRevenue', AdminRevenueSchema);

export default AdminRevenueModel; 
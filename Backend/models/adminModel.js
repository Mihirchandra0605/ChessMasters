import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Check if the model already exists in Mongoose, to avoid overwriting it
const AdminModel = mongoose.models.AdminModel || mongoose.model('AdminModel', AdminSchema);

export default AdminModel;

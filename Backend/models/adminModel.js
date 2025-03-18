import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    Role: { type: String, required: true },
    Password: { type: String, required: true }
});

// Check if the model already exists in Mongoose, to avoid overwriting it
const AdminModel = mongoose.models.AdminModel || mongoose.model('AdminModel', AdminSchema);

export default AdminModel;

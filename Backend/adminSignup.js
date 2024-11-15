import readline from 'readline';
import bcrypt from 'bcryptjs';
import AdminModel from './models/AdminModel.js'; // Import the Admin model
import mongoose from 'mongoose';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};
await mongoose.connect("mongodb://0.0.0.0:27017/chessApp").then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const adminSignup = async () => {
    try {
        const name = await askQuestion("Enter admin name: ");
        const email = await askQuestion("Enter admin email: ");
        const password = await askQuestion("Enter admin password: ");

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new AdminModel({
            name,
            email,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin registered successfully!');
    } catch (error) {
        console.error("Error registering admin:", error);
    } finally {
        rl.close();
    }
};

adminSignup();

import mongoose from "mongoose";

export const dbConnection = () => {
    const dbUrl = process.env.DB_CONNECTION || process.env.DB_ONLINE;

    mongoose.connect(dbUrl)
        .then(conn => console.log('DB Connected....'))
        .catch((err) => console.log('Error DataBase', err))
} 
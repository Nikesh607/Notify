import {initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase with either service account JSON or environment variables
const firebaseConfig = process.env.FIREBASE_CONFIG 
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : {
      credential: applicationDefault(),
      projectId: process.env.PROJECT_ID
    };

initializeApp(firebaseConfig);

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
);

app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.post("/send", function (req, res) {
    const receivedToken = req.body.fcmToken;

    const message = {
        notification: {
            title: "Notif",
            body: 'This is a Test Notification'
        },
        token: receivedToken,
    };

    getMessaging()
        .send(message)
        .then((response) => {
            res.status(200).json({
                message: "Successfully sent message",
                token: receivedToken,
            });
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
            console.log("Error sending message:", error);
        });


});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
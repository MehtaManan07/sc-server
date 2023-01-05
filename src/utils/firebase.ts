const admin = require("firebase-admin");
import * as firebaseKeys from "../config/firebaseKeys.json";
admin.initializeApp({ credential: admin.credential.cert(firebaseKeys) });
// const token =
//   "dO5CADiUTmOgmg9DooP-xY:APA91bEn9UjvCewo1B35KrFF11uhqoTMK9sRMWf2qf54vPdQLGltRscDmnWJyx9594CBbgJ6QP5dUgOa5gaHitpDR05ccP4MxOodCVEcP--SojbhAulNl-jHJFF-X4pliO1r6eCoQFsc";

// @ts-ignore
export const notifySingleUser = (token, data, title, body) => {
  const message = {
    token,
    data,
    notification: {
      title,
      body,
    },
  };
  admin
    .messaging()
    .send(message)
    .then((response: any) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error: any) => {
      console.log("Error sending message:", error);
    });
};

// @ts-ignore
export const notifyMultipleUsers = (tokens, data, title, body) => {
  const message = {
    tokens,
    data,
    notification: {
      title,
      body,
    },
  };
  admin
    .messaging()
    .sendMultiCast(message)
    .then((response: any) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error: any) => {
      console.log("Error sending message:", error);
    });
};

export default admin;
/*
 */

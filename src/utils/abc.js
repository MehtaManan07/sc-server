const admin = require("firebase-admin");
const firebaseKeys = require("../config/firebaseKeys.json");
admin.initializeApp({ credential: admin.credential.cert(firebaseKeys) });
const tokennn =
  "fHCA9m7PTd6MWLw3diozIf:APA91bEZVh_1E28acDSGTqhM0JqnAF7i_r60Brua9vvlHtEIVxfktPsS4OE-mHOMzyoUcReChjuURP3X3PPLvJnpNp612MJvevMrhx3cQzMeKec4aCmm1XjBGq0VGKDZ7ctKc-QTqwdp";
const hey = () => {
  admin.messaging().send({
    token:
      "fHCA9m7PTd6MWLw3diozIf:APA91bEZVh_1E28acDSGTqhM0JqnAF7i_r60Brua9vvlHtEIVxfktPsS4OE-mHOMzyoUcReChjuURP3X3PPLvJnpNp612MJvevMrhx3cQzMeKec4aCmm1XjBGq0VGKDZ7ctKc-QTqwdp",
    // data: {
    //   notifee: JSON.stringify({
    //     body: "This message was sent via FCM!",
    //     android: {
    //       channelId: "default",
    //       actions: [
    //         {
    //           title: "Mark as Read",
    //           pressAction: {
    //             id: "read",
    //           },
    //         },
    //       ],
    //     },
    //   }),
    // },
        data: {a: 'Hey there'},
        notification: {
          title : 'bruh moment',
          body: 'bruh momentttt',
        },
  }).then((response) => {
    // Response is a message ID string.
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
};
hey();
// @ts-ignore
 const notifySingleUser = (token, data, title, body) => {
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
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

// @ts-ignore
 const notifyMultipleUsers = (tokens, data, title, body) => {
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
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

// export default admin;
/*
 */

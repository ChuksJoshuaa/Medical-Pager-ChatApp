const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

//Routes
const authRoutes = require("./routes/auth.js");

//Errors

//Libraries
const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//You can also use express.json in place of body-parser
// app.use(express.json());
// app.use(express.urlencoded());

//setting up the twilio messaging platform
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

//Connecting to twilio
const twilioClient = require("twilio")(accountSid, authToken);

app.use(cors());

app.get("/", (req, res) => {
  res.send("The App is running smoothly");
});

//Twilio
app.post("/", (req, res) => {
  const { message, user, sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.message
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => console.log("Message sent"))
            .catch(() => console.log(error));
        }
      });
    return res.status(200).send("Message sent");
  }
  return res.status(200).send("Not a new message request");
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));

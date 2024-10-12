import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const app = express();
const port = 3000;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const secret = process.env.TAGARELA_SECRET;

if (!discordWebhookUrl) {
  throw new Error("🚨 Webhook URL is not defined on .env file\n");
}

if (!secret) {
  throw new Error("🚨 Secret is not defined on .env file\n");
}

app.use(express.json());

app.post("/send", async (req: any, res: any) => {
  const { message } = req.body;
  const signature = req.headers["api-key"];

  if (!signature || signature !== secret) {
    logger.error(
      `🚨 Someone trying to access without or wrong key: ${signature}\n`,
    );
    return res.status(401).send("🚨 You shall not pass!");
  }

  if (!message) {
    logger.error(`🚨 Someone trying send without message\n`);
    return res
      .status(400)
      .send("🚨 You need to provide a message to be sended on that channel");
  }

  try {
    await axios.post(discordWebhookUrl, {
      content: message,
    });
    logger.info(`🎉 ${message} has sucessfuly sent\n`);
    return res.status(200).send("🎉 Message has sucessfully sent");
  } catch (error) {
    console.error(`😢 Oops, something wrong here: ${error}\n`);
    return res.status(500).send("😢 Oops, something wrong here");
  }
});

app.listen(port, () => {
  logger.info(`🤖 Server is running on http://localhost:${port}\n`);
});

import { RAWG_API_KEY } from "./env.js";
import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/random-game", async (_req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  setInterval(() => getGame(res), 1000 * 5);
});

async function getGame(res) {
  const rawgResponse = await fetch(
    "https://api.rawg.io/api/games?key=" + RAWG_API_KEY
  );
  const rawgData = await rawgResponse.json();
  const games = rawgData["results"];

  const randomIndex = randomInt(0, games.length - 1);
  const randomGame = rawgData["results"][randomIndex];

  // write will continue to write to the response and does not terminate the connection
  // \n\n signals the end of the event message and is required
  res.write(
    `data: { "name": "${randomGame.name}", "metacritic": ${randomGame.metacritic}, "playtime": ${randomGame.playtime} }\n\n`
  );
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Listening on port", PORT));

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const R6StatsAPI = require("r6statsapi").default;
const { DateTime } = require("luxon")
require("dotenv").config();

const app = express();
const API = new R6StatsAPI(process.env.API_KEY);

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const api_res = await API.getSesonalStats("Ace.Honey", "pc");
  const stats = api_res.seasons[Object.keys(api_res.seasons)[0]].regions.ncsa[0];
  const { rank_text, mmr, next_rank_mmr, max_rank_text, max_mmr } = stats;
  // const lastUpdated = DateTime.fromISO(api_res.last_updated, { zone: "America/Chicago" }).setLocale("en-US").toLocaleString(DateTime.DATETIME_SHORT)

  const finalText = `Rank: ${rank_text} | MMR: ${mmr} | Next Rank MMR: ${next_rank_mmr} | Highest Rank: ${max_rank_text} | Highest MMR: ${max_mmr} | More stats: https://acehunter.tv/r6stats`;
  res.send(finalText);
});

const port = process.env.PORT || 2424;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

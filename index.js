const express = require("express");
const ytdl = require("ytdl-core");
const bodyParser = require("body-parser");
const ytmux = require("./utils/muxer");
const logger = require("./utils/loggers");
const nonAccentVietnamese = require("./utils/convertTitle");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
  path: "./config/.env",
});
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/public", express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./" });
});

app.get("/download", async (req, res) => {
  let init = {
    fm: { format: "mp4" },
    url: req.query.url,
  };
  let info = await ytdl.getInfo(init.url, init.fm);
  let title = nonAccentVietnamese(info.videoDetails.title);
  res.header(
    "Content-Disposition",
    `attachment; filename=${title.toUpperCase()}.mp4`
  );
  // support ytdl to get highest video & audio quality
  ytmux(init.url, init.fm).pipe(res);
});

app.listen(port, () => {
  logger.info({ msg: `🚀 Server listening at port ${port} 🚀` });
});

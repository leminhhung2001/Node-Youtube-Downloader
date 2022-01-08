const logger = require("pino");
const dayjs = require("dayjs");

const log = logger({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  prettifier: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format("HH:mm:ss")}"`,
});

module.exports = log;

import path from "path";
import { pino } from "pino";

const logger = pino(pino.destination("/observer_data/logs/app.log"));

export default logger;

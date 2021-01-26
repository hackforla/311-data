import { setupWorker } from "msw";
import handlers from "./handlers.js";

export const server = setupWorker(...handlers);

import fs from 'fs';
import path from 'path';
import { format } from 'util';

const LOG_DIR = path.join(process.cwd(), 'logs');
const DB_LOG_FILE = path.join(LOG_DIR, 'db.log');

if (!fs.existsSync(LOG_DIR)) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create log directory:', error);
  }
}

export function logToDB(message: string, ...args: unknown[]) {
  try {
    const timestamp = new Date().toUTCString();
    const formattedMessage = format(message, ...args);
    const logEntry = `[${timestamp}] ${formattedMessage}\n`;

    fs.appendFileSync(DB_LOG_FILE, logEntry);
  } catch (error) {
    // Fallback to console if file logging fails
    console.error('Failed to write to log file:', error);
    console.log(message, ...args);
  }
}

const logger = logToDB;

export default logger;

// src/utils/logger.js
import axios from 'axios';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM3BhMWE0NWI2QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3ODIzODExMTAsImlhdCI6MTc4MjM4MDIxMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBkYTAzODk5LTZlMGUtNGZjNS1hZmNhLThlMDM1MzU1YTBlMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InRhbm5pcnUgamFpc3VyeWEiLCJzdWIiOiI1NjgxMGVjMS0zYTJiLTQzZWMtOGFjMy1kMDNiNDBjMDZhZjkifSwiZW1haWwiOiIyM3BhMWE0NWI2QHZpc2hudS5lZHUuaW4iLCJuYW1lIjoidGFubmlydSBqYWlzdXJ5YSIsInJvbGxObyI6IjIzcGExYTQ1YjYiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiI1NjgxMGVjMS0zYTJiLTQzZWMtOGFjMy1kMDNiNDBjMDZhZjkiLCJjbGllbnRTZWNyZXQiOiJKSkF1QVpRSEh5YWVSYWFxIn0.lqAF71Z8l7RqmE1hskELpfUhC96Xi6BYl6SF-39BHzA';
const LOG_API = 'http://4.224.186.213/evaluation-service/logs';

export const log = async (stack, level, packageName, message) => {
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

  if (!validStacks.includes(stack) || !validLevels.includes(level)) {
    return;
  }

  try {
    const response = await axios.post(
      LOG_API,
      {
        stack: stack,
        level: level,
        package: packageName,
        message: message
      },
      {
        headers: {
          'Authorization': 'Bearer ' + AUTH_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.log('[' + stack + '][' + level + '][' + packageName + '] ' + message);
  }
};
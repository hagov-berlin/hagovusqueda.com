class Logger {
  shouldLog(messageLevel: string) {
    const targetLevel = process.env.LOG_LEVEL || "info";
    if (messageLevel === "debug") {
      return targetLevel === "debug";
    }
    if (messageLevel === "info") {
      return targetLevel === "debug" || targetLevel === "info";
    }
    if (messageLevel === "warn") {
      return targetLevel === "debug" || targetLevel === "info" || targetLevel === "warn";
    }
  }

  debug(...args: unknown[]) {
    if (this.shouldLog("debug")) console.log(new Date().toISOString(), ...args);
  }

  info(...args: unknown[]) {
    if (this.shouldLog("info")) console.log(new Date().toISOString(), ...args);
  }

  warn(...args: unknown[]) {
    if (this.shouldLog("warn")) console.log(new Date().toISOString(), ...args);
  }
}

export default new Logger();

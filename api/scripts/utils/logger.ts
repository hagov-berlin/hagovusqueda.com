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
    if (messageLevel === "error") {
      return (
        targetLevel === "debug" ||
        targetLevel === "info" ||
        targetLevel === "warn" ||
        targetLevel === "error"
      );
    }
  }

  debug(...args: unknown[]) {
    if (this.shouldLog("debug")) console.log(new Date().toISOString(), "[DEBUG]", ...args);
  }

  info(...args: unknown[]) {
    if (this.shouldLog("info")) console.log(new Date().toISOString(), "[INFO]", ...args);
  }

  warn(...args: unknown[]) {
    if (this.shouldLog("warn")) console.log(new Date().toISOString(), "[WARN]", ...args);
  }

  error(...args: unknown[]) {
    if (this.shouldLog("error")) console.log(new Date().toISOString(), "[ERROR]", ...args);
  }
}

export default new Logger();

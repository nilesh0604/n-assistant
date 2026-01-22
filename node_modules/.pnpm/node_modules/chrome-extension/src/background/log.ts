/// <reference types="vite/client" />

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warning: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
}

// Log forwarding integration
class LogForwarder {
  private serviceUrl: string = 'http://127.0.0.1:8100';
  private isEnabled: boolean = true;
  private logBuffer: any[] = [];
  private batchSize: number = 5;
  private flushInterval: number = 3000; // 3 seconds

  constructor() {
    // Check if service is available
    this.checkServiceAvailability();
    
    // Start periodic flush
    setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushLogs();
      }
    }, this.flushInterval);
  }

  private async checkServiceAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.serviceUrl}/logs/stats`);
      this.isEnabled = response.ok;
    } catch (error) {
      this.isEnabled = false;
    }
  }

  public addLog(level: LogLevel, source: string, message: string): void {
    if (!this.isEnabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      source,
      message
    };

    this.logBuffer.push(logEntry);

    // Flush immediately for error logs
    if (level === 'error' || this.logBuffer.length >= this.batchSize) {
      this.flushLogs();
    }
  }

  private async flushLogs(): Promise<void> {
    if (!this.isEnabled || this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const response = await fetch(`${this.serviceUrl}/logs/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: logsToSend
        })
      });
    } catch (error) {
      // Silently fail to avoid infinite loops
    }
  }
}

// Global log forwarder instance
const logForwarder = new LogForwarder();

const createLogger = (namespace: string): Logger => {
  const prefix = `[${namespace}]`;

  // Bind console methods directly to preserve call stack and show correct line numbers
  const boundDebug = console.debug.bind(console, prefix);
  const boundInfo = console.info.bind(console, prefix);
  const boundWarn = console.warn.bind(console, prefix);
  const boundError = console.error.bind(console, prefix);
  const boundGroup = console.group.bind(console);
  const boundGroupEnd = console.groupEnd.bind(console);

  // Enhanced logging with forwarding
  const enhancedDebug = (...args: unknown[]) => {
    boundDebug(...args);
    if (import.meta.env.DEV) {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      logForwarder.addLog('debug', namespace, message);
    }
  };

  const enhancedInfo = (...args: unknown[]) => {
    boundInfo(...args);
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    logForwarder.addLog('info', namespace, message);
  };

  const enhancedWarn = (...args: unknown[]) => {
    boundWarn(...args);
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    logForwarder.addLog('warning', namespace, message);
  };

  const enhancedError = (...args: unknown[]) => {
    boundError(...args);
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    logForwarder.addLog('error', namespace, message);
  };

  return {
    debug: enhancedDebug,
    info: enhancedInfo,
    warning: enhancedWarn,
    error: enhancedError,
    group: (label: string) => boundGroup(`${prefix} ${label}`),
    groupEnd: boundGroupEnd,
  };
};

// Create default logger
const logger = createLogger('Agent');

export type { Logger, LogLevel };
export { createLogger, logger };

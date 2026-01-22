/**
 * Log Forwarder Service
 * Sends Chrome extension logs to local monitoring service
 */

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

class LogForwarder {
  private serviceUrl: string = 'http://127.0.0.1:8100';
  private isEnabled: boolean = true;
  private logBuffer: LogEntry[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 2000; // 2 seconds
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

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
      originalConsole.log(`[LogForwarder] Service available: ${this.isEnabled}`);
    } catch (error) {
      this.isEnabled = false;
      originalConsole.log('[LogForwarder] Service not available, logs will not be forwarded');
    }
  }

  /**
   * Add a log entry to the buffer
   */
  public addLog(level: LogEntry['level'], source: string, message: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      metadata
    };

    this.logBuffer.push(logEntry);

    // Flush immediately for error logs
    if (level === 'error' || this.logBuffer.length >= this.batchSize) {
      this.flushLogs();
    }
  }

  /**
   * Forward logs to local service
   */
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      originalConsole.log(`[LogForwarder] Sent ${logsToSend.length} logs successfully`);

    } catch (error) {
      originalConsole.error('[LogForwarder] Failed to send logs:', error);
      
      // Retry logic for critical logs
      const criticalLogs = logsToSend.filter(log => log.level === 'error');
      if (criticalLogs.length > 0) {
        this.retryLogs(criticalLogs);
      }
    }
  }

  /**
   * Retry sending critical logs
   */
  private async retryLogs(logs: LogEntry[], attempt: number = 1): Promise<void> {
    if (attempt > this.maxRetries) {
      console.error('[LogForwarder] Max retries exceeded, dropping logs');
      return;
    }

    setTimeout(async () => {
      try {
        const response = await fetch(`${this.serviceUrl}/logs/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entries: logs
          })
        });

        if (response.ok) {
          console.log(`[LogForwarder] Retry ${attempt} successful for ${logs.length} critical logs`);
        } else {
          this.retryLogs(logs, attempt + 1);
        }
      } catch (error) {
        console.error(`[LogForwarder] Retry ${attempt} failed:`, error);
        this.retryLogs(logs, attempt + 1);
      }
    }, this.retryDelay * attempt);
  }

  /**
   * Enable/disable log forwarding
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`[LogForwarder] Log forwarding ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current status
   */
  public getStatus(): { enabled: boolean; bufferSize: number; serviceUrl: string } {
    return {
      enabled: this.isEnabled,
      bufferSize: this.logBuffer.length,
      serviceUrl: this.serviceUrl
    };
  }
}

// Global instance
const logForwarder = new LogForwarder();

// Enhanced console logging with forwarding
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
};

// Intercept console calls
console.log = function(...args: any[]) {
  originalConsole.log.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  logForwarder.addLog('info', 'extension', message);
};

console.info = function(...args: any[]) {
  originalConsole.info.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  logForwarder.addLog('info', 'extension', message);
};

console.warn = function(...args: any[]) {
  originalConsole.warn.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  logForwarder.addLog('warning', 'extension', message);
};

console.error = function(...args: any[]) {
  originalConsole.error.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  logForwarder.addLog('error', 'extension', message);
};

console.debug = function(...args: any[]) {
  originalConsole.debug.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  logForwarder.addLog('debug', 'extension', message);
};

export default logForwarder;

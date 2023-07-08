import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MainLoggerService implements LoggerService {
  private context: string;

  setContext(context: any) {
    this.context = JSON.stringify(context);
  }

  log(message: any, context?: string) {
    this.printMessage('info', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.printMessage('warn', message, context);
  }

  private printMessage(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    process.stdout.write(
      `[${timestamp}] ${level} [${context || this.context}]: ${message}\n`,
    );

    if (trace) {
      process.stdout.write(
        `[${timestamp}] ${level} [${context || this.context}]: ${trace}\n`,
      );
    }
  }
}

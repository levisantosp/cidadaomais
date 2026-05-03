import type { StatusMap } from 'elysia'

export class HttpException extends Error {
  public readonly statusText: keyof StatusMap

  public constructor(statusText: keyof StatusMap, message: string) {
    super(message)
    this.name = new.target.name
    this.statusText = statusText
  }
}

export class NotFoundException extends HttpException {
  public constructor(message = 'Resource not found') {
    super('Not Found', message)
  }
}

export class UnauthorizedException extends HttpException {
  public constructor(message = 'Unauthorized') {
    super('Unauthorized', message)
  }
}

export class ForbiddenException extends HttpException {
  public constructor(message = 'Forbidden') {
    super('Forbidden', message)
  }
}

export class ConflictException extends HttpException {
  public constructor(message = 'The resource already exists or has been modified by another request.') {
    super('Conflict', message)
  }
}
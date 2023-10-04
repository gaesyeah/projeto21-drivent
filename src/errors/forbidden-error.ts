import { ApplicationError } from '@/protocols';

export function forbiddenError(message: string = 'Outside of the business rules'): ApplicationError {
  return {
    name: 'ForbiddenError',
    message,
  };
}
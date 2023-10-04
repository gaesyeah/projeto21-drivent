import { ApplicationError } from '@/protocols';

export function forbiddenError(message: string = 'Outside the business rules'): ApplicationError {
  return {
    name: 'forbiddenError',
    message,
  };
}
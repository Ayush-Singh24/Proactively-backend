export class ApiError {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.message = message;
    this.status = status;
  }
}

export class ValidationError {
  error: any;
  constructor(error: any) {
    this.error = error;
  }
}

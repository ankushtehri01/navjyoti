/**
 * Standard success envelope: { success, message, data }.
 * Use `send` to write it directly to the response.
 */
import { HTTP_STATUS } from '../constants/index.js';

export class ApiResponse {
  constructor(statusCode = HTTP_STATUS.OK, message = 'Success', data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }

  static ok(res, message, data) {
    return new ApiResponse(HTTP_STATUS.OK, message, data).send(res);
  }

  static created(res, message, data) {
    return new ApiResponse(HTTP_STATUS.CREATED, message, data).send(res);
  }
}

export default ApiResponse;

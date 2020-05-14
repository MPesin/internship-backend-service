export default class ErrorResponse extends Error {
  /**
   * @constructor
   * @param {string} message message of the error
   * @param {number} statusCode html status code 
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
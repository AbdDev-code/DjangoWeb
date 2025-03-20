class ErrorResponse extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Error klassi bilan to'g'ri ishlash uchun
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}

module.exports = ErrorResponse;
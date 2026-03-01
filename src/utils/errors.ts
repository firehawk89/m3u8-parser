type SuccessResponse<T = unknown> = { success: true; data?: T };
type ErrorResponse<T = unknown> = { success: false; error: string; data?: T };

export const generateSuccessResponse = <T = unknown>(data?: T): SuccessResponse<T> => {
	return { success: true, data };
};

export const generateErrorResponse = <T = unknown>(error: string, data?: T): ErrorResponse<T> => {
	return { success: false, error, data };
};

export class CustomError extends Error {
	public readonly statusCode: number;

	constructor(message: string, name: string, statusCode: number) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class InvalidUrlError extends CustomError {
	constructor(message: string = 'Invalid URL provided', statusCode: number = 400) {
		super(message, InvalidUrlError.name, statusCode);
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string = 'No .m3u8 request found on this page', statusCode: number = 404) {
		super(message, NotFoundError.name, statusCode);
	}
}

export class FetchError extends CustomError {
	constructor(message: string = 'Failed to fetch resource', statusCode: number = 500) {
		super(message, FetchError.name, statusCode);
	}
}

export class ParseError extends CustomError {
	constructor(message: string = 'Failed to process m3u8', statusCode: number = 500) {
		super(message, ParseError.name, statusCode);
	}
}

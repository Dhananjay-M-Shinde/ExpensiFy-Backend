class apiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
    ){
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

export {apiError}

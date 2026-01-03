import { checkSchema, ParamSchema } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt
import HTTP_STATUS from '~/constants/httpStatus.js'
import { USERS_MESSAGES } from '~/constants/messages.js'
import { ErrorWithStatus } from '~/models/Errors.js'
import User from '~/models/schemas/User.schema.js'
import databaseService from '~/services/database.services.js'
import { hashPassword } from '~/utils/crypto.js'
import { verifyToken } from '~/utils/jwt.js'
import { validate } from '~/utils/validation.js'
import { config } from 'dotenv'
import { UserVerifyStatus } from '~/constants/enums.js'
import { ObjectId } from 'mongodb'
import { tokenPayload } from '~/models/requests/Users.requests.js'
config()

const password_schema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
  isString: true,
  isLength: {
    options: { min: 6, max: 50 },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_STRONG
  }
}

const confirm_password_schema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: true,
  isLength: {
    options: { min: 6, max: 50 }
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    }
  },
  custom: {
    options: (value, { req }) => {
      if (value === req.body.password) {
        return true
      }
      throw USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH
    }
  }
}

const forgot_password_token_schema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      try {
        const decode_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decode_forgot_password_token
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decode_forgot_password_token = decode_forgot_password_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}

const name_schema: ParamSchema = {
  notEmpty: { errorMessage: 'Name is required.' },
  isString: { errorMessage: 'Name must be a string.' },
  isLength: {
    options: { min: 1, max: 100 },
    errorMessage: 'Name must be between 1 and 100 characters.'
  },
  trim: true
}

const date_of_birth_schema: ParamSchema = {
  isISO8601: {
    options: { strict: true, strictSeparator: true },
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_ISO8601
  }
}

const image_schema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Image must be string'
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: 'Image length must be from 1 to 400'
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED, bail: true },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID, bail: true },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (!user) throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
            if (user.verify === UserVerifyStatus.Unverified) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_HAVE_TO_VERIFY_EMAIL,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user as User
            return true
          }
        }
      },

      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        trim: true
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: name_schema,

      email: {
        // bail dùng để dừng lại khi check nếu sai, khi nào pass các điều kiện kia thì mới xuống dưới để tránh query tài nguyên trong DB
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED, bail: true },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID, bail: true },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value }) // tránh query cái này
            if (user) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },

      password: password_schema,

      confirm_password: confirm_password_schema,

      date_of_birth: date_of_birth_schema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            try {
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              ;(req as Request).decode_authorization = decode_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const [decode_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshToken.findOne({ token: value })
              ])
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decode_refresh_token = decode_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decode_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })
              ;(req as Request).decode_email_verify_token = decode_email_verify_token
            } catch (error) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED, bail: true },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            })
            if (!user) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
            }
            if (user.verify === UserVerifyStatus.Unverified) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_HAVE_TO_VERIFY_EMAIL,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user as User
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgot_password_token_schema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: password_schema,
      confirm_password: confirm_password_schema,
      forgot_password_token: forgot_password_token_schema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decode_authorization as tokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_VERIFIED,
      status: HTTP_STATUS.FORBIDDEN
    })
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...name_schema,
        optional: true,
        notEmpty: undefined
      },

      date_of_birth: {
        ...date_of_birth_schema,
        optional: true
      },

      bio: {
        optional: true,
        isString: {
          errorMessage: 'Bio must be string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: 'Bio length must be from 1 to 200'
        }
      },

      location: {
        optional: true,
        isString: {
          errorMessage: 'Location must be string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: 'Location length must be from 1 to 200'
        }
      },

      website: {
        optional: true,
        isString: {
          errorMessage: 'Website must be string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: 'Website length must be from 1 to 200'
        }
      },

      username: {
        optional: true,
        isString: {
          errorMessage: 'Username must be string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: 'Username length must be from 1 to 50'
        }
      },

      avatar: image_schema,

      cover_photo: image_schema
    },
    ['body']
  )
)

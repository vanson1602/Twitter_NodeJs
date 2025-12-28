import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages.js'
import User from '~/models/schemas/User.schema.js'
import databaseService from '~/services/database.services.js'
import { hashPassword } from '~/utils/crypto.js'
import { validate } from '~/utils/validation.js'

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED, bail: true },
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID, bail: true },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })
          if (!user) throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
          req.user = user as User
          return true
        }
      }
    },

    password: {
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      trim: true
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: { errorMessage: 'Name is required.' },
      isString: { errorMessage: 'Name must be a string.' },
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: 'Name must be between 1 and 100 characters.'
      },
      trim: true
    },

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

    password: {
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
    },

    confirm_password: {
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
    },

    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_ISO8601
      }
    }
  })
)

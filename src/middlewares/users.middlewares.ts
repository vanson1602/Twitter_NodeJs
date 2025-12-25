import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services.js'
import { validate } from '~/utils/validation.js'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password'
    })
  }
  next()
}

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
      notEmpty: { errorMessage: 'Email is required.', bail: true },
      isEmail: { errorMessage: 'Email is not valid.', bail: true },
      trim: true,
      custom: {
        options: async (value) => {
          const isEmailExist = await usersService.checkEmailExist(value) // tránh query cái này
          if (isEmailExist) {
            throw 'Email is already existed'
          }
          return true
        }
      }
    },

    password: {
      notEmpty: { errorMessage: 'Password is required.' },
      isString: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Password must be between 6 and 50 characters.'
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must be at least 6 characters long and include at least 1 lowercase letter, 1 uppercase letter, and 1 symbol.'
      }
    },

    confirm_password: {
      notEmpty: { errorMessage: 'Confirm password is required.' },
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
          throw 'Confirm password does not match password.'
        }
      }
    },

    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: 'Date of birth must be a valid ISO8601 date (e.g., 2000-12-31).'
      }
    }
  })
)

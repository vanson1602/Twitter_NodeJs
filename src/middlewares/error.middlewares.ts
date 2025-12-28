import { NextFunction, Request, Response } from 'express'
import omit from 'lodash/omit.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { ErrorWithStatus } from '~/models/Errors.js'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: err
  })
}

import { NextFunction, Request, Response } from 'express'
import pick from 'lodash'

type FilterKeys<T> = Array<keyof T>

export const filterMiddleWares =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick.pick(req.body, filterKeys)
    next()
  }

import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { getUser } from '../utils/get-user';
import multer from 'multer';
import { env } from '../../env/env';
import { authGuard } from '../guards/auth-guard';
import { getPictureUrl } from '../utils/get-picture-url';
import { extname, join } from 'path';
import { BadRequestError } from '../../commons/errors/bad-request-error';
import { promises } from 'fs';
import { UPLOAD_DIR } from '../../storage/init-storage';
import { ErrorCode } from '@id6/commons/build/error-code';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('id6:updatePicture');

const allowedFormats = ['.png', '.jpg', '.jpeg'];
const allowedMimeTypes = ['.png', '.jpg', '.jpeg'];

const upload = multer({
  dest: UPLOAD_DIR,
  fileFilter(req, file, callback) {
    const ext = extname(file.originalname);
    if (allowedFormats.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new BadRequestError('Format not allowed', ErrorCode.format_not_allowed, {
      allowedFormats,
      allowedMimeTypes,
    }));
  },
});

async function handler(req: Request, res: Response): Promise<void> {
  const user = getUser(req);
  const picture = req.file;

  const oldPicture = user.picture;

  user.picture = picture?.filename;

  await user.save();

  if (oldPicture) {
    try {
      await promises.unlink(join(env.ID6_DATA_DIR, oldPicture));
    } catch (e) {
      logger.error('Could not delete old picture', e);
    }
  }

  res.json({
    picture: getPictureUrl(user.picture),
  });
}

export const updatePicture = [
  authGuard,
  upload.single('picture'),
  wrapAsyncMiddleware(handler),
];

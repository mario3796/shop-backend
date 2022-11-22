import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

export const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    return cb(null, true);
  }
  cb(null, false);
};

export const filename = (req, file, cb) => {
  cb(
    null,
    new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname,
  );
};

export const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath, (err) => {
    if (err) throw new NotFoundException(err.message);
  });
};

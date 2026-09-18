import fs from 'fs';
import sharp from 'sharp';

const src = 'public/imperio-do-ouro-mrv.webp';
sharp(src)
  .resize(600)
  .webp({ quality: 75 })
  .toFile('public/imperio-do-ouro-mrv-mobile.webp');

sharp(src)
  .webp({ quality: 80 })
  .toFile('public/imperio-do-ouro-mrv-desktop.webp');

/* eslint-disable import/no-anonymous-default-export */
import path from 'path';

export default {
  fontFamily: 'mplus-1p',
  fontPath: {
    bold: path.resolve(process.cwd(), 'fonts', 'mplus-1p-bold.ttf'),
  },
  width: 565,
  height: 885,
  fontSize: 48,
  backgroundColor: 'hsl(195, 15%, 92.5%)',
  textColor: 'hsl(220, 10%, 7.5%)',
};

import {createCanvas, registerFont} from 'canvas';
import fastify from 'fastify';
import constants from './constants';

const server = fastify();

export async function createImageBinary(title: string) {
  const canvas = createCanvas(constants.width, constants.height);
  const context = canvas.getContext('2d');

  registerFont(constants.fontPath.bold, {
    family: constants.fontFamily,
    weight: 'bold',
  });

  context.fillStyle = constants.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = constants.textColor;
  context.font = `${constants.fontSize}px ${constants.fontFamily}`;

  const box = {width: canvas.width * 0.75};

  title
    .split('')
    .reduce(
      (pre, char, i) => {
        const wrap =
          box.width <= pre[i].x + context.measureText(pre[i].char).width;
        return [
          ...pre,
          {
            char,
            x: wrap
              ? pre[0].x
              : pre[i].x + context.measureText(pre[i].char).width,
            y:
              pre[i].y +
              (wrap ? context.measureText(pre[i].char).emHeightAscent : 0),
          },
        ];
      },
      [{char: '', x: 0, y: 0}],
    )
    .forEach(({char, x, y}, _i, array) =>
      context.fillText(
        char,
        (canvas.width - box.width) / 2 + x,
        (canvas.height - (array[array.length - 1].y - array[0].y)) / 2 + y,
      ),
    );

  return canvas.toBuffer();
}

server.get<{Querystring: {title: string}}>('/', async (request, reply) => {
  const {title} = request.query;

  const imageBuffer = await createImageBinary(title);

  reply.type('image/png');
  reply.header('Content-Length', imageBuffer.byteLength);
  reply.header('Cache-Control', `max-age=2592000, public`);

  return imageBuffer;
});

server.listen(3000, '0.0.0.0', (err) => {
  if (err) process.exit(1);
});

/* eslint-disable new-cap */
import hark from 'hark';

const initHark = (args) => {
  if (!window.hark) {
    throw new Error('Please link hark.js');
  }

  const { connection, event, stream } = args;
  const options = {};
  const speechEvents = new hark(stream, options); // hark.js 초기화

  speechEvents.on('speaking', () => {
    connection.send({
      userid: event.userid,
      type: 'speaking',
      isSpeak: true
    });
  });

  speechEvents.on('stopped_speaking', () => {
    connection.send({
      userid: event.userid,
      type: 'silence',
      isSpeak: false
    });
  });
};

export default initHark;

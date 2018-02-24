import stream from 'getstream';

export default stream.connect(process.env.STREAM_API_KEY, null, process.env.STREAM_APP_ID);

let client;

async function initStream() {
  if (!client) client = await stream.connect(process.env.STREAM_API_KEY, null, process.env.STREAM_APP_ID);
  return client;
}

async function request(run) {
  run(await initStream());
}

const feedGroups = {
  CLUB: 'club',
  CLUB_NOTIFICATION: 'club_notification',
  EVENT: 'event',
  EVENT_NOTIFICATION: 'event_notification',
  TIMELINE: 'timeline',
  NOTIFICATIONS: 'notifications'
}

export {
  feedGroups,
  request
}

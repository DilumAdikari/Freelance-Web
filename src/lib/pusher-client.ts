import PusherClient from 'pusher-js';

const appKey = process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy_key';
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2';

export const pusherClient = new PusherClient(appKey, {
  cluster: cluster,
});
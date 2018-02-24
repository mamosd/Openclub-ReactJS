export const setup = async () => {
  if (process.env.IS_SERVER) return null;
  if (window.mixpanel) return window.mixpanel;
  window.mixpanel = await System.import('mixpanel-browser');
  window.mixpanel.init(process.env.MIXPANEL_TOKEN);
  return window.mixpanel;
}

export const tracking = async cb => process.env.IS_CLIENT ? cb(await setup()) : false;

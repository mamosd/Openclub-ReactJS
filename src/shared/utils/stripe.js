/**
 * functions and init for stripe integration
 */

const windowCheck = () => {
  if (typeof window === 'undefined') return true;
  return false;
}

async function init() {
  if (windowCheck()) return null;
  let Stripe = null;

  if (window.Stripe) Stripe = window.Stripe;
  return Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
}

async function createBankAccount(bankAccount) {
  const Stripe = await init();
  try {
    const token = await Stripe.createToken('bank_account', bankAccount);
    return token;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function createCardElement(style, mountNode, err) {
  const stripe = await init();

  const elements = stripe.elements();

  let card = null

  const errorListener = ({ error }) => {
    if (error) return err(error.message);
    return err(null);
  }

  const boundErrorListener = errorListener.bind(this);

  const mount = () => {
    card = elements.create('card', style);
    card.mount(mountNode)
    card.addEventListener('change', boundErrorListener);
  }
  const unmount = () => {
    card.removeEventListener('change', boundErrorListener);
  }
  const submit = async () => {
    const { token, error } = await stripe.createToken(card);
    if (error) return err(error.message);
    return token;
  }

  return {
    mount: mount.bind(this),
    unmount: unmount.bind(this),
    card,
    submit: submit.bind(this)
  };
}


export {
  createBankAccount,
  createCardElement
}

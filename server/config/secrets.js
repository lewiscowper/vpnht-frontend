module.exports = {

  db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/membership',

  sessionSecret: process.env.SESSION_SECRET || 'vpn',

  mailgun: {
    user: process.env.MAILGUN_USER || 'vpn.ht',
    password: process.env.MAILGUN_PASSWORD || ''
  },

  vpnht: {
    url: process.env.VPNHT_URL || '',
    key: process.env.VPNHT_APIKEY || '',
    secret: process.env.VPNHT_APISECRET || ''
  },

  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || '',
    stripePubKey: process.env.STRIPE_PUB_KEY || '',
    defaultPlan: 'free',
    plans: ['monthly', 'yearly'],
    planData: {
      'monthly': {
        name: 'Monthly',
        price: 4.99
      },
      'yearly': {
        name: 'Yearly',
        price: 39.99
      }
    }
  },

  googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};

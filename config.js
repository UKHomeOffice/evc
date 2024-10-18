'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  env: process.env.NODE_ENV || 'production',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  email: {
    notifyApiKey: process.env.NOTIFY_KEY,
    caseworkerTemplateId: process.env.CASEWORKER_TEMPLATE_ID,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    customerTemplateId: process.env.CUSTOMER_TEMPLATE_ID,
    emailReplyToId: process.env.REPLY_TO_EMAIL_ID
  },
  survey: {
    urls: {
      feedback: 'https://eforms.homeoffice.gov.uk/outreach/Feedback.ofml?FormName=evc'
    }
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  redis: {
    port: process.env.REDIS_PORT || '6379',
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
  },
  upload: {
    maxFileSizeInBytes: (25 * 1024 * 1024) + 4096, // 25MiB plus slack
    hostname: process.env.FILE_VAULT_URL,
    allowedMimeTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif'
    ]
  }
};

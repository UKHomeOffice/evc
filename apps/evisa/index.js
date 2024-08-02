'use strict';
/* eslint-disable comma-dangle */

const config = require('../../config');
const agentEmail = require('./behaviours/agent-email')(config.email);
const limitDocument = require('./behaviours/limit-documents');
const removeImage = require('./behaviours/remove-image');
const saveImage = require('./behaviours/save-image');

module.exports = {
  name: 'evisa',
  baseUrl: '/',
  steps: {
    '/start': {
      next: '/biometric-residence-permit-number'
    },
    '/biometric-residence-permit-number': {
      fields: [
        'brp-options',
        'brp-number'
      ],
      // next: '/reference-numbers'
      forks: [
        {
          target: '/contact-details',
          condition: {
            field: 'brp-options',
            value: 'yes'
          }
        },
        {
          target: '/reference-numbers',
          condition: {
            field: 'brp-options',
            value: 'no'
          }
        }
      ],
    },
    '/reference-numbers': {
      fields: [
        'reference-numbers-options',
        'urn-number',
        'passport-number',
        'other-reference-number',
      ],
      next: '/contact-details'
    },

    '/start1': {
      next: '/start2',
    },
    '/start2': {
      next: '/invite',
    },
    '/invite': {
      fields: ['sent-email'],
      next: '/technical',
      forks: [
        {
          target: '/no-invite',
          condition: {
            field: 'sent-email',
            value: 'no',
          }
        }
      ]
    },
    '/no-invite': {
      backLink: false
    },
    '/technical': {
      fields: ['tech-problem'],
      next: '/contact-details',
    },
    '/contact-details': {
      behaviours: [agentEmail, 'complete', saveImage('image'), removeImage, limitDocument],
      fields: ['full-name', 'email', 'contact-number', 'ref-number', 'question', 'image', 'contacted'],
      next: '/confirmation',
    },
    '/confirmation': {
      behaviours: [],
      clearSession: true, // triggers hof/components/clear-session to clear the session
      backLink: false
    },
  }
};

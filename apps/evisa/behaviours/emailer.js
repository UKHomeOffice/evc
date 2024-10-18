'use strict';
/* eslint-disable prefer-const */

const NotifyClient = require('notifications-node-client').NotifyClient;
const logger = require('hof/lib/logger')({ env: process.env });
const { EMAIL } = require('../constants.js');

module.exports = class Emailer {
  constructor(emailConfig) {
    // Configuration check
    let requiredProperties = [
      'notifyApiKey',
      'caseworkerTemplateId',
      'caseworkerEmail',
      'customerTemplateId',
      'emailReplyToId'    // [Notify emailReplyToId](https://docs.notifications.service.gov.uk/node.html#emailreplytoid-optional)
    ];
    let missing = requiredProperties.filter(property => !emailConfig[property]);
    if (missing.length > 0) {
      let errorMsg = missing.map(property => `config.email ${property} is not defined`).join('\n');
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    this.emailConfig = emailConfig;
    this.notifyClient = new NotifyClient(emailConfig.notifyApiKey);
  }

  async sendCaseworkerEmail(personalisation) {
    await this._sendEmail(
      this.emailConfig.caseworkerTemplateId,
      this.emailConfig.caseworkerEmail,
      personalisation,
      EMAIL.RECIPIENT_TYPE.CASEWORKER
    );
  }

  async sendCustomerEmail(emailAddress, personalisation) {
    await this._sendEmail(
      this.emailConfig.customerTemplateId,
      emailAddress,
      personalisation,
      EMAIL.RECIPIENT_TYPE.CUSTOMER,
      this.emailConfig.emailReplyToId
    );
  }

  async _sendEmail(templateId, emailAddress, personalisation, recipientType, emailReplyToId = undefined) {
    let options = {
      personalisation
    };

    if (emailReplyToId) {
      options.emailReplyToId = emailReplyToId;
    }

    try {
      let response = await this.notifyClient.sendEmail(templateId, emailAddress, options);
      logger.info(`${recipientType} Email sent successfully: ${response?.data?.id || 'no id'}`);
    } catch (err) {
      let errorDetails = JSON.stringify(err.response?.data || '');
      let errorCode = err.code || '';
      let errorMessage = `Failed to send Email: ${errorCode} - ${err.message}; Cause: ${errorDetails}`;
      logger.error(errorMessage);
      throw (err);
    }
  }
};

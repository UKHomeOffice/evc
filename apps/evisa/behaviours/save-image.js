'use strict';
/* eslint-disable max-len */

const _ = require('lodash');
const config = require('../../../config');
const ImageUpload = require('../models/image-upload');

module.exports = fieldName => superclass => class extends superclass {
  process(req) {
    if (req.files && req.files[fieldName]) {
      // TODO check this mapping is necessary - I don't see a consumer for `req.form.values[fieldName]`
      // set image name on `values` for filename extension validation
      // N:B validation controller gets values from
      // `req.form.values` not `req.files`
      req.form.values[fieldName] = req.files[fieldName].name;
      req.log('info', `Processing image: ${req.form.values[fieldName]}`);
    }
    super.process.apply(this, arguments);
  }

  /**
   * Validate the file being uploaded is the correct type and size.
   *
   * @param {string} key - The key of the field to be validated.
   * @param {object} req - The request object containing the field to be validated.
   * @return {object} A ValidationError object if the field is invalid, otherwise the result of the superclass's validateField method.
   */
  validateField(key, req) {
    // TODO check the key is the same as `fieldName`
    if (req.body['upload-file']) {
      const fileToBeValidated = _.get(req.files, `${fieldName}`);

      if (fileToBeValidated) {
        const size = fileToBeValidated.size;
        const sizeTooBig = size > config.upload.maxFileSizeInBytes;
        const sizeBeyondServerLimits = fileToBeValidated.truncated;
        const invalidSize = sizeTooBig || sizeBeyondServerLimits;

        // Is file type (mimetype) in whitelist?
        const mimetype = fileToBeValidated.mimetype;
        const invalidMimetype = !config.upload.allowedMimeTypes.includes(mimetype);

        if (invalidSize || invalidMimetype) {
          return new this.ValidationError(key, {
            key,
            type: invalidSize ? 'maxFileSize' : 'fileType',
            redirect: undefined
          });
        }
      } else {
        return new this.ValidationError(key, {
          key,
          type: 'required',
          redirect: undefined
        });
      }
    }
    return super.validateField(key, req);
  }

  async saveValues(req, res, next) {
    if (req.body['upload-file']) {
      const images = req.sessionModel.get('images-uploaded') || [];

      if (_.get(req.files, fieldName)) {
        req.log('info', `Saving image: ${req.files[fieldName].name}`);
        const image = _.pick(req.files[fieldName], ['name', 'data', 'mimetype']);
        const uploader = new ImageUpload(image);

        try {
          // TODO enable saving to file-vault
          // await model.save();

          req.sessionModel.set('images-uploaded', [...images, uploader.toJSON()]);
          return res.redirect(`${req.baseUrl}${req.path}`);
        } catch (error) {
          return next(new Error(`Failed to save image, error: ${error}`));
        }
      }
    }
    return super.saveValues.apply(this, arguments);
  }
};

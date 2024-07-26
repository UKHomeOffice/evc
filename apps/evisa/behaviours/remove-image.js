'use strict';

// Remove the image from the session that is identified by the id in `req.query.delete`
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    if (req.query.delete) {
      const images = req.sessionModel.get('images') || [];
      const remaining = images.filter(i => i.id !== req.query.delete);
      req.log('info', `Removing image: ${req.query.delete}`);
      req.sessionModel.set('images', remaining);
      return res.redirect(`${req.baseUrl}${req.path}`);
    }
    return super.configure(req, res, next);
  }
};
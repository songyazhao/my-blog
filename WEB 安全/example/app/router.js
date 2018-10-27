'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.homePage);
  router.get('/content', controller.home.contentPage);
  router.get('/search', controller.home.search);
  router.post('/save', controller.home.save);
};

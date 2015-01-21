/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  // Client authorization endPoints

  'get /': {
    view: 'index'
  },
  'get /dashboard': {
    view: 'index'
  },
  'get /manage/*': {
    view: 'index'
  },
  'get /logout': {
    view: 'index'
  },
  'get /login': {
    view: 'index'
  },
  // 'post /login': {
  //   controller: 'Auth',
  //   action: 'login'
  // },
  // 'get /logout': {
  //   controller: 'Auth',
  //   action: 'logout'
  // },

  // Resources endPoints
  'get /ingredient/warning/set': {
  controller: 'IngredientController',
  action: 'updateLimit'
  },

  // 'get /product/view': {
  //   controller: 'ProductController',
  //   action: 'viewAll'
  // },

  // '/info': {
  //   controller: 'InfoController',
  //   action: 'index'
  // },
  // 
  'store/view': {
    controller: 'StoreController',
    action: 'view'
  },

  'ingredient/view': {
    controller: 'IngredientController',
    action: 'view'
  },
}

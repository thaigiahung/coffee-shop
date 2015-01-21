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
  'get /view': {
    view: 'view_receipt',
    locals: {
      datas: [
        { id: 1, customer: 'beef corndog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 2, customer: 'dog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 3, customer: 'bndog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 4, customer: 'bog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 5, customer: 'bendog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 6, customer: 'bedog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 7, customer: 'ndog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 8, customer: 'beef cog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 9, customer: 'bendog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 10, customer: 'beef cog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 11, customer: 'bendog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 12, customer: 'beefdog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 13, customer: 'beefog',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 14, customer: 'be',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 15, customer: 'bg',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 },
        { id: 16, customer: 'og',tax: 10, discount: 0, coupon: "A", subtotal: 100000, total: 110000, total_item: 10, time: "01/01/2015 10:10:10", store: "16 NXK", received_money: 150000 }
      ]
    }
  },
  'get /view1/:id': {
    view: 'view_receipt_items',
    locals: {
      datas: [
        { id: 1, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 2, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 3, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 4, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 5, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 6, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 7, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 8, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 9, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 10, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 11, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 12, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 13, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 14, product: 'Macha',amount: 10, price: 20000, total: 200000},
        { id: 15, product: 'Macha',amount: 10, price: 20000, total: 200000}
      ]
    }
  },
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

  '/info': {
    controller: 'InfoController',
    action: 'index'
  },

}

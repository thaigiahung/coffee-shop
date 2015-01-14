window.CLIENT_ID = 'browser';
window.CLIENT_SECRET = 'secret';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function getAccessToken() {
  if (!window.oauth) {
    return null;
  }
  return window.oauth && window.oauth.access_token;
}

function appendAccessToken() {
  if (getAccessToken()) {
    return 'access_token=' + getAccessToken();
  }
  return '';
}

// Load temlate

async.mapSeries(['/tpl/login.html', 
                  '/tpl/admin.html', 
                  '/tpl/product-page.html', 
                  '/tpl/store-page.html', 
                  '/tpl/category-page.html',
                  '/tpl/Ingredient-page.html',
                  '/tpl/Ingredientcategory-page.html'],function(url, done) {

  $.get(url, function(data) {
    done(null, data);
  });  
}, function(err, templates) {
  if (!err) {
    var loginTemplate = templates[0];
    var adminTemplate = templates[1];
    var productPageTemplate = templates[2];
    var storePageTemplate = templates[3];
    var categoryPageTemplate = templates[4];

    var IngredientcategoryPageTemplate = templates[6];
 
    var ingredientPageTemplate = templates[5];


    var Session = Backbone.Model.extend({
      url: function() {
        return '/info?' + appendAccessToken();
      }
    });

    var Product = Backbone.Model.extend({
      url: function() {
        if (this.id) {
          return '/product/' + this.id + '?' + appendAccessToken();
        }
        return '/product?' + appendAccessToken();
      }      
    });

    var ProductCollection = Backbone.Collection.extend({
      model: Product,

      url: function() {
        return '/product?' + appendAccessToken();
      }
    });

    var IngredientCategory = Backbone.Model.extend({
      url: function() {
        if (this.id) {
          return '/ingredientcategory/' + this.id + '?' + appendAccessToken();
        }
        return '/ingredientcategory?' + appendAccessToken();
      }      
    });

    var IngredientCategoryCollection = Backbone.Collection.extend({
      model: IngredientCategory,

      url: function() {
        return '/ingredientcategory?' + appendAccessToken();
      }
    });


    var Category = Backbone.Model.extend({
      url: function() {
        if (this.id) {
          return '/category/' + this.id + '?' + appendAccessToken();
        }
        return '/category?' + appendAccessToken();
      }      
    });
 
    var CategoryCollection = Backbone.Collection.extend({
      model: Category,

      url: function() {
        return '/category?' + appendAccessToken();
      }
    });

    var Ingredient = Backbone.Model.extend({
      url: function() {
        if (this.id) {
          return '/ingredient/' + this.id + '?' + appendAccessToken();
        }
        return '/ingredient?' + appendAccessToken();
      }      
    });
 
    var IngredientCollection = Backbone.Collection.extend({
      model: Ingredient,

      url: function() {
        return '/ingredient?' + appendAccessToken();
      }
    });

    var Store = Backbone.Model.extend({
      url: function() {
        if (this.id) {
          return '/store/' + this.id + '?' + appendAccessToken();
        }
        return '/store?' + appendAccessToken();
      }      
    });

    var StoreCollection = Backbone.Collection.extend({
      model: Store,

      url: function() {
        return '/store?' + appendAccessToken();
      }
    });

    var DashboardPage = Backbone.View.extend({
      render: function() {
        return this;
      }
    });

    var ProductRow = Backbone.View.extend({
      tagName: 'tr',

      events: {
        'click .remove': 'removeProduct',
        'click .update': 'updateProduct'
      },

      constructor: function(productPage, product, index) {
        Backbone.View.call(this);
        this.productPage = productPage;
        this.product = product;
        this.index = index;
        this.listenTo(this.product, 'change', this.render);
      },

      removeProduct: function(e) {
        e.preventDefault();
        this.product.destroy();
        this.remove();
      },

      updateProduct: function(e) {
        e.preventDefault();
        this.productPage.updateProduct(this.product);
      },

      render: function() {
        this.$el.empty();
        this.$el.append('<td>' + this.index +'</td>');
        this.$el.append('<td>' + _.escape(this.product.get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.productPage.categories.get(this.product.get('category')).get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.product.get('price')) +'</td>');
        this.$el.append('<td><img class="product-image" src="' + this.product.get('image') +'"></td>');
        // this.$el.append('<td>' + _.escape(this.product.get('image')) +'</td>');
        this.$el.append('<td><button type="button" class="btn btn-primary update">Edit</button> <button type="button" class="btn btn-danger remove">Delete</button></td>');
        return this;
      }
    });

    var ProductPage = Backbone.View.extend({
      template: _.template(productPageTemplate),

      events: {
        'click #form button[type=submit]': 'submitForm',
        'click .add': 'addProduct'
      },

      constructor: function(product, index) {
        Backbone.View.call(this);
        this.products = new ProductCollection();
        this.categories = new CategoryCollection();
        // Append
        this.listenTo(this.products, 'add', this.addProductRow);
        // Re-render, index change!
        this.listenTo(this.products, 'remove', this.render);
        var _this = this;
        // Fetch categories
        this.categories.fetch({
          success: function() {
            // Fetch products
            _this.products.fetch();
          }
        })
      },

      addProductRow: function(product) {
        this.$('#product-table').append(new ProductRow(this, product, 1 + this.products.indexOf(product)).render().el);
      },

      updateProduct: function(product) {
        this.currentProduct = product;
        this.$('#form .modal-title').text('Cập nhật sản phẩm');
        this.$('#product-name').val(product.get('name'));
        this.$('#product-price').val(product.get('price'));
        this.$('#product-category').empty();
        this.categories.each(function(c) {
          this.$('#product-category').append('<option value="' + c.id + '"' + (product.get('category') == c.id ? ' selected' : '') + '>' + c.get('name') + '</option>');
        }, this);
        this.$('#message').hide();
        this.$('#form').modal();
      },

      addProduct: function() {
        this.currentProduct = null;
        this.$('#form .modal-title').text('Thêm sản phẩm');
        this.$('#product-name').val('');
        this.$('#product-price').val('');
        this.$('#product-category').empty();
        this.categories.each(function(c) {
          this.$('#product-category').append('<option value="' + c.id + '">' + c.get('name') + '</option>');
        }, this);
        this.$('#product-image').val('');
        this.$('#message').hide();
        this.$('#form').modal();
      },

      submitForm: function(e) {
        e.preventDefault();
        var _this = this;
        var readFile = function(callback) {
          var file = this.$('#product-image')[0];
          // FileReader support
          if (FileReader) {
            if (file.files.length == 0) {
              // Not upload file
              callback(null, null);
            } else {
              var fr = new FileReader();
              fr.onload = function () {
                callback(null, fr.result);
              }
              fr.readAsDataURL(file.files[0]);
            }
          } 
          // Not supported
          else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
            callback(Error('Not support'));
          }
        };
        if (this.currentProduct) {
          readFile(function(err, data) {
            if (!err) {
              _this.currentProduct.save({
                name: _this.$('#product-name').val(),
                price: _this.$('#product-price').val(),
                category: _this.$('#product-category').val(),
                imageDataUrl: data
              }, {
                wait: true,
                success: function() {
                  // Hide form
                  _this.$('#form').modal('hide');
                },
                error: function() {
                  // Print message
                  _this.$('#message').text('Không thể cập nhật sản phẩm');
                  _this.$('#message').show();
                }
              });
            }  
          });
        } else {
          readFile(function(err, data) {
            if (!err) {
              _this.products.create({
                name: _this.$('#product-name').val(),
                price: _this.$('#product-price').val(),
                category: _this.$('#product-category').val(),
                imageDataUrl: data
              }, {
                wait: true,
                success: function() {
                  // Hide form
                  _this.$('#form').modal('hide');
                },
                error: function() {
                  // Print message
                  _this.$('#message').text('Không thể tạo sản phẩm mới');
                  _this.$('#message').show();
                }
              });
            }   
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.products.each(function(product, index) {
          this.$('#product-table').append(new ProductRow(this, product, index + 1).render().el);
        })
        return this;
      }
    });

    var StoreRow = Backbone.View.extend({
      tagName: 'tr',

      events: {
        'click .remove': 'removeStore',
        'click .update': 'updateStore'
      },

      constructor: function(storePage, store, index) {
        Backbone.View.call(this);
        this.storePage = storePage;
        this.store = store;
        this.index = index;
        this.listenTo(this.store, 'change', this.render);
      },

      removeStore: function(e) {
        e.preventDefault();
        this.store.destroy();
        this.remove();
      },

      updateStore: function(e) {
        e.preventDefault();
        this.storePage.updateStore(this.store);
      },

      render: function() {
        this.$el.empty();
        this.$el.append('<td>' + this.index +'</td>');
        this.$el.append('<td>' + _.escape(this.store.get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.store.get('address')) +'</td>');
        this.$el.append('<td>' + _.escape(this.store.get('phone')) +'</td>');
        this.$el.append('<td><button type="button" class="btn btn-primary update">Edit</button> <button type="button" class="btn btn-danger remove">Delete</button></td>');
        return this;
      }
    });

    var StorePage = Backbone.View.extend({
      template: _.template(storePageTemplate),

      events: {
        'click #form button[type=submit]': 'submitForm',
        'click .add': 'addStore'
      },

      constructor: function(product, index) {
        Backbone.View.call(this);
        this.stores = new StoreCollection();
        // Append
        this.listenTo(this.stores, 'add', this.addStoreRow);
        // Re-render, index change!
        this.listenTo(this.stores, 'remove', this.render);
        var _this = this;
        // Fetch
        this.stores.fetch()
      },

      addStoreRow: function(store) {
        this.$('#store-table').append(new StoreRow(this, store, 1 + this.stores.indexOf(store)).render().el);
      },

      updateStore: function(store) {
        this.currentStore = store;
        this.$('#form .modal-title').text('Cập nhật cửa hàng');
        this.$('#store-name').val(store.get('name'));
        this.$('#store-address').val(store.get('address'));
        this.$('#store-phone').val(store.get('phone'));
        this.$('#message').hide();
        this.$('#form').modal();
      },

      addStore: function() {
        this.store = null;
        this.$('#form .modal-title').text('Thêm cửa hàng');
        this.$('#store-name').val('');
        this.$('#store-address').val('');
        this.$('#store-phone').val('');
        this.$('#message').hide();
        this.$('#form').modal();
      },

      submitForm: function(e) {
        e.preventDefault();
        var _this = this;
        if (this.currentStore) {
          this.currentStore.save({
            name: this.$('#store-name').val(),
            address: this.$('#store-address').val(),
            phone: this.$('#store-phone').val()
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Không thể cập nhật cửa hàng');
              _this.$('#message').show();
            }
          });
        } else {
          _this.stores.create({
            name: this.$('#store-name').val(),
            address: this.$('#store-address').val(),
            phone: this.$('#store-phone').val()
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Không thể thêm cửa hàng mới');
              _this.$('#message').show();
            }
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.stores.each(function(store, index) {
          this.$('#store-table').append(new StoreRow(this, store, index + 1).render().el);
        })
        return this;
      }
    });
    
    var IngredientCategoryRow = Backbone.View.extend({
      tagName: 'tr',

      events: {
        'click .remove': 'removeIngredientCategory',
        'click .update': 'updateIngredientCategory'
      },

      constructor: function(IngredientcategoryPage, Ingredientcategory, index) {
        Backbone.View.call(this);
        this.IngredientcategoryPage = IngredientcategoryPage;
        this.Ingredientcategory = Ingredientcategory;
        this.index = index;
        this.listenTo(this.Ingredientcategory, 'change', this.render);
      },

      removeIngredientCategory: function(e) {
        e.preventDefault();
        this.Ingredientcategory.destroy();
        this.remove();
      },

      updateIngredientCategory: function(e) {
        e.preventDefault();
        this.IngredientcategoryPage.updateIngredientCategory(this.Ingredientcategory);
      },

      render: function() {
        this.$el.empty();
        this.$el.append('<td>' + this.index +'</td>');
        this.$el.append('<td>' + _.escape(this.Ingredientcategory.get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.Ingredientcategory.get('description')) +'</td>');
        this.$el.append('<td><button type="button" class="btn btn-primary update">Update</button> <button type="button" class="btn btn-danger remove">Delete</button></td>');
        return this;
      }
    });
    
    var IngredientCategoryPage = Backbone.View.extend({
      template: _.template(IngredientcategoryPageTemplate),

      events: {
        'click #form button[type=submit]': 'submitForm',
        'click .add': 'addIngredientCategory'
      },

      constructor: function(Ingredientcategory, index) {
        Backbone.View.call(this);
        this.Ingredientcategories = new IngredientCategoryCollection();
        // Append
        this.listenTo(this.Ingredientcategories, 'add', this.addIngredientCategoryRow);
        // Re-render, index change!
        this.listenTo(this.Ingredientcategories, 'remove', this.render);
        var _this = this;
        // Fetch categories
        this.Ingredientcategories.fetch({})
      },

      addIngredientCategoryRow: function(Ingredientcategory) {
        this.$('#Ingredientcategory-table').append(new IngredientCategoryRow(this, Ingredientcategory, 1 + this.Ingredientcategories.indexOf(Ingredientcategory)).render().el);
      },

      updateIngredientCategory: function(Ingredientcategory) {
        this.currentIngredientCategory = Ingredientcategory;
        this.$('#form .modal-title').text('Update ingredient category');
        this.$('#Ingredientcategory-name').val(Ingredientcategory.get('name'));
        this.$('#Ingredientcategory-description').val(Ingredientcategory.get('description'));
        this.$('#message').hide();
        this.$('#form').modal();
      },

      addIngredientCategory: function() {
        this.currentIngredientCategory = null;
        this.$('#form .modal-title').text('Add  ingredient category');
        this.$('#Ingredientcategory-name').val('');
        this.$('#Ingredientcategory-description').val('');
        this.$('#message').hide();
        this.$('#form').modal();
      },

      submitForm: function(e) {
        e.preventDefault();
        var _this = this;
        if (this.currentIngredientCategory) {
          _this.currentIngredientCategory.save({
            name: _this.$('#Ingredientcategory-name').val(),
            description: _this.$('#Ingredientcategory-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot update ingredient category!');
              _this.$('#message').show();
            }
          });
        } else {
          _this.Ingredientcategories.create({
            name: _this.$('#Ingredientcategory-name').val(),
            description: _this.$('#Ingredientcategory-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot add ingredient category!');
              _this.$('#message').show();
            }
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.Ingredientcategories.each(function(Ingredientcategory, index) {
          this.$('#Ingredientcategory-table').append(new IngredientCategoryRow(this, Ingredientcategory, index + 1).render().el);
        })
        return this;
      }
    });

    var CategoryRow = Backbone.View.extend({
      tagName: 'tr',

      events: {
        'click .remove': 'removeCategory',
        'click .update': 'updateCategory'
      },

      constructor: function(categoryPage, category, index) {
        Backbone.View.call(this);
        this.categoryPage = categoryPage;
        this.category = category;
        this.index = index;
        this.listenTo(this.category, 'change', this.render);
      },

      removeCategory: function(e) {
        e.preventDefault();
        this.category.destroy();
        this.remove();
      },

      updateCategory: function(e) {
        e.preventDefault();
        this.categoryPage.updateCategory(this.category);
      },

      render: function() {
        this.$el.empty();
        this.$el.append('<td>' + this.index +'</td>');
        this.$el.append('<td>' + _.escape(this.category.get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.category.get('description')) +'</td>');
        this.$el.append('<td><button type="button" class="btn btn-primary update">Edit</button> <button type="button" class="btn btn-danger remove">Delete</button></td>');
        return this;
      }
    });

    var CategoryPage = Backbone.View.extend({
      template: _.template(categoryPageTemplate),

      events: {
        'click #form button[type=submit]': 'submitForm',
        'click .add': 'addCategory'
      },

      constructor: function(category, index) {
        Backbone.View.call(this);
        this.categories = new CategoryCollection();
        // Append
        this.listenTo(this.categories, 'add', this.addCategoryRow);
        // Re-render, index change!
        this.listenTo(this.categories, 'remove', this.render);
        var _this = this;
        // Fetch categories
        this.categories.fetch({})
      },

      addCategoryRow: function(category) {
        this.$('#category-table').append(new CategoryRow(this, category, 1 + this.categories.indexOf(category)).render().el);
      },

      updateCategory: function(category) {
        this.currentCategory = category;
        this.$('#form .modal-title').text('Update category');
        this.$('#category-name').val(category.get('name'));
        this.$('#category-description').val(category.get('description'));
        this.$('#message').hide();
        this.$('#form').modal();
      },

      addCategory: function() {
        this.currentCategory = null;
        this.$('#form .modal-title').text('Add category');
        this.$('#category-name').val('');
        this.$('#category-description').val('');
        this.$('#message').hide();
        this.$('#form').modal();
      },

      submitForm: function(e) {
        e.preventDefault();
        var _this = this;
        if (this.currentCategory) {
          _this.currentCategory.save({
            name: _this.$('#category-name').val(),
            description: _this.$('#category-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot update category!');
              _this.$('#message').show();
            }
          });
        } else {
          _this.categories.create({
            name: _this.$('#category-name').val(),
            description: _this.$('#category-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot add category!');
              _this.$('#message').show();
            }
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.categories.each(function(category, index) {
          this.$('#category-table').append(new CategoryRow(this, category, index + 1).render().el);
        })
        return this;
      }
    });
    
    //Huy - Ingredient

    var IngredientRow = Backbone.View.extend({
      tagName: 'tr',

      events: {
        'click .remove': 'removeIngredient',
        'click .update': 'updateIngredient'
      },

      constructor: function(ingredientPage, ingredient, index) {
        Backbone.View.call(this);
        this.ingredientPage = ingredientPage;
        this.ingredient = ingredient;
        this.index = index;
        this.listenTo(this.ingredient, 'change', this.render);
      },

      removeIngredient: function(e) {
        e.preventDefault();
        console.log(this.ingredient);
        this.ingredient.destroy();

        this.remove();
      },

      updateIngredient: function(e) {
        e.preventDefault();
        this.ingredientPage.updateIngredient(this.ingredient);
      },

      render: function() {
        this.$el.empty();
        this.$el.append('<td>' + this.index +'</td>');
        this.$el.append('<td>' + _.escape(this.ingredient.get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.ingredientPage.ingredientcategories.get(this.ingredient.get('category')).get('name')) +'</td>');
        this.$el.append('<td>' + _.escape(this.ingredient.get('instock')) + '</td>');
        this.$el.append('<td>' + _.escape(this.ingredient.get('unit')) +'</td>');
        this.$el.append('<td>' + _.escape(this.ingredient.get('price')) +'</td>');
        this.$el.append('<td>' + _.escape(this.ingredient.get('description')) +'</td>');

        this.$el.append('<td><button type="button" class="btn btn-primary update">Edit</button> <button type="button" class="btn btn-danger remove">Delete</button></td>');
        return this;
      }
    });

    var IngredientPage = Backbone.View.extend({
      template: _.template(ingredientPageTemplate),

      events: {
        'click #form button[type=submit]': 'submitForm',
        'click .add': 'addIngredient'
      },

      constructor: function(ingredient, index) {
        Backbone.View.call(this);
        this.ingredient = new IngredientCollection();
        this.ingredientcategories = new IngredientCategoryCollection();
        // Append
        this.listenTo(this.ingredient, 'add', this.addIngredientRow);
        // Re-render, index change!
        this.listenTo(this.ingredient, 'remove', this.render);
        var _this = this;
        
        // Fetch categories
        this.ingredientcategories.fetch({
          success: function() {
           // Fetch ingredient
            _this.ingredient.fetch();
          }
        })
      },

      addIngredientRow: function(ingredient) {
        this.$('#ingredient-table').append(new IngredientRow(this, ingredient, 1 + this.ingredient.indexOf(ingredient)).render().el);
      },

      updateIngredient: function(ingredient) {
        this.currentIngredient = ingredient;
        this.$('#form .modal-title').text('Update ingredient');
        this.$('#ingredient-name').val(ingredient.get('name'));
        this.$('#ingredient-category').empty();
        this.ingredientcategories.each(function(c) {
          this.$('#ingredient-category').append('<option value="' + c.id + '"' + (ingredient.get('category') == c.id ? ' selected' : '') + '>' + c.get('name') + '</option>');
        }, this);
        this.$('#ingredient-instock').val(ingredient.get('instock'));
        this.$('#ingredient-unit').val(ingredient.get('unit'));
        this.$('#ingredient-price').val(ingredient.get('price'));
        this.$('#ingredient-description').val(ingredient.get('description'));
        this.$('#message').hide();
        this.$('#form').modal();
      },

      addIngredient: function() {
        this.currentIngredient = null;
        this.$('#form .modal-title').text('Add ingredient');
        this.$('#ingredient-name').val('');
        this.$('#ingredient-category').empty();
        this.ingredientcategories.each(function(c) {
          this.$('#ingredient-category').append('<option value="' + c.id + '">' + c.get('name') + '</option>');
        }, this);
        this.$('#ingredient-instock').val('');
        this.$('#ingredient-unit').val('');
        this.$('#ingredient-price').val('');
        this.$('#ingredient-description').val('');
        this.$('#message').hide();
        this.$('#form').modal();
      },

      submitForm: function(e) {
        e.preventDefault();
        var _this = this;
        if (this.currentIngredient) {
          _this.currentIngredient.save({
            name: _this.$('#ingredient-name').val(),
            category: _this.$('#ingredient-category').val(),
            instock: _this.$('#ingredient-instock').val(),
            unit: _this.$('#ingredient-unit').val(),
            price: _this.$('#ingredient-price').val(),
            description: _this.$('#ingredient-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot update ingredient!');
              _this.$('#message').show();
            }
          });
        } else {
          _this.ingredient.create({
            name: _this.$('#ingredient-name').val(),
            category: _this.$('#ingredient-category').val(),
            instock: _this.$('#ingredient-instock').val(),
            unit: _this.$('#ingredient-unit').val(),
            price: _this.$('#ingredient-price').val(),            
            description: _this.$('#ingredient-description').val(),
          }, {
            wait: true,
            success: function() {
              // Hide form
              _this.$('#form').modal('hide');
            },
            error: function() {
              // Print message
              _this.$('#message').text('Cannot add ingredient!');
              _this.$('#message').show();
            }
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.ingredient.each(function(ingredient, index) {
          this.$('#ingredient-table').append(new IngredientRow(this, ingredient, index + 1).render().el);
        })
        return this;
      }
    });

    var AdminView = Backbone.View.extend({
      template: _.template(adminTemplate),

      updateSideBarMenu: function() {
        var active = this.$sideBarMenu.find('a[href="/' + Backbone.history.fragment + '"]');
        if (active) {
          this.$sideBarMenu.find('a').removeClass('active');
          active.addClass('active');
        }
      },

      setPage: function(page) {
        // Clean up old page
        this.$page.empty();
        this.page = page;
        this.$page.append(this.page.render().el);
      },

      render: function() {
        this.$el.html(this.template());
        this.$sideBarMenu = this.$('#side-menu');
        this.$page = this.$('#page-wrapper');
        return this;
      }
    });

    var LoginView = Backbone.View.extend({
      events: {
        'click #btn-login': 'login'
      },

      template: _.template(loginTemplate),

      login: function(e) {
        e.preventDefault();
        this.$message.hide();
        var email = this.$email.val();
        var password = this.$password.val()
        if (!email || !password) {
          this.$message.text('Vui lòng nhập đầy đủ thông tin');
          this.$message.show();
        } else {
          this.$email.val('');
          this.$password.val('');
          this.$progress.show();
          var _this = this;
          $.post('/oauth/token', {
            client_id: window.CLIENT_ID,
            client_secret: window.CLIENT_SECRET,
            grant_type: 'password',
            username: email,
            password: password
          }).success(function(data) {
            _this.$progress.hide();
            window.oauth = data;
            setCookie('oauth', JSON.stringify(data), 1);
            window.session = new Session();
            window.session.fetch({
              success: function() {
                if (window.returnPath) {
                  window.router.navigate(window.returnPath  , {trigger: true});
                } else {
                  window.router.navigate('dashboard', {trigger: true});
                }
              },
              error: function() {
                setCookie('oauth', '', 0);
                delete window.oauth;
                _this.$message.text('Email/mật khẩu không chính xconác');
                _this.$message.show();
              }
            });
          }).error(function() {
            _this.$progress.hide();
            _this.$message.text('Email/mật khẩu không chính xác');
            _this.$message.show();
          });
        }
      },

      render: function() {
        this.$el.html(this.template());
        this.$message = this.$('#message');
        this.$progress = this.$('#progress');
        this.$progress.hide();
        this.$message.hide();
        this.$email = this.$('input[name=email]');
        this.$password = this.$('input[name=password]');
        return this;
      }
    });

    var Router = Backbone.Router.extend({
      routes: {
        '': 'index',
        'dashboard': 'dashboard', 
        'manage/products': 'products',
        'manage/inventories': 'inventories',
        'manage/stores': 'stores',
        'manage/categories': 'categories',
        'manage/Ingredientcategories': 'Ingredientcategories',
        'manage/ingredient': 'ingredient',
        'login': 'login',
        'logout': 'logout'
      },

      index: function() {
        router.navigate('dashboard', {trigger: true}); 
      },

      loadDashboard: function() {
        if (!this.adminView) {
          // Load admin template
          $('#content').empty();
          this.adminView = new AdminView();  
          $('#content').append(this.adminView.render().el);
        }
        // Active menu
        this.adminView.updateSideBarMenu();
      },

      dashboard: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        } 
        this.loadDashboard();
        this.adminView.setPage(new DashboardPage());
      },

      products: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.loadDashboard();
        // Change content view to product list
        this.adminView.setPage(new ProductPage());
      },

      stores: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.loadDashboard();
        // Change content view to product list
        this.adminView.setPage(new StorePage());
      },

      categories: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.loadDashboard();
        // Change content view to category list
        this.adminView.setPage(new CategoryPage());
      },

      ingredient: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.loadDashboard();
        // Change content view to ingredient list
        this.adminView.setPage(new IngredientPage());
      },

      Ingredientcategories: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.loadDashboard();
        // Change content view to Ingredientcategory list
        this.adminView.setPage(new IngredientCategoryPage());
      },


      inventories: function() {
        // Clean up DOM
        if (!window.session) {
          window.router.navigate('login', {trigger: true});
          return;
        }
        this.dashboard();
        console.log('inventories');
      },

      login: function() {
        delete this.adminView;
        $('#content').empty();
        // Render login view
        var view = new LoginView();
        $('#content').append(view.render().el);
      },

      logout: function() {
        delete window.oauth;
        setCookie('oauth', '', 0);
        window.router.navigate('login', {trigger: true});
      }
    });

    window.router = new Router();

    $(function() {
      // Listen for a
      $(document).on('click', 'a', function(e) {
        var href = $(this).attr('href');
        if (href[0] == '/') {
          e.preventDefault();
          router.navigate(href.slice(0), {trigger: true});
        }
      });
      // Wait for DOM ready
      // Check oauth cookie
      var cookie = getCookie('oauth');
      if (cookie) {
        try {
          window.oauth = JSON.parse(cookie);
          if (window.oauth && window.oauth.access_token) {
            window.session = new Session();
            window.session.fetch({
              success: function() {
                Backbone.history.start({pushState: true});
              },
              error: function() {
                Backbone.history.start({pushState: true});
                window.returnPath = Backbone.history.fragment;
                router.logout();
              }
            });            
          } else {
            setCookie('oauth', '', 0);
            Backbone.history.start({pushState: true});
            // Remember path
            window.returnPath = Backbone.history.fragment;
            if (window.returnPath == 'login') {
              delete window.returnPath;
            }
            window.router.navigate('login', {trigger: true});
          }
        } catch (e) { 
          // setCookie('oauth', '', 0);
        }
      } else {
        Backbone.history.start({pushState: true});
        // Remember path
        window.returnPath = Backbone.history.fragment;
        if (window.returnPath == 'login') {
          delete window.returnPath;
        }
        window.router.navigate('login', {trigger: true});
      }
    });
  }
});
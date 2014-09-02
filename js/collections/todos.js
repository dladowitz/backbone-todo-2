var app = app || {}

var TodoList = Backbone.Collection.extedn({

//CONFIGURATIONS
//  Type of model we use in the collection
  model: app.Todo,

//  Currently using local storage instead of a server. Will move to using rails
  localStorage: new Backbone.LocalStorage('todos-backbone'),

//COLLECTION METHODS
//  Uses underscores filter methods to return completed todos
  completed: function() {
    return this.filter(function( todo ) {
      return todo.get('completed');
    });
  },

//  Returns todos that are not completed. Not sure how 'without.apply works'. Part of Underscore.
  remaining: function() {
    return this.without.apply(this, this.completed() );
  },

//Returns the number of the next item in the collection. Not sure what order does. .last is an underscore method.
  nextOrder: function(){
    if( !this.length ){
      return 1;
    } else {
      return this.last().get('order') + 1
    }
  },

//  Somehow retuns the order?
  comparator: function( todo ) {
    return todo.get('order');
  }
});

app.Todos = new TodoList();



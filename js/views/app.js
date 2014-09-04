var app = app || {}

app.AppView = Backbone.View.extend({
//  Binds to the element #todoapp which is already in the html
  el: '#todoapp',

//  The template for stats at the bottom of the page. Finds #stats-template from the html on the page.
//  Passes it to the _.template method.
  statsTemplate: _.template( $('#stats-template').html() ),

//  DOM Events
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllCompleted'
  },

//  Initialize view. Creates local variables from JQuery find selectors within the $el.
// Bind to API events.
  initialize: function(){
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

//  listens to Todos collection for events. Calls methods on collection.
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

//    Gets all the todos from server or local storage. Not sure how todos are getting rendered. Maybe .add() is called by .fetch()
    app.Todos.fetch();
  },

  render: function(){
    console.log("render function: AppView")
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

//  If there are items in the collection
    if ( app.Todos.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

//    Removes 'selected' class. Does some filtering bullshit, adds classback. WTF?
      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
        .addClass('selected');
//    If there are no items in the collecion hide the main and footer
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

//  Something about if there are none remaining check the toggle-all checkbox?
    this.allCheckbox.checked = !remaining;
  },

//  Creates a new to-do view from a to-do model. Appends it to #todo-list
  addOne: function( todo ) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

//  Clears out element, then adds in each item from the collection
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  // triggers 'visible' event on model
  filterOne: function (todo) {
    todo.trigger('visible');
  },

  filterAll: function () {
    app.Todos.each(this.filterOne, this);
  },

//  creates new attributes for to-do
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

//  Create a new to-do when enter key pressed
  createOnEnter: function (event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    } else {
      app.Todos.create( this.newAttributes() );
      this.$input.val('');
    }
  },

// Clear all completed to-do items, destroying their models. Not sure how.
  clearCompleted: function() {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
//  set to true or false
    var completed = this.allCheckbox.checked;

    app.Todos.each(function( todo ) {
      todo.save({
        'completed': completed
      });
    });
  }
});

var app = app || {}

app.TodoView = Backbone.View.extend({
  tagName: 'li',

  template: _.template( $('#item-template').html() ),

  events: {
//    not sure why 'togglecompleted isnt camelcased
    'click .toggle': 'togglecompleted',
    'dbclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

//  listen to the model for 'change'
  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  render: function(){
    console.log("render function: TodosView")
    this.$el.html(this.template( this.model.attributes ));
    this.$el.toggleClass( 'completed', this.model.get('completed') );
    console.log("toggling 'completed' class")
    this.toggleVisible();
    this.$input = this.$('.edit');
    return this;
  },

  toggleVisible: function(){
    this.$el.toggleClass('hidden', this.isHidden());
  },

  isHidden: function(){
    var isCompleted = this.model.get('completed');
    return ( (!isCompleted && app.TodoFilter == 'completed') ||
      (isCompleted && app.TodoFilter == 'active') )
  },

  togglecompleted: function(){
    console.log("togglecomleted funtion")
    this.model.toggle();
  },
//  switches the view to editing mode
  edit: function(){
    this.$el.addClass('editing');
    this.$input.focus();
  },

//  stop editing mode. save changes
  close: function(){
    var value = this.$input.val().trim();

    if(value){
      this.model.save({ title: value });
    }

    this.$el.removeClass('editing');
  },

//  stop editing if enter key is pressed
  updateOnEnter: function(e) {
    if ( e.which === ENTER_KEY ){
      this.close();
    }
  },

//  destroy model from local storage
  clear: function (){
    console.log("clear function")
    this.model.destroy();
  }
});

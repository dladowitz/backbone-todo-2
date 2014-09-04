var app = app || {}

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  },
  toggle: function(){
    console.log("toggle function")
    this.save({completed: !this.get('completed')})
  }
});

Tasks = new Meteor.Collection('tasks');

if (Meteor.isClient) {
  Session.set('taskAdded', null);

  Meteor.startup(function(){
    // Background
    var t = new Trianglify({
      noiseIntensity: 0,
      cellsize: 50,
      strokeOpacity: 0
    });
    var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);
    document.getElementById('background').setAttribute('style', 'background-image: ' + pattern.dataUrl);

    // Full width text
    var nodes = document.querySelectorAll('[data-fit-text]');
    fitterHappierText(nodes);
  });

  Handlebars.registerHelper("formatTime", function(time) {
    return moment(time).format('h:mm a');
  });

  Template.question.taskAdded = function(){
    return Session.equals('taskAdded', this._id);
  };

  Template.question.currentTime = function(){
    return moment().format('h:mm a');
  };

  Template.question.currentDay = function(){
    return moment().format('dddd');
  };

  Template.today.task = function(){
    var today = moment().format('YYYYMMDD');
    return Tasks.find({createdAtDate: today}, {sort: {createdAtTime: -1}});
  };

  Template.yesterday.task = function(){
    var yesterday = moment().subtract(1, 'days').format('YYYYMMDD');
    return Tasks.find({createdAtDate: yesterday}, {sort: {createdAtTime: -1}});
  };

  Template.question.events({
    'keydown #new_task' : function(event, template) {
      if(event.which === 13) {
        var newTask = template.find('#new_task');
        newTask.value != '' ? Meteor.call('addTask', newTask.value) : null;
        newTask.value = '';
        Session.set('taskAdded', this._id);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    'addTask' : function(newTask) {
      var now = moment();
      Tasks.insert({
        name:      newTask,
        createdAtDate: now.format('YYYYMMDD'),
        createdAtTime: Date.now()
      });
    }
  });

  // Seed
  if(Tasks.find().count() === 0) {
    Tasks.insert({
      name:      'Installed a fresh instance of Meteor',
      createdAtDate: moment().format('YYYYMMDD'),
      createdAtTime: Date.now()
    });
    Tasks.insert({
      name:      'Created a new branch on the Done repo',
      createdAtDate: moment().format('YYYYMMDD'),
      createdAtTime: Date.now()
    });
    Tasks.insert({
      name:      'Installed the MomentJS package',
      createdAtDate: moment().subtract(1, 'days').format('YYYYMMDD'),
      createdAtTime: Date.now()
    });
    Tasks.insert({
      name:      'Created some a basic template',
      createdAtDate: moment().subtract(1, 'days').format('YYYYMMDD'),
      createdAtTime: Date.now()
    });
  }
}

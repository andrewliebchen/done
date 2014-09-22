Tasks = new Meteor.Collection('tasks');

if (Meteor.isClient) {
  Session.set('taskAdded', null);

  Meteor.subscribe('tasks');

  Meteor.startup(function(){
    // Background
    var t = new Trianglify({
      noiseIntensity: 0,
      cellsize: 80,
      strokeOpacity: 0
    });
    var pattern = t.generate(document.body.clientWidth, document.body.clientHeight);
    document.body.setAttribute('style', 'background-image: ' + pattern.dataUrl);

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
    return moment().format('MMM. Do');
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
    'keydown #new_task_object' : function(event, template){
      if(event.which === 13) {
        var newTask = {
          verb: template.find('#new_task_verb').value,
          taskObject: template.find('#new_task_object').value
        };
        newTask.taskObject != '' ? Meteor.call('addTask', newTask) : null;
        $(event.target).closest('.input-container').find('input').val('');
        Session.set('taskAdded', this._id);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('tasks', function(){
    var yesterday = moment().subtract(1, 'days').format('YYYYMMDD');
    return Tasks.find({createdAtDate: {$gte: yesterday}, createdBy: this.userId});
  });

  Meteor.methods({
    'addTask' : function(newTask) {
      var now = moment();
      Tasks.insert({
        taskVerb:      newTask.verb,
        taskObject:    newTask.taskObject,
        createdAtDate: now.format('YYYYMMDD'),
        createdAtTime: Date.now(),
        createdBy:     Meteor.userId()
      });
    }
  });

  // Seed
  if(Tasks.find().count() === 0) {
    Tasks.insert({
      taskVerb:      'Installed',
      taskObject:    'a fresh instance of Meteor',
      createdAtDate: moment().format('YYYYMMDD'),
      createdAtTime: Date.now(),
      createdBy:     this.userId
    });
    Tasks.insert({
      taskVerb:      'Created',
      taskObject:    'a new branch on the Done repo',
      createdAtDate: moment().format('YYYYMMDD'),
      createdAtTime: Date.now(),
      createdBy:     this.userId
    });
    Tasks.insert({
      taskVerb:      'Installed',
      taskObject:    'the MomentJS package',
      createdAtDate: moment().subtract(1, 'days').format('YYYYMMDD'),
      createdAtTime: Date.now(),
      createdBy:     this.userId
    });
    Tasks.insert({
      taskVerb:      'Created',
      taskObject:    'some a basic template',
      createdAtDate: moment().subtract(1, 'days').format('YYYYMMDD'),
      createdAtTime: Date.now(),
      createdBy:     this.userId
    });
  }
}

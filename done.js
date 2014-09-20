Tasks = new Meteor.Collection('tasks');

if (Meteor.isClient) {
  Template.question.currentTime = function(){
    return moment().format('h:mm a');
  };

  Template.question.currentDay = function(){
    return moment().format('dddd');
  };

  Template.history.post = function(){
    return Tasks.find({});
  }

  // Template.history.day = function(){
  //   var tasks = Tasks.find().fetch();
  //   var groupedDates = _.groupBy(_.pluck(tasks, 'createdAt'));
  //   _.each(_.values(groupedDates), function(day) {
  //     console.log({Date: day[0], Total: day.length});
  //   });
  // }

  Template.question.events({

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  Meteor.methods({

  });

  // Seed
  if(Tasks.find().count() === 0) {
    Tasks.insert({
      name:      'Installed a fresh instance of Meteor',
      createdAt: moment().format('YYYYMMDD')
    });
    Tasks.insert({
      name:      'Created a new branch on the Done repo',
      createdAt: moment().format('YYYYMMDD')
    });
    Tasks.insert({
      name:      'Installed the MomentJS package',
      createdAt: moment().format('YYYYMMDD')
    });
    Tasks.insert({
      name:      'Created some a basic template',
      createdAt: moment().format('YYYYMMDD')
    });
  }
}

if (Meteor.isClient) {

  Template.question.currentTime = function(){
    return moment().format('h:mm a');
  };

  Template.question.currentDay = function(){
    return moment().format('dddd');
  };

  Template.question.events({

  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  Meteor.methods({

  });
}

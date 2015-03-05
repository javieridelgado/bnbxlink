// On Client and Server
if (Meteor.isClient) {
    Template.panelDetail.helpers({
        commentsEnabled: function () {
            var enabled = Session.get("commentsEnabled");

            if (enabled == "Y")
                return true;

            return false;
        }
    });

    Template.panelComments.helpers({
        comments: function () {
            return BNBLink.Comments.find({
                objType: "panel",
                objID: this._id
            });
        }
    });

    Template.panelCommentEntry.helpers({
        isOwnEntry: function () {
            return this.userID == Meteor.userId();
        }
    });

    Template.panelDetail.events({
        'click #commentPanel': function (event) {
            var enabled;

            event.preventDefault();
            // This functionality should search within the current data of the added panels
            BNBLink.log("comments clicked");

            enabled = Session.get("commentsEnabled");
            if (enabled == "Y") {
                Session.set("commentsEnabled", "N");
            } else {
                Session.set("commentsEnabled", "Y");
            }
        },

        'click #deletepanel': function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels

            Meteor.call('delPanel', this._id, Meteor.userId(), function (error, result) {
                if (error)
                    return BNBLink.log(error.reason);

                BNBLink.go('/');
            });
        }
    });

    Template.panelComments.events({
        "click #bnbclosechat": function(event) {
            Session.set("commentsEnabled", "N");
        },

        // detect add new comment
        "submit form": function (event) {
            event.preventDefault();
            // This functionality should search within the current data of the added panels
            Meteor.call('addPanelComment', this._id, Meteor.userId(), $("#newComment").val(), function (error, result) {
                var chatWindow;

                if (error)
                    return BNBLink.log(error.reason);

                // reset comment input box
                $("#newComment").val('');

                // scroll the chat window to the bottom
                chatWindow = $("div.panel.bnbchat > div.panel-body")[0];
                chatWindow.scrollTop = chatWindow.scrollHeight;
            });
        }
    });

}
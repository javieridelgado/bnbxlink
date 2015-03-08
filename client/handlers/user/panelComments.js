if (Meteor.isClient) {
    Template.panelComments.helpers({
        comments: function () {
            var ctxHash;

            // retrieve the route parameters, so we show the specific comments for this panel
            ctxHash = "";
            if (Router) {
                ctxHash = Router.current().params.query;
            }

            return BNBLink.Comments.find({
                objType: "panel",
                objID: this._id,
                objKey: ctxHash
            });
        }
    });

    Template.panelCommentEntry.helpers({
        isOwnEntry: function () {
            return this.userID == Meteor.userId();
        }
    });

    Template.panelComments.events({
        "click #bnbclosechat": function (event) {
            Session.set("commentsEnabled", "N");
        },

        // detect add new comment
        "submit form": function (event) {
            var ctxHash;

            // retrieve the route parameters, so we show the specific comments for this panel
            ctxHash = "";
            if (Router) {
                ctxHash = Router.current().params.query;
            }

            event.preventDefault();

            Meteor.call('addPanelComment', this._id, ctxHash, Meteor.userId(), $("#newComment").val(), function (error, result) {
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
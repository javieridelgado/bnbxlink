// server/smtp.js
Meteor.startup(function () {
    smtp = {
        username: 'javier.i.delgado@gmail.com',   // eg: server@gentlenode.com
        password: 'r4m0nc1n',   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.gmail.com',  // eg: mail.gandi.net
        port: 465
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
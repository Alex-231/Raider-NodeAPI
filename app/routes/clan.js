var express = require('express');
var router = express.Router();
var Clan = require('../models/clan');
var User = require('../models/user');
var passport = require('passport');

    ///////////////
    //CLAN ROUTES//
    ///////////////


    //DELETE CLAN ROUTE
    //1. Find the clan fron the clanname param.
    //2. Remove clan references from all members.
    //3. Delete clan.

    //Params:
    //clanname

    router.delete('/:clanname', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        //Find the clan
        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        //If the request user's is the clan creator...
        if(req.user._id = clan.creator_id)
        {
            //Find all of the users in the clan...
            User.find({'clan_id' : clan._id}, function(err, users){
                if(err)
                {
                    res.send({ success: false, message: err });
                }
                else
                {
                    //Remove all clan references from member users...
                    users.forEach(function(user) {
                        user.clan_id = null;

                        user.save(function(err) {
                            if (err) {
                                
                            }
                        });

                    }, this);
                }
            })

            //Delete the clan...
            clan.remove(function(err) {
                if (err) {
                        res.send({ success: false, message: err });
                }
                else {
                        res.send({ success: true, message: 'Deleted clan.' });
                }
            });

        }
        else
        {
            res.send({ success: false, message: 'You dont have permission to delete this clan.' });
        }
        
        if (req.params.slot > (req.user.characters.count - 1)) {
            res.send({ success: false, message: 'No character was found.' });
        }

        req.user.characters.splice(req.params.slot, 1);
        req.user.save(function(err) {
            if (err) {
                res.send({ success: false, message: err });
            }
        });

        res.send({ success: true, message: 'Successfully deleted the character at ' + req.params.slot });
    });


    //CREATE CLAN ROUTE

    //Params:
    //clanname

    //Body:
    //open bool

    router.post('/:clanname', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

            var clan = new Clan({
                name: req.params.clanname,
                creator_id: req.user._id,
                open: req.body.open,
            });

            //Attempt to save the new clan.
            clan.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
                res.json({ success: true, message: 'Successfully created new clan.' });
            });

    });

    //JOIN CLAN ROUTE
    //For joining open/public clans.
    //Find the clan.
    //If it's open, update the request user's clan_id.

    //Params:
    //clanname

    //Body:
    //open bool

    router.get('/:clanname/join', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(foundClan.open)
        {
            req.user.clan_id = foundClan._id;
            req.user.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
                res.json({ success: true, message: 'Successfully joined clan.' });
            });
        }
        else
        {
            res.json({ success: false, message: 'This clan is private. You need to send an request, or accept an invite to join.' });
        }
    });

    router.get('/:clanname/leave', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(foundClan._id == req.user.clan_id)
        {
            req.user.clan_id = null;
            req.user.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
                else
                {
                    return res.json({ success: true, message: "Successfully left clan." });
                }
            });
        }
        else
        {
            res.json({ success: false, message: "User is not in this clan." });
        }
    });

    router.post('/:clanname/requests/:username', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if(req.user.username != req.params.username)
        {
            res.send({ success: false, message: 'Cannot send a join request for another user.' });
        }

        var clan;

        //Find the clan requested to send the request to.
        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(clan.open)
        {
            //Assuming the clan was opened before a member refreshed the page, this might occur.
            //res.json({ success: false, message: 'This clan is open. You do not need to send a request.' });
            req.user.clan_id = clan._id;
            req.user.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
                res.json({ success: true, message: 'Successfully joined clan.' });
            });
        }
        else
        {
            //Add the user's ID to the clan requests array.
            clan.requestedUser_ids.push(req.user._id);
            clan.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
            });

            req.user.clanRequest_ids.push(clan._id);
            req.user.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
            });


            res.json({ success: true, message: 'Clan request sent.' });
        }
    });

    router.delete('/:clanname/requests/:username', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        if(req.user.username != req.params.username)
        {
            res.send({ success: false, message: 'Cannot delete a join request for another user.' });
        }

        var clan;

        //Find the clan requested to send the request to.
        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        //Add the user's ID to the clan requests array.

        if(clan.requestedUser_ids.indexOf(req.user._id) > -1)
        {
            clan.requestedUser_ids.splice(clan.requestedUser_ids.indexOf(req.user._id), 1);
            clan.save();
        }
        if(req.user.clanRequest_ids.indexOf(clan._id) > -1)
        {
            req.user.clanRequest_ids.splice(req.user.clanRequest_ids.indexOf(clan._id), 1)
            req.user.save();
        }
        res.json({ success: true, message: 'Deleted clan request.' });
    });

    router.get('/:clanname/requests/:username/accept', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(clan.open)
        {
            res.send({ success: false, message: 'The clan is open, there are no join requests.' });
        }
        else if(req.user._id = clan.creator_id)
        {
            var acceptingUser;

            User.findOne({ name: req.params.username }, function(err, foundUser) {
                if (err) { //If there's an error, return it.
                    res.send({ success: false, message: err });
                }
                else if (foundClan) { //If there's a clan, store it.
                    acceptingUser = username;
                }
                else { //If there's no clan, return false.
                    res.send({ success: false, message: 'Request username not found.' });
                }
            });

            //If the user sent a request, add them.
            if(clan.requestedUser_ids.indexOf(acceptingUser._id) > -1 && req.user.clanRequest_ids.indexOf(clan._id) > -1)
            {
                //Remove all clan references from member users...
                acceptingUser.clanRequest_ids.forEach(function(id) {
                    Clan.findById(id, function(err, foundClan) {
                        if (foundClan && foundClan.requestedUser_ids.indexOf(acceptingUser._id) > -1) { //If there's a clan, store it.
                            foundClan.requestedUser_ids.splice(foundClan.requestedUser_ids.indexOf(acceptingUser._id), 1);

                            foundClan.save();
                        }
                    });
                }, this);

                acceptingUser.clanRequest_ids = null;
                acceptingUser.clan_id = clan._id;

                acceptingUser.save(function(err) {
                    if (err) {
                        return res.json({ success: false, message: err });
                    }
                });

                res.json({ success: true, message: 'Successfully accepted user join request.' })
            }
            else
            {
                res.json({ success: false, message: 'This user has not requested to join.' });
            }
        }
        else
        {
            res.send({ success: false, message: 'Only the clan creator can accept join requests.' });
        }
    });

    router.get('/:clanname/requests/:username/deny', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(clan.open)
        {
            res.send({ success: false, message: 'The clan is open, there are no join requests.' });
        }


        else if(req.user._id = clan.creator_id)
        {
            var denyingUser;

            User.findOne({ name: req.params.username }, function(err, foundUser) {
                if (err) { //If there's an error, return it.
                    res.send({ success: false, message: err });
                }
                else if (foundClan) { //If there's a clan, store it.
                    denyingUser = username;
                }
                else { //If there's no clan, return false.
                    res.send({ success: false, message: 'Request username not found.' });
                }
            });

            //If the user sent a request, deny them.
            if(clan.requestedUser_ids.indexOf(denyingUser._id) > -1)
            {
                if(denyingUser.clanRequest_ids.indexOf(clan._id) > -1)
                {
                    denyingUser.clanRequest_ids.splice(denyingUser.clanRequest_ids.indexOf(clan._id), 1);
                    denyingUser.save();
                }

                clan.requestedUser_ids.splice(clan.requestedUser_ids.indexOf(denyingUser._id), 1);
                clan.save(function(err) {
                    if (err) {
                        return res.json({ success: false, message: err });
                    }
                    res.json({ success: true, message: 'Successfully denied join request.' });
                });
            }
            else
            {
                //make sure that the user doesn't have any unlinked requests...
                if(denyingUser.clanRequest_ids.indexOf(clan._id) > -1)
                {
                    denyingUser.clanRequest_ids.splice(denyingUser.clanRequest_ids.indexOf(clan._id), 1);
                    denyingUser.save();
                }

                res.json({ success: false, message: 'This user has not requested to join.' });
            }
        }
        else
        {
            res.send({ success: false, message: 'Only the clan creator can deny join requests.' });
        }
    });

    //INVITE CLAN MEMBER ROUTE
    //1. Find the clan fron the clanname param.
    //2. If the clan is open, return error. No point inviting users to an open clan.
    //3. If the user is not the clan creator, return error, they do not have permission.
    //4. Find the user from the username param.
    //5. Add the clan invite to the user, save.

    //Params:
    //clanname
    //username

    router.get('/:clanname/invite/:username', passport.authenticate('jwt', { session: false, failureRedirect: '/api/errors/unauthorized' }), function(req, res) {

        var clan;

        Clan.findOne({ name: req.params.clanname }, function(err, foundClan) {
            if (err) { //If there's an error, return it.
                res.send({ success: false, message: err });
            }
            else if (foundClan) { //If there's a clan, store it.
                clan = foundClan;
            }
            else { //If there's no clan, return false.
                res.send({ success: false, message: 'No clan was found.' });
            }
        });

        if(clan.open)
        {
            res.send({ success: false, message: 'Unable to invite users to an open clan.' });
        }
        else if(req.user._id = clan.creator_id)
        {
            var invitingUser;

            User.findOne({ name: req.params.username }, function(err, foundUser) {
                if (err) { //If there's an error, return it.
                    res.send({ success: false, message: err });
                }
                else if (foundClan) { //If there's a clan, store it.
                    invitingUser = username;
                }
                else { //If there's no clan, return false.
                    res.send({ success: false, message: 'Invite username not found.' });
                }
            });

            clan.invitedUser_ids.push(invitingUser._id);
            clan.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
            });

            invitingUser.clanInvite_ids.push(clan._id);
            invitingUser.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err });
                }
            });

            res.json({ success: true, message: 'Successfully invited user.' });
        }
        else
        {
            res.send({ success: false, message: 'Only the clan creator can invite players.' });
        }
    });

module.exports = router;
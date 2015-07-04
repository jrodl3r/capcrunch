'use strict';

var Messages = {
  trade : {
    heading        : 'Execute a blockbuster trade for your team',
    max_players    : 'Five assets per team max on trades...',
    min_players    : 'Both teams need at least one player...',
    oneway_only    : 'One-way trades only...',
    active_only    : 'Active player trades only...'
  },
  create : {
    heading        : 'Create & Sign a custom player to your team',
    missing_fname  : 'Don\'t forget to add a first name...',
    missing_lname  : 'Don\'t forget to add a last name...',
    missing_pos    : 'Don\'t forget to choose a position...',
    missing_salary : 'Don\'t forget to add a salary...',
    missing_dur    : 'Don\'t forget to add a salary duration...'
  },
  error : {
    loading_team   : 'Sorry, There was an error loading that team.',
    loading_roster : 'Sorry, There was an error loading that roster.',
    saving_roster  : 'Sorry, There was an error saving your roster.',
    editing_roster : 'Sorry, There was an error updating your roster.',
    min_players    : 'Try adding a few more players to your roster first.',
    trade_execute  : 'There was an error executing the trade',
    trade_player   : 'There was an error adding the player'
  }
};

module.exports = Messages;

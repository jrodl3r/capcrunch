'use strict';

// TODO: setup other types [basic|full|markdown]

var Table = {

  // build basic text roster
  build: function(data, type) {
    var roster = data.rosterData,
        signed = data.playerData.signed,
        unsigned = data.playerData.unsigned,
        created = data.playerData.created,
        trades = data.tradeData,
        cap = data.capData,
        clip = '', div = type === 'basic' ? ' - ' : ' | ', alt_count = 0,
        posf = ['L','C','R'], posd = ['L','R'], pos = '', salary, label, stats, key, x, y;

    // Forwards
    for (x = 0; x < 6; x++) {
      if (x < 4) {
        label = type === 'basic' ? '' : '[L' + (x + 1) + '] ';
        clip = clip + label;
        for (y = 0; y < 3; y++) {
          if (!y) { pos = '[-- LW --]'; } else if (y == 2) { pos = '[-- RW --]'; } else { pos = '[-- C --]'; }
          key = 'F' + (x + 1) + posf[y];
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            clip = clip + roster[key].lastname + ' (' + salary + ')';
          } else { clip = clip + pos; }
          if (y < 2) { clip = clip + div; }
        } clip = clip + '\n';

      // Benched
      } else if (x == 4 && (roster.FB1.status !== 'empty' || roster.FB2.status !== 'empty' || roster.FB3.status !== 'empty')) {
        label = type === 'basic' ? 'Benched: ' : '[BN] ';
        clip = clip + label;
        for (y = 0; y < 3; y++) {
          key = 'FB' + (y + 1);
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';

      // Injured
      } else if (x == 5 && (roster.FR1.status !== 'empty' || roster.FR2.status !== 'empty' || roster.FR3.status !== 'empty')) {
        label = type === 'basic' ? 'Injured: ' : '[IR] ';
        clip = clip + label;
        for (y = 0; y < 3; y++) {
          key = 'FR' + (y + 1);
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';
      }} clip = clip + '\n';

    // Defense
    for (x = 0; x < 5; x++) {
      if (x < 3) {
        label = type === 'basic' ? '' : '[D' + (x + 1) + '] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          pos = y ? '[-- LD --]' : '[-- RD --]';
          key = 'D' + (x + 1) + posd[y];
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            clip = clip + roster[key].lastname + ' (' + salary + ')';
          } else { clip = clip + pos; }
          if (y < 1) { clip = clip + div; }
        } clip = clip + '\n';

      // Benched
      } else if (x == 3 && (roster.DB1.status !== 'empty' || roster.DB2.status !== 'empty')) {
        label = type === 'basic' ? 'Benched: ' : '[BN] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          key = 'DB' + (y + 1);
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';

      // Injured
      } else if (x == 4 && (roster.DR1.status !== 'empty' || roster.DR2.status !== 'empty')) {
        label = type === 'basic' ? 'Injured: ' : '[IR] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          key = 'DR' + (y + 1);
          if (roster[key].status && roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';
      }} clip = clip + '\n';

    // Goalies
    for (x = 0; x < 3; x++) {
      if (!x) {
        label = type === 'basic' ? '' : '[G] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          pos = y ? '[-- S --]' : '[-- B --]';
          key = 'G' + (x + 1) + posd[y];
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            clip = clip + roster[key].lastname + ' (' + salary + ')';
          } else { clip = clip + pos; }
          if (y < 1) { clip = clip + div; }
        } clip = clip + '\n';

      // Benched
      } else if (x == 1 && (roster.GB1.status !== 'empty' || roster.GB2.status !== 'empty')) {
        label = type === 'basic' ? 'Benched: ' : '[BN] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          key = 'GB' + (y + 1);
          if (roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';

      // Injured
      } else if (x == 2 && (roster.GR1.status !== 'empty' || roster.GR2.status !== 'empty')) {
        label = type === 'basic' ? 'Injured: ' : '[IR] ';
        clip = clip + label;
        for (y = 0; y < 2; y++) {
          key = 'GR' + (y + 1);
          if (roster[key].status && roster[key].status !== 'empty') {
            salary = !/(UFA|RFA)/.test(roster[key].contract[6]) ? roster[key].capnum : roster[key].contract[6];
            if (alt_count) { clip = clip + div; }
            clip = clip + roster[key].lastname + ' (' + salary + ')';
            alt_count = alt_count + 1;
          }}
        alt_count = 0;
        clip = clip + '\n';
      }}

    // Signed
    if (signed.length) {
      label = type === 'basic' ? 'Signed:' : '[Signed]';
      clip = clip + '\n' + label;
      signed.forEach(function(p) {
        clip = clip + '\n' + p.firstname.charAt(0) + '. ' + p.lastname + ' (' + p.capnum + '/' + p.duration + 'yr)';
      });
      clip = clip + '\n';
    }

    // Unsigned
    if (unsigned.length) {
      label = type === 'basic' ? 'Unsigned:' : '[Unsigned]';
      clip = clip + '\n' + label;
      unsigned.forEach(function(p) {
        clip = clip + '\n' + p.firstname.charAt(0) + '. ' + p.lastname + ' (' + p.contract[6] + ')';
      });
      clip = clip + '\n';
    }

    // Created
    if (created.length) {
      label = type === 'basic' ? 'Added:' : '[Added]';
      clip = clip + '\n' + label;
      created.forEach(function(p) {
        clip = clip + '\n' + p.firstname.charAt(0) + '. ' + p.lastname + ' (' + p.capnum + '/' + p.duration + 'yr)';
      });
      clip = clip + '\n';
    }

    // Trades
    if (trades.length) {
      label = type === 'basic' ? 'Trades:' : '[Trades]';
      clip = clip + '\n' + label;
      trades.forEach(function(t) {
        clip = clip + '\nTo ' + t.league_team + ': ';
        t.user.forEach(function(p, i) {
          if (!i) { clip = clip + p.firstname.charAt(0) + '. ' + p.lastname; }
          else { clip = clip + ', ' + p.firstname.charAt(0) + '. ' + p.lastname; }
        });
        t.picks.user.forEach(function(p, i) {
          if (t.user.length || i) { clip = clip + ', 20' + p.year + ' ' + p.label + ' Round'; }
          else { clip = clip + '20' + p.year + ' ' + p.label + 'Round' }
        });
        clip = clip + '\n   For: ';
        t.league.forEach(function(p, i) {
          if (!i) { clip = clip + p.firstname.charAt(0) + '. ' + p.lastname; }
          else { clip = clip + ', ' + p.firstname.charAt(0) + '. ' + p.lastname; }
        });
        t.picks.league.forEach(function(p, i) {
          if (t.user.length || i) { clip = clip + ', 20' + p.year + ' ' + p.label + ' Round'; }
          else { clip = clip + '20' + p.year + ' ' + p.label + 'Round' }
        });
      });
      clip = clip + '\n';
    }

    // Cap Stats
    stats = '[  Cap Space: ' + cap.space + '  |  Cap Hit: ' + cap.hit + '  |  Players: ' + cap.players + '  ]';
    div = '';
    for (x = 0; x < stats.length; x++) { div = div + '-'; }
    clip = clip + '\n' + div + '\n' + stats + '\n' + div + '\nCapCrunch.io » http://capcrunch.io/' + data.id;

    return clip.toString();
  }
};

module.exports = Table;
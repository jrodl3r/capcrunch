'use strict';

var State = {
  rosterData : {
    F1L: { status: 'empty' }, F1C: { status: 'empty' }, F1R: { status: 'empty' },
    F2L: { status: 'empty' }, F2C: { status: 'empty' }, F2R: { status: 'empty' },
    F3L: { status: 'empty' }, F3C: { status: 'empty' }, F3R: { status: 'empty' },
    F4L: { status: 'empty' }, F4C: { status: 'empty' }, F4R: { status: 'empty' },
    FB1: { status: 'empty' }, FB2: { status: 'empty' }, FB3: { status: 'empty' },
    FR1: { status: 'empty' }, FR2: { status: 'empty' }, FR3: { status: 'empty' },
    D1L: { status: 'empty' }, D1R: { status: 'empty' },
    D2L: { status: 'empty' }, D2R: { status: 'empty' },
    D3L: { status: 'empty' }, D3R: { status: 'empty' },
    DB1: { status: 'empty' }, DB2: { status: 'empty' },
    DR1: { status: 'empty' }, DR2: { status: 'empty' },
    G1L: { status: 'empty' }, G1R: { status: 'empty' },
    GB1: { status: 'empty' }, GB2: { status: 'empty' },
    GR1: { status: 'empty' }, GR2: { status: 'empty' }},
  teamData   : { id: '', name: '',
    cap      : { players: '', hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
    players  : { forwards: [], defensemen: [], goaltenders: [], other: [], inactive: [] }},
  playerData : { team: '', inplay: [], benched: [], ir: [], cleared: [], traded: [], acquired: [], unsigned: [], signed: [], created: [] },
  altLines   : { FR: false, FB: false, DR: false, DB: false, GR: false, GB: false },
  tradeTeam  : { id: '', forwards: [], defensemen: [], goaltenders: [], inactive: [], picks: { Y15: [], Y16: [], Y17: [], Y18: [] }},
  tradeData  : { trades: [], user: [], league: [], players: { user: [], league: [] }, picks: { user: [], league: [] }},
  panelData  : { active: 'forwards', inactive: 'inactive', actions: 'trades', loading: false, engaged: false, enabled: true },
  capData    : { year: 6, players: 0, unsigned: 0, hit: '0.000', space: '71.400', cap: '71.400' },
  pickData   : { Y15: [], Y16: [], Y17: [], Y18: [] },
  viewData   : { active: 'loading', last: '', next: '' },
  shareData  : { name: '', link: '', view: 'input', text: '', type: '' },
  dragData   : { type: '', group: '', index: '', pos: '' },
  notify     : { label: '', msg: '' }
};

module.exports = State;

// F1L : { contract: ['','','','','','','','','','','','','','',''], caphit: '', capnum: '', lastname: '', firstname: '', id: '', image: '', jersey: '', nation: '', position: '', shot: '', team: '', status: 'empty', age: '', bonus: '' },
//       F1C : { contract: ['','','','','','','','','','','','','','',''], caphit: '', capnum: '', lastname: '', firstname: '', id: '', image: '', jersey: '', nation: '', position: '', shot: '', team: '', status: 'empty', age: '', bonus: '' },
//       F1R : { contract: ['','','','','','','','','','','','','','',''], caphit: '', capnum: '', lastname: '', firstname: '', id: '', image: '', jersey: '', nation: '', position: '', shot: '', team: '', status: 'empty', age: '', bonus: '' },

// REFACTOR..
// teamInfo   : { id : '', name : '' },
// teamCap    : { players: '', hit : '', space : '', forwards : '', defensemen : '', goaltenders : '', other : '', inactive : '' },
// teamData   : { forwards : [], defensemen : [], goaltenders : [], other : [], inactive : [] },
// tradeTeam  : { id : '', forwards : [], defensemen : [], goaltenders : [], inactive : [] },
// tradeData  : { trades : [], user_list : [], league_list : [] },
// tradeItems : { user : [], league : [] },
// userInfo   : { team: '', name : '', link : '' },
// userData   : { inplay : [], benched : [], ir : [], cleared : [], traded : [], acquired : [], created : [] },
// altLines   : { FR : false, FB : false, DR : false, DB : false, GR : false, GB : false },
// capData    : { year : 6, hit : '0.000', space : '71.000' },
// viewData   : { active : 'loading', last : '', next : '' },
// panelData  : { active : 'trades', loading : false, engaged : false, enabled : true, share : false },
// dragData   : { type : '', group : '', index : '' },
// notify     : { label : '', msg : '' }

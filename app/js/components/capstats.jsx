'use strict';

var CapStats = React.createClass({

  toggleMenu: function() {
    var view = this.props.activeView,
        id   = view + '-stats-menu',
        menu = document.getElementById(id);
    if (menu.className.indexOf(' active') === -1) {
      menu.className = menu.className + ' active';
    } else {
      menu.className = menu.className.replace(' active', '');
    }
  },

  render: function() {

    var view  = this.props.activeView,
        info  = this.props.capData ? this.props.capData : { hit : 0, space : 0 },
        count = this.props.playerCount ? this.props.playerCount : 0;

    // TODO:
    //   <a id={ view + '-stats-button' } onClick={UI.blockAction}
    //     className={ view === 'roster' && count || view === 'payroll' ? 'cap-stats-menu-button' : 'cap-stats-menu-button disabled' }
    //     onMouseEnter={ view === 'roster' && count || view === 'payroll' ? this.toggleMenu : null }>
    //     <i className="fa fa-gear"></i>
    //   </a>
    //   <div id={ view + '-stats-menu' } className="cap-stats-menu" onMouseLeave={this.toggleMenu}>
    // { view === 'roster'
    //   ? <ul>
    //       <li><a onClick={this.props.resetRoster}><i className="fa fa-trash"></i> Remove All</a></li>
    //     </ul>
    //   : <ul>
    //       <li><a><i className="fa fa-close"></i> Menu Item</a></li>
    //     </ul> }
    //   </div>
    return (
      <div id={ view + '-stats' } className={ view === 'roster' && count || view === 'payroll' ? 'cap-stats active' : 'cap-stats' }>
        <div>
          <span>Roster Players <span className="value">{count}</span></span>
        </div>
        <div>
          <span>Payroll Total <span className="value">{info.hit}</span></span>
        </div>
        <div>
          <span>Cap Space <span className={ info.space > 0 ? 'value' : 'value overage' }>{info.space}</span></span>
        </div>
        <div className="salary-cap">
          <span>Salary Cap <span className="value">69.000</span></span>
        </div>
      </div>
    );
  }
});

module.exports = CapStats;

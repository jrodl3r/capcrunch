'use strict';

var CapStats = React.createClass({

  // toggleMenu: function() {
  //   var view = this.props.activeView,
  //       id   = view + '-stats-menu',
  //       menu = document.getElementById(id);
  //   if (menu.className.indexOf(' active') === -1) {
  //     menu.className = menu.className + ' active';
  //   } else {
  //     menu.className = menu.className.replace(' active', '');
  //   }
  // },
  //   <a id={ view + '-stats-button' } onClick={UI.blockAction}
  //     className={ view === 'roster' && count || view === 'payroll' ? 'cap-stats-menu-button' : 'cap-stats-menu-button disabled' }
  //     onMouseEnter={ view === 'roster' && count || view === 'payroll' ? this.toggleMenu : null }>
  //     <i className="fa fa-cog"></i>
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

  render: function() {

    return (
      <div id={ this.props.activeView + '-stats' } className="cap-stats active">
        <div><span>Roster Players<span className="value">{this.props.capData.players}</span></span></div>
        <div><span>Payroll Total <span className="value">{this.props.capData.hit}</span></span></div>
        <div>
          <span>Cap Space
            <span className={ this.props.capData.space > 0 ? 'value' : 'value overage' }>{this.props.capData.space}</span>
          </span>
        </div>
      { this.props.activeView === 'roster' && this.props.capData.unsigned
        ? <div className="unsigned value overage">
            {this.props.capData.unsigned}&nbsp;Unsigned Player { this.props.capData.unsigned > 1 ? <span>s</span> : null }
            <i className="fa fa-info-circle"></i>
          </div>
      : <div className="salary-cap"><span>Salary Cap <span className="value">{ this.props.capData.cap || this.props.league }</span></span></div> }
      </div>
    );
  }
});

module.exports = CapStats;

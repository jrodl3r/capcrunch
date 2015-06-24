'use strict';

var Footer = React.createClass({

  render: function() {
    return (
      <footer className={ !/(teams|loading)/.test(this.props.activeView) ? 'active' : '' }>
        <div className="logo">
          CAP<span className="alt">CRUNCH</span><span className="divider">&#8942;</span><span className="version">v0.9.3</span>
        </div>
        <ul>
          <li className="credits">Credits
            <ul id="credits">
              <li>Payroll &amp; Player Info » <a href="http://nhlnumbers.com" target="_blank">NHLNumbers.com</a></li>
              <li>Picks &amp; Trade Details » <a href="http://prosportstransactions.com/hockey/DraftTrades/Years" target="_blank">Pro Sports Transactions</a></li>
              <li>Player Bios &amp; Images » <a href="http://tsn.ca" target="_blank">TSN</a></li>
              <li>Arena BG Image » <a href="http://hockey.fantasysports.yahoo.com" target="_blank">Yahoo</a></li>
            </ul>
          </li>
          <li className="divider">&#8942;</li>
          <li className="nextup">What&#39;s Next?
            <ul id="nextup">
              <li>Sign Free Agents (UFA&#39;s + Offer-sheets)</li>
              <li>Always-Visible <strong>Cap Stats HUD</strong> w/ Integrated User Alerts + Settings Menu</li>
              <li><strong>Tabbed Active Players Panel</strong> (combine F/D/G for better visibility)</li>
              <li>Mobile + Touch Support</li>
            </ul>
          </li>
          <li className="divider">&#8942;</li>
          <li><a href="https://twitter.com/CapCrunchIO" target="_blank">Support + Feedback</a></li>
        </ul>
      </footer>
    );
  }
});

module.exports = Footer;

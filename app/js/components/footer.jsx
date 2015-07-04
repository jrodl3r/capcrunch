'use strict';

var Footer = React.createClass({

  render: function() {
    var status = !/(teams|loading)/.test(this.props.activeView) ? 'active ' : '';

    return (
      <footer className={ this.props.activeView === 'payroll' ? status + 'alt' : status }>
        <div className="logo">
          <span className="cap">CAP</span>CRUNCH<span className="divider">&#8942;</span><span className="version">0.9.3</span>
        </div>
        <ul>
          <li className="credits">Credits
            <ul id="credits">
              <li><a href="http://prosportstransactions.com/hockey/DraftTrades/Years" title="Draft Picks" target="_blank">Pro Sports Transactions</a></li>
              <li><a href="http://nhlnumbers.com" title="Team Payrolls" target="_blank">NHLNumbers.com</a></li>
              <li><a href="http://tsn.ca" title="Player Photos" target="_blank">TSN.ca</a></li>
            </ul>
          </li>
          <li className="divider">&#8942;</li>
          <li className="nextup">What&#39;s Next?
            <ul id="nextup">
              <li>New Cap Stats + Settings Menu</li>
              <li>Offer-Sheet + Sign Free Agents</li>
              <li>Mobile / Touch Support</li>
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

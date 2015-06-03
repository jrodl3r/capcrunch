'use strict';

var PRM = React.addons.PureRenderMixin;

var Footer = React.createClass({

  mixins: [PRM],

  render: function() {
    return <footer><span className="cap">CAP</span>CRUNCH <span className="version">0.9.2</span></footer>;
  }
});

module.exports = Footer;

'use strict';

var PRM = React.addons.PureRenderMixin;

var Footer = React.createClass({

  mixins: [PRM],

  render: function() {
    return <footer>CAP<span className="alt">CRUNCH</span> <span className="version">0.9.2</span></footer>;
  }
});

module.exports = Footer;

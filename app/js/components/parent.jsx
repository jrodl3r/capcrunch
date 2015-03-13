// CapCrunch Parent (Component)
// ==================================================
'use strict';

var Child = require('./child.jsx');

var Parent = React.createClass({
      render: function() {
        return (
          <div>
            <div> This is the parent. </div>
            <Child name="wildchild" />
          </div>
        );
      }
    });

module.exports = Parent;

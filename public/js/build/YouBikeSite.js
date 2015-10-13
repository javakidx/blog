"use strict";

var React = require('react');

var YouBikeSite = React.createClass({
  displayName: "YouBikeSite",

  getInitialState: function getInitialState() {
    return {
      site: this.props.site
    };
  },
  render: function render() {
    var site = this.props.site;
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "column" },
        site.sno
      ),
      React.createElement(
        "div",
        { className: "column" },
        site.sarea
      ),
      React.createElement(
        "div",
        { className: "column" },
        site.sna
      ),
      React.createElement(
        "div",
        { className: "column" },
        site.sbi
      ),
      React.createElement(
        "div",
        { className: "column" },
        site.mday
      )
    );
  }
});

module.exports = YouBikeSite;

var React = require('react');

var YouBikeSite = React.createClass({
	getInitialState : function(){
		return {
			site : this.props.site,
		};
	},
  	render : function(){
		var site = this.props.site;
  		return (
  			<div className="row">
  				<div className="column">{site.sno}</div>
  				<div className="column">{site.sarea}</div>
  				<div className="column">{site.sna}</div>
  				<div className="column">{site.sbi}</div>
  				<div className="column">{site.mday}</div>
  			</div>
  		);
  	}
});

module.exports = YouBikeSite;

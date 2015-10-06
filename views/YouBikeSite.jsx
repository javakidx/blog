var React = require('react');

var YouBikeSite = React.createClass({
	getInitialState : function(){
		return {
			site : this.props.site,
		};
	},
  	render : function(){
		var site = this.state.site;
  		return (
  			<tr>
  				<td>{site.sno}</td>
  				<td>{site.sarea}</td>
  				<td>{site.sna}</td>
  				<td>{site.sbi}</td>
  				<td>{site.mday}</td>
  			</tr>
  		);
  	}
});

module.exports = YouBikeSite;
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
var YouBikeSiteList = React.createClass({
	propTypes: {
    		siteList: React.PropTypes.array
  	},
  	getInitialState: function() {
    		return {
      			siteList: (this.props.siteList || [])
    		};
  	},
	render : function(){
		//console.log(this.state.siteList);
		var siteNodes  = this.state.siteList.map(function(site) {
			//console.log(site);
       			return <YouBikeSite site={site}></YouBikeSite>;
     		});
		return (<table className="table">
				<thead>
					<tr>
						<td>場站代號</td>
						<td>場站區域</td>
						<td>場站名稱</td>
						<td>目前車輛數</td>
						<td>資料更新時間</td>
					</tr>
				</thead>
				<tdody>
					{siteNodes}
				</tdody>
			</table>);
	}
});
var site = [];
ReactDOM.render(
    <YouBikeSiteList siteList={site}></YouBikeSiteList>,
    document.getElementById('container')
);

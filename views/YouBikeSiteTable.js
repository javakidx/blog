var React = require('react'),
    DOM = React.DOM,
    div = DOM.div,
    h2 = DOM.h2,
    button = DOM.button;

var YouBikeSiteTable = React.createClass({
	getInitialState : function(){
		return {
			siteList : this.props.siteList || [],
			page : 1 
		};
	},
	componentDidMount : function(){
		this.loadYouBikeSiteInfo();
	},
	loadYouBikeSiteInfo : function(){
		var pageSize = 10,
			offset = (this.state.page >= 1 ? this.state.page - 1 : 0) * pageSize;	
		var youBikeSiteUrl = '/youbike/' + pageSize + '/' + offset;
		$.ajax({
			url : youBikeSiteUrl,
			dataType : 'json',
			cache : false,
			success : function(data){
				if(data.result && data.result.results)
				{
					this.setState({
						siteList : data.result.results
					});
				}
			}.bind(this),
			error : function(xhr, status, err){
				console.error(youBikeSiteUrl, status, err.toString());
			}.bind(this)
		});
	},
	nextPage : function()
	{
		this.state.page += 1;
		this.loadYouBikeSiteInfo();
	},
	previousPage : function()
	{
		this.state.page -= 1;
		if(this.state.page < 0)
		{
			this.state.page = 0;
		}
		this.loadYouBikeSiteInfo();
	},
	render : function(){
		return div({
                    className : "youBikeView",
                    children : [
                        h2(null, "Site Information"),
                        div({
                            className : "youBikeTable",
                            children : [
                                div({
                                    className : "dataHead",
                                }, div({
                                        className : "row",
                                        children : [
                                            div({className : "column"}, "場站代號"),
                                            div({className : "column"}, "場站區域"),
                                            div({className : "column"}, "場站名稱"),
                                            div({className : "column"}, "目前車輛數"),
                                            div({className : "column"}, "資料更新時間"),
                                        ]
                                })),
                                React.createElement(YouBikeSiteRow, {siteList : this.state.siteList})
                            ],
                        }),
                        button({onClick : this.previousPage}, "上一頁"),
                        button({onClick : this.nextPage}, "下一頁"),
                ]
                });
            /*
            (
			<div className="youBikeView">
				<h2>YouBike Site Information</h2>
				<div className="youBikeTable">
					<div className="dataHead">
						<div className="row">
							<div className="column">場站代號</div>
							<div className="column">場站區域</div>
							<div className="column">場站名稱</div>
							<div className="column">目前車輛數</div>
							<div className="column">資料更新時間</div>
						</div>
					</div>
					<YouBikeSiteRow siteList={this.state.siteList}/>
				</div>
				<button onClick={this.previousPage}>上一頁</button>
				<button onClick={this.nextPage}>下一頁</button>
			</div>
		)
            */
	}
});

var YouBikeSiteRow = React.createClass({
	render : function(){
//        var youBikeSite = React.createFactory(YouBikeSite);
		return div({
            className : "dataBody",
            children : this.props.siteList.map(function(site, index){
                return React.createElement(YouBikeSite, {site : site, key : index});
            })
        });
        /*
        (
			<div className="dataBody">
				{this.props.siteList.map(function(site) {
					//console.log(site);
       					return (<YouBikeSite site={site} />);
       				})}
			</div>
		);
        */
	}
});
// var YouBikeSiteDetail = React.createClass({
//     getInitialState : function(){
//         return {
//             site : this.props.site
//         };
//     },
//     render : function()
//     {
//         var site = this.state.site;
//         return div({
//             className : 'detailTable', 
//             children : [
//                 div(null, '場站代號&nbsp;&nbsp;' + site.id + '<br/>'),
//     			div(null, '場站位置&nbsp;&nbsp;' + site.ar + '<br/>'),
// 	    		div(null, 'Position&nbsp;&nbsp;' + site.aren + '<br/>'),
// 		    	div(null, '場站區域&nbsp;&nbsp;' + site.sarea + '<br/>'),
// 			    div(null, 'Area&nbsp;&nbsp;' + site.sareaen + '<br/>')
//             ]
//         });

//     }
// });
var YouBikeSite = React.createClass({
	getInitialState : function(){
		return {
			site : this.props.site,
		};
	},
	showData : function(){
		var site = this.state.site;
        
                	var htmlPeice = '<div class="row"><div>場站代號</div><div>' + site.sno + '</div></div>' +
        			'<div class="row"><div>場站位置</div><div>' + site.ar + '</div></div>' +
			'<div class="row"><div>Position</div><div>' + site.aren + '</div></div>' +
			'<div class="row"><div>場站區域</div><div>' + site.sarea + '</div></div>' +
			'<div class="row"><div>Area</div><div>' + site.sareaen + '</div></div>';
        
        //var htmlPeice = React.renderToStaticMarkup(React.createFactory(YouBikeSiteDetail({site : site})));
        		$.colorbox({
            			html : '<div class="table">' + htmlPeice + '</div>',
            			width : 800,
            			height : 500,
            			opacity :  0.3
        		});
	},
  	render : function(){
		var site = this.state.site = this.props.site;
  		return (
  			<div className="row">
  				<div className="column">{site.sno}</div>
  				<div className="column">{site.sarea}</div>
  				<div className="column">{site.sna}</div>
  				<div className="column">{site.sbi}</div>
  				<div className="column">{site.mday}</div>
  			</div>
  		);
        /*
        div({
            className : "row",
            onClick : this.showData,
            "data-site" : JSON.stringify(this.state.site)
        }, 
        [
            div({className : "column", key : site.no}, site.sno),
            div({className : "column", key : site.no + "1"}, site.sarea),
            div({className : "column", key : site.no + "2"}, site.sna),
            div({className : "column", key : site.no + "3"}, site.sbi),
            div({className : "column", key : site.no + "4"}, site.mday),
        ]);
        */
  	}
});

module.exports = YouBikeSiteTable;

namespace("leesa.visual")["<%= visualName %>"] = (function (leesa, _, d3) {
	var magicalChart = {
		extend: function (quadrant) {},
		render: function (quadrant, callback) {
			var content = quadrant.htmlJContent();
			content.html("");
			var visual = quadrant.visual();
			var data = quadrant.data();
			var parameters = visual.parameters || {};
			// var _visualIdentifier = "<%= visualName %>";//uncomment to see what values you have
			// console.log(_visualIdentifier +" Quadrant:",quadrant) 
			// console.log(_visualIdentifier +" Visual:",visual) 
			// console.log(_visualIdentifier +" Data:",data);
			// console.log(_visualIdentifier +" Parameters:",parameters);
		},
		configuration: {},
	}
	return magicalChart;
})(leesa, _, d3)

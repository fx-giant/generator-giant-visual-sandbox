namespace("leesa.visual")["<%= visualName %>"] = (function (leesa, _, d3) {
	var magicalChart = {
		extend: function (quadrant) { },
		render: function (quadrant, callback) {
			var content = quadrant.htmlJContent();
			content.html("");
			var visual = quadrant.visual();
			var data = quadrant.data();
			var parameters = visual.parameters || {};
			//console.log(visual,data,parameters) //uncomment to see what values you have
		},
		configuration: {},
	}
	return magicalChart;
})(leesa, _, d3)
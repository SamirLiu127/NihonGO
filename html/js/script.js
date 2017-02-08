(function () {
var m = L.map('mapID').setView([35.978,134.319], 5);
var baseMaps = [
    "Stamen.Watercolor",
	"OpenStreetMap.Mapnik",
	"OpenStreetMap.DE",
	"Esri.WorldImagery",
	//"MapQuestOpen.OSM"
];
var lc = L.control.layers.provided(baseMaps,{},{collapsed:false}).addTo(m);
m.addHash({lc:lc});
var data={}, layers={}, fills =[
    "rgb(197,27,125)",
	"rgb(222,119,174)",
	"rgb(213, 62, 79)",
	"rgb(84, 39, 136)",
	"rgb(247,64,247)",
	"rgb(244, 109, 67)",
	"rgb(184,225,134)",
	"rgb(127,188,65)",
	"rgb(69, 117, 180)"
];
d3.json("json/jp.json", dealwithData);
function dealwithData(oa){
	data.json= oa.features.map(function(v){
        return [v.geometry.coordinates[1],v.geometry.coordinates[0],v.properties.Name,v.geometry.count];
	});
    points();
    //veronoi();
    //delaunay();
    clusters();
    //quadtree();
}
function points(){
    layers.points = L.layerGroup(data.json.map(function(v){
    	// console.log(v);
    	return L.circleMarker(L.latLng(v),{radius:5,stroke:false,fillOpacity:1,clickable:false,color:fills[Math.floor((Math.random()*9))]})
	}));
	lc.addOverlay(layers.points,"points");
}
// function veronoi(){
//     data.veronoi = d3.geom.voronoi(data.json);
//     layers.veronoi = L.layerGroup(data.veronoi.map(function(v){
// 		return L.polygon(v,{stroke:false,fillOpacity:0.7,color:fills[Math.floor((Math.random()*9))]})
// 	}));
// 	lc.addOverlay(layers.veronoi,"veronoi");
// }
// function delaunay(){
//     data.delaunay = d3.geom.delaunay(data.json);
//     layers.delaunay = L.layerGroup(data.delaunay.map(function(v){
// 		return L.polygon(v,{stroke:false,fillOpacity:0.7,color:fills[Math.floor((Math.random()*9))]})
// 	}));
// 	lc.addOverlay(layers.delaunay,"delaunay");
// }
function clusters(){
    layers.clusters= new L.MarkerClusterGroup();
	layers.clusters.addLayers(data.json.map(function(v){
		// console.log(v);
		return L.marker(L.latLng(v))
				.bindPopup("<strong>"+v[2]+"</strong><br>"+v[1]+","+v[0]+"<br/><strong>熱度</strong>:"+v[3]).openPopup();
	}));

	lc.addOverlay(layers.clusters,"clusters");
}

// function quadtree(){
//     data.quadtree = d3.geom.quadtree(data.json.map(function(v){return {x:v[0],y:v[1]};}));
// 	layers.quadtree = L.layerGroup();
// 	data.quadtree.visit(function(quad, lat1, lng1, lat2, lng2){
// 		layers.quadtree.addLayer(L.rectangle([[lat1,lng1],[lat2,lng2]],{fillOpacity:0,weight:1,color:"#000",clickable:false}));
// 	});
// 	lc.addOverlay(layers.quadtree,"quadtree");
// }


// //Test
// var aggregated = turf.sum(
//   "json/jpBlock.topo.json", "json/jp.json", 'count', 'sum');

// var resultFeatures = points.features.concat(aggregated.features);

// var result = {
//   "type": "FeatureCollection",
//   "features": resultFeatures
// };
// console.log(result);


// Heatmap
layers.svg=L.d3("json/jpBlock.topo.json",{
	topojson:"singleSeatBlock",
	svgClass : "YlOrRd",
	pathClass:function(d) {
		// return "town q" + (10-layers.svg.quintile(d.properties.pop/layers.svg.path.area(d)))+"-11";

		var pt = d.properties.pop;
		// console.log(pt);
		if(pt==0){return "town q0-7"}
		else if(0<pt&&pt<=20){return "town q1-7"}
		else if(20<pt&&pt<=50){return "town q2-7"}
		else if(50<pt&&pt<=100){return "town q3-7"}
		else if(100<pt&&pt<=200){return "town q4-7"}
		else if(200<pt&&pt<=500){return "town q5-7"}
		else if(500<pt){return "town q6-7"}
	},
	before: function(data){
		var _this = this;
		// console.log(_this);
		this.quintile=d3.scale.quantile().domain(data.geometries.map(function(d){
			var pt = d.properties.pop;
			if(pt==0){return 6}
			else if(0<pt&&pt<=20){return 5}
			else if(20<pt&&pt<=50){return 4}
			else if(50<pt&&pt<=100){return 3}
			else if(100<pt&&pt<=200){return 2}
			else if(200<pt&&pt<=500){return 1}
			else if(500<pt){return 0}
		})).range(d3.range(11));
		// this.quintile=d3.scale.quantile().domain(data.geometries.map(function(d){return d.properties.pop/_this.path.area(d);})).range(d3.range(11));
	}
});
layers.svg.bindPopup(function(p){
	var out =[];
	out.push("<strong>Title</strong>: "+p['title']);
	out.push("<strong>熱門度</strong>: "+p['pop']);
	// for(var key in p){
	// if(key !== "FOURCOLOR"){
	// 	out.push("<strong>"+key+"</strong>: "+p[key]);
	// 	}
	// }
	return out.join("<br/>");
	});
lc.addOverlay(layers.svg,"Heatmap");


// Heatmap2
layers.svg2=L.d3("json/jpBlock.topo.json",{
	topojson:"singleSeatBlock",
	svgClass : "Spectral",
	pathClass:function(d) {
		// return "town q" + (10-layers.svg.quintile(d.properties.pop/layers.svg.path.area(d)))+"-11";

		var pt = d.properties.pop;
		// console.log(pt);
		if(pt==0){return "town q6-7"}
		else if(0<pt&&pt<=20){return "town q5-7"}
		else if(20<pt&&pt<=50){return "town q4-7"}
		else if(50<pt&&pt<=100){return "town q3-7"}
		else if(100<pt&&pt<=200){return "town q2-7"}
		else if(200<pt&&pt<=500){return "town q1-7"}
		else if(500<pt){return "town q0-7"}
	},
	before: function(data){
		var _this = this;
		// console.log(_this);
		this.quintile=d3.scale.quantile().domain(data.geometries.map(function(d){
			var pt = d.properties.pop;
			if(pt==0){return 6}
			else if(0<pt&&pt<=20){return 5}
			else if(20<pt&&pt<=50){return 4}
			else if(50<pt&&pt<=100){return 3}
			else if(100<pt&&pt<=200){return 2}
			else if(200<pt&&pt<=500){return 1}
			else if(500<pt){return 0}
		})).range(d3.range(11));
		// this.quintile=d3.scale.quantile().domain(data.geometries.map(function(d){return d.properties.pop/_this.path.area(d);})).range(d3.range(11));
	}
});
layers.svg2.bindPopup(function(p){
	var out =[];
	out.push("<strong>Title</strong>: "+p['title']);
	out.push("<strong>熱門度</strong>: "+p['pop']);
	// for(var key in p){
	// if(key !== "FOURCOLOR"){
	// 	out.push("<strong>"+key+"</strong>: "+p[key]);
	// 	}
	// }
	return out.join("<br/>");
	});
lc.addOverlay(layers.svg2,"Heatmap2");


window.public = {};
window.public.data = data;
window.public.layers = layers;
}());
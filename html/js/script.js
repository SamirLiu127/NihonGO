(function() {
    totaltime = 7200;
    $("#content").append("<button type='button'>清除路線 </button>");
    $("button").on("click", clear);

    function clear() {
        $('path[stroke="red"]').remove();
        $('#route').empty();
        $('path[stroke-opacity="1"').remove();
        $('div[class="leaflet-marker-icon leaflet-glyph-icon leaflet-zoom-animated leaflet-interactive"]').remove();
    }
    var m = L.map('mapID', {
        attributionControl: true
    }).setView([37.978, 138.319], 6);
    // var cartodbAttribution = '<a href="https://github.com/sskingdon">sskingdon</a>, <a href="https://github.com/Sims-Liou">Sims-liou</a>, <a href="https://github.com/yuclin">yuclin</a>';
    var placedic = {};
    var yoo = 0;
    var nowroute;
    var markers = L.layerGroup();
    var collist = ["#5500DD", "#5555FF", "#227700", "#880000", "#000000"];
    var weilist = ["16", "11", "8", "5", "4"];
    var coomlist = ["第一推薦路線", "第二推薦路線", "第三推薦路線", "第四推薦路線", "第五推薦路線"];
    var heatcolor = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C'];
    var heatname = ["0-20", "20-50", "50-100", "100-200", "200-500", "500以上"];
    var oplist = ["1", "1", "1", "1", "1"];
    var baseMaps = [
        "Stamen.Watercolor",
        "OpenStreetMap.Mapnik",
        "OpenStreetMap.DE",
        "Esri.WorldImagery",
        //"MapQuestOpen.OSM"
    ];
    var havething = 0;
    //圖例
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < 5; i++) {
            div.innerHTML +=
                '<div id="nunu"><i style="background:' + collist[i] + '"></i><span id="ss"> ' + coomlist[i] + '</span></div><br>';
        }
        return div;
    };

    legend.addTo(m);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var legend1 = L.control({
        position: 'bottomleft'
    });
    legend1.onAdd = function(map) {
        var divs = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < 6; i++) {
            divs.innerHTML +=
                '<div><i id="hh" style="background:' + heatcolor[i] + '"></i><span id="sss">' + heatname[i] + '</span></div> <br>';
        }
        return divs;
    };
    legend1.addTo(m);
    //control 右上清單
    var lc = L.control.layers.provided(baseMaps).addTo(m);
    L.control.scale().addTo(m);
    // L.control.attribution({
    //     prefix: cartodbAttribution
    // }).addTo(m);
    var data = {},
        layers = {},
        fills = [
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
    d3.json("json/jpfinal.json", dealwithData);

    function dealwithData(oa) {
        data.json = oa.features.map(function(v) {
            return [v.geometry.coordinates[1], v.geometry.coordinates[0], v.properties.Name, v.properties.point];
        });
        console.log(data.json);
        for (var i = 0; i < data.json.length; i++) {
            if (placedic[data.json[i][2]] == null) {
                var t = [data.json[i][0], data.json[i][1]];
                placedic[t] = data.json[i][2];
            }
        }
        // allpath();
        // points();
        clusters();
        bestroute();

    }

    function allpath() {
        d3.json("json/allroute.json", pao);

        function pao(alro) {
            ss = alro.features.map(function(t) {
                return [
                    [t.fromx, t.fromy],
                    [t.tox, t.toy]
                ];
            });
            layers.allpath = L.polyline(ss, {
                'color': 'black',
                'weight': '0.1'
            });
            lc.addOverlay(layers.allpath, "五五六六");
        }
    }

    function points() {
        layers.points = L.layerGroup(data.json.map(function(v) {
            return L.circleMarker(L.latLng(v[0], v[1]), {
                radius: 5,
                stroke: false,
                fillOpacity: 1,
                clickable: false,
                color: fills[Math.floor((Math.random() * 9))]
            })
        }));
        lc.addOverlay(layers.points, "points");
    }

    function clusters() {
        layers.clusters = new L.MarkerClusterGroup();
        layers.clusters.addLayers(data.json.map(function(v) {
            return L.marker(L.latLng(v[0], v[1]), {
                    alt: v[2]
                })
                .bindTooltip("<strong>" + v[2] + "</strong><br>" + "<strong>熱度</strong>:" + v[3] + "<br/>" + v[0] + "," + v[1]).openTooltip()
                .bindPopup("<strong>" + v[2] + "</strong><br>" + "<strong>熱度</strong>:" + v[3] + "<br/>" + v[0] + "," + v[1]).openPopup();
        }));
        layers.clusters.on('click', fi);
        lc.addOverlay(layers.clusters, "個別景點介紹");
    }

    function fi(ev) {
        var f = ev.originalEvent.path[0].alt;
        if (jawiki[f] != null) {
            console.log("ja");
            var f2wiki = jawiki[f];
            $.ajax({
                type: "GET",
                url: "http://ja.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + f2wiki + "&callback=?",
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    var markup = data.parse.text["*"];
                    var i = $('<div></div>').html(markup);
                    i.find('a').each(function() {
                        $(this).replaceWith($(this).html());
                    });
                    i.find('sup').remove();
                    i.find('.mw-ext-cite-error').remove();
                    $('#article').html($(i).find('p'));
                    $('#article').append('<a href="https://ja.wikipedia.org/wiki/' + f2wiki + '" target="_blank">想看更多...</a>');
                },
                error: function(errorMessage) {}
            });
        } else {
            console.log(f);
            $.ajax({
                type: "GET",
                url: "http://zh.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + f + "&callback=?",
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    if (data.error == null) {
                        var markup = data.parse.text["*"];
                        var i = $('<div></div>').html(markup);
                        i.find('a').each(function() {
                            $(this).replaceWith($(this).html());
                        });
                        i.find('sup').remove();
                        i.find('.mw-ext-cite-error').remove();
                        $('#article').html($(i).find('p'));
                        $('#article').append('<a href="https://zh.wikipedia.org/wiki/' + f + '" target="_blank">想看更多...</a>');
                    } else {
                        // https://www.google.com.tw/search?q=00
                        $('#article').html('<p>Oops!!! Wiki 找不到...</p>');
                        $('#article').append('<a href="https://www.google.com.tw/search?q=' + f + '" target="_blank">Google為您搜尋...</a>');
                    }
                },
                error: function(errorMessage) {
                    console.log("error");
                }
            });
        };
    }; ////////////////////////////////////////////////////////////////////////////////////fu end
    //creat f2wiki dic
    var jawiki = {};
    d3.json("json/jawiki.json", f2wiki);

    function f2wiki(jw) {
        jawikilist = jw.ja.map(function(z) {
            return [z.Name, z.Value];
        });

        for (var i = 0; i < jawikilist.length; i++) {
            if (jawiki[jawikilist[i][0]] == null) {
                jawiki[jawikilist[i][0]] = jawikilist[i][1];
            }
        };
    };
    //Heatmap VectorGrid
    fetch('json/jpBlock.topo.json').then(function(response) {
        return response.json();
    }).then(function(json) {
        var vectorGrid = L.vectorGrid.slicer(json, {
            vectorTileLayerStyles: {
                'singleSeatBlock': function(properties) {
                    console.log(properties.pop);
                    var p = properties.pop;
                    console.log(p === 0);
                    return {
                        fillColor: (20 < p && p <= 50) ? '#FED976' :
                            (50 < p && p <= 100) ? '#FEB24C' :
                            (100 < p && p <= 200) ? '#FD8D3C' :
                            (200 < p && p <= 500) ? '#FC4E2A' :
                            (500 < p) ? '#E31A1C' : '#FFEDA0',
                        // '#A3007D' ,
                        // ['white','#FFFFBD','#E6F599','#FEDF8B','#FC8D5A','#D53F50'];
                        fillOpacity: 0.8,
                        stroke: 1,
                        weight: 0.5,
                        fill: true,
                    }
                }
            }
        });
        lc.addOverlay(vectorGrid, "熱度圖");
    });
    //route ################################################################################################################
    function bestroute() {
        var dic = {};
        d3.json("json/superbigtable.json", hi);

        function hi(ih) {
            superbig = ih.features.map(function(z) {
                return [
                    [z.Startx, z.Starty],
                    [
                        [
                            [z.firstx, z.firsty], z.firstdis, z.firstcartime, z.firstcount
                        ],
                        [
                            [z.secondx, z.secondy], z.seconddis, z.secondcartime, z.secondcount
                        ],
                        [
                            [z.thirdx, z.thirdy], z.thirddis, z.thirdcartime, z.thirdcount
                        ],
                        [
                            [z.fourthx, z.fourthy], z.fourthdis, z.fourthcartime, z.fourthcount
                        ],
                        [
                            [z.fifthx, z.fifthy], z.fifthdis, z.fifthcartime, z.fifthcount
                        ]
                    ]
                ]
            });
            for (var i = 0; i < superbig.length; i++) {
                if (dic[superbig[i][0]] == null) {
                    dic[superbig[i][0]] = superbig[i][1];
                }
            }
        }
        layers.bestroute = L.layerGroup(data.json.map(function(v) {
            return L.circleMarker(L.latLng(v[0], v[1]), {
                    radius: 8,
                    stroke: false,
                    fillOpacity: 0.78,
                    clickable: true,
                    color: "#FF00FF"
                }).bindPopup("<strong>" + v[2] + "</strong>").on('click', choose).openPopup()
                .bindTooltip("<strong>" + v[2] + "</strong><br>" + v[0] + "," + v[1]).openTooltip();

        }));
        lc.addOverlay(layers.bestroute, "最佳路線推薦");

        function choose() {
            nowusing = this;
            var secondlayer = [];
            console.log("yeah");
            if (havething == 1) {
                for (i in m._layers) {
                    if (m._layers[i].options.format == undefined && i > 7000) {
                        try {
                            m.removeLayer(m._layers[i]);
                        } catch (e) {}
                    }
                }
            }
            var currentlat = this.getLatLng().lat;
            var currentlng = this.getLatLng().lng;
            currentpoint = [currentlat, currentlng];
            secondlayer.push(currentpoint);
            var temppath = dic[currentpoint];
            if (temppath != null) {
                var tmpnum = 5;
                var flagg = 0;
                var drawlist = [];
                var weightlist = [];
                for (var gg = 0; gg < 5; gg++) {
                    if (temppath[gg][0][0] != 0 && temppath[gg][0][0] != null) {
                        var now = [currentpoint, temppath[gg][0]];
                        var won1 = temppath[gg][2];
                        var won2 = temppath[gg][3];
                        if (won2 < 2) {
                            won2 = 5;
                        } else {
                            won2 = won2 - 1;
                            won2 = won2 / 615;
                            won2 = won2 * 15;
                            won2 = won2 + 2;
                        }
                        var won = [won1, won2];
                        drawlist.push(now);
                        weightlist.push(won);
                    } else {
                        if (flagg == 0) {
                            tmpnum = gg;
                            flagg = 1;
                        }
                    }
                }
                for (var x = 0; x < tmpnum; x++) {
                    var firstpoint = [drawlist[x][1]];
                    var tmpflag = 0;
                    var cango = 0;
                    var thistime = parseInt(String(weightlist[x][0]));
                    var hphp = totaltime;
                    var nowtime = hphp - thistime;
                    if (nowtime > 0) {
                        var pathlist = [];
                        pathlist.length = 0;
                        pathlist.push(currentpoint);
                        pathlist.push(firstpoint[0]);
                        var nowpoint = firstpoint[0];
                        var counting = 0;
                        while (cango == 0 && counting < 15) {
                            counting = counting + 1;
                            tmpflag = 0;
                            var nowpointdic = dic[nowpoint];
                            for (var y = 0; y < 5; y++) {
                                if (typeof(nowpointdic) === 'undefined') {
                                    cango = 1;
                                    break;
                                }
                                if (nowpointdic[y][0][0] != 0 && nowpointdic[y][0][0] != null) {
                                    var nimare = 0;
                                    for (var fuck = 0; fuck < pathlist.length; fuck++) {
                                        if (String(pathlist[fuck]) === String(nowpointdic[y][0])) {
                                            nimare = 1;
                                            break;
                                        }
                                    }
                                    if (nimare == 0) {

                                        if (nowtime - nowpointdic[y][2] > 0) {
                                            console.log("push");
                                            nowtime = nowtime - nowpointdic[y][2];
                                            nowpoint = nowpointdic[y][0];
                                            pathlist.push(nowpoint);
                                            tmpflag = 1;
                                            break;
                                        } else {

                                        }
                                    } else {

                                    }
                                }
                            }
                            if (tmpflag == 0) {
                                cango = 1;
                            }
                        }
                        var route = new L.Polyline(pathlist, {
                            'color': collist[x],
                            'weight': weilist[x],
                            'opacity': oplist[x],
                            'alt': pathlist
                        });
                        route.on('click', showpath)
                    }
                    if (route != null) {
                        layers.bestroute.addLayer(route);
                        havething = 1;
                    }
                }
            } else {
                alert("no route available");
            }
        }

        function showpath(ev) {
            var f = ev.originalEvents;
            var pathlist = this.getLatLngs();
            $('#content').css("height", "20%");
            $('#route').append("所經路線<br/>");
            $('#route').css("height", "15%");
            $('#article').css("height", "65%");
            if (yoo == 1) {
                $('path[stroke="red"]').remove();
                $('#route').empty();
                $('div[class="leaflet-marker-icon leaflet-glyph-icon leaflet-zoom-animated leaflet-interactive"]').remove();
            }
            nowroute = new L.Polyline(pathlist, {
                'color': 'red',
                'weight': 20,
                'opacity': 1,
                'alt': pathlist
            }).addTo(m);
            var markers = L.layerGroup(nowroute);
            m.addLayer(nowroute);
            var nowplacelist = [];
            for (var y = 0; y < pathlist.length; y++) {
                console.log([pathlist[y].lat, pathlist[y].lng]);
                var t = [pathlist[y].lat, pathlist[y].lng];
                var shit = placedic[t];
                console.log(shit);
                nowplacelist.push(shit);
            }
            console.log(placedic);
            console.log(nowplacelist);
            for (var x = 0; x < pathlist.length; x++) {
                L.marker(pathlist[x], {
                        icon: L.icon.glyph({
                            prefix: '',
                            cssClass: 'sans-serif',
                            glyph: x + 1
                        })
                    })
                    .bindTooltip("<strong>" + nowplacelist[x] + "</strong><br>" + pathlist[x].lat + "," + pathlist[x].lng).openTooltip()
                    .bindPopup("<strong>" + nowplacelist[x] + "</strong><br>" + pathlist[x].lat + "," + pathlist[x].lng).openPopup()
                    .addTo(m);
            }
            yoo = 1;
            for (var t = 0; t < nowplacelist.length; t++) {
                if (t != nowplacelist.length - 1) {
                    $("#route").append("<span id='" + t + "' class='myMOUSE'><u>" + nowplacelist[t] + "</u></span>");
                    $("#" + t + ">u").on('click', li);
                    $("#route").append("-->");
                } else {
                    $("#route").append("<span id='" + t + "' class='myMOUSE'><u>" + nowplacelist[t] + "</u></span>");
                    $("#" + t + ">u").on('click', li);
                }
            }

            function li(ev) {
                var f = this.innerHTML;
                console.log(jawiki[f]);
                if (jawiki[f] != null) {
                    console.log("ja");
                    var f2wiki = jawiki[f];
                    $.ajax({
                        type: "GET",
                        url: "http://ja.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + f2wiki + "&callback=?",
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        dataType: "json",
                        success: function(data, textStatus, jqXHR) {
                            var markup = data.parse.text["*"];
                            var i = $('<div></div>').html(markup);
                            // remove links as they will not work
                            i.find('a').each(function() {
                                $(this).replaceWith($(this).html());
                            });
                            // remove any references
                            i.find('sup').remove();
                            // remove cite error
                            i.find('.mw-ext-cite-error').remove();
                            $('#article').html($(i).find('p'));
                            $('#article').append('<a href="https://ja.wikipedia.org/wiki/' + f2wiki + '" target="_blank">想看更多...</a>');
                        },
                        error: function(errorMessage) {}
                    });
                } else {
                    console.log(f);
                    $.ajax({
                        type: "GET",
                        url: "http://zh.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + f + "&callback=?",
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        dataType: "json",
                        success: function(data, textStatus, jqXHR) {
                            if (data.error == null) {
                                var markup = data.parse.text["*"];
                                var i = $('<div></div>').html(markup);
                                i.find('a').each(function() {
                                    $(this).replaceWith($(this).html());
                                });
                                i.find('sup').remove();
                                i.find('.mw-ext-cite-error').remove();
                                $('#article').html($(i).find('p'));
                                $('#article').append('<a href="https://zh.wikipedia.org/wiki/' + f + '" target="_blank">想看更多...</a>');
                            } else {
                                // https://www.google.com.tw/search?q=00
                                $('#article').html('<p>Oops!!! Wiki 找不到...</p>');
                                $('#article').append('<a href="https://www.google.com.tw/search?q=' + f + '" target="_blank">Google為您搜尋...</a>');
                            }
                        },
                        error: function(errorMessage) {
                            console.log("error");
                        }
                    });
                };
            };
        }
    } //bestroute 
    window.public = {};
    window.public.data = data;
    window.public.layers = layers;
}());
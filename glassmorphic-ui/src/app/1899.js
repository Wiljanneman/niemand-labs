var globalMapZA;
var globalMapWorld;
var globalRotation = [90, -30];
var globalScale = 100;
var globalCenter = [53 * -1, -2 * -1];
var redrawData;
var globalProjection;
var source = $("#timeline-template").html();
var template = Handlebars.compile(source);
var map;
var el;
var battleScale;
var overlaymap;


function loadMap(data) {
    el = document.getElementById('map_za');
    map = new Datamap({
        element: document.getElementById('map_za'),
        responsive: true,
        aspectRatio: 0.3,
        scope: 'collection',
        geographyConfig: {
            dataJson: data,
            popupTemplate: function (geo, data) {
                return '<div class="hoverinfo">' + geo.properties.COUNTRY + '<\div>';

            }
        },
        done: this._handleMapReady.bind(this),
        setProjection: function (element) {
            var projection = d3.geo.mercator()
                .center([29.12, -28.5])
                .rotate([4.4, 0])
                .scale(determineScale(el))
                //.scale(determineScale())
                .translate([el.clientWidth / 2, el.clientHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);
            globalProjection = projection;

            return { path: path, projection: projection };
        },
        fills: {
            defaultFill: "#4c4d45"
        },
        bubblesConfig: {
            popupOnHover: false
        }

    });
    globalMapZA = map;
    var bbox = d3.select('.datamaps-subunits').node().getBBox();
    var overlay = $('.overlay-info');
    overlay.css('left', bbox.x);
    overlay.css('top', bbox.y);
    overlay.css('width', 300);
    overlay.css('height', 200);
    overlay.css('position', 'absolute');

    d3.selectAll('path.datamaps-subunit').each(function (d) {

        var centroid = getMyCentroid(this);
        // map.svg.selectAll(".datamaps-subunit").transition().duration(800).attr("transform", "translate(" + el.clientWidth / 2 + "," + (el.clientHeight) / 2 + ")scale(1)translate(" + -centroid[0] + "," + -centroid[1] + ")");
        switch (d.properties.COUNTRY) {
            case 'ZAR':
                d3.select(this).style('fill', "rgb(44, 160, 44)");
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(44, 160, 44)");
                });
                coordinates = [27.137469208071025, -25.214881864043882];
                d3.select(this.parentNode).append("text")
                    .attr("class", "ovs-label")
                    .attr("transform", function (d) { return "translate(" + globalProjection(coordinates) + ")rotate(0)"; })
                    .attr("dy", ".35em")
                    .text(function (d) { return 'Transvaal (ZAR)' })
                    .on({
                        "mouseover": function () {
                            d3.select(this).style('stroke', 'aliceblue');
                            d3.select(this).style("cursor", "pointer");
                        }, "mouseout": function () {
                            d3.select(this).style("cursor", "default");
                            d3.select(this).style('stroke', 'none');
                        }
                    });
                break;
            case 'OVS':
                d3.select(this).style('fill', "rgb(252, 141, 89)");
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(252, 141, 89)");
                });
                coordinates = [25.4, -29.8];
                d3.select(this.parentNode).append("text")
                    .attr("class", "ovs-label")
                    .attr("transform", function (d) { return "translate(" + globalProjection(coordinates) + ")rotate(-45)"; })
                    .attr("dy", ".35em")
                    .text(function (d) { return 'Orange Free State' }).on({
                        "mouseover": function () {
                            d3.select(this).style('stroke', 'aliceblue');
                            d3.select(this).style("cursor", "pointer");
                        }, "mouseout": function () {
                            d3.select(this).style("cursor", "default");
                            d3.select(this).style('stroke', 'none');
                        }
                    });
                break;
            case 'CAPE COLONY':
                d3.select(this).style('fill', "rgb(214, 39, 40)");
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                coordinates = [19.8, -29.8];
                d3.select(this.parentNode).append("text")
                    .attr("class", "eng-label")
                    .attr("transform", function (d) { return "translate(" + globalProjection(coordinates) + ")rotate(25)"; })
                    .attr("dy", ".35em")
                    .text(function (d) { return 'British South Africa' }).on({
                        "mouseover": function () {
                            d3.select(this).style('stroke', 'aliceblue');
                            d3.select(this).style("cursor", "pointer");
                        }, "mouseout": function () {
                            d3.select(this).style("cursor", "default");
                            d3.select(this).style('stroke', 'none');
                        }
                    });
                break;
            case 'Lesotho':
                d3.select(this).style('fill', "rgb(214, 39, 40)");
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Swaziland':
                d3.select(this).style('fill', "rgb(214, 39, 40)");
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            default:

        }
    })

    // d3.selectAll('path.datamaps-subunit')
    function getMyCentroid(element) {
        var bbox = element.getBBox();
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    }



    var data = [{ p: 'hello' }];

    $.get("/Umbraco/api/Battles/GetAllForEra/?era=1", function (retData) {
        var battles = [];
        for (var i = 0; i < retData.length; i++) {
            battles.push({
                name: retData[i].DefaultName,
                radius: 5,
                country: 'NA',
                date: retData[i].Date,
                latitude: retData[i].LocationLat,
                longitude: retData[i].LocationLong,
                summary: retData[i].Summary,
                outcomeDesc: retData[i].OutcomeDesc

            });
            victorClass = retData[i].Victor == 1 ? 'class="boerVictory"' : 'class="britVictory"';
            //$('.battles').append('<li ' + victorClass   +'><div class= "collapsible-header"><h5 class="heading">' + retData[i].DefaultName + '</h5></div><div class="collapsible-body" style=""><div class="hide job-num">0</div></div></li>');




        }
        var timelineStage1 = battles.filter(el => {
            return new Date(el.date) <= new Date('1899-12-15');
        });
        var timelineStage2 = battles.filter(el => {
            return (new Date(el.date) >= new Date('1900-01-24') && new Date(el.date) <= new Date('1900-09-01')) ;
        });
        var timelineStage3 = battles.filter(el => {
            return (new Date(el.date) >= new Date('1900-09-02') && new Date(el.date) <= new Date('1902-05-31'));
        });
        var html = template(timelineStage1);
        var html2 = template(timelineStage2);
        var html3 = template(timelineStage3);
        $('.era1').append(html);
        $('.era2').append(html2);
        $('.era3').append(html3);
        $('.era1 .entry').css('display', 'none');
        $('.era2 .entry').css('display', 'none');
        $('.era3 .entry').css('display', 'none');


        $('.era1 h2.era__title').on('click', function (e) {
            if (e.target.className !== 'entry') {
                if (!$(this).hasClass("active")) {
                    $('.era2 .entry').css('display', 'none');
                    $('.era3 .entry').css('display', 'none');
                    $('.era1 .entry').slideDown();
                    $(this).addClass("active");
                } else {
                    $('.era1 .entry').slideUp();
                    $('.era1 h2.era__title').removeClass("active");
                }
            }

        });
        $('.era2 h2.era__title').on('click', function (e) {
            if (e.target.className !== 'entry') {
                if (!$(this).hasClass("active")) {
                    $('.era1 .entry').css('display', 'none');
                    $('.era3 .entry').css('display', 'none');
                    $('.era2 .entry').slideDown();
                    $(this).addClass("active");
                } else {
                    $('.era2 .entry').slideUp();
                    $('.era2 h2.era__title').removeClass("active");
                }
            }
        });

        $('.era3 h2.era__title').on('click', function (e) {
            if (e.target.className !== 'entry') {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    $('.era1 .entry').css('display', 'none');
                    $('.era2 .entry').css('display', 'none');
                    $('.era3 .entry').slideDown();
                } else {
                    $('.era3 .entry').slideUp();
                    $('.era3 h2.era__title').removeClass("active");
                }
            }


        });



        Element.prototype.appendBefore = function (element) {
            element.parentNode.insertBefore(this, element);
        }, false;

        //draw bubbles for battles
        map.bubbles(battles)

        //d3.selectAll('.datamaps-bubble').transition().delay(1000).on('mouseover', function () { $('.overlay-info').css("z-index", 2000).delay(5000) });
        //d3.selectAll('.datamaps-bubble').transition().delay(1000).on('mouseout', function () { $('.overlay-info').css("z-index", 0).delay(5000) });
        d3.selectAll('.datamaps-bubble').on("mouseenter", function(d,i) {
        d3.select(this).transition()
            .ease("elastic")
            .duration("500")
            .attr("r", 15);
        d3.select("#clipCircle" + i + " circle").transition()
            .ease("cubic-out")
            .duration("200")
            .attr("r", 10);
        d3.select("#text" + i).transition()
            .ease("cubic-out")
            .duration("200")
            .attr("y", 12)
            .attr("font-size", 32)
            .attr("fill", "#333");
            //$('.overlay-info').css("z-index", 2000);
            //$('.overlay-info').css("opacity", 1);
            
    })
        .on("mouseleave", function (d, i) {
            d3.select(this).transition()
                .ease("quad")
                .delay("100")
                .duration("200")
                .attr("r", 5);
            d3.select("#clipCircle" + i + " circle").transition()
                .ease("quad")
                .delay("100")
                .duration("200")
                .attr("r", 0);
            d3.select("#text" + i).transition()
                .ease("cubic-out")
                .duration("400")
                .delay("100")
                .attr("y", 7)
                .attr("font-size", 20)
                .attr("fill", "#FFF");
            $('.overlay-info').css("opacity", 0);
            }).on('click', function (d) { setMapView(d);  } );

    });




}

function determineScale(el) {

    if (el.clientWidth > 1730) {
        return 4000;
    } else if (el.clientWidth >= 1520) {
        return 3500;
    } else if (el.clientWidth >= 1300) {
        return 3000;
    } else if (el.clientWidth >= 1086) {
        return 2500;
    } else if (el.clientWidth >= 870) {
        return 2000;
    } else if (el.clientWidth >= 600) {
        return 1500;
    } else if (el.clientWidth >= 430) {
        return 1000;
    } else if (el.clientWidth >= 360) {
        return 800;
    } else {
        return 500;
    }
}
function loadMiniMap(data) {
    var el = document.getElementById('map_world');
    var map = new Datamap({
        element: document.getElementById('map_world'),
        responsive: true,
        scope: 'collection',
        geographyConfig: {
            dataJson: data,
            highlightBorderColor: '#bada55',
            hideAntarctica: true,
            popupTemplate: function (geo, data) {
                return '<div class="hoverinfo">' + geo.properties.Name + '<\div>';

            }
        },
        setProjection: function (element) {
            var projection = d3.geo.orthographic()
                .rotate(globalRotation)
                .scale(globalScale)
                .translate([el.clientWidth / 2, el.clientHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);

            return { path: path, projection: projection };
        },
        fills: {
            defaultFill: "#4c4d45"
        },

    });
    map.graticule();

    globalMapWorld = map;


    d3.selectAll('#map_world.svg-container path.datamaps-subunit').style('opacity', '0.3');
    d3.selectAll('path.datamaps-subunit').each(function (d) {
        active = d3.select(null);
        //var centroid = getMyCentroid(this);
        // map.svg.selectAll(".datamaps-subunit").transition().duration(800).attr("transform", "translate(" + el.clientWidth / 2 + "," + (el.clientHeight) / 2 + ")scale(1)translate(" + -centroid[0] + "," + -centroid[1] + ")");
        switch (d.properties.NAME) {
            case 'Transvaal':
                d3.select(this).style('fill', "rgb(44, 160, 44)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(44, 160, 44)");

                });
                break;
            case 'Orange Free State':
                d3.select(this).style('fill', "rgb(252, 141, 89)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(252, 141, 89)");

                });
                break;
            case 'India':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Ceylon':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Australia':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'New Zealand':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Canada':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'British South Africa':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'United Kingdom':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Swaziland':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Basutoland':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Ireland':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            case 'Scotland':
                d3.select(this).style('fill', "rgb(214, 39, 40)").style('opacity', '1');
                d3.select(this).on("mouseover", function () {
                    d3.select(this).style("fill", "rgb(214, 39, 40))");
                });
                break;
            default:

        }
        d3.select(this).on("mouseover", function () {
            d3.select(this).style("stroke", "blue");
        });
        d3.select(this).on("mouseout", function () {
            d3.select(this).style("stroke", "white");
        });
    })
    d3.selectAll('#map_world.svg-container path.datamaps-subunit').on('click', function (d) {

    })
    function reset() {
        d3.selectAll('#map_world.svg-container path.datamaps-subunit').style('opacity', '0.3');
    }
    $('span').on('click', function () {
        var long = $(this).data('longitude');
        var lat = $(this).data('latitude');
        globalScale = $(this).data('scale');

        rotate2Destination(long, lat);

    })
    function rotate2Destination(long, lat) {
        nextRotate = [long * -1, lat * -1];
        d3.select("g")
            .transition()
            .attrTween("d", function (d) {
                var r = d3.interpolate(globalRotation, nextRotate);
                return function (t) {
                    globalRotation = r(t);
                    return redraw();
                };
            })
            .duration(2000);
    }
    function redraw() {
        redrawData = data;
        d3.select("#map_world").html('');
        loadMiniMap(redrawData);
    } // redraw
}

$(document).ready(function () {
    d3.select(window).on('resize', function () {
        globalMapZA.resize();
        //globalMapWorld.resize();
    });
    // sidebar click events


});

//call zoom func
function _handleMapReady (datamap) {
    zoom = new Zoom({
        $container: $('#map_za'),
        datamap: datamap
    });
}
// clicked on bubble map
function initmap() {
    // set up the map
    overlaymap = new L.Map('map-canvas');

    // create the tile layer with correct attribution
    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 12, attribution: osmAttrib });

    // start the map in South-East England
    overlaymap.setView(new L.LatLng(-26.195246, 28.03408), 9);
    overlaymap.addLayer(osm);
}
function setMapView(battle) {
    $('.overflow').html('<h1>'+ battle.name +'</h1><br>' + battle.summary)
    $('#sidebar').fadeOut();
    $('#container').css("visibility", "visible").fadeIn();
    var marker = L.marker([battle.latitude, battle.longitude]).addTo(overlaymap);
    overlaymap.setView(new L.LatLng(battle.latitude, battle.longitude), 9);
}

function zoomToBattle(lat, long, name) {
    d3.selectAll('.datamaps-bubble').style('fill', '#777777').style('r', '5');;
    //var zoomOpts = {
    //    scaleFactor: 1, // Zoom amount
    //    center: {
    //        lat: lat,
    //        lng: long
    //    },
    //    transition: {
    //        duration: 1000 // milliseconds
    //    },
    //    onZoomComplete: function (zoomData) {
    //        // Called after zoomto completes.  Bound to the Datamaps instance.
    //        // Passes one argument, zoomData.
    //        // zoomData = {
    //        //   translate: { x: <number>, y: <number> },
    //        //   scale: <number>
    //        // }
    //        // no-op by default
    //    }
    //};

    //// perform the zoom
    //map.zoomto(zoomOpts);

    // color focus battle
    d3.selectAll('.datamaps-bubble').each(function (d) {
        if (d.name === name) {
            d3.select(this).style('fill', '#a367e7').style('r', '20');
        }
    });
}
initmap();
function closeMapOverlay() {
    $('#container').css("visibility", "hidden").fadeOut();
    if ($(window).width() > 560) {
        $('#sidebar').fadeIn();
    }
    
}



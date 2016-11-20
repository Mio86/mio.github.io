$(document).ready(function () {
    var $form = $("form");
    var sMovie, sYear, sImdb, sUrl, allTitle, allSeasons;
    var title = $(".title");
    var page = 1;
    var globalTimeout = null;

    $(".contentSlide").hide();
    $(".contentSeason").hide();
    $("#suggest").hide();
    $("#year").hide();
    $("#imdbID").hide();
    $("#simdbID").hide();
    $(".season").hide();
    $(".totalseasons").hide();
    $(".seasonNo").hide();
    $(".episodeNo").hide();

    $form.on("keyup", function (event) {
        event.preventDefault();
            if (globalTimeout != null) {
                clearTimeout(globalTimeout);
            }
            globalTimeout = setTimeout(function() {
                globalTimeout = null;
                var tempMovie = $form.find("#title").val().trim();
        var tempYear = $form.find("#year").val();
        var tempImdb = $form.find("#imdbID").val();
        if (sMovie !== undefined && sMovie === tempMovie && sYear !== undefined && sYear === tempYear && sImdb !== undefined && sImdb ===tempImdb)
            return;
        sMovie = tempMovie;
        sYear = tempYear;
        sImdb = tempImdb;
        $(".dataTitle").html("<li style='list-style: none; padding-left: 43%'><img src='animate/loading.gif'</li>");
        $("#suggest").fadeIn();
        $(".contentSlide").hide();
        $(".totalseasons").text("");
        sUrl = "https://www.omdbapi.com/?s=" + sMovie + "*";//&y=" + sYear + "&page=" + page;
        $.getJSON(sUrl, function (json) {
            allTitle = $.map(json.Search, function (titleItem, index) {
                console.log(titleItem.Poster, titleItem.Poster == "N/A");
                if (titleItem.Poster == "N/A")
                    titleItem.Poster = "http://i.media-imdb.com/images/SFa6c7a966d6dcebed648b97af73c87f0d/nopicture/67x98/film.png";
                return "<li class='list-group-item no-gutter well'><a data-imdb='" + titleItem.imdbID + "' data-year='" + titleItem.Year + "' data-title='" + titleItem.Title + "' href='#' >" +
                    "<img style='width: 90px; height: 128px; display: inline-block' src=\"" + titleItem.Poster + "\"/>" +
                    "<span style='position: absolute; left: 100px; right: 5px; top: 0; padding-top: 20px; font-size: 15px;'>" + titleItem.Title +
                    " <span style='color: #5e5e5e; font-size: 13px'>" + "(" + titleItem.Year + ")" + "</span> " +
                    "  </span>" + "<span style='position: absolute; right: 0; bottom: 0; font-size: 12px; padding-right: 20px'>" + titleItem.Type + "</span> " + "</a></li>";
            });

                if (json.Response === "False") {
                $(".dataTitle").append("<li style='list-style: none; text-align: center'>Movie not found</li>");
                return;
            }

            $(".dataTitle").html(allTitle);

            forInfo();

        });
            }, 500);
    });

    $(".totalseasons").on("click", function () {
        var seasons = $("a:focus").attr('data-season');
        $.getJSON("https://www.omdbapi.com/?i=" + sImdb + "&Season=" + seasons , function (json) {
            allSeasons = $.map(json.Episodes, function (seasonItem, index) {
                return "<li class='list no-gutter well'><a data-imdb='" + seasonItem.imdbID + "' data-year='" + seasonItem.Released + "' data-title='" + seasonItem.Title + "' href='#' >" +
                    "<p style='padding-left: 7px; font-size: 15px; color: #5e5e5e; display: inline-block; margin-bottom: 3px; margin-top: 5px" +
                    "'><b>Episode: </b></p>"+"<p style='color: #66afe9; font-size: 15px; padding-left: 7px; display: inline-block; margin-bottom: 3px; margin-top: 5px'>" + seasonItem.Episode + "</p>" +
                    "<p style=' padding-left: 7px; padding-top: 0; font-size: 15px; color: #66afe9; margin-bottom: 5px'>" + seasonItem.Title + " " +
                    " <span style='display: inline-block; font-size: 12px; color: #5e5e5e'>" + "(" + seasonItem.Released + ")" + "</span></p></a></li>";
            });

            $(".contentSeason").show();
            $(".linkSeason").text(seasons);
            $(".dataSeasons").html(allSeasons);

            $(".list a").on("click", function (event) {
                $("#imdbID").val($(this).data('imdb'));
                $form.submit();
                $(".fullPlot").show(0);
                $(".fPlot").hide(0);
                $(".sPlot").show(0);
            });

            $(".list").hover(
                function() {
                    $(this).css('background-color', '#ffffff')
                }, function() {
                    $(this).css('background-color', '')
                });

            $form.on("keyup", function () {
                $(".contentSeason").hide(0);
                $(".contentSlide").hide(0);
                $(".dataSeasons").html("");
            });

            $("#episodeList").on("click", function () {
                $(".contentSeason").hide();
            });
        })
    });

    $(".forScroll").on("scroll", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var forScroll = $('.forScroll')[0];
        // detect end of scroll;
        console.log(forScroll.offsetHeight , forScroll.scrollTop, forScroll.scrollHeight);
        if(forScroll.offsetHeight + forScroll.scrollTop < forScroll.scrollHeight - 50)
            return;
        page++;
        sUrl = "https://www.omdbapi.com/?s=" + sMovie + "*&y=" + sYear + "&page=" + page;
        $.getJSON(sUrl, function (json) {
            allTitle = $.map(json.Search, function (titleItem, index) {
                console.log(titleItem.Poster, titleItem.Poster == "N/A");
                if (titleItem.Poster == "N/A")
                    titleItem.Poster = "http://i.media-imdb.com/images/SFa6c7a966d6dcebed648b97af73c87f0d/nopicture/67x98/film.png";
                return "<li class='list-group-item no-gutter well'><a data-imdb='" + titleItem.imdbID + "' data-year='" + titleItem.Year + "' data-title='" + titleItem.Title + "' href='#' >" +
                    "<img style='width: 90px; height: 128px; display: inline-block' src=\"" + titleItem.Poster + "\"/>" +
                    "<span style='position: absolute; left: 100px; top: 0; padding-top: 20px; font-size: 15px;'>" + titleItem.Title +
                    " <span style='color: #5e5e5e; font-size: 13px'>" + "(" + titleItem.Year + ")" + "</span> " +
                    "  </span>" + "<span style='position: absolute; right: 0; bottom: 0; font-size: 12px; padding-right: 20px'>" + titleItem.Type + "</span> " + "</a></li>";
            });

            $(".dataTitle").append(allTitle);

            if (json.Response === "False") {
                $(".dataTitle").append(json.Error);
            }

            forInfo();
        })
    });

    function forInfo(){

        $(".list-group-item a").on("click", function () {
            $("#imdbID").val($(this).data('imdb'));
            $("#year").val($(this).data('year'));
            $("#simdbID").val($(this).data('imdb'));
            $form.submit();
            $("#suggest").hide(0);
            $("#year").val("");
            $(".totalseasons").text("");
            $(".seasonNo").hide(0);
            $(".episodeNo").hide(0);
            $(".contentSlide").delay(1000).show(0);
        });

        $(".list-group-item img").hover(
            function(){
                $(this).stop().animate({opacity:'0.5'},'slow')
            },
            function(){
                $(this).stop().animate({opacity:'1'},'slow')
            });

        $(".list-group-item").hover(
            function() {
                $(this).css('background-color', '#ffffff')
            }, function() {
                $(this).css('background-color', '')
            });

        $("#backInfo").on("click", function () {
            $.getJSON("https://www.omdbapi.com/?i="+ sImdb + "&y=" + sYear + "&plot=",
                function (json) {
                    if (json.Type == "episode"){
                       $(".totalseasons").html("");
                        $(".seasonNo").hide(0);
                        $(".episodeNo").hide(0);
                        $("#imdbID").val($("#simdbID").val());
                        $(".contentSlide").show(0);
                        $("#suggest").hide(0);
                        $form.submit();
                        $(".fullPlot").show(0);
                        $(".fPlot").hide(0);
                        $(".sPlot").show(0);
                    }else{
                        $(".contentSlide").hide(0);
                        $("#title").val(sMovie).submit();
                        $(".contentSeason").hide(0);
                        $(".seasonNo").hide(0);
                        $(".episodeNo").hide(0);
                        $(".fullPlot").show(0);
                        $(".fPlot").hide(0);
                        $(".sPlot").show(0);
                        $("#suggest").show(0);
                    }
                })
        });

        $form.on("keyup", function (event) {
            if ($("#title").val() == "") {
                $(".dataTitle").html("");
                $("#suggest").fadeOut();
            }
        })
    }

    $form.on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        sMovie = $form.find("#title").val();
        sYear = $form.find("#year").val();
        sImdb = $form.find("#imdbID").val();
        $.getJSON("https://www.omdbapi.com/?i="+ sImdb + "&y=" + sYear + "&plot=",
            function (json) {
                if (json.Rated == "N/A") {
                    json.Rated = "";
                }
                if (json.Type == "series"){
                    $(".season").show();
                    $(".totalseasons").show();

                }else {
                    $(".season").hide();
                    $(".totalseasons").hide();
                }
                if ($(".totalseasons a").length == json.totalSeasons){
                    return false;
                }else {
                    var countSeason = 1;
                    for (var season = json.totalSeasons; countSeason <= season; season--){
                        $(".totalseasons").append(" " + "<a data-season='" + season + "' href='#' style='margin-left: 4px; font-size: 13px'>" + season + "</a>");
                    }
                }

                title.html(json.Title + " " +"<p style='display: inline; font-size: 25px; color: #adadad'>"+ "(" + json.Year + ")" +"</p>");
                $(".info").text(json.Rated + " | " + json.Runtime + " | " + json.Genre + " | " + json.Language + " | " + json.Released + " " + "(" + json.Country + ")");
                $(".modTitle").html("<h3 style='display: inline'>" + json.Title + " " + "(" + json.Year + ")" + "</h3>");
                $(".director").text(json.Director);
                $(".writer").text(json.Writer);
                $(".actors").text(json.Actors);
                $(".sPlot").text(json.Plot);
                $(".language").text(json.Language);
                $(".awards").text(json.Awards);
                if (json.Type == "episode"){
                    $(".poster").html("<img src=" + json.Poster + "/>");
                    $(".seasonNo").show();
                    $(".seasonIn").text(json.Season);
                    $(".episodeNo").show();
                    $(".episodeIn").text(json.Episode);
                }else{
                    $(".poster").html("<img style='width: 182px; height: 268px' src=" + json.Poster + "/>");
                }
                if (json.Type == "series"){
                    $(".seasonNo").hide();
                    $(".episodeNo").hide();
                }
                $(".metascore").text(json.Metascore);
                $(".imdbrating").text(json.imdbRating);
                $(".imdbvotes").text(json.imdbVotes);
            });

        $.getJSON("https://www.omdbapi.com/?i=" + sImdb + "&y=" + sYear + "&plot=full",
            function (json) {
                $(".lessPlot").hide();
                $(".fullPlot").on("click", function () {
                    $(".sPlot").hide();
                    $(".fPlot").text(json.Plot);
                    $(".fullPlot").hide();
                    $(".lessPlot").show();
                    $(".fPlot").show();
                });
                $(".lessPlot").on("click", function () {
                    $(".fPlot").hide();
                    $(".fullPlot").show();
                    $(".lessPlot").hide();
                    $(".sPlot").show();
                });
            });
    });
});

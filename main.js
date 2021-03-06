// Milestone 1:
// Creare un layout base con una searchbar (una input e un button)
// in cui possiamoscrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando ilbottone, cercare sull’API tutti i film che contengono ciò
// che ha scritto l’utente.Vogliamo dopo la risposta dell’API visualizzare a schermo
// i seguenti valori per ognifilm trovato:
// 1.Titolo
// 2.Titolo Originale
// 3.Lingua
// 4.Voto

//https://api.themoviedb.org/3
///search/movie
//api_key=d12ae54df472b7dfaec7f47b6ee5fdd3
//query=nomefilm

$(document).ready(function(){

    $('#prec').hide();

    $('.card__container').animate({scrollLeft: 0});

    $('#prec').click(function(){
      $('.card__container').animate({scrollLeft: '-=1400'}, 800);
      $('#next').show();
      if ($('.card__container').first('.card__movie').scrollLeft() <= 1400) {
        $('#prec').hide();
      }
    })

    $('#next').click(function(){
      $('.card__container').animate({scrollLeft: '+=1400'}, 800);
      $('#prec').show();
      if ($('.card__container').last('.card__movie').scrollLeft()) {
        $('#next').hide();
      }

    })

  api_movie_or_tv_show('superman');

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  //aggiungo alert di benvenuto
  Swal.fire({
    title: 'Benvenuto su BOOLFLIX',
    text: 'clicca sull\'icona in alto a destra per carcare un film',
    animation: true,
    customClass: {
      popup: 'animated tada'
    }
  })

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  //nascondo search-bar
  $('#search').hide();

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  //al click sull'icona visualizzo la search-bar
  $('.fa-search').click(function(){
    $('#search').fadeIn(500);
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  //intercetto il tasto invio
  $('#search').keyup(function(event){

    //salvo la ricerca utente in una variabile
    var movie_utente = $('#search').val();
    //console.log(movie_utente);

    //intercetto il tasto invio
    if (event.which == 13) {

      //pulisco la ricerca ad ogni invio
      $('#search').val(' ');

      //svuoto il contenitore per la nuova ricerca
      $('.card__container').empty();

      /////////////////////////////////////////////////////////////////////////////////////////////////////

      api_movie_or_tv_show(movie_utente);

    }

  })

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  function api_movie_or_tv_show(movie_utente){
    //salvo url base per i film dentro a una variabile
    var url_base_movie_multi = "https://api.themoviedb.org/3/search/multi";

    //chiamata ajax
    $.ajax({
      url: url_base_movie_multi,
      method: 'GET',
      data: {
        'api_key': 'd12ae54df472b7dfaec7f47b6ee5fdd3',
        'query': movie_utente,
        'language': 'it-IT'
      },
      success: function(risposta){
        //console.log(risposta.results);

        //metto dentro a una variabile il contenuto della risposta
        var contenuto = risposta.results;
        //console.log(contenuto);

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        //controllo se il film inserito non è presente
        if (contenuto.length == 0) { //<-- controllo su array vuoto
          Swal.fire({
            title: 'Movie or Tv show not find',
            // text: 'choose another one',
            type: 'error',
            confirmButtonText: 'ok'
          })

          api_movie_or_tv_show('superman');

        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        //eseguo ciclo per scorrere le proprieta
        for (var i = 0; i < contenuto.length; i++) {

          var genere_id = contenuto[i].genre_ids;
          //console.log(genere_id);

          //ciclo i generi dei film
          for (var d = 0; d < genere_id.length; d++) {
            //console.log(genere_id[d]);
            var id_movie = genere_id[d];
            //console.log(id_movie);

            /////////////////////////////////////////////////////7

            $.ajax({
              url: "https://api.themoviedb.org/3/genre/movie/list",
              method: 'GET',
              data: {
                'language': 'it-IT',
                'api_key': 'd12ae54df472b7dfaec7f47b6ee5fdd3',
              },
              success: function(risposta){
                //console.log(risposta);
                var genres = risposta.genres;
                //console.log(genres);
                //
                // for (var z = 0; z < 16; z++) {
                //   //console.log('movie id: ' + genres[z].id);
                //   var id_gen_mov = genres[z].id;
                //   //console.log(id_gen_mov);
                //   if (id_gen_mov == id_movie) {
                //     console.log('trovato: ' + genres[z].name);
                //   }
                // }

                $.ajax({
                  url: "https://api.themoviedb.org/3/genre/tv/list",
                  method: 'GET',
                  data: {
                    'language': 'it-IT',
                    'api_key': 'd12ae54df472b7dfaec7f47b6ee5fdd3',
                  },
                  success: function(risposta){
                    //console.log(risposta);
                    var genres = risposta.genres;
                    //console.log(genres);

                    // for (var x = 0; x < 16; x++) {
                    //   //console.log('serie tv id: ' + genres[x].id);
                    //   var id_gen_tv = genres[x].id;
                    //   //console.log(id_gen_tv);
                    //   if (id_gen_tv == id_movie) {
                    //     console.log('trovato: ' + genres[x].name);
                    //   }
                    // }

                  }, error: function(richiesta, stato, errori){
                    console.log(errori);

                  }
                });

              }, error: function(richiesta, stato, errori){
                console.log(errori);

              }
            });


          }


          //locandina
          var img = contenuto[i].poster_path;

          var loc = "https://image.tmdb.org/t/p/w342"+img;
          //console.log(loc);

          if (img == null) {
            loc = "https://www.macys.com/navapp/web20/assets/img/pdp/productNotAvailable_PDP.png?op_sharpen=1"
          }

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //id film per cast
          var id = contenuto[i].id;
          //console.log(id);

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //aggiungo le serie tv alla ricerca
          if (contenuto[i].media_type == "tv") {
            var tipo = contenuto[i].original_name;
            var nome = contenuto[i].name;
            var formato = 'TV series';
          }else{
            var tipo = contenuto[i].original_title;
            var nome = contenuto[i].title;
            var formato = 'Movie';
          }

          //metto la lingua all'interno di una variabile
          var lingua = contenuto[i].original_language;
          //console.log(lingua);

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //fix name flag
          if (lingua == 'en') {
            lingua = 'us';
            //console.log(lingua);
          } else if (lingua == 'ja') {
            lingua = 'jp';
          }

          //console.log(lingua);

          var flg = "https://www.countryflags.io/"+lingua+"/shiny/24.png";
          //console.log(flg);

          if (flg == null) {
            flag = lingua;
            //console.log(flag);
          }

          var trama = contenuto[i].overview;
          //console.log(trama);

          if (trama == '') {
            trama = 'n/a';
          }

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //popolo l'oggetto con le informazioni ottenute
          var movie = {
            dato1: nome,
            // dato2: tipo,
            dato3: flg,
            dato4: i,
            dato5: trama,
            dato6: formato,
            dato7: loc,
          }

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          // typeof <-- specifica il tipo -- si usa con spazio

          //salvo la valutazione del film e la arrotondo per eccesso dividendola per 2
          var star = parseFloat(contenuto[i].vote_average).toFixed()/2;
          //console.log(typeof star);

          //limito la valutazione a 5
          if (star > 5) {
            star = 5;
          }

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //console.log(star);
          var card__template = $('#card__template').html();
          var template__function = Handlebars.compile(card__template);
          var html = template__function(movie);

          //appendo la card del film
          $('.card__container').append(html);

          recupera_cast(i, id);

          //appendo le stelle
          for (var s = 0; s < 5; s++) {
            if (s < star) {
              $('.card__movie[data-id="'+i+'"]').find('.stars').append('<i class="fas fa-star"></i>');
            }else{
              $('.card__movie[data-id="'+i+'"]').find('.stars').append('<i class="far fa-star"></i>');
            }
          }

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          $('.info').hide();

          $('.card__movie').click(function(){
            $(this).find('.poster_path').fadeOut(function(){
              $(this).siblings('.info').fadeIn();
              $(this).parent('.card__movie').addClass('scrool');
            });
          })

          $('.card__movie').mouseleave(function(){
              $(this).find('.info').fadeOut(function(){
                $(this).siblings('.poster_path').fadeIn();
                $(this).parent('.card__movie').removeClass('scrool');
              })
            })
        }

      }, error: function(richiesta, stato, errori){
        console.log(errori);

      }

    });
  }

  function recupera_cast(i, id){
    //chiamata per cast
    $.ajax({
      url: "https://api.themoviedb.org/3/movie/"+id+"/credits",
      method: 'GET',
      data: {
        movie_id: id,
        api_key: "d12ae54df472b7dfaec7f47b6ee5fdd3",
      },
      success: function(risposta){
        //console.log(risposta.cast);
        var cast = risposta.cast;
        //console.log(cast);

        for (var t = 0; t < 5 && t < cast.length; t++) { //<-- condizioni sempre in mezzo
          var attori = cast[t].name;
          //console.log(attori);
          $('.card__movie[data-id="'+i+'"]').find('.actors').append(attori + '<br>');
          //console.log($('.card__movie[data-id="'+i+'"]'));

        }

      }, error: function(richiesta, stato, errori){
        console.log(errori);
        attori = 'n/a';
        $('.card__movie[data-id="'+i+'"]').find('.actors').append(attori);
      }

    });
  }

});

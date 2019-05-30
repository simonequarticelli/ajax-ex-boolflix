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

  //salvo url base per i film dentro a una variabile
  var url_base_movie = "https://api.themoviedb.org/3/search/multi";

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
    //chiamata ajax
    $.ajax({
      url: url_base_movie,
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
        console.log(contenuto);

        //controllo se il film inserito è presente
        if (contenuto == '') {
          Swal.fire({
            title: 'Movie not find',
            // text: 'choose another one',
            type: 'error',
            confirmButtonText: 'ok'
          })
        }

        //eseguo ciclo per scorrere le proprieta
        for (var i = 0; i < contenuto.length; i++) {

          //locandina
          var img = contenuto[i].poster_path;

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

          var id = i;
          //console.log(id);

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


              for (var a = 0; a < 5 && a < cast.length; a++) { //<-- condizioni sempre in mezzo
                var attori = cast[a].name;
                //console.log(attori);
                $('.card__movie[data-id="'+i+'"]').find('.actors').append(attori + '<br>');
                console.log($('.card__movie[data-id="'+i+'"]'));
              }


            }, error: function(richiesta, stato, errori){
              console.log(errori);
            }
          });

          /////////////////////////////////////////////////////////////////////////////////////////////////////

          //popolo l'oggetto con le informazioni ottenute
          var movie = {
            dato1: nome,
            // dato2: tipo,
            dato3: lingua,
            dato4: id,
            dato5: contenuto[i].overview,
            dato6: formato,
            dato7: img,
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


          $('.card__movie').mouseenter(function(){
            $(this).find('.poster_path').fadeOut(1000, function(){
              $(this).parent('.card__movie').addClass('scrool');
              $(this).siblings('.info').fadeIn();
            });


          }).mouseleave(function(){
            $(this).find('.info').fadeOut(1000, function(){
              $(this).parent('.card__movie').removeClass('scrool');
              $(this).siblings('.poster_path').fadeIn();
            })
          })

        }

      }, error: function(richiesta, stato, errori){
        console.log(errori);
      }

    });

  }

})


});

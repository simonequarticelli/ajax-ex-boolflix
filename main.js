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

    //aggiungo alert di benvenuto
    Swal.fire({
    title: 'Benvenuto su BOOLFLIX',
    text: 'clicca sull\'icona in alto a destra per carcare un film',
    animation: true,
    customClass: {
      popup: 'animated tada'
    }
  })

  //nascondo search-bar
  $('#search').hide();

  //al click sull'icona visualizzo la search-bar
  $('.fa-search').click(function(){
    $('#search').fadeIn(500);
  });

  //salvo url base per i film dentro a una variabile
  var url_base_movie = "https://api.themoviedb.org/3/search/movie";

  //intercetto il tasto invio
  $('#search').keypress(function(event){

  //salvo la ricerca utente in una variabile
  var movie_utente = $('#search').val();
  console.log(movie_utente);

  //intercetto il tasto invio
  if (event.which == 13) {

    //svuoto il contenitore per la nuova ricerca
    $('.card__container').empty();

    //creo chiamata ajax
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

        //eseguo ciclo per scorrere le proprieta
        for (var i = 0; i < contenuto.length; i++) {

          //popolo l'oggetto con le informazioni ottenute
          var movie = {
            dato1: contenuto[i].title,
            dato2: contenuto[i].original_title,
            dato3: contenuto[i].original_language,
            dato4: contenuto[i].vote_average,
            // dato5: contenuto[i].overview,
          }

          var card__template = $('#card__template').html();

          var template__function = Handlebars.compile(card__template);

          var html = template__function(movie);

          //appendo la card del film
          $('.card__container').append(html);
        }

      }, error: function(richiesta, stato, errori){
        console.log(errori);
      }

    });

  }



})














});

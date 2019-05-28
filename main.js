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
  var url_base_movie = "https://api.themoviedb.org/3/search/multi";

  //intercetto il tasto invio
  $('#search').keyup(function(event){

  //salvo la ricerca utente in una variabile
  var movie_utente = $('#search').val();
  //console.log(movie_utente);

  //intercetto il tasto invio
  if (event.which == 13) {

    //svuoto il contenitore per la nuova ricerca
    $('.card__container').empty();

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

        //eseguo ciclo per scorrere le proprieta
        for (var i = 0; i < contenuto.length; i++) {

          // var img = contenuto[i].backdrop_path;
          // console.log(img);
          //
          // //https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg
          // var url_base_img = "https://image.tmdb.org/t/p/w185";
          //
          // $.ajax({
          //   url: url_base_img,
          //   method: 'GET',
          //   data: {
          //     img: img,
          //   },
          //   success: function(risposta){
          //     console.log(risposta.results);
          //
          //
          //
          //
          //
          //   }, error: function(richiesta, stato, errori){
          //     console.log(errori);
          //   }
          // });

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

          //https://www.countryflags.io/MY/flat/64.png
          // switch (lingua) {
          //   case 'en':
          //     lingua = 'us';
          //     break;
          //   case 'ja':
          //     lingua = 'jp'
          //     break;
          //   default:
          // }

          if (lingua == 'en') {
            lingua = 'us';
            //console.log(lingua);
          } else if (lingua == 'ja') {
            lingua = 'jp';
          } else {
            lingua;
          }

          var id = i;
          //console.log(id);

          //popolo l'oggetto con le informazioni ottenute
          var movie = {
            dato1: nome,
            dato2: tipo,
            dato3: lingua,
            dato4: id,
            // dato5: contenuto[i].overview,
            dato6: formato,
          }

          // typeof <-- specifica il tipo -- si usa con spazio

          //salvo la valutazione del film e la arrotondo per eccesso
          var star = parseFloat(contenuto[i].vote_average).toFixed();
          //console.log(typeof star);

          //limito la valutazione a 5
          if (star > 5) {
            star = 5;
          }

          //console.log(star);
          var card__template = $('#card__template').html();
          var template__function = Handlebars.compile(card__template);
          var html = template__function(movie);

          //appendo la card del film
          $('.card__container').append(html);

          //appendo le stelle alle card
          for (var j = 0; j < star; j++) {
            //console.log(star);
            $('.stars').closest('.card__movie[data-id="'+i+'"]').append('<i class="fas fa-star"></i>');
          }
        }

      }, error: function(richiesta, stato, errori){
        console.log(errori);
      }

    });

  }




})














});

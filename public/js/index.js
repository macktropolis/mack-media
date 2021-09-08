/* 
// Create a new div to display alt text as caption
$('img').each(function() {
  var data = $(this).attr('alt');
  $(this)
    .wrap("<div class='new'></div>")
    .parent('.new')
    .attr('data-alt', data)
  ;
});
*/
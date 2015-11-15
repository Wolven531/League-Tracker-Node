jQuery(document).ready(function($) {
  $('#btn_add_user').on('click', function(evt) {
    var input = $('#league_name').val();
    evt.preventDefault();
    var matches = $('#current-users td.username').filter(function(ind, elem) {
      return $(elem).text().toLowerCase() === input.toLowerCase();
    });
    if(matches.length > 0) {
      alert('That user is already stored.');
    } else {
      $('#form_add_user').submit();
    }
  });
});
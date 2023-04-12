  function geteHealth(){
    var data = {
        resource_id: 'bacaa1aa-5415-4ffa-afa8-f8717981cfbe', // the resource id
        limit: 5, // get 5 results
        q: 'jones' // query for 'jones'
      };
      $.ajax({
        url: 'https://data.ehealthireland.ie/api/3/action/datastore_search?resource_id=bacaa1aa-5415-4ffa-afa8-f8717981cfbe&limit=5',
        data: data,
        dataType: 'jsonp',
        success: function(data) {
          alert('Total results found: ' + data.result.total)
        }
      });
  }
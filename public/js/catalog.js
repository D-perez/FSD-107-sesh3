
var serverURL = 'http://localhost:8080/API/';
var items = [];

function fetchCatalog() {
    // get items from server
    $.ajax({
        url: serverURL+"items/daniel", //last dir sorts by user. remove username to display all
        type: "GET",
        success: (res) => {
            console.log('Get works',res);
            // this will travel the array that the server sends back
            for(var i = 0; i < res.length; i++) {
                var item = res[i];
                drawItem(item); // send each item to draw on the HTML
                items.push(item) //trying to add to items to restore search
            }
            
        },
        error: (details) => {
            console.log('Get error',details);
        }
    });
}

function drawItem(product) {
    var layout = `
    <div id="${product.code}" class="${product.category} card text-center">
        <div class="card-header">
            <h2><b>${product.title}</b></h2>
        </div>
        <div class="card-body">
            <h3 class="card-title">$${product.price}</h3>
            <img src="${product.image}" alt="">
            <p class="card-text">${product.description}</p>
            <button class="green btn btn-outline-info btn-block">Add to cart</button>
        </div>
        <div class="card-footer text-muted">
            Category - <b>${product.category}</b>
        </div>
    </div>
    `;

    $('#catalog').append(layout); 
}

function Search() {
    console.log('searched function activated')
    var searchText = $('#txt-search').val();

    $('#catalog').html('');

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.title.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText) || item.category.toLowerCase().includes(searchText) || item.price.toString().includes(searchText) || item.code.toString().includes(searchText)){
            drawItem(item);
        } 
    } 
}

function init() {

    console.log(' loaded');
    fetchCatalog();
    
    $('#btn-search').click(Search);

    // $('#txt-search').change(() => {
    //     var searchText = $('#txt-search').val();
    //                                                // dont know why but causes double print
    //     for ( var i = 0; i < items.length; i++) {
    //         if(searchText == '') {
    //             $('#catalog').html('')
    //             drawItem(items[i]);
    //         }
    //     }
    // });

    $('#txt-search').keypress((e) => {
        console.log(e);
        if(e.keyCode == 13){
            Search();
        }
    });

}



window.onload = init;
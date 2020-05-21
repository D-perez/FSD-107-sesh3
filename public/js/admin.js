var serverURL = 'http://localhost:8080/API/';
let items = [];

class Item {
    constructor(code,title,price,description,category,image) {
        this.code = code;
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = category;
        this.image = image;
        this.user = 'daniel';
    }
}

function register() {
    
    // save input values in variables
    var code = $('#code').val();
    var title = $('#title').val();
    var price = $('#price').val();
    var desc = $('#description').val();
    var category = $('#category').val();
    var image = $('#image').val();

    if (code!='' && title != '' && price !='' && category != ''){
        // create the object (using the constructor)
        var newItem = new Item(code,title,price,desc,category,image);
        // push the item to array
        items.push(newItem);

        var jsonString = JSON.stringify(newItem);

        // display on the console
        console.log(jsonString);
        console.log(newItem);
        console.log(items);
    }
    
    $.ajax({
        url:serverURL+'items',
        type:'POST',
        contentType:'application/json',
        data:jsonString,
        success: function(response){
            console.log('It Works',response);
            // show notification
            $('#success').removeClass('hidden');
            // hide notification
            setTimeout(function(){
                $('#success').addClass('hidden');
            },5000);
        },
        error: function(errorDetails) {
            console.log('Something went wrong....', errorDetails);
            $('#error').show();
            $('#error').hide(5000);
        }
    });


    $('#code').val('');
    $('#title').val('');
    $('#price').val('');
    $('#description').val('');
    $('#category').val('');
    $('#image').val('');

}

function init() {
    console.log('Admin Loaded');

    $('#btn-register').on('click',function(){
        register();
    });
}

window.onload = init;
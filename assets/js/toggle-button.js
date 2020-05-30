{
    let toggleFriend=function(toggleButton){
        console.log(toggleButton);
        console.log($(toggleButton));

        $(toggleButton).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'Post',
                url:$(toggleButton).attr('href'),
                success:function(data){
                  
                    console.log(data);
                    if(data.data.userSelected==false){
                        $(toggleButton).html('Friend is removed')
                    }else{
                        $(toggleButton).html('Friend is added')
                    }
                    
                },error:function(err){
                    console.log('Error',err.responseText);
                }
            })
        })
    }
    toggleFriend($('.toggle-button'));
}
// create a class to toggle likes when a link is clicked, using AJAX

class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self=this;
            
            $.ajax({
                type:'POST',
                url:$(self).attr('href'),
                success:function(data){
                    let likesCount=parseInt($(self).attr('data-likes'));
                    console.log(likesCount);
                    console.log(data);
                    if(data.data.deleted===true){
                        likesCount=likesCount-1;
                    }else{
                        likesCount=likesCount+1;
                    }
                    $(self).attr('data-likes',likesCount);
                    $(self).html(`${likesCount} Likes`);
                },error:function(err){
                    console.log('Error in completing request',err);
                }
            })
        })
    }
}
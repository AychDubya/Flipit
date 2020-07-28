$(function(){
    $(".save-card").click(function(event){
        let id = $(this).data("id");
        let editCard = $(this).data("editcard");
        
        let newCardAdd ={
            addCard: editCard
        };
        
        // Send the PUT request.
        $.ajax("/api/new_card" + id, {
            type: "PUT",
            data: newCardAdd
        }).then(
            function() {
                // / Reload the page to get the updated list
                location.reload();
            }
        );
    });

   

   $(".delete-card").click(function(event) {
       let id =$(this).data("id");
        console.log(id)

    //SEND DELETE REQUEST
    $.ajax("api/new_card" + id, { 
        type:"DELETE"
    }).then(
        function() {
            console.log("deleted card", id);
            location.reload()
        }
     );
   });
});
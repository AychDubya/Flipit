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

    // $(".save-card").on("submit", function(event) {
    //     // Make sure to preventDefault on a submit event.
    //     event.preventDefault();
    
    //     var newCard = {
    //       name: $("").val().trim(),
    //       addCard: $("").val().trim()
    //     };
    //     // Send the POST request.
    //     $.ajax("/api/new_card", {
    //         type: "POST",
    //         data: newCard
    //       }).then(
    //         function() {
    //           console.log("created new card");
    //           // Reload the page to get the updated list
    //           location.reload();
    //         }
    //       );
    //     });

});
$(function(){
    $(".save-card").click(function(event){
        let id = $(this).data("id");
        
        let question = $(`#card-${id} .question-edit`).val();
        let answer = $(`#card-${id} .answer-edit`).val();


        let editedCard ={
            question: question,
            answer: answer,
        };
        
        // Send the PUT request.
        $.ajax("/api/update_card/" + id, {
            type: "PUT",
            data: editedCard
        }).then(
            function() {
                // / Reload the page to get the updated list
                location.reload();
            }
        );
    });

    $(".edit-card").click(function(event) {
        let id = $(this).data("id");

        $(`#card-${id} .save-card`).prop('disabled', function(index, value) { 
            return !value; 
        });
        $(`#card-${id} .question-display`).toggle();
        $(`#card-${id} .question-edit`).toggle();
        $(`#card-${id} .answer-display`).toggle();
        $(`#card-${id} .answer-edit`).toggle();
    })
});
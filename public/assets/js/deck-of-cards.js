$(function () {
    $(".save-newcard").click(function(event){
        let question = $("#newquestion").val();
        let answer = $("#newanswer").val();

        $.ajax("/api/new_card", {
            method:"POST",
            data:{
                question: question,
                answer: answer,
                DeckId:$(this).attr("data-id")
            }

        }).then(
            function () {
                // Reload the page to get the updated list
                location.reload();
            }
        );
    })

    $(".edit-newcard").click(function(event){
        $(`.save-newcard`).prop('disabled', function (index, value) {
            return !value;
        });
        $(`#new-card .question-edit`).toggle();
        $(`#new-card .answer-edit`).toggle();
    })


    $(".save-card").click(function (event) {
        let id = $(this).data("id");
        console.log("waz happnin");
        let question = $(`#card-${id} .question-edit`).val();
        let answer = $(`#card-${id} .answer-edit`).val();
        console.log(question, answer);


        let editedCard = {
            question: question,
            answer: answer,
        };

        // Send the PUT request.
        $.ajax("/api/update_card/" + id, {
            type: "PUT",
            data: editedCard
        }).then(
            function () {
                // Reload the page to get the updated list
                location.reload();
            }
        );
    });
    // edit cards from deck
    $(".edit-card").click(function (event) {
        let id = $(this).data("id");

        $(`#card-${id} .save-card`).prop('disabled', function (index, value) {
            return !value;
        });
        $(`#card-${id} .question-display`).toggle();
        $(`#card-${id} .question-edit`).toggle();
        $(`#card-${id} .answer-display`).toggle();
        $(`#card-${id} .answer-edit`).toggle();
    })

    // delete cards from deck
    $(".delete-card").click(function (event) {
        let id = $(this).data("id");

        $.ajax({
            url:"/api/delete_card/" + id,
            method: "DELETE",
        }).done(function(data){
            console.log(data);
            location.reload()
        }).fail(function(err) {
            console.log(err);
            location.reload();
        });
    });

    $(".delete-deckPg-btn").click(function(event) {
        event.preventDefault();
        const confirmed = confirm("Delete this deck and all its cards?");
        if (confirmed) {
            let id = $(this).data("id");
            $.ajax({
                url: `/api/delete_deck`,
                method: "DELETE",
                data: { id }
            })
            console.log("deleted deck");
            location.href = "/profile";
        } else {
            console.log("cancelled");
        }
    })
});
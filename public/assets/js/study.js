$(".studycard").flip();

    let cardData = location.href.split("/");
    let deckIndx = cardData[cardData.length - 1];
    let counter = 0
    
if (cardData[cardData.length - 2] === "study") {
    
    $.get("/api/deck/" + deckIndx).then(function (data){

        $("#question").text(data[0].question)
        $("#answer").text(data[0].answer)
    
        $("#next").click(function(event){
            counter++
            $("#question").text(data[counter].question)
            $("#answer").text(data[counter].answer)
        })
    
        $("#previous").click(function(event){
            counter--
            $("#question").text(data[counter].question)
            $("#answer").text(data[counter].answer)
        })
    })
}

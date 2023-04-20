/// <reference types="jquery" />
window.onresize = () => {
  setTimeout(() => {
    drawCircle();
    console.log("canvas refreshed!");
  }, 100);
};



var gridSpacing = 100;
var gridRadius = 2;

class Card {
  constructor() {
    const container = (this.container = $("<div id='card-container'></div>"));
    const head = (this.head = $("<div id='card-head'></div>"));

    /* Title Component */
    const titleContainer = (this.titlecontainer = $(
      '<div id="card-title-container"></div'
    ));
    const title = (this.title = $(`<h2 id='card-title' maxlength='14'>`));
    const titleInput = (this.titleInput = $(
      "<input id='card-title-input' placeholder='Enter Title Here' contenteditable='true'></input>"
    ));
    const content = (this.content = $("<div id='card-content'></div>"));

    /* Task Component */
    const taskContainer = (this.taskContainer = $(
      "<div id='card-task-container'></div>"
    ));
    const taskInput = (this.input = $(
      "<input id='card-input' placeholder='Enter Task'></input>"
    ));
    const taskRemove = (this.taskRemove = $(
      "<button id='remove-task'>-</button>"
    ));

    /* Add the elements to the object */
    container.appendTo("body");
    head.appendTo(container);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    content.appendTo(container);
    taskContainer.appendTo(content);
    taskInput.appendTo(content);

    /* Assign title input value */
    titleInput.on("keypress", (e) => {
      if (e.key === "Enter") {
        /* Title */
        if (titleInput.val() != "" && container.has("h2").length === 0) {
          $(this.head).append(this.title);
          this.title.text(this.titleInput.val());
        } else if (container.has("h2").length > 0) {
          /* Edit already existing title value */
          title.text(titleInput.val());
        }

        titleInput.hide();
        title.show();
        head.show();
      }
    });

    /* Task List & Task Input */
    let maxTasks = 5;
    let tasks = 0;
    taskInput.on("keypress", (e) => {
      if (e.key === "Enter") {
        if (this.input.val() != "") {
          tasks++;
          this.taskItem = $(
            `<ul><li id="task-item">${taskInput.val()}</li></ul>`
          ).appendTo(this.taskContainer);
          
          taskInput.blur();
          taskInput.val("");
        }
     
        if (tasks >= maxTasks) {
          this.input.blur();
          this.input.hide();
          return;
        }
      }
    });


    /* Toggle head input and edit button visibility */
    title.on("click", () => {
      titleInput.show();
      titleInput.focus();
      title.hide();
    });

    container.css("scale: 1");
  }
}

function CreateCard() {
  
  let card = new Card();
  $(card.container).appendTo($("body"));
  $(card.container).css("transform", "scale(0)");
  setTimeout(() => {
    $(card.container).css("transform", "scale(1)", 500);
  });
}


function drawCircle() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let x = 0;
  let y = 0;

  for (x = 0; x < canvas.width; x += gridSpacing) {
    for (y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.fillStyle = "";
      ctx.arc(x, y, gridRadius, 0, 100);
      ctx.fill();
      ctx.closePath();
    }
  }
}


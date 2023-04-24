/// <reference types="jquery" />
window.onresize = () => {
  setTimeout(() => {
    drawCircle();
    console.log("canvas refreshed!");
  }, 100);
};

var gridSpacing = 25;
var gridRadius = 1;

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
    const content = (this.content = $(
      "<div id='card-content' title='Hold to drag'></div>"
    ));

    /* Task Component */
    const taskContainer = (this.taskContainer = $(
      "<div id='card-task-container'></div>"
    ));
    const taskInput = (this.input = $(
      "<input id='card-input' placeholder='Enter Task'></input>"
    ));

    const taskItem = (this.taskItem = $(`<ul id="task-item"></ul>`));

    /* Add the elements to the object */
    container.appendTo($("#body-content"));
    head.appendTo(container);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    content.appendTo(container);
    taskContainer.appendTo(content);
    taskInput.appendTo(content);

    /* Make card draggable */
    container.on("mousedown", () => {
      container.draggable({
        revert: true,
        start: function () {
          $(this).css("z-index", 9999);
        },
        stop: function () {
          $(this).css("z-index", "");
        },
      });

      /* Make card swappable with other cards based on positioning */
    });

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

          /* taskContainer.clone().appendTo(content); */
          taskItem.clone().text(this.input.val()).appendTo(taskContainer.clone().appendTo(content))
         /*  taskItem.clone().text(this.input.val()).appendTo(taskContainer); */

          taskInput.blur();
          taskInput.val("");
          tasks++;
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

    /* Edit task item by clicking */
    container.on("click", "#task-item", () => {
      var itemInput = $(
        "<input id='task-item-input' placeholder='Edit task here'></input>"
      );
      console.log("CLICKED");
      if (!$(taskContainer).find("#task-item-input").length) {
        taskContainer.append(itemInput);
      } else return;

      itemInput.on("keypress", (e) => {
        if (e.key === "Enter" && itemInput.val() != "") {
          console.log("Input registered: " + itemInput.val());
         $(this).text(itemInput.val());
        }
      });
    });

    container.css("scale: 1");
  }
}

function CreateCard() {
  let card = new Card();
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
      ctx.arc(x, y, gridRadius, 0, gridSpacing);
      ctx.fill();
      ctx.closePath();
    }
  }
}

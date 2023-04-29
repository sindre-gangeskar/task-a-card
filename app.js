/// <reference types="jquery" />

var gridSpacing = 20;
var gridRadius = 1.5;

class Card {
  constructor() {
    const container = (this.container = $("<div id='card-container'></div>"));
    const head = (this.head = $("<div id='card-head'></div>"));

    //#region Title
    /* Title Component */
    const titleContainer = (this.titlecontainer = $(
      '<div id="card-title-container"></div'
    ));

    const title = (this.title = $(`<p id='card-title'"></p>`));
    const titleInput = (this.titleInput = $(
      "<input id='card-title-input' placeholder='Enter Title Here' contenteditable='true' maxlength='10'></input>"
    ));
    //#endregion

    //#region Task Component

    const content = (this.content = $(
      "<div id='card-content' title='Hold to drag'></div>"
    ));
    const taskContainer = (this.taskContainer = $(
      "<div id='card-task-container'></div>"
    ));
    const appendTaskInput = (this.input = $(
      "<input id='card-input' placeholder='Enter Task' maxlength='14'></input>"
    ));
    const taskItem = (this.taskItem = $(
      `<p id="task-item" ></p>`
    ));

    //#endregion

    /* Make card draggable */
    container.draggable({
      revert: true,
      start: function () {
        $(this).css("z-index", 9999);
      },
      stop: function () {
        $(this).css("z-index", "");
      },
    });

    /* Add the elements to the object */
    container.appendTo($("#body-content"));
    head.appendTo(container);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    content.appendTo(container);
    appendTaskInput.appendTo(container);

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
    appendTaskInput.on("keypress", (e) => {
      if (e.key === "Enter") {
        if (this.input.val() != "") {
          taskContainer
            .clone()
            .append(taskItem.clone().text(this.input.val()))
            .appendTo(content);

          appendTaskInput.blur();
          appendTaskInput.val("");
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
    container.on("click", "#task-item", (event) => {
      const container = $(event.target).closest("#card-task-container");
      const item = container.find("#task-item");
      const editTask = $(
        "<input placeholder='Edit Task Here' id='edit-task-input' maxlength='14'></input>"
      );
      if (item.length > 0) {
        item.hide();
       
        /* If the item doesn't have an item of #edit-task-input, append one and show it */
        if (item.siblings("#edit-task-input").length === 0) {
          container.append(editTask);
          editTask.show();
          editTask.focus();
        }/* If item already has a sibling of edit-task-input, find it, and show it.  */
         else if (item.siblings("#edit-task-input").length !== 0) {
          container.find("#edit-task-input").show();
          container.find("#edit-task-input").focus();
        }

        /* Edit Task */
        editTask.on("keypress", (e) => {
          if (e.key === "Enter" && editTask.val() != "") {
            item.text(editTask.val());
            editTask.val("");
            editTask.blur();
            item.show();
            editTask.hide();
          }
        });
      }
    });

    container.css("scale: 1");
  }
}

function CreateCard() {
  let card = new Card();
  $(card.container).css("transform", "scale(0)", "opacity(0)");
  setTimeout(() => {
    $(card.container).css("transform", "scale(1)").animate({ opacity: 1 }, 500);
  });
}

function drawCircle() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const circleColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--circle-color");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let x = 0;
  let y = 0;

  for (x = 0; x < canvas.width; x += gridSpacing) {
    for (y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.fillStyle = circleColor;
      ctx.arc(x, y, gridRadius, 0, gridSpacing);
      ctx.fill();
      ctx.closePath();
    }
  }
}

/// <reference types="jquery" />

var gridSpacing = 20;
var gridRadius = 1.5;

class Card {
  constructor() {
    const container = (this.container = $(
      "<div id='card-container' class='card-hover'></div>"
    ));
    const head = (this.head = $("<div id='card-head'></div>"));

    //#region Title
    /* Title Component */
    const titleContainer = (this.titlecontainer = $(
      '<div id="card-title-container"></div>'
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
    const taskItem = (this.taskItem = $(`<p id="task-item" ></p>`));

    const deleteBtn = (this.deleteBtn = $(
      '<button class="btn delete-btn" role="button">DETETETE</button'
    ));
    const deleteIcon = (this.deleteIcon = $(
      '<i class="bi bi-x-lg delete-icon"></i>'
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
    container.appendTo($("body"));

    head.appendTo(container);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    content.appendTo(container);
    appendTaskInput.appendTo(container);
    deleteBtn.appendTo(head);
    deleteBtn.append(deleteIcon);
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
      titleInput.select();
      title.hide();
    });

    /* Edit task item by clicking */
    container.on("click", "#task-item", (event) => {
      const container = $(event.target).closest("#card-task-container");
      const item = container.find("#task-item");
      const editTask = $(
        "<input placeholder='Edit Task Here' id='edit-task-input' maxlength='14'></input>"
      ).popover({
        title: "Submit & Cancel",
        content: "'Enter' to submit. \n 'Esc' to cancel edit.",
        offset: "0px, 40px",
      });

      editTask.on("focus", () => {
        editTask.popover("show");
      });

      editTask.on("blur", () => {
        editTask.popover("hide");
      });

      /* Check if the container has an item, if it does, execute code */
      if (item.length > 0) {
        item.hide();
        editTask.val(item.text());

        /* If the item doesn't have an item of #edit-task-input, append one */
        if (item.siblings("#edit-task-input").length === 0) {
          container.append(editTask);
          editTask.focus();
          editTask.select();
        } /* If item already has a sibling of edit-task-input, find it, and show it.  */ else if (
          item.siblings("#edit-task-input").length !== 0
        ) {
          let input = container.find("#edit-task-input");
          input.val(item.text());
          input.show();
          input.focus();
          input.select();
        }

        /* Edit Task */
        editTask.on("keydown", (e) => {
          if (e.key === "Enter" && editTask.val() != "") {
            item.text(editTask.val());
            editTask.val("");
            editTask.blur();
            item.show();
            editTask.hide();
          } else if (e.key === "Escape") {
            editTask.val("");
            editTask.blur();
            editTask.hide();
            item.show();
          }
        });
      }
    });

    /* Title popover */
    $(document).on("mouseenter", "#card-title", function () {
      let element = $(this);

      element.popover({
        title: "Click",
        content: "Click to edit",
        placement: "right",
        offset: "0, 40px",
      });
      element.popover("toggle");

      element.on("mouseleave", function () {
        element.popover("toggle");
      });
    });

    /* Delete Card */
    $(document).on("click", "#card-container .delete-btn", function () {
      $(this).closest("#card-container").css("transform", "scale(0)");
      $(this).closest("#card-container").removeClass("card-hover");

      setTimeout(() => {
        $(this).closest("#card-container").remove();
      }, 500);
    });

    /* Item popover */
    $(document).on("mouseenter", "#task-item", function () {
      let element = $(this);

      element.popover({
        title: "Click",
        content: "Click to edit",
        placement: "right",
        offset: "0, 40px",
      });
      element.popover("toggle");

      element.on("mouseleave", function () {
        element.popover("toggle");
      });
    });
  }
}

function createCard() {
  let card = new Card();
  $(card.container).css("transform", "scale(0)");
  setTimeout(() => {
    $(card.container).css("transform", "scale(1)");
  });
}

function drawCircle() {
  const canvas = document.querySelector("canvas");
  const body = document.querySelector("body");
  const ctx = canvas.getContext("2d");
  const circleColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--circle-color");

  canvas.width = window.innerWidth;
  canvas.height += window.innerHeight;

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

function about() {
  alert("Created by Sindre Gangeskar");
}

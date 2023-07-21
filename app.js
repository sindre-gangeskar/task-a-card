/// <reference types="jquery" />
var groups = [[], [], [], [], []];

class Card {
  constructor() {
    const container = (this.container = $("<div id='card-container' class='sortable'></div>"));
    const head = (this.head = $("<div id='card-head'></div>"));

    //#region Title
    /* Title Component */
    const titleContainer = (this.titlecontainer = $('<div id="card-title-container"></div>'));

    const title = (this.title = $(`<p id='card-title'"></p>`));
    const titleInput = (this.titleInput = $("<input id='card-title-input' placeholder='Enter Title Here' contenteditable='true' maxlength='10'></input>"));
    //#endregion

    //#region Task Component
    
    /* Card elements */
    const content = (this.content = $("<div id='card-content' title='Hold to drag'></div>"));
    const taskContainer = (this.taskContainer = $("<div id='card-task-container'></div>"));
    const appendTaskInput = (this.input = $("<input id='card-input' placeholder='Enter Task' maxlength='14'></input>"));
    const taskItem = (this.taskItem = $(`<p id="task-item" ></p>`));
    const detailsBtn = $((this.detailsBtn = $("<button class='details-btn'>. . .</button>")));
    const deleteBtn = (this.deleteBtn = $('<button class="btn delete-btn" role="button" data-bs-toggle="modal" data-bs-target="#modal-delete"></button'));
    const deleteIcon = (this.deleteIcon = $('<i class="bi bi-x delete-icon"></i>'));

    /* Details modal */
    const detailsModal = $((this.detailsModal = $("<div class='modal fade scrollable details-modal role='dialog' data-bs-backdrop='static'></div>")));
    const detailsModalDialog = $((this.detailsModalDialog = $("<div class='modal-dialog modal-dialog-scrollable' role='document'></div>")));
    const detailsModalContent = $((this.detailsModalContent = $("<div class='modal-content text-center'></div>")));
    const detailsModalTitle = $((this.detailsModalTitle = $("<div class='modal-title p-3'><h5>Additional Information</h5></div>")));
    const detailsModalBody = $((this.detailsModalBody = $("<div class='modal-body text-center'></div>")));
    const detailsModalFooter = $((this.detailsModalFooter = $("<div class='modal-footer'><button class='btn btn-success' data-bs-dismiss='modal'>Save & Close</button></div>")));
    const detailsModalTextArea = $((this.detailsModalTextArea = $("<textarea class='modalDetailsTextArea container-fluid w-100 p-3' placeholder='Enter additional information here' spellcheck='false'></textarea>")));

    /* Card Container Appends */
    head.appendTo(container);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    detailsBtn.appendTo(head);
    content.appendTo(container);
    appendTaskInput.appendTo(container);
    deleteBtn.appendTo(head);
    deleteBtn.append(deleteIcon);
    container.appendTo($(".wrapper"));
    //#endregion

    /* Details Modal Appends */
    detailsModal.appendTo("body");
    detailsModalDialog.appendTo(detailsModal);
    detailsModalContent.appendTo(detailsModalDialog);
    detailsModalTitle.appendTo(detailsModalContent);
    detailsModalBody.appendTo(detailsModalContent);
    detailsModalFooter.appendTo(detailsModalContent);
    detailsModalTextArea.appendTo(detailsModalBody);

    $(detailsBtn)
      .closest(".details-btn")
      .on("click", function () {
        console.log("asdassads");
        $(detailsModal).modal("show");
      });

    $(".wrapper").sortable({
      placeholder: "marker",
      items: ".sortable",
      tolerance: "pointer",
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
    appendTaskInput.on("keypress", (e) => {
      if (e.key === "Enter") {
        if (this.input.val() != "") {
          taskContainer.clone().append(taskItem.clone().text(this.input.val())).appendTo(content);

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
      const editTask = $("<input placeholder='Edit Task Here' id='edit-task-input' maxlength='14'></input>").popover({
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
        } /* If item already has a sibling of edit-task-input, find it, and show it.  */ else if (item.siblings("#edit-task-input").length !== 0) {
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
      let target = $(this).closest("#card-container");

      $("#delete-modal").modal("show");

      /* Delete on confirmation */
      $("#modal-delete .confirm-delete-btn").on("click", function () {
        deleteCard(target);
        $("#modal-delete").modal("hide");
      });
      /* Cancel deletion */
      $("#modal-delete .cancel-delete-btn").on("click", function () {
        $("#modal-delete").modal("hide");
        target = null;
        return;
      });
      /* Archive deletion */
      $("#modal-delete .archive-delete-btn").on("click", function () {
        deleteCard(target);
        console.log("Not yet implemented, will get deleted instead");
        $("#modal-delete").modal("hide");
        return;
      });
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
  }, 300);
  return card.container;
}
function drawGrid() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const circleColor = getComputedStyle(document.documentElement).getPropertyValue("--circle-color");

  const dotSize = 2; // Adjust the dot size as desired
  const gridSpacing = 15;

  canvas.width = 32;
  canvas.height = 32;

  const offset = 4;
  const numDotsX = Math.floor(canvas.width / dotSize);
  const numDotsY = Math.floor(canvas.height / dotSize);

  const gridSpacingX = Math.floor((canvas.width / numDotsX) * gridSpacing);
  const gridSpacingY = Math.floor((canvas.height / numDotsY) * gridSpacing);

  for (let x = offset; x < canvas.width; x += gridSpacingX) {
    for (let y = offset; y < canvas.height; y += gridSpacingY) {
      ctx.beginPath();
      ctx.fillStyle = circleColor;
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }

  var dataURL = canvas.toDataURL();
  return dataURL;
}
function about() {
  const modal = $("<div class='modal fade about-me'></div>");
  const modalDialog = $("<div class='modal-dialog modal-dialog-centered' role='document'></div>");
  const modalContent = $("<div class='modal-content'></div>");
  const modalTitle = $("<div class='modal-title p-3'><h5>About</h5></div>");
  const modalBody = $("<div class='modal-body'><p class='text-center'>Created by Sindre Gangeskar</p></div>");
  const modalFooter = $("<div class='modal-footer'><button class='btn btn-success btn-confirm'>OK</button></div>");

  if (document.querySelector(".about-me")) {
    $(".about-me").modal("show");
  } else {
    $(modalDialog).appendTo($(modal));
    $(modalContent).appendTo($(modalDialog));
    $(modalTitle).appendTo($(modalContent));
    $(modalBody).appendTo($(modalContent));
    $(modalFooter).appendTo($(modalContent));
    $(modal).appendTo("body");
    $(modal).modal("show");
  }

  $(".btn-confirm").on("click", function () {
    $(modal).modal("hide");
  });
}
function deleteCard(target) {
  $(target).closest("#card-container").css({ transition: "transform 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95)", transform: "scale(0)", outline: "none" });

  setTimeout(() => {
    $(target).closest("#card-container").remove();
  }, 500);
}
function checkGroups(groups) {
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    if (groups[4].length >= 8) {
      $("#modal-alarm").modal("show");
      return true;
    }
  }
  return false;
}
function addCardToGroup() {
  if (checkGroups(groups)) {
    return;
  }

  let card = createCard();

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    if (groups[groupIndex].length < 8) {
      $(card).addClass(`group-${groupIndex + 1}`);
      groups[groupIndex].push(card);
      $(`.group-${groupIndex + 1}-toggle`).click();
      $(`.group-${groupIndex + 1}-toggle`).focus();
      console.log(groupIndex);
      return;
    }
  }
}
$(document).ready(function () {
  $("#add-card").on("click", function () {
    addCardToGroup();
  });

  $(".group-1-toggle").click(function () {
    $(".group-1").show();
    $(".group-2").hide();
    $(".group-3").hide();
    $(".group-4").hide();
    $(".group-5").hide();
  });
  $(".group-2-toggle").click(function () {
    $(".group-2").show();
    $(".group-1").hide();
    $(".group-3").hide();
    $(".group-4").hide();
    $(".group-5").hide();
  });
  $(".group-3-toggle").click(function () {
    $(".group-3").show();
    $(".group-1").hide();
    $(".group-2").hide();
    $(".group-4").hide();
    $(".group-5").hide();
  });
  $(".group-4-toggle").click(function () {
    $(".group-4").show();
    $(".group-1").hide();
    $(".group-2").hide();
    $(".group-3").hide();
    $(".group-5").hide();
  });
  $(".group-5-toggle").click(function () {
    $(".group-5").show();
    $(".group-1").hide();
    $(".group-2").hide();
    $(".group-3").hide();
    $(".group-4").hide();
  });
});

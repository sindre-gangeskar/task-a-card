/// <reference types="jquery" />

var groups = [[], [], [], [], []];
let key = 0;
class Card {
  constructor() {
    /* Card elements */

    const container = (this.container = $("<div id='card-container' class='sortable' data-bs-toggle='popover'></div>")).popover({
      title: "Drag & Sort",
      content: "Drag and Drop: Hold left mouse button to drag cards. Sort cards by swapping positions to arrange as desired.",
      trigger: "hover",
      container: this.container,
      placement: "top",
      offset: "0px, 50px",
      delay: { show: 1500 },
    });
    const head = (this.head = $("<div id='card-head'></div>"));
    const groupID = $((this.groupID = $("<div class='text-center group-id'></div>")));
    const titleContainer = (this.titlecontainer = $('<div id="card-title-container"></div>'));
    const title = (this.title = $(`<p id='card-title' data-bs-toggle='popover'"></p>`)).popover({ title: "Click", content: "Click to edit title", placement: "right", offset: "0px, 20px", trigger: "hover", container: this.title, delay: { show: 500 } });
    const titleInput = (this.titleInput = $("<input id='card-title-input' placeholder='Enter Title Here' contenteditable='true' maxlength='10' autocomplete='off' data-bs-toggle='popover'></input>")).popover({
      title: "Submit",
      content: "Press Enter to submit.",
      placement: "left",
      offset: "105px, -100px",
      trigger: "focus",
      container: this.container,
      delay: { show: 500 },
    });
    const content = (this.content = $("<div id='card-content'></div>"));
    const taskContainer = (this.taskContainer = $("<div id='card-task-container'></div>"));
    const taskInputContainer = (this.taskInputContainer = $("<div id='task-input-container'></div>"));
    const taskInput = (this.taskInput = $("<input id='card-input' placeholder='Enter Task' maxlength='14' autocomplete='off' data-bs-toggle='popover'></input>")).popover({
      title: "Submit",
      content: "Press Enter to submit.",
      placement: "right",
      offset: "0px, 20px",
      trigger: "focus",
      container: taskInputContainer,
      delay: { show: 500 },
    });
    const taskItem = (this.taskItem = $("<p id='task-item'></p>"));
    const detailsBtn = $((this.detailsBtn = $("<button class='details-btn' data-bs-toggle='popover'>...</button>"))).popover({
      trigger: "hover",
      offset: "0px, 15px",
      container: $(this.detailsBtn),
      title: "More Info",
      content: "Click to add additional information",
      placement: "left",
      delay: { show: 500 },
    });
    const deleteBtn = (this.deleteBtn = $("<button class='btn delete-btn' role='button' data-bs-toggle='modal' data-bs-target='#modal-delete'></button"));
    const deleteIcon = (this.deleteIcon = $('<i class="bi bi-x delete-icon"></i>'));

    /* Details modal */
    const detailsModal = $((this.detailsModal = $("<div class='modal fade scrollable details-modal role='dialog' data-bs-backdrop='static'></div>")));
    const detailsModalDialog = $((this.detailsModalDialog = $("<div class='modal-dialog modal-dialog-scrollable' role='document'></div>")));
    const detailsModalContent = $((this.detailsModalContent = $("<div class='modal-content text-center'></div>")));
    const detailsModalTitle = $((this.detailsModalTitle = $("<div class='modal-title p-3'><h5>Additional Information</h5></div>")));
    const detailsModalBody = $((this.detailsModalBody = $("<div class='modal-body text-center'></div>")));
    const detailsModalFooter = $((this.detailsModalFooter = $("<div class='modal-footer'><button class='btn btn-success' data-bs-dismiss='modal'>Save & Close</button></div>")));
    const detailsModalTextArea = $((this.detailsModalTextArea = $("<textarea class='modalDetailsTextArea container-fluid w-100 p-3' placeholder='Enter additional information here\n(Max 480 characters)' maxlength='480' rows='5' cols='5' max-rows='10' spellcheck='false'></textarea>")));

    /* Card Container Appends */
    head.appendTo(container);
    groupID.appendTo(head);
    titleContainer.appendTo(head);
    titleInput.appendTo(titleContainer);
    detailsBtn.appendTo(head);
    content.appendTo(container);
    taskInputContainer.appendTo(container);
    taskInput.appendTo(taskInputContainer);
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

    $(detailsBtn).on("click", function () {
      $(detailsModal).modal("show");
    });

    /* Assign title input value */
    titleInput.on("keypress", (e) => {
      if (e.key === "Enter" && titleInput.val() !== "") {
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
        if (this.taskInput.val() != "") {
          taskContainer.clone().append(taskItem.clone().text(this.taskInput.val())).appendTo(content);

          taskInput.blur();
          taskInput.val("");
          tasks++;
        }

        if (tasks >= maxTasks) {
          this.taskInput.blur();
          this.taskInput.hide();
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
      const editTask = $("<input placeholder='Edit Task Here' id='edit-task-input' maxlength='14'></input>").popover({ title: "Submit", content: "Press enter to submit edit of task", trigger: "focus", container: this.taskInputContainer, offset: "-30px, 20px" });
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
  const cardContainer = $(target).closest("#card-container");
  if (key === groups.length) {
    groups[groups.length].pop();
  }
  groups[key].pop();
  cardContainer.css({ transition: "transform 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95)", transform: "scale(0)", outline: "none" });
  getAvailableSlotsInGroup(key, true);

  setTimeout(() => {
    cardContainer.remove();
  }, 500);
}
function checkAllGroupsFull(groups) {
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    if (groups[groups.length - 1].length >= 8) {
      return true;
    }
  }

  return false;
}
function addCardToGroup(groupVisiblity) {
  if (checkAllGroupsFull(groups)) {
    const firstAvailableSlot = getFirstAvailableSlotInGroup();

    if (firstAvailableSlot === undefined) {
      $("#modal-alarm").modal("show");
      return;
    } else {
      key = firstAvailableSlot;
    }
  }
  else key = getFirstAvailableSlotInGroup();

  if (getAvailableSlotsInGroup(key, false) && key <= groups.length) {
    let card = createCard();
    let groupID = $(card).find(".group-id");
    if (groupVisiblity) groupID.show();
    else groupID.hide();

    $(card).addClass(`group-${key + 1}`);
    groupID.html(key + 1);
    groups[key].push(card);
    $(`.group-${key + 1}-toggle`).click();
    $(`.group-${key + 1}-toggle`).focus();
    $(`.group-${key + 1}`).show();
    return;
  }
  if (!getAvailableSlotsInGroup(key, false)) {
    if (key > groups.length) key = groups.length;
    key++;
  }
}
function getAvailableSlotsInGroup(index, debug) {
  if (index >= 0 && index <= groups.length) {
    if (debug) {
      console.log(`Available slots: ${8 - groups[index].length}`);
    }
    if (groups[index].length < 8) {
      return true;
    } else {
      return false;
    }
  }
}
function getFirstAvailableSlotInGroup() {
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
    if (groups[groupIndex].length < 8) {
      return groupIndex;
    }
  }
}
function getGroupIndexVisibility() {
  const groupToggle = $(".group-visibility-switch");

  function updateGroupIndexVisibility(checked) {
    if (checked) $(".group-id").show();
    else $(".group-id").hide();
  }

  const initialVisibility = $(groupToggle).is(":checked");
  updateGroupIndexVisibility(initialVisibility);

  /*Update on change */
  groupToggle.on("change", function () {
    const checked = $(this).is(":checked");
    updateGroupIndexVisibility(checked);
  });

  return initialVisibility;
}
function getTooltipsVisibility() {
  const toggle = $(".tooltips-visibility-switch");

  function updateTooltipsVisibility(checked) {
    if (checked) {
      $('[data-bs-toggle="popover"]').popover("enable");
    } else $('[data-bs-toggle="popover"]').popover("disable");
  }

  toggle.on("change", function () {
    const checked = $(this).is(":checked");
    updateTooltipsVisibility(checked);
  });
}
function toggleGroups(key) {
  switch (key) {
    case 0:
      $(".group-1").show();
      $(".group-2").hide();
      $(".group-3").hide();
      $(".group-4").hide();
      $(".group-5").hide();
      break;

    case 1: {
      $(".group-2").show();
      $(".group-1").hide();
      $(".group-3").hide();
      $(".group-4").hide();
      $(".group-5").hide();
      break;
    }
    case 2: {
      $(".group-3").show();
      $(".group-1").hide();
      $(".group-2").hide();
      $(".group-4").hide();
      $(".group-5").hide();
      break;
    }
    case 3: {
      $(".group-4").show();
      $(".group-1").hide();
      $(".group-2").hide();
      $(".group-3").hide();
      $(".group-5").hide();
      break;
    }
    case 4: {
      $(".group-5").show();
      $(".group-1").hide();
      $(".group-2").hide();
      $(".group-3").hide();
      $(".group-4").hide();
      break;
    }
    default:
      break;
  }
}

$(document).ready(function () {
  getTooltipsVisibility();
  getGroupIndexVisibility();
  $(".wrapper").sortable({
    placeholder: "marker",
    items: ".sortable",
    tolerance: "pointer",
  });
  $("#add-card").on("click", function () {
    addCardToGroup(getGroupIndexVisibility());
    getAvailableSlotsInGroup(key, true);
  });
  $(".group-1-toggle").click(function () {
    key = 0;
    toggleGroups(key);
    getAvailableSlotsInGroup(key, false);
  });
  $(".group-2-toggle").click(function () {
    key = 1;
    toggleGroups(key);
    getAvailableSlotsInGroup(key, false);
  });
  $(".group-3-toggle").click(function () {
    key = 2;
    toggleGroups(key);
    getAvailableSlotsInGroup(key, false);
  });
  $(".group-4-toggle").click(function () {
    key = 3;
    toggleGroups(key);
    getAvailableSlotsInGroup(key, false);
  });
  $(".group-5-toggle").click(function () {
    key = 4;
    toggleGroups(key);
    getAvailableSlotsInGroup(key, false);
  });

  /* Delete Card */
  $(document).on("click", "#card-container .delete-btn", function () {
    let target = $(this).closest("#card-container");
    $("#delete-modal").modal("show");

    /* Delete on confirmation */
    $("#modal-delete .confirm-delete-btn").one("click", function () {
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
    $("#modal-delete .archive-delete-btn").one("click", function () {
      deleteCard(target);
      console.log("Not yet implemented, will get deleted instead");
      $("#modal-delete").modal("hide");
      return;
    });
  });
});

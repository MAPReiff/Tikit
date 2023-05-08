(function () {

    function checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply ${varName}!`;
        if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    };

    let deleteCommentButton = document.getElementsByClassName('deleteCommentBtn');
    let deleteReplyButton = document.getElementsByClassName('deleteReplyBtn');
    let content = document.getElementById('contentInput');
    let replyingToID = document.getElementById('replyingToID');
    let errordiv = document.getElementById('error-div'); 
    let mycommentform = document.getElementById('comment-form');
    let ticketID = document.getElementById('tickedIDInput');
    let deleteErrorDiv = document.getElementById('delete-error-div'); 
    let closeCommentBtn = document.getElementById('closeCommentModal'); 

    if(mycommentform) { 
        mycommentform.addEventListener('submit', (event) => {
            event.preventDefault();
        try { 
          let contentValue = content.value;
          let replyingToIDValue = replyingToID.value; 
          let ticketIDValue = ticketID.value;
          errordiv.hidden = true;
          contentValue = checkString(contentValue, "content"); 
          $.ajax({
            type: "POST",
            url: '/comments/' + ticketIDValue,
            contentType: "application/json",
            data: JSON.stringify({
              contentInput: contentValue,
              replyingToID: replyingToIDValue
            }),
            success: function () {
              content.value = '';
              window.location.reload();
            },
            //code adapted from https://stackoverflow.com/questions/377644/jquery-ajax-error-handling-show-custom-exception-messages
            error: function (xhr, ajaxOptions, thrownError) {
              let errorMsg = xhr.status + ":" + thrownError;
              errordiv.innerHTML = errorMsg + "<br>" + xhr.responseText;
              errordiv.hidden = false;
              content.value = '';
              content.focus();
              mycommentform.reset();
            }
          });
        } catch (e){ 
          errordiv.innerHTML = e;
          errordiv.hidden = false;
          content.value = '';
          content.focus();
          mycommentform.reset();
        }
      });
    }

    //adapted from https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    Array.from(deleteCommentButton).forEach(function(deleteCommentButton) {
      if(deleteCommentButton) {
        deleteCommentButton.addEventListener('click', (event) => {
              event.preventDefault();
              let commentId = deleteCommentButton.value;
              console.log(commentId)
              if (confirm("Are you sure you want to delete this comment and its replies?") === true) {
                  $.ajax({
                    type: "DELETE",
                    url: '/comments/comment/' + commentId,
                    contentType: "application/json",
                    //data: JSON.stringify(""),
                    success: function () {
                      let msg = "create successful";
                      console.log(msg);
                      window.location.reload();
                    }, //https://stackoverflow.com/questions/377644/jquery-ajax-error-handling-show-custom-exception-messages
                    error: function (xhr, ajaxOptions, thrownError) {
                      let errorMsg = xhr.status + ":" + thrownError;
                      deleteErrorDiv.innerHTML = errorMsg + "<br>" + xhr.responseText;
                      deleteErrorDiv.hidden = false;
                    }
                  });
                } else {
                  return;
                }
          });
      }
    });
  
    //adapted from https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
    Array.from(deleteReplyButton).forEach(function(deleteReplyButton) {
      if(deleteReplyButton) {
        deleteReplyButton.addEventListener('click', (event) => {
              event.preventDefault();
              let commentId = deleteReplyButton.value;
              console.log(commentId)
              if (confirm("Are you sure you want to delete this reply?") === true) {
                  $.ajax({
                    type: "DELETE",
                    url: '/comments/comment/' + commentId,
                    contentType: "application/json",
                    //data: JSON.stringify(""),
                    success: function () {
                      let msg = "create successful";
                      console.log(msg);
                      window.location.reload();
                    }, //https://stackoverflow.com/questions/377644/jquery-ajax-error-handling-show-custom-exception-messages
                    error: function (xhr, ajaxOptions, thrownError) {
                      let errorMsg = xhr.status + ":" + thrownError;
                      deleteErrorDiv.innerHTML = errorMsg + "<br>" + xhr.responseText;
                      deleteErrorDiv.hidden = false;
                    }
                  });
                } else {
                  return;
                }
          });
      }
    });
    
    if(closeCommentBtn) {
      closeCommentBtn.addEventListener('click', (event) => {
          event.preventDefault();
          errordiv.hidden = true;
          errordiv.value = ''; 
          content.value = '';
          mycommentform.reset();
        });
    }
    
})();

function setReplyID(replyID) { 
  let replyingToID = document.getElementById('replyingToID');
  replyingToID.value = replyID; 
  console.log(replyingToID.value)
}



// function checkString(strVal, varName) {
//     if (!strVal) throw `Error: You must supply ${varName}!`;
//     if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
//     strVal = strVal.trim();
//     if (strVal.length === 0)
//       throw `Error: ${varName} cannot be an empty string or string with just spaces`;
//     if (!isNaN(strVal))
//       throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
//     return strVal;
//   };
  
//   function deleteComment(commentId) {
//     if (confirm("Are you sure you want to delete this comment?") === true) {
//       $.ajax({
//         type: "DELETE",
//         url: '/comments/comment/' + commentId,
//         contentType: "application/json",
//         //data: JSON.stringify(""),
//         success: function () {
//           let msg = "create successful";
//           console.log(msg);
//           window.location.reload();
//         },
//       });
//     } else {
//       return;
//     }
//   }
  
//   function postComment(ticketId) {
//     let content = document.getElementById('contentInput');
//     let errordiv = document.getElementById('error-div'); 
//     let mycommentform = document.getElementById('comment-form')
//     //content = checkString(content, "Content")
//     console.log('/comments/' + ticketId)
  
//     if(mycommentform) { 
//       try { 
//         let contentValue = content.value;
//         errordiv.hidden = true;
//         contentValue = checkString(contentValue, "content"); 
//         $.ajax({
//           type: "POST",
//           url: '/comments/' + ticketId,
//           contentType: "application/json",
//           data: JSON.stringify({
//             contentInput: contentValue
//           }),
//           success: function () {
//             let msg = "create successful";
//             console.log(msg);
//             window.location.reload();
//           },
//         });
//       } catch (e){ 
//         alert(errordiv.innerHTML)
//         errordiv.innerHTML = e;
//         errordiv.hidden = false;
//         content.value = '';
//         content.focus();
//         mycommentform.reset();
//       }
//     }
//   }
  
  
  
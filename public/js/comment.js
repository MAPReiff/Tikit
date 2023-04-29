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

    let deleteCommentButton = document.getElementById('deleteCommentBtn');
    let deleteReplyButton = document.getElementById('deleteReplyBtn');
    let content = document.getElementById('contentInput');
    let replyingToID = document.getElementById('replyingToID');
    let errordiv = document.getElementById('error-div'); 
    let mycommentform = document.getElementById('comment-form');
    let ticketID = document.getElementById('tickedIDInput');


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
              let msg = "create successful";
              console.log(msg);
              window.location.reload();
            },
          });
        } catch (e){ 
          alert(errordiv.innerHTML)
          errordiv.innerHTML = e;
          errordiv.hidden = false;
          content.value = '';
          content.focus();
          mycommentform.reset();
        }
      });
    }

    if(deleteCommentButton) {
      deleteCommentButton.addEventListener('click', (event) => {
            event.preventDefault();
            let commentId = deleteCommentButton.value;
            console.log(commentId)
            if (confirm("Are you sure you want to delete this comment?") === true) {
                $.ajax({
                  type: "DELETE",
                  url: '/comments/comment/' + commentId,
                  contentType: "application/json",
                  //data: JSON.stringify(""),
                  success: function () {
                    let msg = "create successful";
                    console.log(msg);
                    window.location.reload();
                  },
                });
              } else {
                return;
              }
        });
    }
    if(deleteReplyButton) {
      deleteReplyButton.addEventListener('click', (event) => {
            event.preventDefault();
            let commentId = deleteReplyButton.value;
            console.log(commentId)
            if (confirm("Are you sure you want to delete this comment?") === true) {
                $.ajax({
                  type: "DELETE",
                  url: '/comments/comment/' + commentId,
                  contentType: "application/json",
                  //data: JSON.stringify(""),
                  success: function () {
                    let msg = "create successful";
                    console.log(msg);
                    window.location.reload();
                  },
                });
              } else {
                return;
              }
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
  
  
  
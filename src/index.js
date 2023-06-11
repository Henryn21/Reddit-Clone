
//variables for post info
let postJson;
let title;
let comm;
let poster;
let postContent;

//current community/subreddit
let currentCommunity="careeradvice";
let currentPosts;


let getStuff= async (community, sort="best")=>{
    let results= await fetch(`https://www.reddit.com/r/${community}/${sort}/.json`);
    let myData= await results.json();
    return myData.data.children;//build post components based on returned posts info
}
//fill page with post html, deciding on strings vs dom functions to append new post data
let fillPage=(postList)=>{
    clearFeed();
    console.log(postList);
    currentPosts=postList;
    for(let i=0;i<postList.length;i++){
        document.querySelector("#dropdownMenuLink").textContent=`r/${postList[i].data.subreddit}`;
        let newPost=document.createElement("div");
        newPost.classList.add("post");
        newPost.innerHTML=`
        <div class="postVote">
            <i class="fa-solid fa-arrow-up"></i>
            <p class="postScore">${postList[i].data.score}</p>
            <i class="fa-solid fa-arrow-down"></i>
        </div>
        <div class="postBody">
            <div class="postHeader">
                <p class="postCommunity">r/${postList[i].data.subreddit}</p>
                <p class="postAuthor">Posted by ${postList[i].data.author}</p>
            </div>
            <div class="postContent">
                <h1 class="postTitle">${postList[i].data.title}</h1>
                <p>${postList[i].data.selftext.substring(0,500)}</p>
            </div>
        </div>`
        newPost.id=i;
        newPost.addEventListener("click", ()=>{popUp(newPost)});
        // newPost.id=postList[i].data.id;
        document.querySelector("#feed").appendChild(newPost);
    }
}
//first call/default posts
getStuff("careeradvice", "best").then((bestAdvicePosts)=>{fillPage(bestAdvicePosts)})
//select community using dropdown
let getCommunity= (community)=>{
    getStuff(community, "best").then((communityPosts)=>{fillPage(communityPosts)});
    currentCommunity=community;
}
//clear feed
let clearFeed=()=>{
    document.querySelector("#feed").innerHTML=``;
}
//sort posts options
let sortPosts=(sortType)=>{
    console.log("sorting by "+sortType);
    getStuff(currentCommunity, sortType).then((communityPosts)=>{fillPage(communityPosts)});
}
//show selected post: Full post, comments, replies 
let popUp= async(post)=>{
    //select post
    //get post text and comments, replies
    console.log(currentPosts[post.id].data.selftext);
    fetch(`${currentPosts[post.id].data.url}.json`)
    .then((selectedPromise)=>{return selectedPromise.json()})
    .then((selected)=>{
        //trim array with slice, returns first 5
        return selected[1].data.children.slice(0,6);
    })
    .then((comments)=>{
        console.log(comments);
        //create selected post element
        let selectedPost=document.createElement("div");
        selectedPost.classList.add("selectedPost");
        selectedPost.innerHTML=`
            <div class="selectedPostVote">
                <i class="fa-solid fa-arrow-up"></i>
                <p class="postScore">${currentPosts [post.id].data.score}</p>
                <i class="fa-solid fa-arrow-down"></i>
            </div>
            <div class="postBody">
                <div class="postHeader">
                    <p class="postCommunity">r/${currentPosts[post.id].data.subreddit}</p>
                    <p class="postAuthor">Posted by ${currentPosts[post.id].data.author}</p>
                </div>
                <div class="postContentSelected">
                    <h1 class="postTitle">${currentPosts[post.id].data.title}</h1>
                    <p>${currentPosts[post.id].data.selftext}</p>
                </div>
            </div>
            <div class="commentSection">
            </div>`;//FINISH THIS CONTAINTER DIV, WIP!!
        document.querySelector(".selectedContainer").appendChild(selectedPost);
        document.querySelector(".selectedContainer").addEventListener("click", (e)=>{e.stopPropagation()});
        document.querySelector(".content").classList.add("pause");
        document.querySelector(".overlay").classList.add("visible");

        //add comments to post
        //WIP!!!
        buildComments(selectedPost,comments);
        // comments.forEach(comment){
            
        // }
        // append each comment
        // `<div class="comment">
        // <div class="commentHeader">
        //     <p>${comments[0]}</p>
        // </div>
        // <div class="commentText">
        
        // </div>`
        }
    );
}
//build comment section div
let buildComments=(selectedPost ,comments)=>{
    //append each comment
    //forEach comment, build comment element and append to (comment section) list(underneath selected post)
    comments.forEach((comment)=>{
        console.log(comment.data.body)
        let commentElement=document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML=`
            <div class="commentBody">
                <div>
                    <h1 class="commentAuthor">${comment.data.author}</h1>
                    <p>${comment.data.body}</p>
                </div>
                <div class="commentVote">
                    <i class="fa-solid fa-arrow-up"></i>
                    <p class="commentScore">${comment.data.score}</p>
                    <i class="fa-solid fa-arrow-down"></i>
                </div>
            </div>
        `;
        selectedPost.children[2].appendChild(commentElement);
    })
}
//if comment has replies, append as child div
let buildReplies=(selectedPost,comments)=>{
    //append first comment
    //forEach reply, 
}

//close selected post and comments pop up
let closePost=(e)=>{
    console.log(e);
    e.stopPropagation();
    let selectedPost=document.querySelector(".selectedPost");
    document.querySelector(".selectedContainer").removeChild(selectedPost)
    document.querySelector(".overlay").classList.remove("visible");
    console.log("CLEAR")
}
document.querySelector(".overlay").addEventListener("click",(e)=>{closePost(e)});
//community feed X
//main feed 
//sort X
//create post 
//comment 4
//reply 5
//vote 1
//pop up post when clicked

//Log in function
// POST http://localhost:3333/auth/signup HTTP/1.1
// content-type: application/json

// {
//     "email": "j@j.com",
//     "password": "test"
// }
//TEST BUTTON FOR SIGN IN

let logIn= async()=>{
    fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: "j@j.com",
            password: "test",
          }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => response.text())
      .then((text) => console.log(text))
}

let signupButton=document.querySelector("#profile");
signupButton.addEventListener("click", logIn);
//check session status
let sessionChecker= async()=>{
    fetch("http://localhost:3333/feature"), {
        method:"GET"

    }
    // res.send("Secret feature used!")
} 
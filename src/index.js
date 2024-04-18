
//variables for post info
let postJson;
let title;
let comm;
let poster;
let postContent;

//current community/subreddit
let currentCommunity="careeradvice";
let currentPosts;

//get posts from subreddit
let getStuff= async (community, sort="best")=>{
    let results= await fetch(`https://www.reddit.com/r/${community}/${sort}/.json?raw_json=1`);
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
    //check for image post
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
                <p class="postScore">${currentPosts[post.id].data.score}</p>
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
//close post by button function
let exitPost=()=>{
    let selectedPost=document.querySelector(".selectedPost");
    document.querySelector(".selectedContainer").removeChild(selectedPost)
    document.querySelector(".overlay").classList.remove("visible");
    console.log("CLEAR")
}

//log in screen pop up
let loginOverlay=document.querySelector(".loginOverlay");
let logInPopUp=()=>{
    loginOverlay.classList.add("visible");
}
//clear login pop up
let closeLogin=()=>{
    loginOverlay.classList.remove("visible");
}
let closeLoginButton=document.querySelector("#closeLogin");
closeLoginButton.addEventListener("click", closeLogin)
//Log in function
let logIn= async()=>{
    //get inputted email/password
    let email=document.querySelector("#email").value;
    let password=document.querySelector("#password").value;
    console.log(email);
    console.log(password);
    let result= await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password,
          }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => response.text())
      .then((text) => console.log(text+" is logged in"))
      window.localStorage.setItem("user", email);
      closeLogin();
      displayUser();
}
//display current user in header
let displayUser=()=>{
    let user=window.localStorage.getItem("user");
    //get user
    //set header to username
    document.querySelector("#profile").textContent=user;
}
//sign up function
let signUp= async()=>{
    let email=document.querySelector("#email").value;
    let password=document.querySelector("#password").value;
    console.log(email);
    console.log(password);
    let result= await fetch('http://localhost:3333/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password,
          }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => response.text())
      .then((text) => console.log(text))
      closeLogin();
}
//prevent submit
let preventRefresh=(e)=>{
    e.preventDefault();
}
let loginForm=document.querySelector(".loginForm");
loginForm.addEventListener("submit", preventRefresh);
//Log in button in header
let signInButton=document.querySelector("#profile");
signInButton.addEventListener("click", logInPopUp);

//login button for pop up screen
let logInButton=document.querySelector("#logInButton");
logInButton.addEventListener("click", logIn);

//sigin button for pop up screen
let signUpButton=document.querySelector("#signUpButton");
signUpButton.addEventListener("click", signUp);
//sign out

//who is signed in?-function/button
let whoAmI = async () => {
    try {
        let result = await fetch('http://localhost:3333/feature', {
            method: 'GET',
            credentials: 'include', // This includes cookies in the request
            headers:{
                "Set-Cookie":"promo_shown=1; SameSite=None",
                "Accept": "*/*"
            }
        });

        if (result.ok) {
            let text = await result.text();
            // console.log("Who am I?, I am : ",text);
        } else {
            console.log('Request failed with status:', result.status);
        }
        
        closeLogin();
    } catch (error) {
        console.error('Error:', error);
    }
};

//checks if user, logs user on server side
let whoAmIButton = document.querySelector("#whoAmIButton");
whoAmIButton.addEventListener("click", whoAmI);

//check and log user to browser
async function getSessionUser() {
    try {
      const response = await fetch('http://localhost:3333/getSessionUser');
      const data = await response.json();
      console.log(data);
      return data.user; // Assuming the response contains a "user" field
    } catch (error) {
      console.error('Error fetching session user:', error);
      return null;
    }
  }
  let getUserButton = document.querySelector("#getUserButton");
  getUserButton.addEventListener("click", getSessionUser);

//search for subreddits function
let searchBar=document.querySelector("#search");

let findSubreddit=()=>{
    //get search query
    let searchQuery=searchBar.value;
    //get posts to display
    getCommunity(searchQuery);
}

searchBar.addEventListener("keydown",
    function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            findSubreddit();
        }
    }
);

//get current user
// let getCurrentUser=async()=>{
//     let result= await fetch('http://localhost:3333/auth/signup', {

//     }
// }
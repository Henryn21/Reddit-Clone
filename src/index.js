// import { initializeApp } from 'firebase/app';
// import { getFirestore,getDocs,collection,doc, getDoc } from "firebase/firestore";
// const firebaseConfig = {
//     apiKey: "AIzaSyC9JcH18aP98luiEZyAnbyyfje43HYhZO8",
//     authDomain: "notreddit-73615.firebaseapp.com",
//     projectId: "notreddit-73615",
//     storageBucket: "notreddit-73615.appspot.com",
//     messagingSenderId: "699529099968",
//     appId: "1:699529099968:web:fa911cf6a76ebd522b0b25"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// //test to read data on fb
// let showData=async ()=>{
//     const docRef = doc(db, "yo", "NREu5f4BEGNfREtNXEDs");
//     const docSnap = await getDoc(docRef);
//     console.log(docSnap.data());
// }
// showData();

//variables for post info
let postJson;
let title;
let comm;
let poster;
let postContent;
//fetch api on url with .json at end, for testing with template post
// fetch("https://www.reddit.com/r/cscareerquestions/comments/11gqslm/the_hustle_culture_posts_are_very_off_putting/.json")
//     .then((res)=>{
//         return res.json();
//     })
//     .then((postInfo)=>{
//         // console.log(postInfo[0].data.children[0].data.);
//         //fix : ugly
//         let titleElement=document.querySelector("#templateTitle");
//         let authorElement=document.querySelector("#templatePoster");
//         let communityElement=document.querySelector("#templateCommunity");
//         let contentElement=document.querySelector("#templateContent");
//         //see above
//         postJson=postInfo[0].data.children[0].data;
//         poster=postJson.author;
//         title=postJson.title;
//         comm=postJson.subreddit;
//         //selftexthtml is a property, maybe creates elements? Not by default :(
//         postContent=postJson.selftext;
//         //write to html, FIX: swap to dynamic created elements or something
//         titleElement.textContent=title;
//         authorElement.textContent=poster;
//         communityElement.textContent=comm;
//         contentElement.textContent=postContent.substring(0,500);
//     })
//     .catch(function(err) {
//         console.log(err);   // Log error if any
//     });

let getStuff= async (community, sort="best")=>{
    let results= await fetch(`https://www.reddit.com/r/${community}/${sort}/.json`);
    let myData= await results.json();
    return myData.data.children;//build post components based on returned posts info
}
//fill page with post html, deciding on strings vs dom functions to append new post data
let fillPage=(postList)=>{
    clearFeed();
    console.log(postList);
    for(let i=0;i<postList.length;i++){
        let newPost=document.createElement("div");
        newPost.classList.add("post");
        newPost.innerHTML=`
        <div class="postVote">
            <i class="fa-solid fa-thumbs-up"></i>
            <p class="postScore">${postList[i].data.score}</p>
            <i class="fa-solid fa-thumbs-down"></i>
        </div>
        <div class="postBody">
            <div class="postHeader">
                <p class="postCommunity">${postList[i].data.subreddit}</p>
                <p class="postAuthor">${postList[i].data.author}</p>
            </div>
            <div class="postContent">
                <h1 class="postTitle">${postList[i].data.title}</h1>
                <p>${postList[i].data.selftext.substring(0,500)}</p>
            </div>
        </div>`
        document.querySelector("#feed").appendChild(newPost);
    }
}

getStuff("careeradvice", "best").then((bestAdvicePosts)=>{fillPage(bestAdvicePosts)})
//select community using dropdown
let getCommunity= (community)=>{
    getStuff(community, "best").then((communityPosts)=>{fillPage(communityPosts)});
}
//clear feed
let clearFeed=()=>{
    document.querySelector("#feed").innerHTML=``;
}


//community feed 2
//main feed 1
//sort
//create post 3
//comment 4
//reply 5
//vote 1
//pop up post when clicked
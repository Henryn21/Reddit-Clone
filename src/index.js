import { initializeApp } from 'firebase/app';
import { getFirestore,getDocs,collection,doc, getDoc } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyC9JcH18aP98luiEZyAnbyyfje43HYhZO8",
    authDomain: "notreddit-73615.firebaseapp.com",
    projectId: "notreddit-73615",
    storageBucket: "notreddit-73615.appspot.com",
    messagingSenderId: "699529099968",
    appId: "1:699529099968:web:fa911cf6a76ebd522b0b25"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//test to read data on fb
let showData=async ()=>{
    const docRef = doc(db, "yo", "NREu5f4BEGNfREtNXEDs");
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
}
showData();
//variables for post template, CHANGE TO CREATE NEW ELEMENTS!!!!
// let titleElement=document.querySelector("#templateHeader");
// let authorElement=document.querySelector("#templatePoster");
// let communityElement=document.querySelector("#templateCommunity");
// let contentElement=document.querySelector("#templateContent");
//variables for post info
let postJson;
let title;
let comm;
let poster;
let postContent;
//fetch api on url with .json at end
fetch("https://www.reddit.com/r/cscareerquestions/comments/11gqslm/the_hustle_culture_posts_are_very_off_putting/.json")
    .then((res)=>{
        return res.json();
    })
    .then((postInfo)=>{
        // console.log(postInfo[0].data.children[0].data.);
        //fix : ugly
        let titleElement=document.querySelector("#templateTitle");
        let authorElement=document.querySelector("#templatePoster");
        let communityElement=document.querySelector("#templateCommunity");
        let contentElement=document.querySelector("#templateContent");
        //see above
        postJson=postInfo[0].data.children[0].data;
        poster=postJson.author;
        title=postJson.title;
        comm=postJson.subreddit;
        //selftexthtml is a property, maybe creates elements? Not by default :(
        postContent=postJson.selftext;
        //write to html, FIX: swap to dynamic created elements or something
        titleElement.textContent=title;
        authorElement.textContent=poster;
        communityElement.textContent=comm;
        contentElement.textContent=postContent;
    })
    .catch(function(err) {
        console.log(err);   // Log error if any
    });
    //returns promise
let getStuff= async (community, sort)=>{
    let results= await fetch(`https://www.reddit.com/r/${community}/${sort}.json`);
    let data=results.json();
    console.log(data);
    return data;//build post components based on returned posts info
}
    
getStuff();



//community feed 2
//main feed 1
//sort
//create post 3
//comment 4
//reply 5
//vote 1
//pop up post when clicked
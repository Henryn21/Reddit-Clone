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

let showData=async ()=>{
    const docRef = doc(db, "yo", "NREu5f4BEGNfREtNXEDs");
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
}
showData();
//fetch api on url with .json at end
fetch("https://www.reddit.com/r/CK3AGOT/comments/116drje/which_of_these_late_features_are_you_the_most.json")
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);   // Log error if any
    });
    //returns promise
let getStuff= async ()=>{
    let po= await fetch("https://www.reddit.com/r/CK3AGOT/comments/116drje/which_of_these_late_features_are_you_the_most.json");
    let data=po.json();
    console.log(data);
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
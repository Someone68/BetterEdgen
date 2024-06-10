// ==UserScript==
// @name         BetterEdgen
// @namespace    http://tampermonkey.com
// @version      2024-06-04
// @description  Better Edgenuity Tweaks!
// @author       You
// @match        *://r09.core.learn.edgenuity.com/player/
// @icon         https://auth.edgenuity.com/Login/images/Login/IL-EDG-product-icon_C.png
// @grant        none
// ==/UserScript==


//
// ______      _   _            _____    _
// | ___ \    | | | |          |  ___|  | |
// | |_/ / ___| |_| |_ ___ _ __| |__  __| | __ _  ___ _ __
// | ___ \/ _ \ __| __/ _ \ '__|  __|/ _` |/ _` |/ _ \ '_ \
// | |_/ /  __/ |_| ||  __/ |  | |__| (_| | (_| |  __/ | | |
// \____/ \___|\__|\__\___|_|  \____/\__,_|\__, |\___|_| |_|
//                                          __/ |
//                                         |___/
//
// Built off of EdgenTweaks, which was maintained by Graydn, SubatomicMC, and de-y. (https://gitlab.com/roglemorph/edgentweaks)

let $, jQuery;
$ = jQuery = window.jQuery;

let vocabAutoComplete, autoAdvance, skipIntro, guessPractice, showColumn = false;



// scroll down to enable/disable tweaks




//----------------------------------//
//                                  //
//  _____                 _         //
// |_   _|_ __ _____ __ _| |__ ___  //
//   | | \ V  V / -_) _` | / /(_-<  //
//   |_|  \_/\_/\___\__,_|_\_\/__/  //
//                                  //
//            ~ Menu ~              //
//                                  //
//----------------------------------//
const tweaks = {
    // Enable and disable tweaks here
    vocab: true, // Automatically complete vocab assignments.                                    // Set to false to disable
    autoadvance: true, // [recommended] Automatically click the next button when available. BUGS: Might restart video!      // Set to false to disable
    skipi: true, // [recommended] Answer questions while the intro audio is playing              // Set to false to disable
    guess: true, // Automatically guess thru warm-ups (Warm-up, Instruction, Summary, Lecture)   // Set to false to disable
    showexample: true, // Show sample response to typing questions                               // Set to false to disable
}



console.log("%c BetterEdgen", "color: lightseagreen; font-weight: bolder; font-size: 30px")
console.log("%c v1.1.0 Initializing...", "color: dodgerblue;")
setTimeout(() => {



    function createButton(buttonText, id, onClickFunction, menu) {
        // Create the button element
        const button = document.createElement('button');

        // Set the button text
        button.innerHTML = buttonText;

        const buttonStyles = {
            display: 'block',
            backgroundColor: '#161616',
            width: '100%',
            color: 'white',
            padding: '10px 20px',
            border: '2px solid #ffc2c2',
            outline: 'none',
            cursor: 'pointer',
        }

        // Apply basic styles
        for (const [key, value] of Object.entries(buttonStyles)) {
            button.style[key] = value;
        }

        // Add click event listener to run the specified code
        button.addEventListener('click', onClickFunction);

        // Append the button to the body (or another element if desired)
        menu.document.body.appendChild(button);

        menu.document.body.style.background = "#101010"

        menu.document.documentElement.style.margin = "0"
        menu.document.documentElement.style.padding = "0"
        menu.document.body.style.margin = "0"
        menu.document.body.style.padding = "0"
        menu.document.documentElement.style.width = "100%"
        menu.document.documentElement.style.height = "100vh"
        menu.document.body.style.width = "100%"
        menu.document.body.style.height = "100vh"
        menu.document.body.style.fontFamily = "monospace"
        button.style.fontFamily = "monospace"
        button.id = id;
    }

    // manage ls

    function lcls(menu) {
        if (localStorage.betterEdgen) {
            let split = localStorage.betterEdgen.split(', ')
            split = split.join('').replaceAll("undefined", "").split(', ')
            split.forEach((thing, index) => {
                console.log(thing)
                tweaks[thing] = true
                if (!menu) return;
                console.log(thing)
                menu.document.getElementById(thing).style.borderColor = "#ffc2c2"
                menu.document.getElementById(thing).innerHTML = menu.document.getElementById(thing).innerHTML.replace("off", "on");
            })
        } else {
            let array = []
            for (let i = 0; i < Object.keys(tweaks).length; i++) {
                if (tweaks[Object.keys(tweaks)[i]]) {
                    localStorage.betterEdgen += `${Object.keys(tweaks)[i]}, `
                }
            }

        }
    }
    //lcls()

    function toggleTweak(id, menu) {

        console.log(menu.document.body.innerHTML)
        if (tweaks[id]) {
            tweaks[id] = false;
            menu.document.getElementById(id).innerHTML = menu.document.getElementById(id).innerHTML.replace("on", "off");
            menu.document.getElementById(id).style.borderColor = "#ffc2c2";
        } else {
            tweaks[id] = true;
            menu.document.getElementById(id).innerHTML = menu.document.getElementById(id).innerHTML.replace("off", "on");
            menu.document.getElementById(id).style.borderColor = "#c2ffee";
        }
        lcls(menu)
    }

    function masterLoop() {
        if (tweaks.autoadvance) AutoAdvance();
        if (tweaks.vocab) VocabCompleter();
        if (tweaks.skipi) SkipIntro();
        if (tweaks.guess) GuessPractice();
        if (tweaks.showexample) ShowColumn();
    }

    setInterval(masterLoop, 4000)


    function openmenu() {
        const menu = window.open("", "BetterEdgen", "width=800,height=600");
        if (menu.document.body.id === "opened") return;
        menu.document.body.id = "opened";
        menu.document.body.innerHTML += "<h1 style='font-weight:lighter;text-align:center;color:#c2ffc3;margin:20px 0px;'>BetterEdgen</h1>"
        createButton("auto advance {off}", "autoadvance", () => {
            toggleTweak("autoadvance", menu)
        }, menu)
        createButton("vocab completer {off}", "vocab", () => {
            toggleTweak("vocab", menu)
        }, menu)
        createButton("skip intro audio {off}", "skipi", () => {
            toggleTweak("skipi", menu)
        }, menu)
        createButton("guess practice {off}", "guess", () => {
            toggleTweak("guess", menu)
        }, menu)
        createButton("show sample response [paragraph answer questions] {off}", "showexample", () => {
            toggleTweak("showexample", menu)
        }, menu)
        lcls(menu)
    }



    function SkipIntro() {
        try {
            window.frames[0].document.getElementById("invis-o-div").remove()
        } catch (TypeError) {}
    }
    // Guess Practice
    function GuessPractice() {
        //Guesser (THIS IS INDEDED TO BE RESTRICTIVE, JUST LEAVE IT.)
        if (["Instruction", "Warm-Up", "Summary", "Lecture"].includes(document.getElementById("activity-title").innerText)) {
            var numOption
            if ($("iframe#stageFrame").contents().find("form").find(".answer-choice-button").length = numOption > 0) {
                $("iframe#stageFrame").contents().find("form").find(".answer-choice-button")[Math.floor(Math.random() * Math.floor(numOption))].click()
            } else if ($("#stageFrame").contents().find("iframe").contents().find(".answer-choice-button").length > 0) {
                $("#stageFrame").contents().find("iframe").contents().find(".answer-choice-button")[Math.floor(Math.random() * Math.floor(4))].click()
            }
            $("#stageFrame").contents().find("#btnCheck")[0].click()
        }
    }
    // Unhide Right Column
    function ShowColumn() {
        try {
            window.frames[0].frames[0].document.getElementsByClassName("right-column")[0].children[0].style.display = "block"
        } catch (TypeError) {}
        try {
            window.frames[0].frames[0].document.getElementsByClassName("left-column")[0].children[0].style.display = "block"
        } catch (TypeError) {}
    }

    function VocabCompleter() {
        if (document.getElementById("activity-title").innerText == "Vocabulary") {
            $("#stageFrame").contents().find(".uibtn.uibtn-blue.uibtn-arrow-next")[0].click()
            var i = 0;
            try {
                var txt = window.frames[0].document.getElementsByClassName("word-background")[0].value
                window.frames[0].document.getElementsByClassName("word-textbox")[0].value = txt;
                $("#stageFrame").contents().find(".word-textbox.word-normal")[0].dispatchEvent(new Event("keyup"));

            } catch {
                return;
            }
            var speed = 50;
            $("#stageFrame").contents().find(".playbutton.vocab-play")[0].click()
            $("#stageFrame").contents().find(".playbutton.vocab-play")[1].click()
            $("#stageFrame").contents().find(".uibtn.uibtn-blue.uibtn-arrow-next")[0].click()
        }
    }

    function AutoAdvance() {
        var increment = 0;
        if (["Unit Test", "Unit Test Review", "Quiz"].includes($("#activity-title").text()) && ($("#activity-status").text() != "Complete")) {
            return;
        }
        if (document.querySelector("#stageFrame").contentDocument.querySelector("video")) {
            document.querySelector("#stageFrame").contentDocument.querySelector("video").addEventListener("ended", () => {
                  console.log("video ended, skipping")
                let myAs = document.getElementsByTagName("a");

                    for (var i = 0; i < myAs.length; i++) {

                        if (myAs[i].innerHTML == 'Go Right' || myAs[i].innerText == 'Go Right' || myAs[i].title == 'Go Right') {

                            myAs[i].click()
                            break;

                        }

                    }
                    $(".footnav.goRight").click()
                    window.API?.frameChain.nextFrame()

                    //Advance to next !!!!assignment!!! not redundant
                    $("#stageFrame").contents().find(".FrameRight").click()
            })
            console.log("i see a videeo")
            if (document.querySelector("#stageFrame").contentDocument.querySelector(".FrameRight")) {
                console.log("i see a next button")
                if (document.querySelector("#stageFrame").contentDocument.querySelector(".FrameRight").style.opacity && parseFloat(document.querySelector("#stageFrame").contentDocument.querySelector(".FrameRight").style.opacity) < 1) {
                    console.log("i click the next button")
                    var myAs = document.getElementsByTagName("a");

                    for (var i = 0; i < myAs.length; i++) {

                        if (myAs[i].innerHTML == 'Go Right' || myAs[i].innerText == 'Go Right' || myAs[i].title == 'Go Right') {

                            myAs[i].click()
                            break;

                        }

                    }
                    $(".footnav.goRight").click()
                    window.API?.frameChain.nextFrame()

                    //Advance to next !!!!assignment!!! not redundant
                    $("#stageFrame").contents().find(".FrameRight").click()

                }
            }
            return;
        }
        console.log("i dont see a video")

        console.log("autoadv - skipping")
        //All other AA checks have succedded at this point.
        $(".footnav.goRight").click()
        window.API?.frameChain.nextFrame()

        //Advance to next !!!!assignment!!! not redundant
        $("#stageFrame").contents().find(".FrameRight").click()



    }



    /*const button = document.createElement("button");
    button.style.padding = "10px";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "#00007C";
    button.style.position = "fixed";
    button.style.bottom = "40px";
    button.style.right = "10px";
    button.style.color = "white";
    button.innerHTML = "Open Tweaks Menu";
    button.style.zIndex = 9999999999;
    button.id = "tweaksopen"
    button.onclick = openmenu
    document.body.append(button)
*/
    console.log("%c BetterEdgen Initialized!", "color: lime; font-weight: bolder")

}, 2000)

# formfunctions
Commonly used form functions (uses jQuery)
## TimeChooser
Add a timepicker to the form by invoking the function TimePicker(); onload or ready, then apply it to an input field by adding a class="timePicker"<br>
* The default is with 5 minute increments, to set it to use 15 minute increments instead use 
 * `TimeChooser(15);`
* The default is to 12 HR, to set it to use 24 HR use 
 * `TimeChooser(true);`
* For 24 HR format and to use 1 minute increment use 
 * `TimeChooser(1,true);`
* To manually set each selector add the css selectors in a string to the first parameter 
 * `TimeChooser("#thisFieldID, #andThisOne",1,true);`
## toProperCase
Set the proper case of a string<br>
`var s ="chris"; s.toProperCase() //Chris`
Execute inline
`<input onblur="runProperCase(this)">`
## FollowUps
### Follow up form fields
dropdowns with a follow up question, with a div of an id with the name and value, when selected, its visible
 ` <select onchange="subOptions(this)" id=SL1><option>BB</option><option>CC</option></select>`
 
 ` <div id="SL1CC" class=hide><input type=text />not seen</div>`
 ` carryoverdrop("select#id1","select#id2");`

For more example see: https://jsfiddle.net/yvhg4L4r/2/

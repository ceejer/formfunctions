# formfunctions
Commonly used form functions (uses jQuery)
## TimePicker
Add a timepicker to the form by invoking the function TimePicker(); onload or ready, then apply it to an input field by adding a class="timePicker"<br>
* The default is with 5 minute increments, to set it to use 15 minute increments instead use 
 * `TimePicker(15);`
* The default is to 12 HR, to set it to use 24 HR use 
 * `TimePicker(true);`
* For 24 HR format and to use 1 minute increment use 
 * `TimePicker(1,true);`
* To manually set each selector add the css selectors in a string to the first parameter 
 * `TimePicker("#thisFieldID, #andThisOne",1,true);`
## toProperCase
Set the proper case of a string<br>
`var s ="chris"; s.toProperCase() //Chris`

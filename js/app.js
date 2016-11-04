/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;


/*  Add NewElement BEFORE -OR- AFTER Using the Aforementioned protoypes */
//NewElement.appendAfter(document.getElementById(""))

window.onload = function() {
    // confTotal = tab on conference activities selected
    // confActivities = array of activities selected
    // btn = location of submit button
    var confTotal = 0; 
    var confActivities = []; 
    var btn = $('button')[0];
    var eMessage = $('#errorMessage')[0];
    var eModal = $('#myModal');

    // Set up the page, hiding non-relevant sections and items
    document.getElementById('other').style.display = "none";
    document.getElementById('colors-js-puns').style.display = "none";
    document.getElementById('color').options[0] = null;
    document.getElementById('payment').options[0] = null;
    document.getElementById('total-cost').style.display = "none";
    document.getElementById('payment').nextElementSibling.nextElementSibling.style.display = "none";
    document.getElementById('payment').nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";

    // Set up event handlers
    document.getElementById("title").onchange = function() { jobTitle(); };
    document.getElementById("design").onchange = function() { colorSelection(); };
    document.getElementById("payment").onchange = function() { paymentSelection(); };

   // Prevents page from reloading after submittal
   $("form").submit( function(e) {
            e.preventDefault();
        });

    $("form").bind("submit", function() {
        if ( !validate() ) { // an error on form
            eMessage.innerHTML = "You are all signed up!";
        } else {
            eMessage.innerHTML = "Oh, snap! We couldn't sign you up.<br> Please check the items in <span>red</span> for errors or omissions.";
        }
        eModal.modal('show');
    });


    // Activities manipulation
    var container = document.getElementsByClassName('activities');
    var arrActivities = [];
    var inputElements = container[0].childNodes;

    for( var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].nodeName === 'LABEL') {
            arrActivities.push(inputElements[i].firstChild);
        }
    }

    // Assign function to onclick property of each checkbox
    for ( var j = 0; j < arrActivities.length; j++) {
        arrActivities[j].onclick = updateActivities;
    }


    function jobTitle() {

        var selected = document.getElementById("title");

        if (selected.value === 'other') {
            document.getElementById('other').style.display = 'block';
            document.getElementById('title').style.display = 'none';
            var enteredTitle = document.getElementById('new_title');
            enteredTitle.focus();

            enteredTitle.onchange = function() {
                selected.value = enteredTitle.value;
            };
        } 
    }

    function colorSelection() {
        document.getElementById('colors-js-puns').style.display = "block";
        var colorOptions = document.getElementById('color');
        var designOption = document.getElementById('design').value;
        var numOptions = colorOptions.length;

         if (designOption === 'heart js') {
            designOption = String.fromCharCode(9829) + ' js';
        }

        var first =  true;        
        for (i = 0; i < numOptions; i++) {
            var str = colorOptions.options[i].innerHTML;
            str = str.toLowerCase();

            if (str.search(designOption) !== -1) {
                if (first) {
                    colorOptions.options[i].selected = 'selected';
                    first = false;
                }
                colorOptions.options[i].style.display = 'inline-block';
            } else {
                colorOptions.options[i].style.display = 'none';
            }
        } 
    }

    function updateActivities() {
        var container = document.getElementsByClassName('activities');
        // item holds the text of the checked item
        var item = this.nextSibling.data;
        var activityCost = 0;
        var time = "";
        var confActivitiesSlot = -1;

        // Isolate cost of activity selected
        activityCost = parseInt(item.slice(item.indexOf('$')+1));

        // Isolate time of activity selected
        if (item.toLowerCase().indexOf("main") !== -1) {
            time = "main";
        } else {
            time = item.slice(item.indexOf('—')+1, item.indexOf(',')-1).trim();
        }

        // Check to see if time conflicts with previously selected activity's time
            for (var i = 0; i < confActivities.length; i++) {
                if (time === confActivities[i]) {
                    confActivitiesSlot = i;
                } 
            }

        if (this.checked && confActivitiesSlot !== -1) { // Activity selected has conflict of time
            eMessage.innerHTML = "Sorry! You've already signed up for an activity at that time.";
            eModal.modal('show');
            this.checked = false;
            return;
        } else if (this.checked && confActivitiesSlot === -1) { // New activity has no conflict of time
            confActivities.push(time);
            confTotal += activityCost;
            this.parentNode.style.color = "#184f68";
            this.parentNode.style.fontweight= "bold";
        } else { // Activity has been unchecked
            confTotal -= activityCost;
            delete confActivities[confActivitiesSlot];
            this.parentNode.style.color = "initial";
        }

        // Display total cost
        var totalCostContainer = document.getElementById('total-cost');
        totalCostContainer.style.display = "block";
        var html = '<h4>Total Cost:</h4><input type="text" id="total_cost" name="total_cost" value="$';
        html += confTotal + '" disabled>';  
        totalCostContainer.innerHTML = html;

    }

    function paymentSelection() {
        var paymentContainer = document.getElementById('payment');
        var selection = paymentContainer.value;

        if (selection === 'paypal') {
            paymentContainer.nextElementSibling.style.display = "none";
            paymentContainer.nextElementSibling.nextElementSibling.style.display = "block";
            paymentContainer.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";
        } else if (selection === 'bitcoin') {
            paymentContainer.nextElementSibling.style.display = "none";
            paymentContainer.nextElementSibling.nextElementSibling.style.display = "none";
            paymentContainer.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "block";
        } else {
            paymentContainer.nextElementSibling.style.display = "block";
            paymentContainer.nextElementSibling.nextElementSibling.style.display = "none";
            paymentContainer.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";
        }
    }

    function validate() {

        var error = false;

        // Is name field empty?
        var name = $('#name');
        if ( !validateName(name.val()) ) {
            name[0].style.borderBottom = "red 2px solid";
            error = true;
        }

        // Validate email
        var email = $('#mail');
        if ( !validateEmail(email.val()) ) {
            email[0].style.borderBottom = "red 2px solid";
            error = true;
        } else {
            $('#mail')[0].style.borderBottom = "";
        }

        // Make sure there is at least one activity selected
        if ( confTotal === 0 ) {
            error = true;
            $('.activities > legend')[0].style.color = 'red';
        } else {
            $('.activities > legend')[0].style.color = 'initial';
        }

        // Validate credit card information
        if ($('#payment').val() === "credit card") {
            var cc = $('#cc-num');
            cc.validateCreditCard(function (result) {

               if (result.card_type === null | !result.length_valid | !result.luhn_valid) {
                   cc[0].style.borderBottom = "red 2px solid";
                   error = true;
               } else {
                   cc[0].style.borderBottom = "";
               }

            });

            // Check zip code
            var zip = $('#zip');
            if ( !validateZip(zip.val()) ) {
                zip[0].style.borderBottom = "red 2px solid";
                error = true;
            } else {
                zip[0].style.borderBottom = "";
            }

            // Check for cvv
            var cvv = $('#cvv');
            if ( !validateCVV(cvv.val()) ) {
                cvv[0].style.borderBottom = "red 2px solid";
                error = true;
            } else {
                cvv[0].style.borderBottom = "";
            } 
        }
         return error;
    }

    function validateName(name) {
        if ( name === '' || name === null) {
            return false
        } else {
            return true;
        }
    }

    function validateEmail(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    }

    function validateZip(zip) {
        var re = /^\b\d{5}(-\d{4})?\b$/;
        return re.test(zip);
    }

    function validateCVV(cvv) {
        var re = /^\b\d{3}$/;
        return re.test(cvv);
    }

    
    

};

var editor; // use a global for the submit and return data rendering in the examples

$(document).ready(function() {

menuItemProc();

$.ajax({
	type: "GET",
	url: "/myjson",
	success: function(data){

		$('#cont_ins').append(CreateTableView(data,"CoolTableTheme",true));

		$('#mytable tfoot th').each( function () {
			var self = $(this);
			var title = $('#mytable thead th').eq( self.index() ).text();
			//console.log($(this).index());
			if ( self.index() > 0 ) {
				self.html( '<input type="text" placeholder="Search '+title+'" />' );
			} else {
				self.html(' ');
			}
		});

		// Activate an inline edit on click of a table cell
	/*	$('#mytable').on( 'click', 'tbody td:not(:first-child)', function (e) {
			editor.inline(  $('#mytable').closest('tr') );
		} );*/
		  
				// Initialise the DataTable
	    table = $('#mytable').DataTable( {
				dom: "Tfrtip",
				order: [ 1, 'asc' ],
				tableTools: {
					sRowSelect: "os", // "os" - one selection; "multi" - is multiselect
					sRowSelector: 'td:first-child',
					aButtons: []
				 /*   { "sExtends": "editor_create", "editor": editor },
					{ "sExtends": "editor_edit",   "editor": editor },
					{ "sExtends": "editor_remove", "editor": editor }
					] */
				}
			} );

		// Apply the filter
		table.columns().eq( 0 ).each( function ( colIdx ) {
			$( 'input', table.column( colIdx ).footer() ).on( 'keyup change', function () {
				if (colIdx != 0 ) {
				 table
					.column( colIdx )
					.search( this.value )
					.draw();
				}
			});
		});
		//table.order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw();
		//new $.fn.dataTable.FixedColumns( table );
		
	}
	});
    
});

function CreateTableView(objArray, theme, enableHeader) {
/*    // set optional theme parameter
    if (theme === undefined) {
        theme = 'mediumTable'; //default theme
    }
 
    if (enableHeader === undefined) {
        enableHeader = true; //default enable headers
    }
 */
    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
 
    var str = '<div class="container"><table id="mytable" cellspacing="0" width="100%">';
     
    // table head
    if (enableHeader) {
        str += '<thead><tr>';
        for (var index in array[0]) {
			if (index != 'ID' )
				str += '<th>' + index + '</th>';
			else
				str += '<th class="myEdit">Select</th>';
        }
        str += '</tr></thead>';
    }
    
    // table foot
    if (enableHeader) {
        str += '<tfoot><tr>';
        for (var index in array[0]) {
            //if (index != 'ID' )
				//str += '<th>' + index + '</th>';
			//else
				str += '<th></th>';
        }
        str += '</tr></tfoot>';
    }
     
    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        //str += (i % 2 == 0) ? '<tr id="row_'+ array[i].ID +'">' : '<tr id="row_'+ array[i].ID +'">';
        str +='<tr id="'+ array[i].ID +'">';
        for (var index in array[i]) {
			if (index != 'ID' ) //console.log("id= "+array[i].ID);
				str += '<td>' + array[i][index] + '</td>';
            else
				str += '<td '+
			    //'id="'+ array[i].ID +'"'+
				'>'+
				//<div class="ed_del_div">'+
				//'<button id="'+ array[i].ID +'" onClick="edit_onclick(this)">Edit</button>'+
				//'<button id="del'+ array[i].ID +'" onClick="delete_onclick(this)">Delete</button>'+
				//'</div>'+
				'</td>';
        }
        str += '</tr>';
    }
    str += '</tbody>'
    str += '</table></div>';
    return str;
}

function editor_onclick(clicked)
{
	var str = $('tr.DTTT_selected').find('td');
	
	//var table = document.getElementById('mytable').getElementsByTagName('tr.DTTT_selected');
	//var sel_rows = table.getElementsByTagName('tr');
	
    console.log( 'table serialize: ' + JSON.stringify(document.getElementById('mytable').getElementsByClassName('DTTT_selected')) );
	alert(clicked.id+' - pressed');
	//onewind();
}

function edit_onclick(clicked)
{
/*
	$.ajax({
			url : "/get",
			type: "POST",
			data : {id: clicked.id},
			success: function(objArray, textStatus, jqXHR)
			{
				*/
				var selectData = selectedRowFromTable( "#mytable" );
				var convData = serializeLocalObject($.parseJSON(selectData));
				var objArray = [];
				objArray[0] = JSON.parse(convData);
				console.log('objArray '+objArray);
				
				var str = '<div id="abc" onClick="check(event, \'abc\')"><div class="popupContainer">'+
				'<form id="edit">';
					//<!-- contact us form -->
				var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

				for (var i = 0; i < array.length; i++) {
					//str += (i % 2 == 0) ? '<tr id='+array[i].ID+'>' : '<tr id='+array[i].ID+'>';
					for (var index in array[i]) {
						switch(index) {
							case 'ID':
								
								break;
							case 'CC':
								str += '<input id="'+array[i].ID+'" type="text" name="'+index+'" value="'+array[i][index]+'" readonly>  '+index.replace("</br>","")+'</br>';
								break;
							default:
									str += '<input id="'+array[i].ID+'" type="text" name="'+index+'" value="'+array[i][index]+'">  '+index.replace("</br>","")+'</br>';
						}
					}
				}
				
				str += '<button class="DTTT_button" id="submit" onClick="confirmSubmitFormData()">Submit</button></form>';
				str += '<div class="fancybox-close popupContainer" id="close"> </div></div></div>';
				//$('#cont_ins').append(str);
				//Popup.showModal('abc');//return false;
				popup_show($('#cont_ins'), str, 'abc');
				console.log('end popup_show');
/*
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
		
		*/
}

function showValues() {
    
    var selectData = selectedRowFromTable( "#mytable" );
    var convData = serializeLocalObject($.parseJSON(selectData));
     
	console.log( 'convData: '+convData);
}

function selectedRowFromTable(idTable) {
	var valuelist = [];

    cells_count = $(idTable).find('tr.DTTT_selected').find('td').length;

	for (var i=0; i<cells_count; i++) 
	{
		if( i===0 )
		{
			valuelist[i] = {
				name : "ID",
				value: $('#mytable').find('tr.DTTT_selected').find('td')[0].parentNode.id
			};
		} 
		else 
		{
		valuelist[i] = {
			name : document.getElementsByTagName('table').mytable.rows[0].cells[i].textContent,
			value: $(idTable).find('tr.DTTT_selected').find('td')[i].textContent
			};
		}
	}

	return JSON.stringify(valuelist);
}

function confirmSubmitFormData()
{
	var str = $( "form" ).serializeObject();
	var id = $( "form" ).children().attr('id');
	updateData(id, str);
}

function updateData(id, objArr)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {
		updateSelectedRow(id, objArr);
		$.extend(objArr, {ID: id});
		$.ajax({
			url : "/update",
			type: "POST",
			data : objArr,
			success: function(data, textStatus, jqXHR)
			{
				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
	}
}
function updateSelectedRow(id, array) {
	//var result = {};
	
	//var id = array.ID;
	//console.log('id: ', id);
	var i = 1;
	for (var index in array) { 
		//if (index != 'ID') {
			//console.log(index,' ', array[index]);
			document.getElementsByTagName('table').mytable.rows[id].children[i].textContent = array[index];
		//}
		i++;
	}
};
//

/* ************* POPUP ************* */

//function to display Popup
function popup_show(cont, str, id){
	cont.append(str);
	document.getElementById(id).style.display = "block";
}
 
//function to check target element
function check(e, id){
	var target = (e && e.target) || (event && event.srcElement); 
	var obj = document.getElementById(id);
	 
	checkParent(target, id)?obj.style.display='none':null;
} 
 
//function to check parent node and return result accordingly
function checkParent(t, id){
	 while(t.parentNode){
		 if(t==document.getElementById(id))
		 {
			return false
		 }
		 else if(t==document.getElementById('close'))
		 {
			document.getElementById(id).remove();
			return true
		 }
		 else if(t==document.getElementById('submit'))
		 {
			document.getElementById(id).remove();
			return true
		 }
		 t=t.parentNode
	 }
	 //console.log('end checkParent');
	 return true
}


/* **** converter JSON to name:value pair **** */
function serializeLocalObject(array) {
	var result = {};
	
	$.each(array, function(i, val) {
		
		result[val.name] = val.value;
		});
	
	return JSON.stringify(result);
};


/* ****  TOP MENU item processing **** */
function menuItemProc() {
	
$('ul.tabs').each(function(){
    // For each set of tabs, we want to keep track of
    // which tab is active and it's associated content
    var $active, $content, $links = $(this).find('a');

    // If the location.hash matches one of the links, use that as the active tab.
    // If no match is found, use the first link as the initial active tab.
    $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
    $active.addClass('active');

    $content = $($active[0].hash);

    // Hide the remaining content
    $links.not($active).each(function () {
      $(this.hash).hide();
    });

    // Bind the click event handler
    $(this).on('click', 'a', function(e){
      // Make the old tab inactive.
      $active.removeClass('active');
      $content.hide();

      // Update the variables with the new link and content
      $active = $(this);
      $content = $(this.hash);

      // Make the tab active.
      $active.addClass('active');
      $content.show();

      // Prevent the anchor's default click action
      e.preventDefault();
    });
  });
	
};


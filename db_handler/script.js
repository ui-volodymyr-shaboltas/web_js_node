//var main = function () {
    //$.getJSON("/myjson", function (data) {
        //console.log(data);
    //});
//};

$(document).ready(function() {

//MENU item processing
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

$.ajax({
	type: "GET",
	url: "/myjson",
	//async: false,
	//dataType: "json",
	success: function(data){
// console.log(CreateTableView(data,"CoolTableTheme",true));
//$('#context').text(CreateTableView(data,"CoolTableTheme",true));
//document.write(CreateTableView(data,"CoolTableTheme",true));
//CONT = CreateTableView(data,"CoolTableTheme",true);
//$('#test').text=CONT;
		$('#cont_ins').append(CreateTableView(data,"CoolTableTheme",true));

		$('#mytable tfoot th').each( function () {
			var title = $('#mytable thead th').eq( $(this).index() ).text();
			//console.log($(this).index());
			if ( $(this).index() > 0 ) {
				$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
			} else {
				$(this).html(' ');
			}
		});
		

		//var editor = new $.fn.dataTable.Editor( {} );
	    var editor = new $.fn.dataTable.Editor( {
			ajax: "/uptade",
			table: "#mytable",
			fields: [
				//{ label: "ID", name: "ID" },
				{ label: "CC", name: "CC" },
				{ label: "PTP", name: "PTP" },
				{ label: "DFS", name: "DFS" },
				{ label: "Bandwidth", name: "Bandwidth" },
				{ label: "Max power", name: "Max power" }
			]
		} );
	    
	    var table = $('#mytable').DataTable( {
        "sDom": 'T<"clear">lfrtip',
        tableTools: {
            sRowSelect: "os",
            aButtons: [
                { sExtends: "editor_create", editor: editor },
                { sExtends: "editor_edit",   editor: editor },
                { sExtends: "editor_remove", editor: editor }
            ]
        }
		} );
	    
		// New record
		$('a.editor_create').on('click', function (e) {
			e.preventDefault();

			editor
				.title( 'Create new record' )
				.buttons( { "label": "Add", "fn": function () { editor.submit() } } )
				.create( $(this).closest('tr') );
		} );

		// Edit record
		$('#mytable').on('click', 'a.editor_edit', function (e) {
			e.preventDefault();

			editor
				.title( 'Edit record' )
				.buttons( { "label": "Update", "fn": function () { editor.submit() } } )
				.edit( function () { 
					console.log('test: '+table.closest('tr'));
					return table.closest('tr') 
					});
		} );

		// Delete a record (without asking a user for confirmation for this example)
		$('#mytable').on('click', 'a.editor_remove', function (e) {
			e.preventDefault();

			editor
				.message( 'Are you sure you wish to remove this record?' )
				.buttons( { "label": "Delete", "fn": function () { editor.submit() } } )
				.remove( $(this).closest('tr') );
		} );

		// DataTable
		//var table = $('#mytable').DataTable( {
			//"sDom": 'T<"clear">Rlfrtip',
			//"oTableTools": {
				//"aButtons": [
					//"copy",
					//"print",
					//{
						//"sExtends":    "collection",
						//"sButtonText": "Save",
						//"aButtons":    [ "csv", "xls", "pdf" ]
					//}
				//]
			//}
		//} );
		//var table = $('#mytable').DataTable( 
		//{
			//dom: "Tfrtip",
			//tableTools: {
				//aButtons: [
					//{ sExtends: "editor_create", editor: editor },
					//{ sExtends: "editor_edit",   editor: editor },
					//{ sExtends: "editor_remove", editor: editor }
				//]
			//}
		//} 
		//);
		 


			
	   

		//$( tableTools.fnContainer() ).insertAfter('div.info');
			//// DataTable scrolled
			//var table = $('#mytable').DataTable( {
			//"scrollX": "300px",
			//"scrollY": "300px",
			//"scrollCollapse": true,
			//"paging": false
		//} );
    
		

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

	//$.ajax({ 
		//type: "GET",
		//url: '/test',
		//success: function(data){ 
			//console.log(data); } 
	//});
	//console.log('test');
    
});

//function loadTable() {
   
	//$.ajax({
		 //type: "GET",
		 //url: "http://localhost/regulatory/jq.js",
		 //async: false,
		 //dataType: "json",
		 //success: function(data){
			//// console.log(CreateTableView(data,"CoolTableTheme",true));
			////$('#context').text(CreateTableView(data,"CoolTableTheme",true));
			////document.write(CreateTableView(data,"CoolTableTheme",true));
			//return CreateTableView(data,"CoolTableTheme",true);
		 //}
	//});
//};

function CreateTableView(objArray, theme, enableHeader) {
    // set optional theme parameter
    if (theme === undefined) {
        theme = 'mediumTable'; //default theme
    }
 
    if (enableHeader === undefined) {
        enableHeader = true; //default enable headers
    }
 
    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
 
    var str = '<div class="container"><section><table id="mytable" class="display" cellspacing="0" width="100%">';
     
    // table head
    if (enableHeader) {
        str += '<thead><tr>';
        for (var index in array[0]) {
			if (index != 'ID' )
				str += '<th>' + index + '</th>';
			else
				str += '<th class="myEdit"></th>';
        }
        str += '</tr></thead>';
    }
    
    // table foot
    if (enableHeader) {
        str += '<tfoot><tr>';
        for (var index in array[0]) {
            if (index != 'ID' )
				str += '<th>' + index + '</th>';
			else
				str += '<th></th>';
        }
        str += '</tr></tfoot>';
    }
     
     
    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        str += (i % 2 == 0) ? '<tr id='+array[i].ID+'>' : '<tr id='+array[i].ID+'>';
        for (var index in array[i]) {
			if (index != 'ID' ) //console.log("id= "+array[i].ID);
				str += '<td>' + array[i][index] + '</td>';
            else
				str += '<td id="'+ array[i].ID +'"><div class="ed_del_div">'+
				//'<button id="'+ array[i].ID +'" onClick="edit_onclick(this)">Edit</button>'+
				//'<button id="del'+ array[i].ID +'" onClick="delete_onclick(this)">Delete</button>'+
				'</div></td>';
        }
        str += '</tr>';
    }
    str += '</tbody>'
    str += '</table></div></section>';
    return str;
}

function delete_onclick(clicked)
{
	alert(clicked.id+' - deleted');
	onewind();
}


function onewind()
{
dave=window.open("","min","width=263 height=181");
dave.document.write("<FONT FACE='Arial' SIZE='2'>")
dave.document.write("<hr><br>This script is great for <h1><font color=\"red\">describing</font></h1>links.")
dave.document.write("</FONT>")
}

function edit_onclick(clicked)
{

	$.ajax({
			url : "/get",
			type: "POST",
			data : {id: clicked.id},
			success: function(objArray, textStatus, jqXHR)
			{
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
							case 'CC':
								str += '<input id="'+array[i].ID+'" type="text" name="'+index+'" value="'+array[i][index]+'" readonly>  '+index.replace("</br>","")+'</br>';
								break;
							default:
									str += '<input id="'+array[i].ID+'" type="text" name="'+index+'" value="'+array[i][index]+'">  '+index.replace("</br>","")+'</br>';
						}
					}
				}
				
				str += '<button  id="submit" onClick="confirmSubmit()">Submit</button></form>';
				str += '<div class="fancybox-close popupContainer" id="close"> </div></div></div>';
				//$('#cont_ins').append(str);
				//Popup.showModal('abc');//return false;
				popup_show($('#cont_ins'), str, 'abc');
				console.log('end popup_show');

			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
		// console.log(array);
		
		//////
		var formData = { 
				id: clicked.id
			
		}; //Array 
		// submit update

		
        //$.ajax({
			//url: '/send_save/send_save', 
			//type: 'POST', 
			//contentType: 'text/json',
			//data: { name: "foo" }
			////data: [{ name:'1', description:'2' }]
			//}); 
    //alert(clicked_id);
}

function showValues() {
    var str = $( "form" ).serializeObject();
    console.log( 'form serialize: ' + JSON.stringify(str) );
  }

function confirmSubmit()
{
	var str = $( "form" ).serializeObject();
	updateData(str);
}

function updateData(objArr)
{
	var agree=confirm("Are you sure you wish to continue?");
	if (agree) {
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
				
//function to display Popup
function popup_show(cont, str, id){
	//var old_content=cont;
	cont.append(str);
	//console.log('popup');
	document.getElementById(id).style.display = "block";
	
}
 
//function to check target element
function check(e, id){
	var target = (e && e.target) || (event && event.srcElement); 
	// console.log('check '+ e +' target ' + id);
	var obj = document.getElementById(id);
	//var obj2 = document.getElementById('edit'); 
	 
	checkParent(target, id)?obj.style.display='none':null;
	//target==obj2?obj.style.display='block':null;
	//console.log('end check:'+target);
	
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




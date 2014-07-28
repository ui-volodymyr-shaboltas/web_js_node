var gtable; // global table variable
var GDATA = [];
var GDDLIST = [];
var colvis;

function loadUserTable(tablename){
	
	loadDDListTable();

	$.ajax({
		type: "GET",
		url: "/getheader?tablename="+tablename,
		success: function(data){
			var result = [];
			var inputData = $.parseJSON(data);
			GDATA = inputData
			// console.log(JSON.stringify(inputData));
			var strtable = '<div class="container"><table id="'+tablename+'" idTable="'+tablename+'" class="display" cellspacing="0" width="100%">';
			var strheader = '<thead><tr>';
			var strfooter = '<tfoot><tr>';

			$.each(inputData, function(i, val) {
				if(val.Visible == 1) {
					result[i] = { "data" : val.Name };
					strheader +='<td alt="'+val.Helper_text+'"">'+val.Label+'</td>';
					strfooter +='<td><input type="text" placeholder="Search '+val.Label+'" /></td>';
				}
			});
			strheader += '</tr></thead>';
			strfooter += '</tr></tfoot>';
			strtable +=  strheader+strfooter+'</table></div>';

			$('#usertable').append(strtable);
			// console.log(result);

			createUserTable(result, tablename);
			
		}
	});
	
}


function loadDDListTable(){
	$.ajax({
		type: "GET",
		url: "/getddlist?query=1",
		success: function(data1){
			var inputData1 = [];
			if (data1 != 'undefine')
				inputData1 = $.parseJSON(data1);
			else 
				inputData1 = [];
			
			// console.log(inputData1);
			$.ajax({
				type: "GET",
				url: "/getddlist?query=2",
				success: function(data2){
					var result = {};
					var key = "";
					var inputData2 = []; 
					if (data2 != 'undefine')
						inputData2 = $.parseJSON(data2);
					else 
						inputData2 = [];

					if ( inputData1 != [] && inputData2 != [] ){
					 	for (var i=0; i<inputData1.length; i++){
					 		var jsonArr=[];
					 		for (var j = 0, k=0; j<inputData2.length; j++) {
					 			if (inputData2[j].ID == inputData1[i].ID) {
					 				jsonArr[k++] = { "list": inputData2[j].Text };
					 				// console.log(i, ":", inputData2[j].Text);
					 			}
					 		};
					 		result[inputData1[i].ID] = jsonArr;
					 		console.log("Loaded: ", jsonArr);
					 	}
					GDDLIST=result;

					console.log("Loaded: ",result);
					} else {
						console.error("DDlist data not loaded!");
					}	
				}
			});
			// var arrayOfObj = [];

			// for (item in arrayOfObj.data) {
			//     if (obj.hasOwnProperty(item)) {
			//         arrayOfObj.push(arrayOfObj[item]);
			//     }
			// }
			// console.log(arrayOfObj);
			//GDDLIST = inputData;
			
		}
	});
	//var data = {};
	// createUserTable(data, tablename);
	
}


function createUserTable(columnData, tablename){
				// Initialise the DataTable
	/*    table = $('#'+tablename).DataTable( {
				//lengthChange: false
			} );*/
		//console.log("test ", xdata);

	    gtable = $('#'+tablename).DataTable( {
        // "processing": true,
        // "serverSide": true,
        //"ajax": "/data.json",
        //"scrollY": true,
        "scrollX": true,
        "ajax": "/getdb?tablename="+tablename,
            //{"DT_RowId":1,"CC":"AM","PTP":3,"DFS":0,"Band":20,"MaxPwr":27,"MaxPwrExt":0,"eirp":0,"min_freq":2412,"max_freq":2472}
        "columns": columnData,
        "pagingType": "full_numbers"
       /*/ [
            { "data": "CC" },
            { "data": "PTP" },
            { "data": "DFS" },
            { "data": 'Band' },
            { "data": "MaxPwr" },
            { "data": "MaxPwrExt" },
            { "data": "eirp" },
            { "data": "min_freq" },
            { "data": "max_freq" }

            "columns": [
            { "data": "CC" },
            { "data": "PTP" },
            { "data": "DFS" },
            { "data": 'Bandwidth' },
            { "data": "Max Pwr" },
            { "data": "Max Pwr Ext" },
            { "data": "EIRP" },
            { "data": "MIN Freq" },
            { "data": "MAX Freq" }
        ]*/
    } );
    	
    	colvis = new $.fn.dataTable.ColVis( gtable );
		// console.log("test ", columnData);
		/*
		$('#'+tablename+' tfoot th').each( function () {
			var self = $(this);
			var title = $('#'+tablename+' thead th').eq( self.index() ).text();
			self.html( '<input type="text" placeholder="Search '+title+'" />' );
		});*/

		//gtable = table;
		// Apply the filter
		gtable.columns().eq( 0 ).each( function ( colIdx ) {
			$( 'input', gtable.column( colIdx ).footer() ).on( 'keyup change', function () {
				//if (colIdx != 0 ) {
				 gtable
					.column( colIdx )
					.search( this.value )
					.draw();
				//}
			});

		/*	$( 'a').on('click',function(obj) {
				console.log('Pressed<a>', obj);

				// table
					//.column( colIdx )
					//.search( this.value )
				//	.draw();
			});*/
		});
		
		
 
    	$( colvis.button() ).insertBefore('div.container');

		var tableTools = new $.fn.dataTable.TableTools( gtable, {
        sRowSelect: "os",
        aButtons: [
        ]
		} );


		/*$( tableTools.fnContainer() ).insertBefore( '#'+tablename );*/
		//table.order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw();
		//new $.fn.dataTable.FixedColumns( table );
		/*
		$('#'+tablename+' tbody').on( 'click', 'tr', function () {
    		console.log( 'Row index: '+gtable.row( this ).index() );

		} );*/

		/*  **** Work with table events **** */
		$('#'+tablename+' tbody').on( 'click', 'tr', function () {
			// console.log('DTTT_UNselected');
        	// $(this).toggleClass('selected');
        	if (gtable.rows('.selected', 0)[0][0]) {
					$('#Edit_button').removeClass("DTTT_disabled");
					$('#Delete_button').removeClass("DTTT_disabled");
					 // console.log('DTTT_selected');
				} else {
					$('#Edit_button').addClass("DTTT_disabled");
					$('#Delete_button').addClass("DTTT_disabled");
					 // console.log('DTTT_UNselected');
				}
   		 } );
  	  
}
/*
function CreateHTMLTableView(objArray, tablename, contentTarget, enableHeader) {

    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	
	//console.log('test '+array);
    var str = '<div class="container"><table id="'+tablename+'" cellspacing="0" width="100%">';
     
    // table head
   // if (enableHeader) {
        str += '<thead><tr>';
        for (var index in array[0]) {
			if (index != 'DT_RowId' )
				str += '<th>' + index + '</th>';
			else
				str += '';//'<th class="myEdit">Select</th>';
        }
        str += '</tr></thead>';
    //}
    
    // table foot
    //if (enableHeader) {
        str += '<tfoot><tr>';
        for (var index in array[0]) {
            if (index != 'DT_RowId' )
				str += '<th>' + index + '</th>';
			else
				str += '';//'<th></th>';
        }
        str += '</tr></tfoot>';
    //}
     
    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        //str += (i % 2 == 0) ? '<tr id="row_'+ array[i].DT_RowId +'">' : '<tr id="row_'+ array[i].DT_RowId +'">';
        str +='<tr id_rec="'+ array[i].DT_RowId +'">';
        for (var index in array[i]) {
			if (index != 'DT_RowId' ) //console.log("id= "+array[i].DT_RowId);
				str += '<td>' + array[i][index] + '</td>';
            else
				str +='';
        }
        str += '</tr>';
    }
    str += '</tbody>';
    str += '</table></div>';

    $('#'+contentTarget).append(str);
}
*/
function new_onclick(clicked)
{
	var tablename = $('#usertable').find( 'table' ).attr('idTable');
	
	//var labelData = gtable.rows(0).data()[0];
	edit_form_creator(0, tablename, false);
	
}

function edit_onclick(clicked)
{
	var tablename = $('#usertable').find( 'table' ).attr('idTable');
	console.log('tablename: '+tablename);

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var selectIndex = gtable.rows('.selected', 0).data()[0].DT_RowId;
		//selectedRowFromTable( tablename, true );
		console.log('selectIndex: '+selectIndex);
		edit_form_creator(selectIndex, tablename, true);	
	}
}

function edit_form_creator(selectIndex, tablename, edited) {
	//var convData = serializeLocalObject($.parseJSON(selectData));
	var selectData = {};
	if(edited)
		selectData = gtable.rows('.selected', 0).data()[0];
	else
		selectData = gtable.rows(0).data()[0];

	// console.log('selectData: '+selectData);


	//<!-- editor form -->
/*	var array = typeof selectData != 'object' ? JSON.parse(selectData) : selectData;
	console.log('SelIdx:', selectIndex,'val:',array);
	*/

	var str = '<div id="abc" onClick="check(event, \'abc\')"><div class="popupContainer">';
	str += '<form id="edit" class="DTED_Lightbox_Content" tablename="'+tablename+'" id_rec="'+selectData.DT_RowId+'"><b>Edit form:</b></br>';

	for(var i=0; i<GDATA.length; i++) {
		str += '<label for="'+GDATA[i].Name+'">'+GDATA[i].Label+': </label>';
		
		if(edited)
			if (GDATA[i].DropDownID > 0) {
				str += '<div class="DTE_Field_Input" data-dte-e="input"><select value="'+selectData[GDATA[i].Name]+'">';

				if( GDDLIST[GDATA[i].DropDownID] ) {
					for(var k=0; k<GDDLIST[GDATA[i].DropDownID].length; k++){
						str += '<option value="'+GDDLIST[GDATA[i].DropDownID][k].list+'" ';
						if (selectData[GDATA[i].Name] == GDDLIST[GDATA[i].DropDownID][k].list)
							str +='selected';
						str +='>'+GDDLIST[GDATA[i].DropDownID][k].list+'</option>';
					}
				}

				str += '</select></div>';

			} else {
				str += '<div class="DTE_Field_Input" data-dte-e="input"><input type="text" name="'+GDATA[i].Name+'" value="'+selectData[GDATA[i].Name]+'"></div>';
			}
			
		else
			str += '<div class="DTE_Field_Input" data-dte-e="input"><input type="text" name="'+GDATA[i].Name+'" value=""></div>';
	}

/*
	for (var index in selectData) {
		console.log('nameCell:', index,'val:', selectData[index]);
		
	}*/
	if(edited)
		str += '</br><button class="DTTT_button" id="submit" onClick="confirmSubmitFormData()">Submit</button></form>';
	else
		str += '</br><button class="DTTT_button" id="submit" onClick="confirmCreateFormData()">Create</button></form>';

	str += '<div class="fancybox-close popupContainer" id="close"> </div></div></div>';
/*
	$("#edit").on("click",function(event){
		var 
				self = $(this),
				id = self.attr('id_rec')
			;
	  console.log("The paragraph was clicked. id="+id);

	  
	});*/

	popup_show($('#usertable'), str, 'abc');
}

function delete_onclick(clicked)
{
	var tablename = $('#usertable').find( 'table' ).attr('idTable');

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var id = gtable.rows('.selected', 0).data()[0].DT_RowId;
		deleteData(id, tablename);
	}
}

function selectedRowFromTable(tablename, selected) {
	var valuelist = [];
	
    cells_count = document.getElementsByTagName('thead').item('tr').children[0].children.length;
    
	if (selected)
		valuelist[0] = {
					name : "DT_RowId",
					value: $('#'+tablename).find('tr.DTTT_selected').find('td')[0].parentNode.getAttribute("id_rec")
				};
	else
		valuelist[0] = {
				name : "DT_RowId",
				value: 'new'
			};

	
	for (var i=1; i<=cells_count; i++) 
	{
		if (selected)
			valuelist[i] = {
				name : document.getElementsByTagName('table').namedItem(tablename).rows[0].cells[i-1].textContent,
				value: $('#'+tablename).find('tr.DTTT_selected').find('td')[i-1].textContent
				};
		else
			valuelist[i] = {
				name : document.getElementsByTagName('table').namedItem(tablename).rows[0].cells[i-1].textContent,
				value: ""
				};
			
	}
	
	return JSON.stringify(valuelist);
}

function confirmSubmitFormData()
{
	var str = $( "form" ).serializeObject();
	var id = $( "form" ).attr('id_rec');
	var tablename = $( "form" ).attr('tablename');
	updateData(id, str, tablename);
}

function updateData(id, objArr, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {
		/*updateSelectedRow(id, objArr, tablename);*/
		$.extend(objArr, {DT_RowId: id});
		//console.log('objArr ', objArr);
		$.ajax({
			url : "/update?tablename="+tablename,
			type: "POST",
			data : objArr,
			success: function(data, textStatus, jqXHR)
			{
				var updateArr=JSON.stringify(objArr);
				id = gtable.rows('.selected', 0);
				console.log('id:', id,' objArr updated in TABLE: '+objArr);


				var d = gtable.row(id).data(); console.log(d);
				//console.log(objArr);
				// d.dfs="XXX";
				for(var index in d){
					d[index]=objArr[index];
				}
				// gtable.rows('.selected', 0).data()[0]=
				// gtable.data($.parseJSON(updateArr))[id].draw();

					gtable
			        .row( id )
			        .data( d )
			        .draw();
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
	}
}

function confirmCreateFormData()
{
	var str = $( "form" ).serializeObject();
	var id = 'new';
	var tablename = $( "form" ).attr('tablename');
	createData(id, str, tablename);
}

function cells_counter () {
	var arr = gtable.row(0).data(); 
	var i=0; 
	
	for(var index in arr){
    	i++;
  	}; 
  	return i;
}

function createData(id, objArr, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {
		$.extend(objArr, {DT_RowId: id});
		$.ajax({
			url : "/create?tablename="+tablename,
			type: "POST",
			data : objArr,
			success: function(data, textStatus, jqXHR)
			{

				var cells_count = cells_counter(); //document.getElementsByTagName('thead').item('tr').children[0].children.length;
				var array = typeof data != 'object' ? JSON.parse(data) : data;

				objArr.DT_RowId = array.insertId;
				console.log('newData updated in TABLE: '+objArr);
				var rowNode = gtable
				    .row.add( objArr )
				    .draw();
				 /*    .node();
				
				$( rowNode )
				    .css( 'color', 'red' )
				    .animate( { color: 'black' } );*/

				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
	}
}

function deleteData(id, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {

		$.ajax({
			url : "/delete?tablename="+tablename,
			type: "POST",
			data : {DT_RowId: id},
			success: function(data, textStatus, jqXHR)
			{
				//gtable.$('tr.DTTT_selected').remove();
				gtable.rows('.selected', 0).remove().draw()
				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
		//var rowtoremove=document.getElementsByClassName('DTTT_selected').item('tr');
		//console.log('gtable.draw'+rowtoremove);
	
		
	}
}
/*

function updateSelectedRow(id, array, tablename) {
	var i = 0;
	for (var index in array) { 
		document.getElementsByClassName('DTTT_selected').item('tr').children[i].textContent = array[index];
		i++;
	}
};*/

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

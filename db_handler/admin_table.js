var GADMDATA = [
            { "data": "Priority" },
            { "data": "Table_name" },
            { "data": "Name" },
            { "data": 'Label' },
            { "data": "Helper_text" },
            { "data": "Type" },
            { "data": "Visible" },
            { "data": "Validation_rule" },
           { "data": "DropDownID" }
        ];

$(document).ready(function() {
	var tablename = 'admintable';

		    gadmtable = $('#'+tablename).DataTable( {
        //"processing": true,
        //"serverSide": true,
        //"ajax": "/data.json",
        //"scrollY": true,
        "scrollX": true,
        "ajax": "/getdb?tablename=headers",
            //{"DT_RowId":1,"CC":"AM","PTP":3,"DFS":0,"Band":20,"MaxPwr":27,"MaxPwrExt":0,"eirp":0,"min_freq":2412,"max_freq":2472}
        "columns": GADMDATA
    } );
		gadmtable.columns().eq( 0 ).each( function ( colIdx ) {
			$( 'input', gadmtable.column( colIdx ).footer() ).on( 'keyup change', function () {
				 gadmtable
					.column( colIdx )
					.search( this.value )
					.draw();

			});
		});
		
		var tableTools = new $.fn.dataTable.TableTools( gadmtable, {
        sRowSelect: "os",
        aButtons: [
        ]
		} );

		$('#'+tablename+' tbody').on( 'click', 'tr', function () {
	// console.log('DTTT_UNselected');
	// $(this).toggleClass('selected');
		if (gadmtable.rows('.selected', 0)[0][0]) {
				$('#Edit_button').removeClass("DTTT_disabled");
				$('#Delete_button').removeClass("DTTT_disabled");
				 // console.log('DTTT_selected');
			} else {
				$('#Edit_button').addClass("DTTT_disabled");
				$('#Delete_button').addClass("DTTT_disabled");
				 // console.log('DTTT_UNselected');
			}
		 } );
		// loadAdminTable(tablename);
   
});
function adm_new_onclick(clicked)
{
	var tablename = $('#edittable').find( 'table' ).attr('idTable');
	
	//var labelData = gadmtable.rows(0).data()[0];
	adm_edit_form_creator(0, tablename, false);
	
}

function adm_edit_onclick(clicked)
{
	var tablename = $('#edittable').find( 'table' ).attr('idTable');
	console.log('tablename: '+tablename);

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var selectIndex = gadmtable.rows('.selected', 0).data()[0].DT_RowId;
		//selectedRowFromTable( tablename, true );
		console.log('selectIndex: '+selectIndex);
		adm_edit_form_creator(selectIndex, tablename, true);	
	}
}

function adm_edit_form_creator(selectIndex, tablename, edited) {
	//var convData = serializeLocalObject($.parseJSON(selectData));
	var selectData = {};
	if(edited)
		selectData = gadmtable.rows('.selected', 0).data()[0];
	else
		selectData = gadmtable.rows(0).data()[0];

	 console.log('selectData (DT_RowId): '+selectData.DT_RowId);


	//<!-- editor form -->
/*	var array = typeof selectData != 'object' ? JSON.parse(selectData) : selectData;
	console.log('SelIdx:', selectIndex,'val:',array);
	*/

	var str = '<div id="abc" onClick="check(event, \'abc\')"><div class="popupContainer">';
	str += '<form id="edit" class="DTED_Lightbox_Content" tablename="'+tablename+'" id_rec="'+selectData.DT_RowId+'"><b>Admin table form:</b></br>';

	for(var i=0; i<GADMDATA.length; i++) {
		str += '<label for="'+GADMDATA[i].data+'">'+GADMDATA[i].data+': </label>';
		
		if(edited)
			str += '<div class="DTE_Field_Input" data-dte-e="input"><input type="text" name="'+GADMDATA[i].data+'" value="'+selectData[GADMDATA[i].data]+'"></div>';
		else
			str += '<div class="DTE_Field_Input" data-dte-e="input"><input type="text" name="'+GADMDATA[i].data+'" value=""></div>';
	}

/*
	for (var index in selectData) {
		console.log('nameCell:', index,'val:', selectData[index]);
		
	}*/
	if(edited)
		str += '</br><button class="DTTT_button" id="submit" onClick="confirmAmdSubmitFormData()">Submit</button></form>';
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

	popup_show($('#admintable'), str, 'abc');
}

function adm_delete_onclick(clicked)
{
	var tablename = $('#admintable').find( 'table' ).attr('idTable');

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var id = gadmtable.rows('.selected', 0).data()[0].DT_RowId;
		adm_deleteData(id, 'headers');
	}
}

function confirmAmdSubmitFormData()
{
	var str = $( "form" ).serializeObject();
	var id = $( "form" ).attr('id_rec');
	var tablename = $( "form" ).attr('tablename');
	adm_updateData(id, str, 'headers');
}

function confirmAdmCreateFormData()
{
	var str = $( "form" ).serializeObject();
	var id = 'new';
	//var tablename = $( "form" ).attr('tablename');
	adm_createData(id, str, 'headers');

}

function adm_updateData(id, objArr, tablename)
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
				id = gadmtable.rows('.selected', 0);
				console.log('id:', id,' objArr updated in TABLE: '+objArr);

				var d = gadmtable.row(id).data(); console.log(d);
				for(var index in d){
					d[index]=objArr[index];
				}

				gadmtable
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


function adm_createData(id, objArr, tablename)
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
				var rowNode = gadmtable
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

function adm_deleteData(id, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {

		$.ajax({
			url : "/delete?tablename="+tablename,
			type: "POST",
			data : {DT_RowId: id},
			success: function(data, textStatus, jqXHR)
			{
				//gadmtable.$('tr.DTTT_selected').remove();
				gadmtable.rows('.selected', 0).remove().draw()
				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
		//var rowtoremove=document.getElementsByClassName('DTTT_selected').item('tr');
		//console.log('gadmtable.draw'+rowtoremove);
	
		
	}
}
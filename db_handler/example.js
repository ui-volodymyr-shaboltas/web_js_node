var gtable;
$(document).ready(function() {
   

gtable = $('#myusertable').dataTable( {
    //"processing": true,
    //"serverSide": true,
  "ajax":  {
   // "type": "POST",
   "url" : "http://localhost:8080/getdb?tablename=regulatory"
  },
    "columns": [
        { "data": "CC" },
        { "data": "PTP" },
        { "data": "DFS" },
        { "data": 'Band' },
        { "data": "MaxPwr" },
        { "data": "MaxPwrExt" },
        { "data": "eirp" },
        { "data": "min_freq" },
        { "data": "max_freq" } ]
} );
/*
   gtable = $('#myusertable').dataTable( {
        //"processing": true,
        //"serverSide": true,
        //"ajax": "/data.json",
        "ajax": "http://localhost:8080/getdb?tablename=regulatory",
            //{"DT_RowId":1,"CC":"AM","PTP":3,"DFS":0,"Band":20,"MaxPwr":27,"MaxPwrExt":0,"eirp":0,"min_freq":2412,"max_freq":2472}
        "columns": [
            { "data": "CC" },
            { "data": "PTP" },
            { "data": "DFS" },
            { "data": 'Band' },
            { "data": "MaxPwr" },
            { "data": "MaxPwrExt" },
            { "data": "eirp" },
            { "data": "min_freq" },
            { "data": "max_freq" }
/*
            "columns": [
            { "data": "CC" },
            { "data": "PTP" },
            { "data": "DFS" },
            { "data": 'Bandwidth' },
            { "data": "Max Pwr" },
            { "data": "Max Pwr Ext" },
            { "data": "EIRP" },
            { "data": "MIN Freq" },
            { "data": "MAX Freq" }*/
   /*     ]
    } );

    $('#example tfoot th').each( function () {
            var self = $(this);
            var title = $('#example thead th').eq( self.index() ).text();
            self.html( '<input type="text" placeholder="Search '+title+'" />' );
        });

    gtable.eq( 0 ).each( function ( colIdx ) {
            $( 'input', gtable.column( colIdx ).footer() ).on( 'keyup change', function () {
                //if (colIdx != 0 ) {
                 table
                    .column( colIdx )
                    .search( this.value )
                    .draw();
                //}
            });
        });
    var tableTools = new $.fn.dataTable.TableTools( table, {
        sRowSelect: "os",
        aButtons: [
        ]
        } );*/
/*
    $('#myusertable tbody').on( 'click', 'tr', function () {
            console.log( 'Row index: '+table.row( this ).index() );
        } );*/
    $('#myusertable tbody').on( 'click', 'tr', function () {
            console.log( 'Row index: '+gtable.row( this ).index() );
        } );

} );
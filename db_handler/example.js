$(document).ready(function() {
    $('#myusertable').dataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "/data.json",
        "columns": [
            { "data": "CC" },
            { "data": "PTP" },
            { "data": "DFS" },
            { "data": "Bandwidth" },
            { "data": "Max Pwr" },
            { "data": "Max Pwr Ext" },
            { "data": "EIRP" },
            { "data": "MIN Freq" },
            { "data": "MAX Freq" }
        ]
    } );

    $('#myusertable tbody').on( 'click', 'tr', function () {
            console.log( 'Row index: '+table.row( this ).index() );
        } );
} );
$('.HTML_container').ready(function () {
    initDataContractInfo('ContractMain');
    getSysAllContractInfoData('ContractMain');
})
// START: LANDOWNER FUNCTIONS
/**
 * Description: This function initialize the data table set by ID.
 * 
 * @param {*} Data 
 */
function initDataContractInfo(Data) {
    $('#tbl_' + Data).DataTable({
        language: {
            sSearch: "",
            searchPlaceholder: "Search records"
        },
        paging: true,
        lengthChange: false,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true,
        order: [[1, 'desc']],
        lengthMenu: [
            [10, 25, 50, 100],
            ['10 rows', '25 rows', '50 rows', '100 rows']
        ],
        buttons: [
            "pageLength",
            "colvis",
            {
                extend: 'excelHtml5',
                title: Data + 'Export'
            }
        ]
    }).buttons().container().appendTo('#tbl_' + Data + '_wrapper .col-md-6:eq(0)');
    $('#tbl_' + Data + '_paginate').css('font-size', 'smaller').css('float', 'right');
    $('#tbl_' + Data + '_filter').css('float', 'right');
    if (Data != 'SysUsers' && Data != 'Period' && Data != 'Calendar') {
        var htmlFilter = ' <datatablefilterbox><input type="checkbox" class="statusFilter statusFilter' + Data + '"' +
            'checked ' +
            'data-bootstrap-switch ' +
            'data-off-color="danger" ' +
            'data-on-color="success" ' +
            'data-on-text="Enabled" ' +
            'data-off-text="Disabled"></datatablefilterbox> <button class="btn btn-info btn-sm" onclick="getSysAllContractInfoData(\'' + Data + '\')" title="Reload Table"><i class="fas fa-redo-alt"></i> Reload</button>';
        $('#tbl_' + Data + '_filter').prepend(htmlFilter);
        $("input[data-bootstrap-switch]").each(function () {
            $(this).bootstrapSwitch('state', $(this).prop('checked'));
        })
    }
    if (Permission.includes(Data + "_add") || excempted.includes($("#username").val())) {
        $('#tbl_' + Data + '_filter').append(' <button class="btn btn-outline-success btn-sm addData" onclick="addContractInfoData(\'' + Data + '\')"><i class="fas fa-plus"></i> Add</button>');
    }
}
/**
 * Description: To add data of the specific table.
 * 
 * @param {*} data 
 */
function addContractInfoData(data) {
    showModal();
    ModalSize('xl');
    var title = 'Create Contract';
    // var title = 'Add ' + data;
    var footer = '<button type = "button" class="btn btn-default" data-dismiss="modal" > Close</button >';
    $('.modal-footer').html(footer);
    if (data != 'SysUsers') {
        $('.modal-footer').append('<button type="button" class="btn btn-success" onclick="saveLandContractData(\'' + data + '\')"> Save Contract' + '</button >');
    } else {
        title = 'Add new User'
        $('.modal-footer').append('<button type="button" class="btn btn-success" onclick="saveNewUser()"> Add User</button >');
    }
    $('.modal-title').html(title);
    $.ajax({
        url: $('#tbl_' + data).data('addpage'),
        type: 'post',
        dataType: 'html',
        success: function (htmlreturn) {
            $('.modal-body').html(htmlreturn);
        },
        error: function () {
            toastr.error('Error on fetching modal view!');
        }
    })
}
/**
 * Description:
 * This function save the data of the specific table.
 * 
 * @param {*} sourceContract 
 */
function saveLandContractData(sourceContract) {
    var fields = $('.triggercontractinfo');
    var sourcefile = 'Tbl_Uploads';
    var fieldID = [];
    // var inputData = {};
    var inputDataCollection = {};
    var inputDataNewContract = {};
    var inputDataRenewContract = {};
    var inputDataPreTermination = {};

    for (var x in fields) {
        if (fields[x].className != undefined) {
            var y = fields[x].className.split(' ');
            fieldID.push(y[0]);
        }
    }
    var advancepayment = $(".advance_payment").val();
    var startpayment = $(".start_of_payment").val();
    var lease_period = $('#lease_period').val().split(' - ');
    var start_lease = lease_period[0];
    var end_lease = lease_period[1];
    var selectedValue = $('input[name=contracttypeRadio]:checked').val();

    if (confirm('Do you want to save it?\n\nPlease check the correctness of the information before saving.')) {
        if (selectedValue === 'newcontract') {
            inputDataNewContract['username'] = $("#username").val();
            inputDataNewContract['token'] = $("#token").val();
            inputDataNewContract['dataSource'] = sourceContract + '_Float';
            inputDataNewContract['sysapp'] = sysapp;

            // New Contract Data [Status: Pending]
            inputDataNewContract['LandInformationCode'] = $('#viewLandInformationNC').val();
            inputDataNewContract['PlantationCode'] = $('.PlantationCode option:selected').val();
            inputDataNewContract['Status'] = 6;
            inputDataNewContract['RepresentativeName'] = $('.RepName').val();
            inputDataNewContract['RepresentativeContactNumber'] = $('#isRep').is(":checked") !== true ? '+' + $('.RepContactNumber').val() : $('.textRepContactNumber').text();
            inputDataNewContract['RepresentativeEmail'] = $('.RepEmail').val();
            inputDataNewContract['LandContractedArea'] = $('.LandContractedArea').val();
            inputDataNewContract['StartDate'] = start_lease;
            inputDataNewContract['EndDate'] = end_lease;
            inputDataNewContract['LeaseTerm'] = $(".terms").val(),
            inputDataNewContract['PaymentTerms'] = $(".PaymentTermsCode").val();
            inputDataNewContract['AdvancePayment'] = advancepayment;
            inputDataNewContract['StartOfPayment'] = startpayment;
            inputDataNewContract['AmountOfAdvancePayment'] = $(".advance_payment_amount").val();
            inputDataNewContract['YearsDivided'] = $(".yrsdivided").val();
            inputDataNewContract['Payment_Amount'] = $('.Payment_Amount').val();
            console.log('new contract', inputDataCollection);
            for (var j in fieldID) {
                inputDataNewContract[fieldID[j]] = $('.triggercontractinfo.' + fieldID[j]).val();
                $('.triggercontractinfo.' + fieldID[j]).val('');
            }

            inputDataCollection = inputDataNewContract;
        } else if (selectedValue === 'renewcontract') {
            inputDataRenewContract['username'] = $("#username").val();
            inputDataRenewContract['token'] = $("#token").val();
            inputDataRenewContract['dataSource'] = sourceContract + '_Float';
            inputDataRenewContract['sysapp'] = sysapp;

            // Renew Contract Data
            inputDataRenewContract['LandInformationCode'] = $('#viewLandInformationRNC').val();
            inputDataRenewContract['RefLandContractCode'] = $('.RNCLandContractCode option:selected').val();
            inputDataRenewContract['Status'] = 3; // Status: Renewed
            inputDataRenewContract['PlantationCode'] = $('.PlantationCode option:selected').val();
            inputDataRenewContract['RepresentativeName'] = $('.RepName').val();
            inputDataRenewContract['RepresentativeContactNumber'] = $('#isRep').is(":checked") !== true ? '+' + $('.RepContactNumber').val() : $('.textRepContactNumber').text();
            inputDataRenewContract['RepresentativeEmail'] = $('.RepEmail').val();
            inputDataRenewContract['LandContractedArea'] = $('.LandContractedArea').val();
            inputDataRenewContract['StartDate'] = start_lease;
            inputDataRenewContract['EndDate'] = end_lease;
            inputDataRenewContract['LeaseTerm'] = $(".terms").val(),
            inputDataRenewContract['PaymentTerms'] = $(".PaymentTermsCode").val();
            inputDataRenewContract['AdvancePayment'] = advancepayment;
            inputDataRenewContract['StartOfPayment'] = startpayment;
            inputDataRenewContract['AmountOfAdvancePayment'] = $(".advance_payment_amount").val();
            inputDataRenewContract['YearsDivided'] = $(".yrsdivided").val();
            inputDataRenewContract['Payment_Amount'] = $('.Payment_Amount').val();
            console.log('renew contract', inputDataCollection);
            for (var j in fieldID) {
                inputDataRenewContract[fieldID[j]] = $('.triggercontractinfo.' + fieldID[j]).val();
                $('.triggercontractinfo.' + fieldID[j]).val('');
            }

            inputDataCollection = inputDataRenewContract;
        } else if (selectedValue === 'pretermination') {
            inputDataCollection['username'] = $("#username").val();
            inputDataCollection['token'] = $("#token").val();
            inputDataCollection['dataSource'] = sourceContract + '_Float';
            inputDataCollection['sysapp'] = sysapp;

            // Pre-Termination Data
            inputDataRenewContract['Status'] = 4; // Status: Pre Termination

            inputDataCollection['inputData'] = inputDataPreTermination;
        }

        // inputDataCollection['inputData'] = inputData;
        console.log('data', inputDataCollection);
        $.ajax({
            url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'FMSmain/saveLandContract',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(inputDataCollection),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                if (data) {
                    saveupdateddata(data.LandContractCode);
                    getSysAllContractInfoData(sourceContract);
                    saveNewFile(sourcefile);
                    saveEscalation(data.LandContractCode);

                    toastr.success('Data added!');
                    hideModal();
                } else {
                    toastr.error('Duplicate code!');
                    stopLoading();
                }
            },
            error: function () {
                toastr.error('Error on saving data!');
                stopLoading();
            }
        })
    }
}


/**
 * Description: This function triggers the select:option of data input.
 * 
 */
function getOptDataForAddContractInfo() {
    var fields = $('.triggercontractinfo');
    var fieldID = [];
    for (var x in fields) {
        if (fields[x].className != undefined) {
            var y = fields[x].className.split(' ');
            fieldID.push(y[0]);
        }
    }
    for (var j in fieldID) {
        if ($('.' + fieldID[j] + '.triggercontractinfo')[0].tagName == 'SELECT') {
            var tagClasses = $('.' + fieldID[j] + '.triggercontractinfo')[0].className.split(' ');
            var optSource = tagClasses[2];
            var optId = tagClasses[0];
            var optName = tagClasses[1];
            var RAWHTML = '<option disabled selected>-</option>';
            getOptDataForAddContractInfoAppend(optSource, optId, optName, RAWHTML);
        }
    }
}
/**
 * Description: This function fetch the data given by trigger.
 * 
 * @param {*} optSource 
 * @param {*} optId 
 * @param {*} optName 
 * @param {*} RAWHTML 
 */
function getOptDataForAddContractInfoAppend(optSource, optId, optName, RAWHTML) {
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getOptData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: optSource,
            id: optId,
            name: optName,
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            for (var i in data) {
                RAWHTML += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
            }
            $('.' + optSource + '.triggercontractinfo').html(RAWHTML);
        },
        error: function () {
            toastr.error('Error on gathering Options!');
            stopLoading();
        }
    })
}

//UPDATE LANDOWNER
/**
 * Description: This function fetch the data of the specific table
 * 
 * @param {*} sourceContract 
 */
function getSysAllContractInfoData(sourceContract) {
    showdatatablesLoader(sourceContract);
    var headcol = $('#tbl_' + sourceContract + ' thead tr th');
    var colid = [];
    for (var x in headcol) {
        if (headcol[x].className != undefined) {
            var y = headcol[x].className.split(' ');
            colid.push(y[0]);
        }
    }
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSysAllData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            isactive: $('.statusFilter').is(':checked'),
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log('sakpan', data);
            var datarow = [];
            $('#tbl_' + sourceContract).DataTable().clear().draw();
            for (var i in data) {
                var dataarr = [];
                for (var j in colid) {
                    if (colid[j] == 'id') {
                        if (data[i].Status === 7) {
                            dataarr.push(
                                '<div style="text-align:center">' + 
                                '<button type="button" onclick="viewLandcontractData(\'' + sourceContract + '\',\'' + data[i][colid[j]] + '\',\'' + data[i].name + '\',\'' + data[i].isactive + '\')" class="btn btn-outline-primary btn-xs" style="width: 80px;">View</button>' + 
                                '<button type="button" onclick="updateLandownerData(\'' + sourceContract + '\',\'' + data[i][colid[j]] + '\',\'' + data[i].name + '\',\'' + data[i].isactive + '\')" class="btn btn-outline-info btn-xs" style="width: 80px; margin-left: 10px; margin-right: 10px;" id="updateButton">Update</button>' + 
                                '</div>');
                        } else {
                            dataarr.push('<div style="text-align:center"><button type="button" onclick="viewLandcontractData(\'' + sourceContract + '\',\'' + data[i][colid[j]] + '\',\'' + data[i].name + '\',\'' + data[i].isactive + '\')" class="btn btn-outline-primary btn-xs" style="width: 80px;">View</button></div>');
                        }
                    } else if (colid[j] == 'Status') {
                        switch (data[i].Status) {
                            case 0:
                                dataarr.push('<div style="text-align:center;color:#088C08"><b>Active</b></div>');
                                break;
                            case 1:
                                dataarr.push('<div style="text-align:center;color:#FF6308"><b>Expiring</b></div>');
                                break;
                            case 2:
                                dataarr.push('<div style="text-align:center;color:#FF0808"><b>Expired</b></div>');
                                break;
                            case 3:
                                dataarr.push('<div style="text-align:center;color:#72918E"><b>Renewed</b></div>');
                                break;
                            case 4:
                                dataarr.push('<div style="text-align:center;color:#68233D"><b>Pre-Term</b></div>');
                                break;
                            case 5:
                                dataarr.push('<div style="text-align:center;color:#080808"><b>Terminated</b></div>');
                                break;
                            case 6:
                                dataarr.push('<div style="text-align:center;color:#077A88"><b>Pending</b></div>');
                                break;
                            // case 7:
                            //     dataarr.push('<div style="text-align:center;color:#A5C18A"><b>Returned</b></div>');
                            //     break;
                            default:
                                dataarr.push('<div style="text-align:center;color:#A5C18A"><b>Error Status</b></div>');
                                break;
                        }   
                    } else if (colid[j] == 'isactive') {
                        if (data[i][colid[j]]) {
                            dataarr.push('<div style="text-align:center;color:green"><b>Enabled</b></div>');
                        } else {
                            dataarr.push('<div style="text-align:center;color:red"><b>Disabled</b></div>');
                        }   
                    } else if (colid[j] == 'geoLocation') {
                        //dataarr.push('<div style="text-align:center"><a href="https://www.google.com/maps/place/' + data[i][colid[j]] + '" target="_blank">' + data[i][colid[j]] + '</a></div>');
                        dataarr.push('<div style="text-align:center"><button class="btn btn-success-sm" onclick="showiFrame(\'' + data[i][colid[j]] + '\')">' + data[i][colid[j]] + '</a></div>');
                    } else {
                        dataarr.push('<div style="text-align:center">' + data[i][colid[j]] + '</div>');
                    }
                }
                datarow.push(dataarr);
            }
            $('#tbl_' + sourceContract).DataTable().rows.add(datarow).draw();
            hidedatatablesLoader(sourceContract);
        },
        error: function () {
            toastr.error('Error on Fetching Data!');
            hidedatatablesLoader(sourceContract);
        }
    })
}
//UPDATE MODAL
/**
 * Description: To update data of the specific table.
 * 
 * @param {*} data 
 * @param {*} id 
 * @param {*} name 
 * @param {*} status 
 */
function updateLandownerData(data, id, name, status) {
    showModal();
    ModalSize('xl');

    // var title = 'Update ' + data + ' <b class="selectedid" data-id="' + id + '">(' + name + ')</b> ';
    var title = 'Update Land Contract <b class="selectedid" data-id="' + id + '">(' + name + ')</b> ';
    var footer = '<button type = "button" class="btn btn-default" data-dismiss="modal" > Close</button >';
    $('.modal-title').html(title);
    $('.modal-footer').html(footer);
    title += '<b></b>';
    if (status == 'true') {
        $('.modal-title').append('- <b style="color:green" class="status" data-status="1">Enabled</b>');
        $('.modal-footer').append('<button type="button" class="btn btn-danger enabledisabledata" onclick="enabledisabledata(\'' + data + '\')"> Disable</button >');
    } else {
        $('.modal-title').append('- <b style="color:red" class="status" data-status="0">Disabled</b>');
        $('.modal-footer').append('<button type="button" class="btn btn-success enabledisabledata" onclick="enabledisabledata(\'' + data + '\')"> Enable</button >');
    }
    if (Permission.includes(data + "_update") || excempted.includes($("#username").val())) {
    } else {
        $('.modal-title').append(' <em>(Read Only)</em>');
        $('.enabledisabledata').prop('disabled', 'true');
    }
    $.ajax({
        url: $('#tbl_' + data).data('editpage'),
        type: 'post',
        dataType: 'html',
        success: function (htmlreturn) {
            $('.modal-body').html(htmlreturn);
        },
        error: function () {
            toastr.error('Error on fetching modal view!');
        }
    })
}
function viewLandcontractData(data, id, name, status) {
    console.log('trouble view land contract data 1', data);
    console.log('trouble view land contract data 2', id);
    console.log('trouble view land contract data 3', name);
    console.log('trouble view land contract data 3', status);
    showModal();
    ModalSize('xl');
    var title = 'View Contract <b class="selectedid" data-id="' + id + '">(' + name + ')</b> ';
    var footer = '<button type = "button" class="btn btn-default" data-dismiss="modal" > Close</button >';
    $('.modal-title').html(title);
    $('.modal-footer').html(footer);
    title += '<b></b>';
    if (status == 'true') {
        $('.modal-title').append('- <b style="color:green" class="status" data-status="1">Enabled</b>');
        $('.modal-footer').append('<button type="button" class="btn btn-danger enabledisabledata" onclick="enabledisabledata(\'' + data + '\')"> Disable</button >');
    } else {
        $('.modal-title').append('- <b style="color:red" class="status" data-status="0">Disabled</b>');
        $('.modal-footer').append('<button type="button" class="btn btn-success enabledisabledata" onclick="enabledisabledata(\'' + data + '\')"> Enable</button >');
    }
    if (Permission.includes(data + "_view") || excempted.includes($("#username").val())) {
    } else {
        $('.modal-title').append(' <em>(Read Only)</em>');
        $('.enabledisabledata').prop('disabled', 'true');
    }
    $.ajax({
        url: $('#tbl_' + data).data('viewpage'),
        type: 'post',
        dataType: 'html',
        success: function (htmlreturn) {
            $('.modal-body').html(htmlreturn);
        },
        error: function () {
            toastr.error('Error on fetching modal view!');
        }
    })
}
/**
 * Description: This function fetch the data for update view.
 * 
 * @param {*} sourceContract 
 * @param {*} filter 
 */
//DATA CRUD start
function getSysContractInfoData(sourceContract, filter) {

    startLoading();
    var fields = $('.triggercontractinfo');
    var fieldID = [];
    for (var x in fields) {
        if (fields[x].className != undefined) {
            var y = fields[x].className.split(' ');
            fieldID.push(y[0]);
        }
    }
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSysData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            filter: filter,
            selectedID: $('.selectedid').data('id'),
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            for (var j in fieldID) {
                if ($('.' + fieldID[j] + '.triggercontractinfo')[0].tagName == 'SELECT') {
                    var tagClasses = $('.' + fieldID[j] + '.triggercontractinfo')[0].className.split(' ');
                    var optSource = tagClasses[2];
                    var optFilter = optSource + 'Code';
                    var name = tagClasses[1];
                    getOptDataForLandownerUpdate(optSource, optFilter, fieldID[j], name, data[fieldID[j]]);
                } else {
                    $('.' + fieldID[j]).val(data[fieldID[j]]);
                }
            }
            if (Permission.includes(sourceContract + "_update") || excempted.includes($("#username").val())) {
                if ($('.status').data('status') == 0) {
                    $('.triggercontractinfo').prop('disabled', 'true');
                }
            } else {
                $('.triggercontractinfo').prop('disabled', 'true');
            }
            stopLoading();
        },
        error: function () {
            toastr.error('Data gathering error!');
            stopLoading();
        }
    })
}
/**
 * Description: This function updates the data of the specified row for update.
 * 
 * @param {*} sourceContract 
 * @param {*} filter 
 * @param {*} id 
 * @param {*} name 
 * @param {*} selected 
 */
function getOptDataForLandownerUpdate(sourceContract, filter, id, name, selected) {
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSelectedOptData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            id: id,
            name: name,
            filter: filter,
            selectedID: selected,
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var RAWHTML = '<option value="' + data.id + '" selected disabled>' + data.name + '</option>';
            $.ajax({
                url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getOptData',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({
                    username: $("#username").val(),
                    token: $("#token").val(),
                    dataSource: sourceContract,
                    id: id,
                    name: name,
                    sysapp: sysapp
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    for (var i in data) {
                        RAWHTML += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('.' + id + '.triggercontractinfo').html(RAWHTML);
                },
                error: function () {
                    toastr.error('Error on gathering Options!');
                    stopLoading();
                }
            })
        },
        error: function () {
            toastr.error('Data gathering error!');
            stopLoading();
        }
    })
}
//START: VIEW DATA OF LAND INFORMATION UPON SELECTION OF LAND TITLE
/**
 * Description: This function fetch the data for update view.
 * 
 * @param {*} sourceContract 
 * @param {*} filter 
 */
//DATA CRUD start
function getSysContractInfoDataView(sourceContract, filter) {

    startLoading();
    var fields = $('.triggerlandinformationview');
    var fieldID = [];
    for (var x in fields) {
        if (fields[x].className != undefined) {
            var y = fields[x].className.split(' ');
            fieldID.push(y[0]);
        }
    }
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSysData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            filter: filter,
            selectedID: $('.selectedid').data('id'),
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            for (var j in fieldID) {
                if ($('.' + fieldID[j] + '.triggerlandinformationview')[0].tagName == 'SELECT') {
                    var tagClasses = $('.' + fieldID[j] + '.triggerlandinformationview')[0].className.split(' ');
                    var optSource = tagClasses[2];
                    var optFilter = optSource + 'Code';
                    var name = tagClasses[1];
                    getOptDataForLandownerUpdateView(optSource, optFilter, fieldID[j], name, data[fieldID[j]]);
                } else {
                    $('.' + fieldID[j]).val(data[fieldID[j]]);
                }
            }
            if (Permission.includes(sourceContract + "_update") || excempted.includes($("#username").val())) {
                if ($('.status').data('status') == 0) {
                    $('.triggerlandinformationview').prop('disabled', 'true');
                }
            } else {
                $('.triggerlandinformationview').prop('disabled', 'true');
            }
            stopLoading();
        },
        error: function () {
            toastr.error('Data gathering error!');
            stopLoading();
        }
    })
}
/**
 * Description: This function updates the data of the specified row for update.
 * 
 * @param {*} sourceContract 
 * @param {*} filter 
 * @param {*} id 
 * @param {*} name 
 * @param {*} selected 
 */
function getOptDataForLandownerUpdateView(sourceContract, filter, id, name, selected) {
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSelectedOptData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            id: id,
            name: name,
            filter: filter,
            selectedID: selected,
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var RAWHTML = '<option value="' + data.id + '" selected disabled>' + data.name + '</option>';
            $.ajax({
                url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getOptData',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({
                    username: $("#username").val(),
                    token: $("#token").val(),
                    dataSource: sourceContract,
                    id: id,
                    name: name,
                    sysapp: sysapp
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    for (var i in data) {
                        RAWHTML += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('.' + id + '.triggerlandinformationview').html(RAWHTML);
                },
                error: function () {
                    toastr.error('Error on gathering Options!');
                    stopLoading();
                }
            })
        },
        error: function () {
            toastr.error('Data gathering error!');
            stopLoading();
        }
    })
}
//END: VIEW DATA OF LAND INFORMATION UPON SELECTION OF LAND TITLE
/**
 * Description: View Data for Contracts
 * 
 * @param {*} sourceContract 
 * @param {*} filter 
 */
function viewContractInfoData(sourceContract, filter) {
    console.log('function parameters 1', sourceContract);
    console.log('function parameters 2', filter);
    startLoading();
    var fields = $('.triggercontractinfoview');
    var fieldID = [];
    for (var x in fields) {
        if (fields[x].className != undefined) {
            var y = fields[x].className.split(' ');
            fieldID.push(y[0]);
        }
    }
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/getSysData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            username: $("#username").val(),
            token: $("#token").val(),
            dataSource: sourceContract,
            filter: filter,
            selectedID: $('.selectedid').data('id'),
            sysapp: sysapp
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.table('Land Information data troubleshoot', data);
            var LandInformationCode = data.LandInformationCode;
            // var LandContractCode = data.LandContractCode;
            console.log(LandInformationCode);
            $.ajax({
                url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'FMSmain/getContractInfoData',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({
                    data: data,
                    LandInformationCode: data.LandInformationCode,
                    username: $("#username").val(),
                    token: $("#token").val(),
                    sysapp: sysapp
                }),
                contentType: "application/json; charset=utf-8",
                success: function (viewdata) {
                    viewContract = {
                        contractdata: data,
                        landinformationdata: viewdata
                    };
                    console.log('view data', viewContract);

                    //view contract data
                    $('.name').text(viewContract.contractdata.Fullname);
                    $('.landdocument').text(viewContract.landinformationdata.Document);
                    $('.landlotnumber').text(viewContract.landinformationdata.LotNumber);
                    $('.LandContractCode').text(viewContract.contractdata.LandContractCode);

                    if (viewContract.landinformationdata.WithCoOwner == true) {
                        $('.hideCoOwner').show();
                        $('.CoOwner').text(viewContract.landinformationdata.CoOwner);
                    } else {
                        $('.hideCoOwner').hide();
                        $('.CoOwner').text('');
                    }

                    if (viewContract.contractdata.RepresentativeName == '') {
                        $('.hideRepresentativeLabel').hide();
                    } else {
                        $('.hideRepresentativeLabel').show();
                        $('.RepName').text(viewContract.contractdata.RepresentativeName);
                        $('.RepContactNumber').text(viewContract.contractdata.RepresentativeContactNumber);
                        $('.RepEmail').text(viewContract.contractdata.RepresentativeEmail);
                    }

                    $('.province').text(viewContract.landinformationdata.provinceName);
                    $('.city').text(viewContract.landinformationdata.cityName);
                    $('.barangay').text(viewContract.landinformationdata.barangayName);
                    $('.landtotalarea').text(viewContract.landinformationdata.Area);
                    $('.landplantation').text(viewContract.contractdata.PlantationCode);
                    $('.landcompany').text(viewContract.contractdata.CompanyCode + ' - ' + viewContract.contractdata.Companyname);
                    $('.landcontractedarea').text(viewContract.contractdata.LandContractedArea);
                }
            })
            stopLoading();
        },
        error: function () {
            toastr.error('Data gathering error!');
            stopLoading();
        }
    })
}
//START:
/**
 * Description: To save the file to server.
 * 
 * @param {*} dataSource 
 */
function saveNewFile(dataSource) {
    var input = document.getElementById('fileUploader');
    if (input.files && input.files.length > 0) {
        var formData = new FormData();
        for (var i = 0; i < input.files.length; i++) {
            formData.append("file" + i, input.files[i]);
        }
        formData.append('username', $("#username").val());
        formData.append('token', $("#token").val());
        formData.append('dataSource', dataSource);
        formData.append('sysapp', sysapp);
    }

    // if (confirm('Save this data?')) {

    // }
    // console.log(formData);
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/FMSattachmentInitUpload',
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            for (var i in data) {
                var name = data[i].name;
                var filename = data[i].filename;
                var extension = data[i].extension;
                console.log(name, filename, extension);
                saveNewUploadedFile(name, filename, extension, dataSource);
            }
        },
        error: function () {
            // File upload error handling
            console.log("error");
        }
    })
}
function saveNewUploadedFile(name, filename, extension, dataSource) {
    var inputData = {};
    var inputDataCollection = {};
    inputDataCollection['username'] = $("#username").val();
    inputDataCollection['token'] = $("#token").val();
    inputDataCollection['dataSource'] = dataSource;
    inputDataCollection['sysapp'] = sysapp;
    inputData['Init_Filename'] = name;
    inputData['Sys_Filename'] = filename;
    inputData['extension'] = extension;
    inputData['Sys_AppsId'] = sysapp;
    // inputData['route_code'] = $('.pagelink.active').data('bcrumbs');
    inputData['route_code'] = $('.pagelink.active').attr("class").split(' ')[1];
    inputDataCollection['inputData'] = inputData;

    console.log(inputDataCollection);
    $.ajax({
        url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'Common/FMSattachmentSaveData',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(inputDataCollection),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.retval == 1) {
                // toastr.success('Data added!');
                $('.triggerdetail').val('');
            } else {
                toastr.error('Duplicate code!');
                stopLoading();
            }
            // getSysAllDataUploads();
        },
        error: function () {
            toastr.error('Error on saving data!');
            stopLoading();
        }
    })
}

function clearSelection(e) {
    $(e).select2('destroy').val('').select2();
}
//Start Contract Payment

function saveEscalation(LandContractCode) {
    for (var x in dataforsaving) {
        var termValue = $('[data-rowid=' + dataforsaving[x] + '][data-colid="startterm"]').val();

        if (termValue) {
            var terms = termValue.split(' - ');
            var start = terms[0];
            var end = terms[1];

            $.ajax({
                url: apiURL('c2673537-85cf-4a28-9cbc-5dad26d9c4a9') + 'FMSmain/saveEscalation',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({
                    LandContractCode: LandContractCode, // add contract_code value or landinformation code
                    // LandInformationCode:,
                    rate: $('[data-rowid=' + dataforsaving[x] + '][data-colid="rate"]').val(),
                    Rate_per_year: $('[data-rowid=' + dataforsaving[x] + '][data-colid="Rate_per_year"]').val(),
                    Total_rate: $('[data-rowid=' + dataforsaving[x] + '][data-colid="Total_rate"]').val(),
                    num_of_has: $('[data-rowid=' + dataforsaving[x] + '][data-colid="Num_of_has"]').val(),
                    // date: $('[data-rowid=' + dataforsaving[x] + '][data-colid="startterm"]').val(),
                    startterm: start,
                    endterm: end,
                    username: $("#username").val(),
                    token: $("#token").val(),
                    sysapp: sysapp
                }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    // saveupdateddata();
                }
            });
        }
        // toastr.success('Data Saved!');
    }
}


//End Contract Payment
//END:
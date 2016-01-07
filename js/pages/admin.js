//todo...
// need to make the text on the left column templated
// for the internal report, use different JRS credentials based on who is logged in.

// can probably make this super re-usable as the html just has a container in it. the model will be the same for most screens



/*
 * ========================================================================
 * admin.js : v0.8.0
 *
 * ========================================================================
 * Copyright 2014
 * Authors: Daniel Petzold
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft Inc., the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 * ========================================================================
 */


var pageConfig = {};


pageConfig.inventory = {
        dashboard: "/public/Samples/FreshDelivery_Demo/Admin_Inventory_Dashboard",
        dashboardParams: {
            Country: ["USA", "Canada", "Mexico"]
        }, 
        filters: [
            {
                paramId: "Country", 
                allName: "All Countries"
                //options: (function(){return pageConfig.dashboardParams.Country})()
            }
        ] 
};

pageConfig.payroll = {
        dashboard: "/public/Samples/FreshDelivery_Demo/Employee_Dashboard",
        dashboardParams: {
            StoreType: ["Deluxe Supermarket", "Gourmet Supermarket", "HeadQuarters", "Mid-Size Grocery", "Small Grocery", "Supermarket"]
        }, 
        filters: [
            {
                paramId: "StoreType", 
                allName: "All Store Types",
            }
        ] 
};

pageConfig.blank = {
        dashboard: "/public/Samples/FreshDelivery_Demo/22.0_Blank_Starting_Dashboard",
        dashboardParams: {
            Country: ["USA", "Canada", "Mexico"]
        }, 
        filters: [
            {
                paramId: "Country", 
                allName: "All Countries"
                //options: (function(){return pageConfig.dashboardParams.Country})()
            }
        ] 
};

pageConfig.internal = {
        dashboard: "/public/Samples/FreshDelivery_Demo/FreshDelivery_Internal_Report"
};



var hash = location.search.split('?')[1]; 
pageConfig = pageConfig[hash] || pageConfig.inventory;



//load the config and get the script for the configured server instance
$.getJSON('./config/config.json', function(data){
    $.getScript(data.visualizeJS, function(){
        initPage(data.jrsConfig);
    });
});

//connect to Jaspersoft BI server and load the dashboard
function initPage(jrsConfig){

    visualize({auth:jrsConfig.auth}, function(v){
        loadDashboard(v);
    });
};

//load the dashboard 
function loadDashboard(v){
    
    var dashboard = v.dashboard({
        resource: pageConfig.dashboard,
        container: "#container",
        error: handleError,
        params: pageConfig.dashboardParams,
        success: function() {
            $("button").prop("disabled", false);
        }
    });

    //attach to the global scope
    window.dashboard = dashboard;
};

function buildParams(){

    //placeholder for the params object
    var params = {};

    //interate over all select lists and build the params object
    $("[data-paramId]").each(function() {
        var paramName = $(this).attr('data-paramId'),
            selectedVal = $(this).val(),
            allVals = [];

        // get a list of all options in the select so we can handle the "all" case
        $(this).children('option').each(function(){
            if($(this).attr('value') !== 'all'){
                allVals.push($(this).attr('value'));
            }  
        });

        //add the parameter to the params object
        params[paramName] = selectedVal === 'all' ? allVals : [selectedVal]; 

    });

    return params;
        
};

//re-load the dashboard apply the selected filters
function updateFilters(dashboard){

    //build the parameters object
    var params = buildParams();

    //reload the dashboard and re-enable the button
    dashboard.params(params).run()
        .fail(handleError)
        .always(function() { 
            $("button").prop("disabled", false); 
        });    
}

//render all the filtering options specified in the page configuration
function renderFilters(){
    $.get('./partials/dropdown.html', function(template){
        var template = Handlebars.compile(template);

        for(var i=0,l=pageConfig.filters.length;i<l;i++){
            var templateData = pageConfig.filters[i];
            templateData.options = pageConfig.dashboardParams[pageConfig.filters[i].paramId];
            $('#filters').append(template(templateData));
        }
    });
}

function handleError(e) {
    alert(e);
}


$(function(){
    //render the filtering options
    renderFilters();

    //attach a listener for updating the filters
    $("button").on('click', function(){
        $("button").prop("disabled", true);
        updateFilters(window.dashboard);
    });
});


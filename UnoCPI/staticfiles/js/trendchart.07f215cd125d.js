var not_set = [undefined, "All", ''];
var yearList = JSON.parse(document.getElementById('yearList').textContent);
var Projects = JSON.parse(document.getElementById('Projects').textContent);
var CommunityPartners = JSON.parse(document.getElementById('CommunityPartners').textContent);
var CampusPartners = JSON.parse(document.getElementById('CampusPartners').textContent);

function get_filter_set (Projects, CommunityPartners, CampusPartners, engagement_type, mission, comm_type, college_name, campus_partner, weitz_cec_part) {
    if (!not_set.includes(engagement_type)) {
        var Projects = Projects.filter(d => d.engagement_type.engagement_type_id === parseInt(engagement_type));
    }
    if (weitz_cec_part == 'CURR_CAMP') {
        var CampusPartners = CampusPartners.filter(d => d.cec_partner.cec_partner_status === "Current");
    }
    if (weitz_cec_part == 'FORMER_CAMP') {
        var CampusPartners = CampusPartners.filter(d => d.cec_partner.cec_partner_status === "Former");
    }
    if (!not_set.includes(college_name)) {
        var CampusPartners = CampusPartners.filter(d => d.college.college_name_id === parseInt(college_name));
    }
    if (!not_set.includes(campus_partner)) {
        var CampusPartners = CampusPartners.filter(d => d.campus_partner_id === parseInt(campus_partner));
    }
    if (!not_set.includes(college_name) || !not_set.includes(campus_partner) || ['CURR_CAMP', 'FORMER_CAMP'].includes(weitz_cec_part)) {
        camps = [];
        CampusPartners.forEach(function (feature) {
            camps.push(feature["campus_partner_id"]);
        })
        var Projects = Projects.filter(d => d.campus_partner_ids.some(r => camps.includes(r)));
    }
    if (!not_set.includes(comm_type)) {
        var CommunityPartners = CommunityPartners.filter(d => d.community_type.community_type_id === parseInt(comm_type));
    }
    if (weitz_cec_part == 'CURR_COMM') {
        var CommunityPartners = CommunityPartners.filter(d => d.cec_partner.cec_partner_status === "Current");
    }
    if (weitz_cec_part == 'FORMER_COMM') {
        var CommunityPartners = CommunityPartners.filter(d => d.cec_partner.cec_partner_status === "Former");
    }
    if (!not_set.includes(comm_type) || ['CURR_COMM', 'FORMER_COMM'].includes(weitz_cec_part)) {
        comms = [];
        CommunityPartners.forEach(function (feature) {
            comms.push(feature["community_partner_id"]);
        })
        var Projects = Projects.filter(d => d.community_partner_ids.some(r => comms.includes(r)));
    }
    var projectCommunities = new Set();
    Projects.forEach(function (feature) {
        if (feature["community_partner_ids"].length != 0) {
            feature["community_partner_ids"].forEach(item => projectCommunities.add(item));
        }
    })
    var CommunityPartners = CommunityPartners.filter(d => projectCommunities.has(d.community_partner_id));

    if (!not_set.includes(mission)) {
        var Projects = Projects.filter(d => d.primary_mission_area.mission_id === parseInt(mission));
        var CommunityPartners = CommunityPartners.filter(d => d.primary_mission_id === parseInt(mission));
    }

    var projectCampus = new Set();
    Projects.forEach(function (feature) {
        feature["campus_partner_ids"].forEach(item => projectCampus.add(item));
    })
    var CampusPartners = CampusPartners.filter(d => projectCampus.has(d.campus_partner_id));

    return [Projects, CommunityPartners, CampusPartners];
}

function getChartData(yearList, Projects, CommunityPartners, CampusPartners, engagement_type, mission, comm_type, college_name, campus_partner, weitz_cec_part) {
    var proj_data = [];
    var comm_data = [];
    var camp_data = [];
    var yrs = [];
    for (y in yearList) {
        yrs.push(yearList[y].name);
        var YrProjects = Projects.filter(d => d.years.includes(yearList[y].id));
        var filt = get_filter_set(YrProjects, CommunityPartners, CampusPartners, engagement_type, mission, comm_type, college_name, campus_partner, weitz_cec_part);
        var projs = filt[0];
        var community = filt[1];
        var campus = filt[2];
        proj_data.push(projs.length);
        comm_data.push(community.length);
        camp_data.push(campus.length);
    }
    var project_count_series = {
        'name': 'Projects',
        'data': proj_data,
        'color': 'turquoise'
    };
    var community_partner_count_series = {
        'name': 'Community Partners',
        'data': comm_data,
        'color': 'teal'
    };
    var campus_partner_count_series = {
        'name': 'Campus Partners',
        'data': camp_data,
        'color': 'blue'
    };
    return [yrs, project_count_series, community_partner_count_series, campus_partner_count_series];
}
var res = getChartData(yearList, Projects, CommunityPartners, CampusPartners, '', '', '', '', '', '');
var yrs = res[0];
var project_count_series = res[1];
var community_partner_count_series = res[2];
var campus_partner_count_series = res[3];

var chart = Highcharts.chart('container',
    {"title":{"text":""},
   "xAxis":{
      "categories": yrs,
      "title":{
         "text":"Academic Years",
         "style":{"fontWeight":"bold","color":"black","fontSize":"15px", "fontFamily": "Arial Narrow"}}},
   "yAxis":{
      "title":{
         "text":"Projects/Partners",
         "style":{"fontWeight":"bold","color":"black","fontSize":"15px", "fontFamily": "Arial Narrow"}}},
   "plotOptions":{
      "series":{
         "dataLabels":{
            "style":{"fontSize":"8px"}}}},
   "tooltip": {"split": true, "style": {"fontFamily": "Arial Narrow"}},
   "series":[project_count_series, community_partner_count_series, campus_partner_count_series],
   "legend":{
      "layout":"horizontal",
      "align":"right",
      "verticalAlign":"top",
      "x":-10,
      "y":50,
      "borderWidth":1,
      "backgroundColor":"#FFFFFF",
      "shadow":"true",
      "itemStyle": {"fontFamily": "Arial Narrow"}},
   "responsive":{
      "rules":[{
        "condition":{"maxWidth":500},
        "chartOptions":{
           "legend":{"layout":"horizontal","align":"center","verticalAlign":"bottom"}}}]}
});

function updateChart () {
    var mission = $('#id_mission option:selected').val();
    var engagement_type = $('#id_engagement_type option:selected').val();
    var college_name = $('#id_college_name option:selected').val();
    var campus_partner = $('#id_campus_partner option:selected').val();
    var weitz_cec_part = $('#id_weitz_cec_part option:selected').val();
    var comm_type = $('#id_community_type option:selected').val();

    var res = getChartData(yearList, Projects, CommunityPartners, CampusPartners, engagement_type, mission, comm_type, college_name, campus_partner, weitz_cec_part);
    var yrs = res[0];
    var project_count_series = res[1];
    var community_partner_count_series = res[2];
    var campus_partner_count_series = res[3];

    chart.update({
       "xAxis":{"categories": yrs},
       "series":[project_count_series, community_partner_count_series, campus_partner_count_series]});
}

function updateCampus() {
    var allCamps = JSON.parse(document.getElementById('campus_filter').textContent);
    var college_name = $('#id_college_name option:selected').val();
    if (!not_set.includes(college_name)) {
        var campus_filter = allCamps.filter(d => d.college === parseInt(college_name));
    } else {
        var campus_filter = allCamps;
    }
    var select = document.getElementById("id_campus_partner");
    select.options.length = 0;
    select.options[select.options.length] = new Option('All', 'All');
    for(campus in campus_filter) {
        select.options[select.options.length] = new Option(campus_filter[campus].name, campus_filter[campus].id);
    }
}
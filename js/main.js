let apiUrl = "https://localhost/dbapi/v2/spaleck";
let userId = null;
// https://localhost/dbapi/v2/spaleck

// $("#lookupform").on("submit",checkuser);
// changeColor.addEventListener("click", );

window.addEventListener('message', function(event) {
    console.log(event);
    if(event.data.command==="sync") {
        if(typeof event.data.data.apiUrl==="undefined" || event.data.data.apiUrl===null) {
            $("#invalidApiUrl").show();
            $("#loader").fadeOut();
            return;
        }

        apiUrl = event.data.data.apiUrl;

        if(typeof event.data.data.userId==="undefined" || event.data.data.userId===null) {
            $("#invalidUserId").show();
            $("#loader").fadeOut();
            return;
        }
        userId = event.data.data.userId;

       checkuser();
    }


    // if(event.data.userId===null || event.data.userId==="") {
    //     $("#loader").fadeOut();
    //     return;
    // }
    // $("#userId").val(event.data.userId);
    // $("#submButt").trigger("click");

});
parent.postMessage({command:"get",data:{apiUrl:null,userId:null}},"*");


function stopWork() {
    $("#loader").fadeIn();
    let ttid = current_ttregistry.relationships.started_work[0].id;
    let inst = $("<span>").apiator({returninstance:true,resourcetype:"item"}).setUrl(apiUrl+"/timetracking/"+ttid)
    inst.id = ttid;
    inst.update({status:"f"})
        .then(function (data) {

            $("#loader").fadeOut();
            $("#working").fadeOut();
            $("#stopOk").fadeIn();
            $("#stopOk .durationh").text(Math.floor(data.attributes.duration/60));
            $("#stopOk .durationm").text(Math.floor(data.attributes.duration%60));
            setTimeout(function () {
                $("#stopOk").fadeOut();
                checkuser();
            },3000);
        })
}
function startWork(src) {
    $("#loader").fadeIn();
    let sel = $("#projectSelect form").find("option:selected").data().instance;
    let data = {
        employee: current_ttregistry.relationships.emplid.id,
    };
    if(sel.attributes.hourly_rate) {
        data.hourly_rate = sel.attributes.hourly_rate;
    }
    if(sel.attributes.op_id) {
        data.operation = sel.attributes.op_id;
    }
    if(sel.attributes.order_id) {
        data.order = sel.attributes.order_id;
    }
    if(sel.attributes.currency) {
        data.currency = sel.attributes.currency;
    }

    $("<span>")
        .apiator({returninstance: true,resourcetype: "collection"})
        .setUrl(apiUrl+"/timetracking")
        .append(data)
        .then(function () {
            $("#projectSelect").fadeOut();
            checkuser();
        })
        .catch(function (xhr) {
            $("#unknownErr").text(JSON.stringify(xhr)).fadeIn();
        });

}

function backToLogin() {
    $("#userId").val("");
    $('#projectSelect').hide();
    $('#working').hide();
    $('#login').show();
    parent.postMessage({command:"saveUser",data:{userId:null}},"*");

}
function checkuser() {
    $("#loader").fadeIn();

    $("<span>").apiator({returninstance: true,resourcetype: "item"})
        .setUrl(apiUrl+"/tags/"+userId+"?include=started_work,emplid,alloc_orders")
        .loadFromRemote()
        .then(function (data) {
            $("#loader").fadeOut();

            current_ttregistry = data;

            if(data.relationships.started_work.length) {
                let cont = $("#working").fadeIn();
                if(data.relationships.started_work[0].attributes.order_label) {
                    cont.find("h3").html(data.relationships.started_work[0].attributes.order_label);
                }
                if(data.relationships.started_work[0].attributes.operation_name) {
                    cont.find("h4").html(data.relationships.started_work[0].attributes.operation_name);
                }

                showKontor = true;

                cont.find(".emplName").text(data.attributes.fname+" "+data.attributes.lname);
                // cont.find(".project").text(data.attributes.fname+" "+data.attributes.lname);
                function showTime() {

                    let dateDiffSeconds = Math.round(((new Date()).getTime()-(new Date(data.relationships.started_work[0].attributes.start)).getTime())/1000);
                    let seconds = dateDiffSeconds%60;
                    let minutes = Math.floor(dateDiffSeconds/60);
                    let hours = Math.floor(minutes/60);
                    minutes = minutes%60;
                    // let minutes = Math.floor(dateDiffSeconds/3600);

                    let elapsed = ("0" + hours).slice(-2) + ":"+("0" + minutes).slice(-2) + ":"+("0" + seconds).slice(-2);
                    cont.find(".elapsedTime").html(elapsed);

                    if(showKontor) {
                        setTimeout(showTime,1000);
                    }
                }
                showTime();
                return;
            }

            let projView = $("#projectSelect");
            projView.find("h3").html(data.attributes.fname + " " + data.attributes.lname);
            let instance = projView.fadeIn().find("select").apiator({returninstance: true,resourcetype: "collection"});

            let projects = [
                {
                    id: null,
                    attributes:{
                        op_id: null,
                        op_name: null,
                        order_id: null,
                        order_name: null,
                        hourly_rate: null,
                        currency: null
                    }
                },
                ...data.relationships.alloc_orders
            ];

            instance.loadFromData(projects);
            if(projects.length<2) {
                $("#projectSelect").find("select").fadeOut();
            }
        })
        .catch(function (xhr) {
            $("#loader").fadeOut();
            let cb;
            switch(xhr.jqXHR.status) {
                case "404":
                    $("#invalidCode").fadeIn();
                    cb = ()=>$("#invalidCode").fadeOut();
                    break;
                case 500:
                    $("#severError").fadeIn();
                    cb = ()=>$("#severError").fadeOut();
                    break;
                case 0:
                    $("#serviceUnavail").fadeIn().text(JSON.stringify(xhr.jqXHR));
                    cb = ()=>$("#serviceUnavail").fadeOut();
                    break;
                default:
                    $("#unknowError").fadeIn();
                    cb = ()=>$("#unknowError").fadeOut();
            }
            setTimeout(cb,2000);
        });
}






let appUrl = "ttclient.html";

// const vPath = _kPath+"views/";
const _kPath = "komponents";
const _kExt = ".html";
const envsFile = "../environments.json";
const defaultView = "/views/dashboard";
const activeEnvFile = "../active_env.json";
const defaultAppUrl = "/views/app";
const loginAppUrl = "/views/login";


function logout() {
    userData = null;
    localData.jwt  = null;
    localStorage.setItem("spaleck",JSON.stringify(localData));
    location = location.pathname;
}

function checkAuth() {
    let localData = {

    };
    let userData;
    Object.assign(localData,JSON.parse(localStorage.getItem(localStorageLabel)));

    if(localData.jwt) {
        try {
            userData = jwt_decode(localData.jwt);
            let d = new Date();
            if(d.getTime()/1000>userData.exp) {
                logout();
            }
        }
        catch($e) {
            // console.log($e);
        }
    }
    return [localData,userData];
}

function toggleAll(src) {
    let checked = $(src).prop("checked");
    $($(src).data("connected")).children().each(function (i) {
        toggleSelect(this,checked);
    });
}

function toggleSelect(src,state) {
    state = state!==undefined?state:!$(src).hasClass('selected');
    $(src).find("input[type=checkbox]").prop("checked",state);
    if(state) {
        $(src).addClass('selected').find("input[type=checkbox]").prop("checked",true);
    }
    else {
        $(src).removeClass('selected');
    }
    let tmp = $("#orderPartsList").children();
    $($(src).data("connected")).prop("checked",(tmp.length===tmp.filter(".selected").length));
}

/**
 * setarea environment-ului se face in Consola cu
 * localStorage.setItem("spaleck.env","denumire_environment")
 *
 * Evident "denumire_environment" trebuie sa se regaseasca in env_config de mai jos
 */

const localStorageLabel = "spaleck";





// let localData,userData;
let [localData,userData] = checkAuth();

autoload = false;
let backendUrl, apiRoot, authUrl, fileApiUrl;


let p1 = new Promise((resolve,reject)=>
    $.get(envsFile)
        .done(function (data) {
            resolve(data);
        })
        .fail(function (data) {
            reject(data);
        })
);
let p2 = new Promise((resolve,reject)=>
    $.get(activeEnvFile)
        .done(function (data) {
            resolve(data);
        })
        .fail(function (data) {
            reject(data);
        })
);


Promise.all([p1,p2])
    .then((values)=>{
        let environments,active;
        [environments,active] = values;
        active = active.active;
        backendUrl = environments[active].backendUrl;
        apiRoot = environments[active].feDBapiUrl;
        authUrl = environments[active].authUrl;
        fileApiUrl = environments[active].fileApiUrl;

        if(typeof appUrl==="undefined") {
            appUrl = defaultAppUrl;
        }

        if(!userData) {
            appUrl = loginAppUrl;
        }

        $("#page").komponent({url:appUrl,replace:false}).finally(function () {
            $(".pageOverlay").remove();
        });
    })
    .catch((a)=>{
        console.log(a);
        alert("Failed to load configuration");
    });

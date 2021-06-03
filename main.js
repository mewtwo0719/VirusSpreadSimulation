var canvas = document.querySelector('canvas');

var canvasWidth = window.innerWidth/2;
var canvasHeight = window.innerWidth/2;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var displayAllInfected = document.getElementById("collectiveInfectionNumber");
var displayInfected = document.getElementById("currentInfectionNumber");
var displayHealthy = document.getElementById("healthyNumber");
var displayImmune = document.getElementById("immuneNumber");
var displayDays = document.getElementById("daysPassed");


var dayLength = 846;
var immuneColor = "#264b96";
var infectedColor = "#bf212f";
var healthyColor = "#27b376";
var dayColor = "#dee4e7";
var nightColor = "#37474f";
var notYetAbleToInfect = "#ffc0cb";

var humanRadius = 4;
var houseWidth = 20;
var officeWidth = 30;


var infected = 10;
var healhyNum = 0;
var immuneNumber = 0;
var daysPassed = 0;

var areaOfInfection = 10;
var infectionChance = 0.025;
var peopleGoToWork = 0.38;
var numberOfHomes = 50;
var numberOfWorkplaces = 5;
var takingSafetyMeasures = 0.5;

//variables for changing
var checkForInfectionPerDay = 8;
var timeForRecovery = 25;
var isolationDays = 5;

var isolation = false;


var ctx = canvas.getContext('2d');

var community = [];
var houses = [];
var offices = [];


var numberOfPopulation;
var time = 0;
var isRunning = false;
var isFirstRun = true;
var speed = 1;
var humanSpeed = 4;

function startStop(){
    isRunning = !isRunning;
    if(isRunning){
        document.getElementById("startButton").innerHTML = "Pauziraj simulaciju";
    }
    else{
        document.getElementById("startButton").innerHTML = "Pokreni simulaciju";
    }
    speed = document.getElementById("speed").value;
    if(isFirstRun) firstRunSetup();
}


function firstRunSetup(){
    isFirstRun = false;

    numberOfPopulation = document.getElementById("numberOfPopulation").value;
    document.getElementById("numberOfPopulation").disabled = true;

    infected = document.getElementById("initialInfected").value;
    document.getElementById("initialInfected").disabled = true;

    areaOfInfection = document.getElementById("areaOfInfection").value * 10;
    document.getElementById("areaOfInfection").disabled = true;

    infectionChance = document.getElementById("infectionChance").value / 100;
    document.getElementById("infectionChance").disabled = true;

    peopleGoToWork = document.getElementById("peopleGoToWork").value / 100;
    document.getElementById("peopleGoToWork").disabled = true;

    numberOfHomes = document.getElementById("numberOfHomes").value;
    document.getElementById("numberOfHomes").disabled = true;

    numberOfWorkplaces = document.getElementById("numberOfWorkplaces").value;
    document.getElementById("numberOfWorkplaces").disabled = true;

    immuneNumber = document.getElementById("numberOfImmune").value;
    document.getElementById("numberOfImmune").disabled = true;

    takingSafetyMeasures = document.getElementById("takingSafetyMeasures").value / 100;
    document.getElementById("takingSafetyMeasures").disabled = true;

    isolation = document.getElementById("isolation").checked;
    document.getElementById("isolation").disabled = true;


    
    //creating homes and offices
    for(var i = 0; i < numberOfHomes; i ++){
    var x = Math.random() * (canvasWidth);
    var y = Math.random() * (canvasHeight);
    houses[i] = [x, y]
}
for(var i = 0; i < numberOfWorkplaces; i ++){
    var x = Math.random() * (canvasWidth);
    var y = Math.random() * (canvasHeight);
    offices[i] = [x, y]
}

    createPopulation();


    //make people immune

    for(var i = 0; i < immuneNumber; i++){
        var temp = Math.round(Math.random() * (community.length-1))
        if(!community[temp].isImmune){
            community[temp].isImmune = true;
            
        } }

//if one student and 1 college

if(infected == 1 && offices.length == 1){
    community[0].isInfected = true;
    community[0].hasJob = true;
    community[0].daysPassedAfterInfected = 6;
}
else {
    //infect first humans
    
for(var i = 0; i < infected; i++){
    var temp = Math.round(Math.random() * (community.length-1))
    if(!community[temp].isInfected ){
        community[temp].isInfected = true;
        community[temp].daysPassedAfterInfected = 5;
        
    } 

}}
    //give jobs to people
numOfPeopleWithJobs = numberOfPopulation * peopleGoToWork;
for(var i = 0; i < numOfPeopleWithJobs; i++){
    var temp = Math.round(Math.random() * (community.length-1))
    if(!community[temp].hasJob) community[temp].hasJob = true;
    else i--;
}


    //give awarness to people
    var peopleTakingSafetyMeasures = numberOfPopulation * takingSafetyMeasures;
    for(var i = 0; i < peopleTakingSafetyMeasures; i++){
        var temp = Math.round(Math.random() * (community.length-1))
        if(!community[temp].safetyMeasures) community[temp].safetyMeasures = true;
        else i--;
    }


}

function Person(x, y, des1x, des1y, des2x, des2y){
    this.x = x;
    this.y = y;
    this.dx = humanSpeed;
    this.dy = humanSpeed;
    this.r = 4;
    this.des1x = des1x;
    this.des1y = des1y;
    this.des2x = des2x;
    this.des2y = des2y;
    this.curDes = 1;
    this.isInfected = false;
    this.isImmune = false;
    this.color = healthyColor;
    this.hasJob = false;
    this.wantToStayHome = false;
    this.selfProtective = false;
    this.daysPassedAfterInfected = 0;
    this.socialDistance = false;
    this.safetyMeasures = false;


    this.useRandomLocation = function(){

        if(Math.random() < 0.7){
        this.des1y = Math.random() * (canvasHeight-14)+7;
        this.des1x = Math.random() * (canvasHeight-14)+7;

    } else if(Math.random() < 0.8){
        var temp = Math.round(Math.random() * (houses.length-1))
        this.des1x = houses[temp][0] + Math.random() * 20;
        this.des1y = houses[temp][1] + Math.random() * 20;
    }
    else{
        var temp = Math.round(Math.random() * (offices.length-1))
        this.des1x = offices[temp][0] + 10;
        this.des1y = offices[temp][1] + 10;
    }
   
        }


    this.update = function(whatTime){
               
        
        if( whatTime == 'day' && this.hasJob && !this.wantToStayHome){

        if(this.x < this.des1x-this.r+1)
        this.x += this.dx;
        if(this.y < this.des1y-this.r+1)
        this.y += this.dy;
   
        if(this.x > this.des1x+this.r-1)
        this.x -= this.dx;
        if(this.y > this.des1y+this.r-1)
        this.y -= this.dy;
            }


        if(whatTime == 'day' && !this.hasJob && !this.wantToStayHome){

        if((this.x > (this.des1x - areaOfInfection-humanSpeed) && this.x < (this.des1x + areaOfInfection+humanSpeed)) && 
        (this.y > (this.des1y - areaOfInfection-humanSpeed) && this.y < (this.des1y + areaOfInfection+humanSpeed))){
            //if(Math.round( Math.random() * 100)%30 == 0)
            this.useRandomLocation();
        }

        
        if(this.x < this.des1x-this.r+1)
        this.x += this.dx; 
        if(this.y < this.des1y-this.r+1)
        this.y += this.dy; 
        if(this.x > this.des1x+this.r-1)
        this.x -= this.dx; 
        if(this.y > this.des1y+this.r-1)
        this.y -= this.dy;  

        }
        
        
        else if( whatTime == 'night'){
   
            if(this.x < this.des2x-this.r+1)
            this.x += this.dx;
            if(this.y < this.des2y-this.r+1)
            this.y += this.dy;
       
            if(this.x > this.des2x+this.r-1)
            this.x -= this.dx;
            if(this.y > this.des2y+this.r-1)
            this.y -= this.dy;
        }

        
    }

    this.checkForInfection = function(){
        for(var i = 0; i < community.length; i++){
             if(this == community[i]) continue;
             if(this.isImmune) continue;
             if(community[i].isInfected == false) continue;
             if(this.isInfected) continue;
             if(community[i].daysPassedAfterInfected <= isolationDays) continue;

            
             
             if((this.x > (community[i].x - areaOfInfection) && this.x < (community[i].x + areaOfInfection)) && 
             (this.y > (community[i].y - areaOfInfection) && this.y < (community[i].y + areaOfInfection))){
             var temp = Math.random();
             if(this.safetyMeasures){
                
            }
             if(infectionChance > temp) {
                if(Math.random() < 0.7 && this.safetyMeasures) continue;
                this.isInfected = true;
                infected++;
            }
          }
        }
    }
    
    this.draw = function(){       
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fillStyle = this.isInfected ? infectedColor : healthyColor;
        if(this.isInfected && this.daysPassedAfterInfected <= isolationDays) ctx.fillStyle = notYetAbleToInfect;
        if(this.isImmune) ctx.fillStyle = immuneColor;
        
        ctx.fill();
    }
}
function createPopulation(){
for(var i = 0; i < numberOfPopulation; i++){

    var temp = Math.round(Math.random() * (houses.length-1))
    //check if there are already too much people in here
    var des2x = houses[temp][0] + Math.random() * 20;
    var des2y = houses[temp][1] + Math.random() * 20;

    var x = des2x;
    var y = des2y;

    var temp = Math.round(Math.random() * (offices.length-1))
    var des1x = offices[temp][0] + Math.random() * 30;
    var des1y = offices[temp][1] + Math.random() * 30;

    community.push(new Person(x, y, des1x, des1y, des2x, des2y))
}
}

function drawAllObjects(){

    ctx.fillStyle = dayColor;
    if(time < dayLength/2)
    ctx.fillStyle = nightColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        //draw buildings
        for(var i = 0; i < houses.length; i++){
            ctx.fillStyle = "#f7a440";
            ctx.fillRect(houses[i][0], houses[i][1], houseWidth, houseWidth);
        }
        for(var i = 0; i < offices.length; i++){
            ctx.fillStyle = "#c0fefc";
            ctx.fillRect(offices[i][0], offices[i][1], officeWidth, officeWidth);
        }
    
}

function updateAllObjects(){
        //switch day and night
        for(var i = 0; i < numberOfPopulation; i++){
            if(time > dayLength/2)
            community[i].update('day');

            else community[i].update('night');

            community[i].draw();

            if(time % (36 * (24/checkForInfectionPerDay)) == 0){
            community[i].checkForInfection();
            if(community[i].daysPassedAfterInfected >= isolationDays && community[i].safetyMeasures && isolation){
                community[i].wantToStayHome = true;
            }
            else if(Math.round( Math.random() * checkForInfectionPerDay)%2 == 0 && !community[i].hasJob)
            community[i].wantToStayHome = true;
            else community[i].wantToStayHome = false;
            
            
        }
        }
}

function animate(){    
    var infectedNumber = 0;
    var healthyNumber = 0;
    immuneNumber = 0;
    for(var i = 0; i < community.length; i++){
        if(community[i].isInfected) infectedNumber++;
        else healthyNumber++;
        if(community[i].isImmune) immuneNumber++;
    }
    if(isRunning) {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    
    drawAllObjects();
    for(var i = 0; i < speed; i++){
        updateAllObjects();
        time++;
        if(time > dayLength){
        time = 0;
        daysPassed++;
        for(var i = 0; i < community.length; i++){
            if(community[i].isInfected){ 
                community[i].daysPassedAfterInfected++;
                if(community[i].daysPassedAfterInfected >= timeForRecovery){
                    community[i].daysPassedAfterInfected = 0;
                    community[i].isInfected = false;
                    community[i].isImmune = true;
                }
                
            }   
        }
        }
       
    }
   
   
    //updateAllObjects();
    var infectedNumber = 0;
    for(var i = 0; i < community.length; i++){
        if(community[i].isInfected) infectedNumber++;
    }
    displayAllInfected.innerHTML = infected;
    displayInfected.innerHTML = infectedNumber;
    displayHealthy.innerHTML = healthyNumber;
    displayDays.innerHTML = daysPassed;
    displayImmune.innerHTML = immuneNumber;
    
}


    requestAnimationFrame(animate);
}

animate()

export function getReportsPerPageByWidth(width){
    if(width >= 1700){
        return 21;
    }
    else if(width >= 1500){
        return 18;
    }
    else if(width >= 1300){
        return 15;
    }
    else if(width >= 1100){
        return 12;
    }
    else if(width >= 767){
        return 9;
    }
    else{
        return 6;
    }
}
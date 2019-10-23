export function formateDate(time) {
    if (!time) return''
    let data = new Date(time);
    let second = String(data.getSeconds())
    if (second.length<2){
        second = 0 +String(data.getSeconds())
    }
    return data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getHours()+':'+data.getMinutes()+':'+second;
}

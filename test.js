var d = "2023-03-08"
var regexp = /^202[34]\-[0-9][0-9]\-[0-9][0-9]$/
var time_ver = regexp.test(d);
console.log(time_ver);
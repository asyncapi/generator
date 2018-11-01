module.exports = (Handlebars, _) => {

//capitalizeFirstLetter
  Handlebars.registerHelper('capFirst', (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

//convert string to java constant format: lightMeasuredPublish -> LIGHT_MEASURED_PUBLISH
  Handlebars.registerHelper('javaConst', (str) => {
    var tokenList = str.split(/(?=[A-Z])/);
    return tokenList.map(function(x){ return x.toUpperCase() }).join("_");
  });
};

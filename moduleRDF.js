

var rdfHeader =    "@prefix  rdf:           <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"      +
                   "@prefix  rdfs: 			<http://www.w3.org/2000/01/rdf-schema#> .\n"  +
                   "@prefix  s: 			<http://schema.org/address> .\n"              +
                   "@prefix  owl: 			<http://www.w3.org/2002/07/owl#> .\n"         +
                   "@prefix  foaf: 			<http:/^/xmlns.com/foaf/0.1/> .\n"            +
                   "@prefix  geo: 			<http://www.w3.org/2003/01/geo/wgs84_pos#> .\n"+
                   "@prefix  dbpedia-owl: 	<http://dbpedia.org/ontology/> .\n"+
                   "@prefix  dcterms: 		<http://purl.org/dc/terms/identifier> . \n\n"

var rdfBody = ""

var createRDF = function(data) {
    var linkedData = {}
    try {
        var linkedData = JSON.parse(data.linkedData)
    }catch(err){

    }

    rdfBody = "<http://aroundhere.flxw.de/monument/" + data._id + ">\n"
    if (data.label)
        rdfBody += "\trdfs:label \"" + data.label + "\", \n"
    if (data.description)
        rdfBody += "\tdcterms:description \"" + data.description + "\", \n"
    if (linkedData.link)
        rdfBody += "\tdcterms:identifier <" + linkedData.link + ">, \n"

    if (linkedData.architects){
        rdfBody += "\tdbpedia-owl:architect [ \n"
        for (var j = 0; j < linkedData.architects.length; j++) {
            rdfBody += "\t\t<" + linkedData.architects[j].url + ">, \n"
        }
        rdfBody += "\t ] , \n"
    }
    if(data.addresses)
        data.addresses.forEach(function(address){
            console.log(address)
            rdfBody += "\tgeo:location [ \n"
            rdfBody += "\t\ts:adress\t"+ address.formatted +", \n"
            rdfBody += "\t\tgeo:lat \t" + address.geolocation.coordinates[0] + ", \n"
            rdfBody += "\t\tgeo:long\t" + address.geolocation.coordinates[1] + ", \n"
            rdfBody += "\t ] , \n"
        })
    if(linkedData.images)
        for(var i=0; i<linkedData.images.length; i++){
            var image = linkedData.images[i]
                rdfBody += "\tdbo:thumbnail <" + image + ">, \n"
        }
    if (data.description)
        rdfBody += "\tdbpedia-owl:yearOfConstruction \"" + linkedData.yearOfConstruction + "\", \n"

    if(linkedData.wikiDataLink)
        rdfBody += "\towl:sameAs <" + linkedData.wikiDataLink.replace(new RegExp("page", ""), "resource") + ">\n"

    rdfBody += "\t."
    console.log(rdfBody)
    rdfBody = rdfBody.replace(/,.[\s\n]*\.{1}/, ".")

    return rdfHeader + rdfBody
}

exports.creatRDF = createRDF
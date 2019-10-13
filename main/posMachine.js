function posMachine(){
    posMachine.prototype = {
        decodedBarcode:function(tags){
            let totalCount = (barcode) => tags.filter(tag => tag === barcode).length;
            let filteredTags = Array.from(new Set(tags));
            let decodedBarcodes = [];
            filteredTags.forEach(tag => {
                decodedBarcodes.push({
                    barcode:tag,
                    count: totalCount(tag)
                });
            });
            return decodedBarcodes;
        },
        loadItems:function(decodedBarcodes){
            // const itemList = [];
            // decodedBarcodes.forEach(decodedBarcode => {
                
            // });
        }
    }
}
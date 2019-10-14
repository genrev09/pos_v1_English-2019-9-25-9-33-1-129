'use strict';

function decodeBarcodes(tags){
    let totalCount = (barcode) => tags.filter(tag => tag === barcode).length;
    let filteredTags = Array.from(new Set(tags));
    const decodedBarcodes = [];
    filteredTags.forEach(tag => {
        decodedBarcodes.push({
            barcode:tag,
            count: totalCount(tag)
        });
    });
    return decodedBarcodes;
}

function loadItems(decodedBarcodes){
    const barcodeList = decodedBarcodes.map(decodedBarcode => decodedBarcode.barcode);
    return loadAllItems().filter(item => barcodeList.includes(item.barcode));
}

function combineItems(decodedBarcodes){
    const itemsWithoutCount = loadItems(decodedBarcodes);
    const items = [];
    let getCount = (barcode) => 
    decodedBarcodes.filter(decodedBarcode => decodedBarcode.barcode === barcode)[0].count;

    itemsWithoutCount.forEach(itemWithoutCount => {
        items.push({
            barcode:itemWithoutCount.barcode,
            name:itemWithoutCount.name,
            price:itemWithoutCount.price,
            unit:itemWithoutCount.unit,
            count:getCount(itemWithoutCount.barcode)
        });
    });

    return items;
}

function decodeTags(tags){
    const filteredTags = Array.from(new Set(tags));
    const getCount = (_tag) => tags.filter(tag => tag === _tag).length;
    const decodedBarcodes = [];
    filteredTags.forEach(filteredTag => {
        decodedBarcodes.push({
            barcode:filteredTag,
            count:getCount(filteredTag)
        });
    });
    return combineItems(decodedBarcodes);
}

function loadAllPromotions(){
    return loadPromotions();
}

function getReceiptItems(items,promotions){
    const receiptItems = [];
    let computeSubtotal = (promotion,count,price) => {
        let subtotal = 0;
        if (promotion.type == undefined)
            return count * price;
        switch (promotion) {
            case 'BUY_TWO_GET_ONE_FREE':
                if(count > 2)
                    count--;
                subtotal = count * price;
                break;
            case '':
                subtotal = count * price;
                break;
            default:
                subtotal = count * price;
                break;
        }
        return subtotal;
    };
    let getPromotion = (barcode) => promotions.filter(promotion => promotion.barcodes.includes(barcode))[0];
    
    items.forEach(item => {
        let promotion = getPromotion(item.barcode);
        receiptItems.push({
            barcode:item.barcode,
            name:item.name,
            price:item.price,
            unit:item.unit,
            count:item.count,
            subtotal:computeSubtotal(promotion, item.count, item.price)
        });
    });
    
    return receiptItems;
}


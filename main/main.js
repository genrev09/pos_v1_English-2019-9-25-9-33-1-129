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
    let getPromotion = (barcode) => promotions.filter(promotion => promotion.barcodes.includes(barcode))[0];
    
    let computeSubtotal = (item) => {
        let subtotal = item.count * item.price;
        let promotion = getPromotion(item.barcode);
        if(promotion != null)
            subtotal -= item.price;
        return subtotal;
    };

    return items.map(item => {
        item.subtotal = computeSubtotal(item)
        return item;
    });
}

function calculateReceiptItems(items){
    const promotions = loadAllPromotions();
    return getReceiptItems(items,promotions);
}

function calculateReceiptTotal(_receiptItems){
    const computedSubtotalSum = _receiptItems.map(receiptItem => receiptItem.subtotal)
                                        .reduce((a,b) => a+b);
    return [{
        receiptItems : _receiptItems,
        total: computedSubtotalSum
    }];
}

function calculateReceiptSavings(_receiptItems){
    const computedTotal = _receiptItems[0].receiptItems.map(receiptItem => receiptItem.count * receiptItem.price)
                                        .reduce((a,b) => a+b);
    _receiptItems[0].saving = computedTotal - _receiptItems[0].total;
    return _receiptItems;
}

function calculateReceipt(items){
    const receiptItems = calculateReceiptItems(items);
    const receiptItemWithTotal = calculateReceiptTotal(receiptItems);
    return calculateReceiptSavings(receiptItemWithTotal);
}

function renderReceipt(receipt){
    let formattedReceipt = "***<store earning no money>Receipt ***\n";

    receipt[0].receiptItems.forEach(item => {
        let itemUnit = determineUnitNoun(item.count,item.unit);
        formattedReceipt += "Name: " + item.name + ", Quantity: " + item.count + " "+ itemUnit + ", Unit: "+ item.price.toFixed(2) + "(yuan), Subtotal: " + item.subtotal.toFixed(2) + "(yuan)\n"
    });
    formattedReceipt += "----------------------\n"+
               "Total: "+ receipt[0].total.toFixed(2)+"(yuan)\n"+
               "Discounted prices: " + receipt[0].saving.toFixed(2)+"(yuan)\n"+
               "**********************";

    return formattedReceipt;
}

function determineUnitNoun (count, unit){
    if(count >= 2)
        return unit+"s";
    else
        return unit;
}

function printReceipt(tags){
    const items = decodeTags(tags);
    const receipt = calculateReceipt(items);
    return renderReceipt(receipt);
}
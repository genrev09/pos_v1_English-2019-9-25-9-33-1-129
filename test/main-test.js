'use strict';

describe('pos', () => {

  // it('should print text', () => {

  //   const tags = [
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000001',
  //     'ITEM000003-2.5',
  //     'ITEM000005',
  //     'ITEM000005-2',
  //   ];

  //   spyOn(console, 'log');

  //   printReceipt(tags);

  //   const expectText = 
  //   "***<store earning no money>Receipt ***\n" +
  //   "Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)\n"+
  //   "Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)\n"+
  //   "Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)\n"+
  //   "----------------------\n"+
  //   "Total：58.50(yuan)\n"+
  //   "Discounted prices：7.50(yuan)\n"+
  //   "**********************";

  //   expect(console.log).toHaveBeenCalledWith(expectText);
  // });

  it('should load items using decoded barcodes', () => {

    const decodedBarcodes = [
      { barcode:'ITEM000001', count:3},
      { barcode:'ITEM000003', count:1},
    ];

    const expectedResult = [{barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle'},
                            {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound'}];

    const actualResult = loadItems(decodedBarcodes);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should decode barcodes from tags', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003'
    ];
    
  const expectedResult = [
    { barcode:'ITEM000001', count:3},
    { barcode:'ITEM000003', count:1},
  ];

  const actualResult = decodeBarcodes(tags);
  
  expect(actualResult).toEqual(expectedResult);
  });

  it('should combine items using decoded barcodes', () => {

    const decodedBarcodes = [
      { barcode:'ITEM000001', count:3},
      { barcode:'ITEM000003', count:1},
    ];

    const itemsWithoutCount = [{barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle'},
                            {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound'}];


    const expectedResult = [{barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3},
                            {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1}];

    const actualResult = combineItems(decodedBarcodes);
    
    expect(actualResult).toEqual(expectedResult);
  });

  it('should decode tags and return an item of object', () => {
      const tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003'
      ];
      
      const expectedResult = [
        {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3},
        {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1}];

    const actualResult = decodeTags(tags);
    
    expect(actualResult).toEqual(expectedResult);
  });

  it('should load all promotions from database', () => {

    const expectedResult = [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
  const actualResult = loadAllPromotions();
  
  expect(actualResult).toEqual(expectedResult);
  });

  it('should get subtotal of item in accordance to promotion', () => {
    const items = [
      {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3},
      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1}
    ];
    
    const promotions = [
      {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
          'ITEM000000',
          'ITEM000001',
          'ITEM000005'
        ]
      }
    ];
    
    const expectedResult = [
      {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}];

  const actualResult = getReceiptItems(items,promotions);
  
  expect(actualResult).toEqual(expectedResult);
  });

  it('should calculate receipt items', () => {
    const items = [
      {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3},
      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1}
    ];
    
    const expectedResult = [
      {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}];

  const actualResult = calculateReceiptItems(items);
  
  expect(actualResult).toEqual(expectedResult);
  });

  it('should calculate receipt total', () => {
    const receiptItems = [
      {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}];

    
    const expectedResult = [{
      receiptItems: [
        {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
        {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}
      ],
      total : 21.00
    }];

  const actualResult = calculateReceiptTotal(receiptItems);
  
  expect(actualResult).toEqual(expectedResult);
  });

  it('should calculate receipt savings', () => {
    const receiptItems = [{
      receiptItems: [
        {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
        {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}
      ],
      total : 21.00
    }];

    
    const expectedResult = [{
      receiptItems: [
        {barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
        {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}
      ],
       total : 21.00,
       saving: 3.00
    }];

  const actualResult = calculateReceiptSavings(receiptItems);
  
  expect(actualResult).toEqual(expectedResult);
  });

  // it('should render receipt', () => {
  //   const receipt = [
  //     [{barcode: 'ITEM000001', name: 'Sprite', price: 3.00, unit:'bottle' , count: 3, subtotal: 6.00},
  //      {barcode: 'ITEM000003', name: 'Litchi', price: 15.00, unit:'pound', count: 1, subtotal: 15.00}],
  //      {total : 21.00},
  //      {saving: 3.00}
  //   ];
    
  //   const expectedResult = 
  //   "***<store earning no money>Receipt ***\n" +
  //   "Name：Sprite，Quantity：3 bottles，Unit：3.00(yuan)，Subtotal：6.00(yuan)\n"+
  //   "Name：Litchi，Quantity：1 pounds，Unit：15.00(yuan)，Subtotal：15.00(yuan)\n"+
  //   "----------------------\n"+
  //   "Total：21.00(yuan)\n"+
  //   "Discounted prices：3.00(yuan)\n"+
  //   "**********************";

  // const actualResult = calculateRenderReceipt(receipt);
  
  // expect(actualResult).toEqual(expectedResult);
  // });

});
